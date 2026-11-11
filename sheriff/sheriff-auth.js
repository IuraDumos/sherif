(() => {
  const config = window.SHERIFF_SUPABASE_CONFIG;
  const isSupabaseConfigured = Boolean(
    config?.url &&
    config?.anonKey &&
    !config.url.includes("YOUR_PROJECT_ID") &&
    !config.anonKey.includes("YOUR_SUPABASE_ANON_KEY")
  );
  const isLoginPage = window.location.pathname.endsWith("/index.html") || window.location.pathname === "/";
  const authNotice = document.querySelector("#auth-notice");
  let supabaseClient = null;
  let sdkLoadError = null;

  function showNotice(message) {
    if (authNotice) {
      authNotice.textContent = message;
      authNotice.hidden = false;
      return;
    }

    let gateMessage = document.querySelector("#auth-gate-message");
    if (!gateMessage) {
      gateMessage = document.createElement("section");
      gateMessage.id = "auth-gate-message";
      gateMessage.className = "auth-gate-message";
      gateMessage.setAttribute("role", "alert");
      gateMessage.setAttribute("aria-live", "assertive");
      document.body.append(gateMessage);
    }
    gateMessage.textContent = message;
    document.body.dataset.authState = "error";
  }

  function publishAuthState(user, profile) {
    const isAuthenticated = Boolean(user && profile);
    document.dispatchEvent(new CustomEvent("sheriff:auth-state", {
      detail: {
        isAuthenticated,
        user: isAuthenticated ? {
          id: user.id,
          name: profile.display_name || user.user_metadata?.full_name || user.user_metadata?.name,
          grade: profile.grade,
          discord: profile.discord_id,
          avatarUrl: profile.avatar_url || user.user_metadata?.avatar_url,
          avatar: user.user_metadata?.avatar,
          discordId: profile.discord_id
        } : null
      }
    }));
  }

  async function checkSession(session) {
    const user = session?.user;
    if (!user) {
      publishAuthState(null, null);
      if (isSupabaseConfigured && !isLoginPage) {
        window.location.replace("index.html");
        return;
      }
      if (!isLoginPage) showNotice("Autentifică-te cu Google sau Discord pentru a accesa paginile Sheriff.");
      return;
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("id, discord_id, display_name, avatar_url, grade, is_blocked")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      showNotice(`Nu am putut verifica accesul: ${profileError.message}`);
      return;
    }
    if (!profile) {
      showNotice("Profilul contului nu a fost găsit. Contactează un administrator.");
      const { error: signOutError } = await supabaseClient.auth.signOut();
      if (signOutError) showNotice(`Nu am putut închide sesiunea: ${signOutError.message}`);
      publishAuthState(null, null);
      return;
    }

    try {
      const edgeResponse = await fetch("/auth/session", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      if (!edgeResponse.ok) {
        const result = await edgeResponse.json();
        if (edgeResponse.status === 403) {
          const { error: signOutError } = await supabaseClient.auth.signOut();
          if (signOutError) {
            showNotice(`Acces blocat, dar sesiunea nu s-a putut închide: ${signOutError.message}`);
            return;
          }
          publishAuthState(null, null);
          if (!isLoginPage) {
            window.location.replace("index.html?blocked=1");
            return;
          }
        }
        showNotice(`Nu s-a putut confirma accesul la server: ${result.error || edgeResponse.statusText}`);
        return;
      }
    } catch (error) {
      showNotice(`Nu s-a putut confirma accesul la server: ${error.message}`);
      return;
    }

    document.body.dataset.authState = "allowed";
    publishAuthState(user, profile);
    if (isLoginPage) {
      const next = new URLSearchParams(window.location.search).get("next");
      let destination = "regulament.html";
      if (next) {
        const nextUrl = new URL(next, window.location.origin);
        if (nextUrl.origin === window.location.origin && nextUrl.pathname !== "/auth/session") {
          destination = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
        }
      }
      window.location.replace(destination);
    }
  }

  function loadSupabaseSdk() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.onload = () => {
        if (!window.supabase?.createClient) {
          reject(new Error("Biblioteca Supabase nu a expus clientul necesar."));
          return;
        }
        resolve();
      };
      script.onerror = () => reject(new Error("Biblioteca Supabase nu s-a putut încărca."));
      document.head.append(script);
    });
  }

  async function startAuth() {
    if (!isSupabaseConfigured) {
      if (isLoginPage) {
        showNotice("Autentificarea nu este încă configurată. Completează URL-ul și cheia publică Supabase pentru a continua.");
      } else {
        showNotice("Autentificarea nu este configurată. Accesul la pagini este blocat până la conectarea Supabase.");
      }
      return;
    }

    try {
      await loadSupabaseSdk();
      supabaseClient = window.supabase.createClient(config.url, config.anonKey);
    } catch (error) {
      sdkLoadError = error;
      showNotice(`Clientul Supabase nu s-a putut încărca: ${error.message}`);
      return;
    }

    if (isLoginPage && new URLSearchParams(window.location.search).has("blocked")) {
      showNotice("Accesul acestui cont a fost blocat de un administrator.");
    }

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      showNotice(`Nu am putut verifica sesiunea: ${error.message}`);
      return;
    }
    await checkSession(data.session);

    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        window.setTimeout(() => {
          checkSession(session).catch((error) => {
            showNotice(`Eroare la verificarea autentificării: ${error.message}`);
          });
        }, 0);
      }
    });
  }

  async function signInWithProvider(provider) {
    if (!supabaseClient) {
      showNotice(sdkLoadError
        ? `Clientul Supabase nu s-a putut încărca: ${sdkLoadError.message}`
        : "Autentificarea nu este configurată încă.");
      return;
    }
    try {
      const redirectUrl = new URL("index.html", window.location.href);
      const next = new URLSearchParams(window.location.search).get("next");
      if (next) redirectUrl.searchParams.set("next", next);
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: { redirectTo: redirectUrl.href }
      });
      if (error) showNotice(`Conectarea cu ${provider === "google" ? "Google" : "Discord"} a eșuat: ${error.message}`);
    } catch (error) {
      showNotice(`Eroare la conectarea cu ${provider === "google" ? "Google" : "Discord"}: ${error.message}`);
    }
  }

  document.querySelector("#google-login")?.addEventListener("click", () => signInWithProvider("google"));
  document.querySelector("#discord-login")?.addEventListener("click", () => signInWithProvider("discord"));

  document.querySelectorAll("[data-sign-out]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!supabaseClient) {
        showNotice("Sesiunea nu poate fi închisă deoarece Supabase nu este disponibil.");
        return;
      }
      button.disabled = true;
      try {
        const edgeResponse = await fetch("/auth/session", { method: "DELETE" });
        if (!edgeResponse.ok) {
          showNotice(`Cookie-ul securizat nu a putut fi șters: ${edgeResponse.statusText}`);
          button.disabled = false;
          return;
        }
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
          showNotice(`Sesiunea Supabase nu a putut fi închisă: ${error.message}`);
          button.disabled = false;
          return;
        }
        window.location.replace("index.html");
      } catch (error) {
        showNotice(`Eroare la închiderea sesiunii: ${error.message}`);
        button.disabled = false;
      }
    });
  });

  window.sheriffAuth = {
    ready: null,
    isConfigured: isSupabaseConfigured,
    get client() {
      return supabaseClient;
    }
  };
  window.sheriffAuth.ready = startAuth().catch((error) => {
    showNotice(`Eroare la inițializarea autentificării: ${error.message}`);
  });
})();

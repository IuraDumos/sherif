(() => {
  const status = document.querySelector("#admin-console-status");
  const membersBody = document.querySelector("#members-table-body");
  const membersMessage = document.querySelector("#members-message");
  const logsBody = document.querySelector("#access-logs-table-body");
  const logsMessage = document.querySelector("#logs-message");
  const refreshButton = document.querySelector("#admin-refresh");

  function setMessage(element, message, isError = false) {
    element.textContent = message;
    element.dataset.state = isError ? "error" : "info";
  }

  function createCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
  }

  function renderMembers(members, currentUserId, supabase) {
    membersBody.replaceChildren();

    if (members.length === 0) {
      const row = document.createElement("tr");
      const cell = createCell("Nu există membri înregistrați.");
      cell.colSpan = 5;
      row.append(cell);
      membersBody.append(row);
      return;
    }

    members.forEach((member) => {
      const row = document.createElement("tr");
      row.append(createCell(member.display_name || "Membru Sheriff"));
      row.append(createCell(member.discord_id || "Discord neconectat"));

      const gradeCell = document.createElement("td");
      const gradeInput = document.createElement("input");
      gradeInput.className = "admin-grade-input";
      gradeInput.type = "text";
      gradeInput.maxLength = 50;
      gradeInput.value = member.grade;
      gradeInput.setAttribute("aria-label", `Grad pentru ${member.display_name || "membru"}`);
      gradeCell.append(gradeInput);
      row.append(gradeCell);

      const accessCell = document.createElement("td");
      const blockedLabel = document.createElement("label");
      blockedLabel.className = "admin-access-toggle";
      const blockedInput = document.createElement("input");
      blockedInput.type = "checkbox";
      blockedInput.checked = member.is_blocked;
      blockedInput.disabled = member.id === currentUserId;
      blockedInput.setAttribute("aria-label", `Blochează accesul pentru ${member.display_name || "membru"}`);
      const blockedText = document.createElement("span");
      blockedText.textContent = member.is_blocked ? "Blocat" : "Permis";
      blockedInput.addEventListener("change", () => {
        blockedText.textContent = blockedInput.checked ? "Blocat" : "Permis";
      });
      blockedLabel.append(blockedInput, blockedText);
      accessCell.append(blockedLabel);
      row.append(accessCell);

      const actionCell = document.createElement("td");
      const saveButton = document.createElement("button");
      saveButton.className = "admin-save-button";
      saveButton.type = "button";
      saveButton.textContent = "Salvează";
      saveButton.disabled = member.id === currentUserId;
      saveButton.addEventListener("click", async () => {
        saveButton.disabled = true;
        setMessage(membersMessage, `Se salvează modificările pentru ${member.display_name || "membru"}…`);
        try {
          const { error } = await supabase.rpc("set_member_access", {
            p_user_id: member.id,
            p_grade: gradeInput.value,
            p_is_blocked: blockedInput.checked
          });
          if (error) {
            setMessage(membersMessage, `Modificarea nu a fost salvată: ${error.message}`, true);
            saveButton.disabled = false;
            return;
          }
          setMessage(membersMessage, `Modificările pentru ${member.display_name || "membru"} au fost salvate.`);
          await loadAdminData(currentUserId, supabase);
        } catch (error) {
          setMessage(membersMessage, `Eroare la salvarea modificărilor: ${error.message}`, true);
          saveButton.disabled = false;
        }
      });
      actionCell.append(saveButton);
      row.append(actionCell);
      membersBody.append(row);
    });
  }

  function renderAccessLogs(logs) {
    logsBody.replaceChildren();

    if (logs.length === 0) {
      const row = document.createElement("tr");
      const cell = createCell("Nu există accesări în ultimele 30 de zile.");
      cell.colSpan = 4;
      row.append(cell);
      logsBody.append(row);
      return;
    }

    logs.forEach((log) => {
      const row = document.createElement("tr");
      row.append(createCell(log.discord_id || "Discord neconectat"));
      row.append(createCell(log.ip_address || "Necunoscut"));
      row.append(createCell(new Intl.DateTimeFormat("ro-RO", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date(log.created_at))));
      const resultCell = createCell(log.result === "allowed" ? "Permis" : "Blocat");
      resultCell.className = `log-result${log.result === "blocked" ? " is-blocked" : ""}`;
      row.append(resultCell);
      logsBody.append(row);
    });
  }

  async function loadAdminData(currentUserId, supabase) {
    setMessage(membersMessage, "Se încarcă membrii…");
    setMessage(logsMessage, "Se încarcă jurnalul…");

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const [membersResult, logsResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, discord_id, display_name, grade, is_blocked")
        .order("display_name"),
      supabase
        .from("access_logs")
        .select("discord_id, ip_address, result, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(250)
    ]);

    if (membersResult.error) {
      setMessage(membersMessage, `Nu s-au putut încărca membrii: ${membersResult.error.message}`, true);
    } else {
      renderMembers(membersResult.data || [], currentUserId, supabase);
      setMessage(membersMessage, `${membersResult.data?.length || 0} membri`);
    }

    if (logsResult.error) {
      setMessage(logsMessage, `Nu s-a putut încărca jurnalul: ${logsResult.error.message}`, true);
    } else {
      renderAccessLogs(logsResult.data || []);
      setMessage(logsMessage, `${logsResult.data?.length || 0} înregistrări · păstrare 30 de zile`);
    }
  }

  async function initializeAdminConsole() {
    const auth = window.sheriffAuth;
    await auth.ready;
    const supabase = auth.client;

    if (!auth.isConfigured) {
      status.textContent = "Configurează Supabase pentru a activa administrarea.";
      setMessage(membersMessage, "Datele nu sunt salvate sau gestionate în această configurație.", true);
      setMessage(logsMessage, "Jurnalizarea nu este activă până la conectarea Supabase.", true);
      return;
    }
    if (!supabase) {
      status.textContent = "Clientul Supabase nu este disponibil.";
      return;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      status.textContent = `Eroare sesiune: ${sessionError.message}`;
      return;
    }
    if (!sessionData.session) {
      status.textContent = "Autentifică-te cu un cont STAFF.";
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("grade, is_blocked")
      .eq("id", sessionData.session.user.id)
      .maybeSingle();

    if (profileError) {
      status.textContent = `Nu s-a putut verifica rolul: ${profileError.message}`;
      return;
    }
    if (!profile || profile.grade !== "STAFF" || profile.is_blocked) {
      status.textContent = "Accesul la administrare este permis doar conturilor STAFF.";
      document.querySelectorAll(".admin-member-management").forEach((section) => {
        section.hidden = true;
      });
      return;
    }

    status.replaceChildren();
    const indicator = document.createElement("span");
    status.append(indicator, document.createTextNode("STAFF · conectat"));
    await loadAdminData(sessionData.session.user.id, supabase);
    refreshButton.addEventListener("click", async () => {
      refreshButton.disabled = true;
      try {
        await loadAdminData(sessionData.session.user.id, supabase);
      } catch (error) {
        setMessage(membersMessage, `Eroare la reîncărcarea datelor: ${error.message}`, true);
      } finally {
        refreshButton.disabled = false;
      }
    });
  }

  initializeAdminConsole().catch((error) => {
    status.textContent = `Eroare la administrare: ${error.message}`;
  });
})();

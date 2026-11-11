# Configurare autentificare și administrare Sheriff

## 1. Creează proiectul Supabase

În Supabase Dashboard, creează un proiect și activează providerii **Google** și **Discord** din **Authentication → Providers**. Site-ul oferă autentificare OAuth cu ambele servicii (nu email/parolă).

Pentru fiecare provider, înregistrează o aplicație OAuth în Google Cloud Console, respectiv Discord Developer Portal, și copiază Client ID și Client Secret în setările providerului corespunzător din Supabase. În ambele aplicații OAuth, adaugă ca redirect URI callback-ul afișat de Supabase, de forma `https://<project-ref>.supabase.co/auth/v1/callback`. Nu pune secretele OAuth în fișierele site-ului.

În **Authentication → URL Configuration**, adaugă URL-ul site-ului publicat și ruta `index.html` în lista de redirect-uri permise. Pentru testare locală, servește folderul printr-un server HTTP local; autentificarea OAuth nu funcționează corect prin `file://`.

## 2. Creează tabelele și politicile

Rulează întregul fișier `supabase-schema.sql` o singură dată în **SQL Editor** din Supabase. Schema:

- creează profilurile, gradul și starea de blocare;
- limitează modificarea membrilor la funcția securizată accesibilă doar STAFF;
- păstrează un jurnal pentru fiecare sesiune: Discord, IP-ul, ora ultimei verificări și rezultatul (`allowed`/`blocked`);
- afișează jurnalele doar echipei STAFF, le ascunde după 30 de zile și le șterge periodic.

IP-ul este preluat de Worker din antetul Cloudflare `CF-Connecting-IP` și salvat în coloana `ip_address` cu tipul `inet`. Jurnalele aplicației sunt vizibile doar personalului STAFF și se șterg după 30 de zile. Supabase și Cloudflare pot procesa adrese IP separat, în jurnalele lor operaționale; verifică setările și termenii ambilor furnizori înainte de publicare.

Dacă schema a fost deja instalată, rulează din nou întregul `supabase-schema.sql` în SQL Editor. Actualizarea adaugă coloana IP și înlocuiește funcția de jurnalizare; înregistrările vechi nu pot fi completate retroactiv cu IP-uri.

După prima autentificare Discord, găsește profilul din `public.profiles` și atribuie contului tău gradul `STAFF` prin SQL Editor, folosind ID-ul UUID din coloana `id`:

```sql
update public.profiles
set grade = 'STAFF'
where id = 'UUID-ul-contului-tău';
```

Nu oferi gradul STAFF altor conturi decât celor de încredere.

## 3. Completează configurația publică

În `supabase-config.js`, înlocuiește URL-ul proiectului și cheia **anon/public** din **Project Settings → API**. Această cheie este publică și protecția datelor se bazează pe politicile RLS din schema SQL. Nu folosi cheia `service_role` în site sau în repository.

## 4. Publică prin Cloudflare Worker

Workerul din `cloudflare-worker.js` verifică sesiunea Supabase și profilul pentru fiecare pagină sau resursă protejată. Conturile blocate sunt trimise înapoi la autentificare, iar `admin.html` este livrat numai gradului `STAFF`. Cookie-ul de sesiune este `HttpOnly`, `Secure` și expiră odată cu tokenul Supabase. La autentificare, Workerul transmite IP-ul furnizat de Cloudflare funcției securizate de jurnalizare.

1. Creează un cont Cloudflare și activează un subdomeniu `workers.dev`.
2. În setările repository-ului GitHub, adaugă secretele `CLOUDFLARE_API_TOKEN` (cu permisiunea Workers Scripts: Edit) și `CLOUDFLARE_ACCOUNT_ID`.
3. Configurează Actions să permită workflow-urile și pornește **Deploy Sheriff to Cloudflare** din fila **Actions**. Workflow-ul publică `cloudflare-worker.js` și servește fișierele din repository cu Wrangler 4.
4. Adaugă `https://sheriff-site.<contul-tău>.workers.dev/index.html` la URL-urile permise din setările Authentication Supabase.
5. Dezactivează GitHub Pages pentru acest repository. Dacă rămâne activ, vechea adresă GitHub Pages va continua să ocolească protecția Workerului.

`wrangler.json` și `supabase-config.js` folosesc valori placeholder. Înlocuiește URL-ul proiectului și cheia **anon/public** în ambele fișiere; nu folosi cheia `service_role`. Configurează providerii Google și Discord în Supabase înainte de conectarea utilizatorilor.

const categories = [
  {
    name: "Circulație rutieră și încălcări în trafic",
    articles: [
      { id: "101", title: "Trecerea pe roșu", fine: "5.000$", suspension: "24h" },
      { id: "102", title: "Parcare ilegală", fine: "5.000$" },
      { id: "103", title: "Obstrucționarea vehiculelor de urgență", fine: "5.000$", suspension: "24h" },
      { id: "104", title: "Condus imprudent", fine: "5.000$", suspension: "24h" },
      { id: "105", title: "Accident rutier fără victime", fine: "10.000$" },
      { id: "106.1", title: "Viteză 11–20 km/h peste limită", fine: "3.000$", points: 3 },
      { id: "106.2", title: "Viteză 21–30 km/h peste limită", fine: "5.000$", points: 5 },
      { id: "106.3", title: "Viteză 31–40 km/h peste limită", fine: "7.000$", points: 7 },
      { id: "106.4", title: "Viteză 41–50 km/h peste limită", fine: "9.000$", points: 9 },
      { id: "106.5", title: "Viteză 51–70 km/h peste limită", fine: "12.000$", suspension: "24h" },
      { id: "106.6", title: "Viteză 71–100 km/h peste limită", fine: "15.000$", suspension: "48h" },
      { id: "106.7", title: "Viteză peste 100 km/h peste limită", fine: "20.000$", suspension: "72h" },
      { id: "107", title: "Purtarea măștii în timpul condusului", fine: "4.000$" },
      { id: "109", title: "Lipsa asigurării auto", fine: "15.000$" },
      { id: "111", title: "Modificări ilegale ale vehiculului", fine: "15.000$", points: 5, other: "Taxă suplimentară: 10.000$" },
      { id: "113", title: "Lipsa documentelor obligatorii", fine: "10.000$" },
      { id: "115", title: "Încălcarea regulilor de traversare", fine: "5.000$" },
      { id: "116", title: "Încălcarea liniei continue", fine: "15.000$", suspension: "24h" },
      { id: "119", title: "Încredințarea vehiculului unei persoane neautorizate", fine: "10.000$" },
      { id: "120", title: "Folosirea telefonului la volan", fine: "5.000$" },
      { id: "121", title: "Intrarea sau tăierea unei coloane oficiale", fine: "20.000$" },
      { id: "122", title: "Neacordarea primului ajutor", fine: "20.000$" },
      { id: "123", title: "Părăsirea sau modificarea locului accidentului", fine: "10.000$" },
      { id: "124", title: "Nereducerea vitezei lângă vehicule de urgență", fine: "7.000$" },
      { id: "125", title: "Circulația pe contrasens", fine: "15.000$" },
      { id: "126", title: "Circulația pe trotuar, acostament, iarbă sau piste", fine: "15.000$" },
      { id: "127", title: "Întoarcerea în locuri interzise", fine: "8.000$" },
      { id: "128", title: "Depășirea în locuri interzise", fine: "8.000$" },
      { id: "129", title: "Schimbarea benzii fără prioritate", fine: "8.000$" },
      { id: "130", title: "Neacordarea priorității de dreapta", fine: "6.000$" },
      { id: "131", title: "Neoprirea la STOP", fine: "4.000$" },
      { id: "132", title: "Neacordarea priorității pietonilor", fine: "5.000$" },
      { id: "133", title: "Circulația necorespunzătoare a vehiculelor lente", fine: "5.000$" },
      { id: "134", title: "Remorcarea cu viteză excesivă", fine: "5.000$" },
      { id: "135", title: "Încălcări pe autostradă", fine: "9.000$" },
      { id: "136", title: "Oprirea în locuri interzise", fine: "9.000$" },
      { id: "137", title: "Utilizarea necorespunzătoare a farurilor", fine: "3.000$" },
      { id: "138", title: "Claxonarea fără motiv", fine: "3.000$" },
      { id: "139", title: "Nerespectarea marcajelor și benzilor", fine: "3.000$" },
      { id: "140", title: "Conducerea unui vehicul defect", fine: "20.000$" }
    ]
  },
  {
    name: "Ordine publică și comportament în societate",
    articles: [
      { id: "108", title: "Nesupunere față de poliție", fine: "3.000$" },
      { id: "110", title: "Obscenitate și insulte publice", fine: "5.000$" },
      { id: "112", title: "Apel fals de urgență", fine: "5.000$" },
      { id: "114", title: "Tulburarea liniștii publice", fine: "3.000$" },
      { id: "117", title: "Neprezentarea documentelor la cererea agentului", fine: "5.000$" },
      { id: "118", title: "Refuzul de a opri sau coborî din vehicul", fine: "10.000$", suspension: "48h la repetare" },
      { id: "141", title: "Intrarea cu vehicule în clădirile statului", fine: "20.000$" },
      { id: "142", title: "Fumatul în locuri publice închise", fine: "5.000$" },
      { id: "143", title: "Ebrietate sau comportament neadecvat în public", fine: "5.000–20.000$" },
      { id: "144", title: "Purtarea la vedere a armelor albe și obiectelor periculoase", fine: "20.000$" },
      { id: "145", title: "Împiedicarea activității jurnaliștilor", fine: "20.000$" },
      { id: "146", title: "Comerț stradal fără autorizație", fine: "10.000$" },
      { id: "152", title: "Insultarea unui angajat al statului", fine: "10.000$" },
      { id: "203", title: "Punerea în pericol a traficului", fine: "18.000$" },
      { id: "206", title: "Protest sau adunare fără autorizație", fine: "20.000$", prison: 10 },
      { id: "207", title: "Revoltă și dezordini în masă", fine: "50.000$", prison: 50 },
      { id: "208", title: "Pătrunderea ilegală pe obiectivele statului", fine: "30.000$", prison: 30 },
      { id: "210", title: "Refuzul de a plăti amenda", fine: "20.000$", prison: 15 },
      { id: "211", title: "Cruzime față de animale", fine: "20.000$", prison: 15 }
    ]
  },
  {
    name: "Infracțiuni rutiere grave",
    articles: [
      { id: "201", title: "Condus fără permis", fine: "15.000$", prison: 15 },
      { id: "202", title: "Părăsirea locului accidentului", fine: "20.000$", prison: 15 },
      { id: "203.1", title: "Sustragerea de la urmărirea poliției", fine: "24.000$" },
      { id: "204", title: "Condus fără plăcuțe sau vehicul neînmatriculat", fine: "12.000$" }
    ]
  },
  {
    name: "Infracțiuni contra persoanei",
    articles: [
      { id: "301", title: "Omor", fine: "30.000$", prison: 30 },
      { id: "302", title: "Omor calificat", fine: "60.000$", prison: 60 },
      { id: "303", title: "Ucidere din culpă", fine: "25.000$", prison: 25 },
      { id: "304", title: "Amenințări", fine: "7.000$", prison: 5 },
      { id: "305", title: "Lipsire ilegală de libertate", fine: "20.000$", prison: 20 },
      { id: "306", title: "Lovire cu vătămare", fine: "15.000$", prison: 15 },
      { id: "307", title: "Viol", fine: "30.000$", prison: 30 },
      { id: "308", title: "Participare la altercație", fine: "10.000$", prison: 10 },
      { id: "309", title: "Șantaj", fine: "20.000$", prison: 20 },
      { id: "310", title: "Hărțuire", fine: "15.000$", prison: 15 },
      { id: "311", title: "Agresarea unui oficial public", fine: "60.000$", prison: 60 },
      { id: "313", title: "Împiedicarea medicilor să acorde ajutor", fine: "20.000$", prison: 30 },
      { id: "314", title: "Calomnie", fine: "20.000$", prison: 15 },
      { id: "315", title: "Provocarea intenționată a unui angajat al statului", fine: "20.000$", prison: 15 },
      { id: "316", title: "Samavolnicie", fine: "20.000$", prison: 20 },
      { id: "317", title: "Atentat la viața unui angajat al statului sau a familiei sale", fine: "100.000$", prison: 90 }
    ]
  },
  {
    name: "Infracțiuni contra proprietății",
    articles: [
      { id: "401", title: "Furt", fine: "20.000$", prison: 20 },
      { id: "402", title: "Jaf armat", fine: "30.000$", prison: 30 },
      { id: "403", title: "Jaf calificat", fine: "40.000$", prison: 40 },
      { id: "404", title: "Abuz de încredere", fine: "15.000$", prison: 15 },
      { id: "405", title: "Înșelăciune", fine: "20.000$", prison: 20 },
      { id: "406", title: "Distrugere de bunuri", fine: "10.000$", prison: 15 },
      { id: "407", title: "Distrugere calificată", fine: "40.000$", prison: 40 },
      { id: "408", title: "Distrugere din culpă", fine: "10.000$", prison: 15 },
      { id: "409", title: "Pătrundere fără drept", fine: "15.000$", prison: 15 },
      { id: "410", title: "Furt calificat", fine: "25.000$", prison: 25 },
      { id: "411", title: "Furt de vehicul", fine: "20.000$", prison: 15 },
      { id: "412", title: "Jaf asupra unei entități comerciale", fine: "60.000$", prison: 45 },
      { id: "413", title: "Furt mărunt", fine: "10.000$", prison: 10 },
      { id: "414", title: "Distrugerea bunurilor statului", fine: "40.000$", prison: 30 },
      { id: "415", title: "Furt de arme și echipamente speciale", fine: "60.000$", prison: 40 },
      { id: "416", title: "Obligarea unei persoane la o tranzacție", fine: "30.000$", prison: 30 }
    ]
  },
  {
    name: "Arme, muniții și substanțe interzise",
    articles: [
      { id: "148", title: "Deținere de droguri sub 3 grame", fine: "5.000–20.000$", confiscation: "Drogurile" },
      { id: "801", title: "Deținere ilegală de arme Categoria I.1/I.2", fine: "50.000$", prison: 30 },
      { id: "802", title: "Deținere ilegală de arme automate", fine: "70.000$", prison: 50 },
      { id: "803", title: "Deținere ilegală de muniție", fine: "40.000$", prison: 20 },
      { id: "804", title: "Descărcarea neautorizată a unei arme", fine: "50.000$", prison: 40 },
      { id: "805", title: "Agresiune armată cu vătămare", fine: "100.000$", prison: 60 },
      { id: "806", title: "Trafic ilegal de arme", fine: "200.000$", prison: 70 },
      { id: "807", title: "Deținere de substanțe Clasa II", fine: "20.000$", prison: 20 },
      { id: "808", title: "Deținere de substanțe Clasa I", fine: "30.000$", prison: 30 },
      { id: "809", title: "Trafic de substanțe Clasa II", fine: "40.000$", prison: 40 },
      { id: "810", title: "Trafic de substanțe Clasa I", fine: "60.000$", prison: 60 },
      { id: "811", title: "Civil cu arme sau echipament cu serie de stat", fine: "150.000$", prison: 70 },
      { id: "812", title: "Explozibili și dispozitive incendiare", fine: "150.000$", prison: 80 },
      { id: "813", title: "Cultivarea și producerea drogurilor", fine: "40.000$", prison: 40 }
    ]
  },
  {
    name: "Infracțiuni economice și comerciale",
    articles: [
      { id: "603", title: "Spălare de bani", fine: "100.000$", prison: 60, confiscation: "Bunurile" },
      { id: "604", title: "Evaziune fiscală", fine: "70.000$", prison: 50 },
      { id: "605", title: "Delapidare", fine: "50.000$", prison: 40 },
      { id: "606", title: "Activitate comercială fără înregistrare", fine: "20.000$", prison: 20 },
      { id: "607", title: "Fabricarea sau punerea în circulație a banilor falși", fine: "70.000$", prison: 50, confiscation: "Bunurile" },
      { id: "608", title: "Transportul mărfurilor interzise cu acte false", fine: "50.000$", prison: 40 },
      { id: "609", title: "Înțelegeri anticoncurențiale", fine: "60.000$", prison: 40 },
      { id: "610", title: "Ascunderea banilor sau bunurilor de la plata impozitelor", prison: 30 }
    ]
  },
  {
    name: "Corupție și abuz în serviciu",
    articles: [
      { id: "501", title: "Luare de mită", fine: "120.000$", prison: 120 },
      { id: "502", title: "Dare de mită", fine: "120.000$", prison: 120 },
      { id: "503", title: "Trafic de influență", fine: "120.000$", prison: 120 },
      { id: "504", title: "Comportament abuziv al unui oficial", fine: "60.000$", prison: 30 },
      { id: "505", title: "Abuz în serviciu", fine: "120.000$", prison: 60 },
      { id: "506", title: "Neglijență în serviciu", fine: "30.000$", prison: 20 },
      { id: "507", title: "Uzurparea unei funcții oficiale", fine: "60.000$", prison: 40 },
      { id: "508", title: "Divulgarea secretelor de stat", fine: "300.000$", prison: 120 },
      { id: "509", title: "Divulgarea secretelor de serviciu", fine: "200.000$", prison: 120 },
      { id: "510", title: "Intermedierea mitei", fine: "120.000$", prison: 120 },
      { id: "511", title: "Neexecutarea ordinelor legale", fine: "20.000$", prison: 20 },
      { id: "512", title: "Furtul bunurilor statului de către angajați", fine: "100.000$", prison: 80 },
      { id: "513", title: "Implicarea angajaților statului în droguri", fine: "100.000$", prison: 80 },
      { id: "514", title: "Obținerea ilegală de informații secrete", fine: "200.000$", prison: 120 },
      { id: "515", title: "Pierderea documentelor secrete", fine: "60.000$", prison: 40 }
    ]
  },
  {
    name: "Infracțiuni contra justiției",
    articles: [
      { id: "701", title: "Acuzație falsă", fine: "30.000$", prison: 30 },
      { id: "702", title: "Ajutorarea făptuitorului", fine: "25.000$", prison: 20 },
      { id: "703", title: "Tăinuirea unei infracțiuni", fine: "30.000$", prison: 25 },
      { id: "704", title: "Obstrucționarea justiției", fine: "40.000$", prison: 40 },
      { id: "705", title: "Mărturie mincinoasă", fine: "25.000$", prison: 25 },
      { id: "706", title: "Represalii împotriva unui martor", fine: "200.000$", prison: 120 },
      { id: "707", title: "Evadare din custodie", fine: "100.000$", prison: 70 },
      { id: "708", title: "Facilitarea unei evadări", fine: "100.000$", prison: 70 },
      { id: "709", title: "Nedenunțarea unei infracțiuni", fine: "30.000$", prison: 30 },
      { id: "710", title: "Nedenunțarea de către un oficial", fine: "30.000$", prison: 30 },
      { id: "711", title: "Amestecul în activitatea avocatului", fine: "40.000$", prison: 40 },
      { id: "712", title: "Amenințarea sau atacarea personalului juridic", fine: "150.000$", prison: 120 },
      { id: "713", title: "Tragerea la răspundere a unui nevinovat", fine: "100.000$", prison: 60 },
      { id: "714", title: "Reținerea sau arestarea ilegală", fine: "100.000$", prison: 60 },
      { id: "715", title: "Falsificarea probelor", fine: "100.000$", prison: 60 },
      { id: "716", title: "Mituirea unui martor sau a unei victime", fine: "60.000$", prison: 50 },
      { id: "717", title: "Neexecutarea hotărârilor judecătorești", fine: "40.000$", prison: 40 },
      { id: "718", title: "Ascunderea sau distrugerea probelor", fine: "40.000$", prison: 40 },
      { id: "719", title: "Sustragerea de la anchetă sau judecată", fine: "40.000$", prison: 40 },
      { id: "720", title: "Refuzul de a da declarații", fine: "20.000$" }
    ]
  },
  {
    name: "Terorism și securitatea statului",
    articles: [
      { id: "901", title: "Act terorist", fine: "300.000$", prison: 120 },
      { id: "902", title: "Propagandă teroristă", fine: "100.000$", prison: 60 },
      { id: "903", title: "Alarmă falsă despre bombă sau terorism", fine: "70.000$", prison: 50 },
      { id: "904", title: "Finanțarea terorismului", fine: "200.000$", prison: 120 },
      { id: "905", title: "Lovitură de stat sau rebeliune armată", fine: "300.000$", prison: 120 },
      { id: "906", title: "Separatism", fine: "200.000$", prison: 120 },
      { id: "907", title: "Grup armat ilegal", fine: "150.000$", prison: 100 },
      { id: "908", title: "Împiedicarea alegerilor sau activității Guvernului", fine: "100.000$", prison: 60 }
    ]
  },
  {
    name: "Aviație și transport aerian",
    articles: [
      { id: "149", title: "Aterizare în zone interzise", fine: "20.000$" },
      { id: "150", title: "Zbor fără acte, sub influență sau în spațiu aerian închis", fine: "15.000–20.000$" }
    ]
  },
  {
    name: "Servicii publice și atribuțiile angajaților statului",
    articles: [
      { id: "153", title: "Ieșirea nejustificată din zona de competență", fine: "20.000$" },
      { id: "209", title: "Luarea sau conducerea unui vehicul al statului", fine: "30.000$", prison: 30 }
    ]
  },
  {
    name: "Alte contravenții și infracțiuni",
    articles: [
      { id: "147", title: "Braconaj", fine: "5.000–20.000$", confiscation: "Captura" },
      { id: "151", title: "Acordarea de ajutor medical fără calificare", fine: "10.000$" },
      { id: "154", title: "Neacordarea priorității între vehiculele de urgență", fine: "10.000$" },
      { id: "155", title: "Conducerea periculoasă a vehiculului de serviciu", fine: "15.000$" },
      { id: "205", title: "Constituirea unui grup infracțional organizat", fine: "50.000$", prison: 50 },
      { id: "600", title: "Confiscarea obligatorie a bunurilor", confiscation: "Obligatorie" }
    ]
  }
];

const categoryList = document.querySelector("#category-list");
const searchInput = document.querySelector("#article-search");
const recordContent = document.querySelector("#record-content");
const emptyState = document.querySelector("#empty-state");
const totalCount = document.querySelector("#total-count");
const selectedCount = document.querySelector("#selected-count");
const flatArticles = categories.flatMap((category, categoryIndex) =>
  category.articles.map((article) => ({ ...article, category: category.name, categoryIndex }))
);
const selectedArticleIds = new Set();

totalCount.textContent = String(flatArticles.length);

function createSanction(label, value, isZero = false, wide = false) {
  const card = document.createElement("div");
  card.className = `sanction${isZero ? " is-zero" : ""}${wide ? " wide" : ""}`;
  const heading = document.createElement("span");
  heading.className = "sanction-label";
  heading.textContent = label;
  const amount = document.createElement("strong");
  amount.className = `sanction-value${isZero ? " zero" : ""}`;
  amount.textContent = value;
  card.append(heading, amount);
  return card;
}

function formatFineTotal(articles) {
  const total = articles.reduce((sum, article) => {
    const amounts = (article.fine || "").match(/\d[\d.]*/g);
    if (!amounts) return sum;
    const values = amounts.map((amount) => Number(amount.replace(/\./g, "")));
    return {
      minimum: sum.minimum + values[0],
      maximum: sum.maximum + (values[1] ?? values[0])
    };
  }, { minimum: 0, maximum: 0 });
  const format = (amount) => new Intl.NumberFormat("ro-RO").format(amount);
  return total.minimum === total.maximum
    ? `${format(total.minimum)}$`
    : `${format(total.minimum)}–${format(total.maximum)}$`;
}

function renderRecord() {
  const selectedArticles = flatArticles.filter((article) => selectedArticleIds.has(article.id));
  const totalPrison = selectedArticles.reduce((total, article) => total + (article.prison || 0), 0);
  const totalPoints = selectedArticles.reduce((total, article) => total + (article.points || 0), 0);
  const suspendedArticles = selectedArticles.filter((article) => article.suspension);
  const confiscatedAssets = [...new Set(
    selectedArticles
      .filter((article) => article.confiscation)
      .map((article) => article.confiscation)
  )];

  recordContent.replaceChildren();
  const intro = document.createElement("div");
  intro.className = "record-intro";

  const title = document.createElement("h2");
  title.textContent = "Cazierul selectat";

  const category = document.createElement("p");
  category.className = "record-category";
  category.textContent = selectedArticles.length
    ? "Verifică articolele și sancțiunile cumulate pentru acest dosar."
    : "Selectează articole din listă pentru a le adăuga în cazier.";
  intro.append(title, category);

  const summaryHeading = document.createElement("h3");
  summaryHeading.className = "sanctions-heading";
  summaryHeading.textContent = "Sancțiuni cumulate";

  const grid = document.createElement("div");
  grid.className = "sanctions-grid";
  grid.append(
    createSanction("Amendă totală", formatFineTotal(selectedArticles), selectedArticles.length === 0),
    createSanction("Timp total de executat", `${totalPrison} minute`, totalPrison === 0),
    createSanction("Puncte de penalizare", String(totalPoints), totalPoints === 0),
    createSanction("Permis suspendat", suspendedArticles.length ? "Da" : "Nu", suspendedArticles.length === 0),
    createSanction("Confiscare", confiscatedAssets.length ? confiscatedAssets.join(", ") : "Nu", confiscatedAssets.length === 0)
  );

  const selectionHeading = document.createElement("div");
  selectionHeading.className = "selection-heading";
  const selectedArticlesHeading = document.createElement("h3");
  selectedArticlesHeading.className = "sanctions-heading";
  selectedArticlesHeading.textContent = "Articole în cazier";
  const clearButton = document.createElement("button");
  clearButton.className = "clear-selection";
  clearButton.type = "button";
  clearButton.textContent = "Șterge selecția";
  clearButton.disabled = selectedArticles.length === 0;
  clearButton.addEventListener("click", () => {
    selectedArticleIds.clear();
    renderRecord();
    updateArticleSelection();
  });
  selectionHeading.append(selectedArticlesHeading, clearButton);

  const selectedList = document.createElement("div");
  selectedList.className = "selected-articles";
  if (selectedArticles.length === 0) {
    const emptySelection = document.createElement("p");
    emptySelection.className = "empty-selection";
    emptySelection.textContent = "Nu ai selectat niciun articol.";
    selectedList.append(emptySelection);
  }
  selectedArticles.forEach((article) => {
    const item = document.createElement("article");
    item.className = "selected-article";
    const itemHeader = document.createElement("div");
    itemHeader.className = "selected-article-header";

    const articleTitle = document.createElement("h4");
    articleTitle.textContent = `Art. ${article.id} — ${article.title}`;
    const removeButton = document.createElement("button");
    removeButton.className = "remove-article";
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Elimină articolul ${article.id} din cazier`);
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      selectedArticleIds.delete(article.id);
      renderRecord();
      updateArticleSelection();
    });
    itemHeader.append(articleTitle, removeButton);

    const details = document.createElement("p");
    details.className = "selected-article-details";
    details.textContent = `Închisoare: ${article.prison || 0} min · Amendă: ${article.fine || "0$"} · Puncte: ${article.points || 0}`;
    item.append(itemHeader, details);

    const notes = [];
    if (article.suspension) notes.push(`Permis suspendat: ${article.suspension}`);
    if (article.confiscation) notes.push(`Confiscări: ${article.confiscation}`);
    if (article.other) notes.push(article.other);
    if (notes.length) {
      const additional = document.createElement("p");
      additional.className = "selected-article-notes";
      additional.textContent = notes.join(" · ");
      item.append(additional);
    }
    selectedList.append(item);
  });

  const suspended = suspendedArticles.map((article) => `Art. ${article.id}: ${article.suspension}`);
  const otherSanctions = selectedArticles
    .filter((article) => article.other)
    .map((article) => `Art. ${article.id}: ${article.other}`);
  recordContent.append(intro, summaryHeading, grid, selectionHeading, selectedList);

  [
    ["Suspendări permis", suspended],
    ["Alte sancțiuni", otherSanctions]
  ].forEach(([label, entries]) => {
    if (entries.length === 0) return;
    const detail = document.createElement("p");
    detail.className = "aggregate-detail";
    const detailLabel = document.createElement("strong");
    detailLabel.textContent = `${label}: `;
    detail.append(detailLabel, document.createTextNode(entries.join(" · ")));
    recordContent.append(detail);
  });

  selectedCount.textContent = `${selectedArticles.length} ${selectedArticles.length === 1 ? "articol selectat" : "articole selectate"}`;
}

function selectArticle(article) {
  if (selectedArticleIds.has(article.id)) {
    selectedArticleIds.delete(article.id);
  } else {
    selectedArticleIds.add(article.id);
  }
  renderRecord();
  updateArticleSelection();
}

function updateArticleSelection() {
  categoryList.querySelectorAll(".article-button").forEach((button) => {
    const selected = selectedArticleIds.has(button.dataset.articleId);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function renderCategories(query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase("ro");
  categoryList.replaceChildren();
  let visibleCount = 0;

  categories.forEach((category, categoryIndex) => {
    const matchingArticles = category.articles.filter((article) => {
      const searchable = `${article.id} ${article.title} ${category.name}`.toLocaleLowerCase("ro");
      return searchable.includes(normalizedQuery);
    });
    if (matchingArticles.length === 0) return;
    visibleCount += matchingArticles.length;

    const section = document.createElement("section");
    section.className = "category";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "category-title";
    toggle.setAttribute("aria-expanded", normalizedQuery ? "true" : "false");
    toggle.setAttribute("aria-controls", `category-articles-${categoryIndex}`);

    const chevron = document.createElement("span");
    chevron.className = "category-chevron";
    chevron.setAttribute("aria-hidden", "true");
    const name = document.createElement("span");
    name.className = "category-name";
    name.textContent = category.name;
    const count = document.createElement("span");
    count.className = "category-count";
    count.textContent = String(matchingArticles.length);
    toggle.append(chevron, name, count);

    const list = document.createElement("div");
    list.className = "article-items";
    list.id = `category-articles-${categoryIndex}`;
    list.hidden = !normalizedQuery;
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      list.hidden = expanded;
    });

    matchingArticles.forEach((article) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "article-button";
      button.dataset.articleId = article.id;
      button.setAttribute("aria-pressed", String(selectedArticleIds.has(article.id)));
      const check = document.createElement("span");
      check.className = "selection-check";
      check.setAttribute("aria-hidden", "true");
      check.textContent = "✓";
      const articleNumber = document.createElement("span");
      articleNumber.className = "article-number";
      articleNumber.textContent = article.id;
      const articleName = document.createElement("span");
      articleName.className = "article-name";
      articleName.textContent = article.title;
      button.append(check, articleNumber, articleName);
      button.addEventListener("click", () => selectArticle({ ...article, category: category.name }));
      list.append(button);
    });

    section.append(toggle, list);
    categoryList.append(section);
  });

  emptyState.hidden = visibleCount > 0;
}

searchInput.addEventListener("input", () => renderCategories(searchInput.value));
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
});

renderCategories();
renderRecord();

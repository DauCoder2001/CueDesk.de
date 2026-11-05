// CueDesk-Website – gemeinsames Skript aller Seiten.
// VERSION ist die einzige Stelle, an der die Versionsnummer der Website steht.
const VERSION = "1.8.0";

document.querySelectorAll("[data-version]").forEach((el) => {
  el.textContent = "Version " + VERSION;
});

// Aktuelle Seite im Menü markieren. Verglichen wird der Seitenname ohne
// ".html", damit auch Adressen wie /funktionen oder /fragen/ passen.
const seitenname = (pfad) => pfad.replace(/\/+$/, "").split("/").pop().replace(/\.html$/, "") || "index";
const seite = seitenname(location.pathname);
document.querySelectorAll(".navi a[href]").forEach((a) => {
  if (a.classList.contains("knopf")) return;
  if (seitenname(new URL(a.getAttribute("href"), location.href).pathname) === seite) a.setAttribute("aria-current", "page");
});

// Menü auf schmalen Bildschirmen: Knopf "Menü" öffnet, "Schließen", Esc oder
// ein Tippen außerhalb schließen es wieder.
const knopf = document.querySelector(".menue-knopf");
const navi = document.querySelector(".navi");
if (knopf && navi) {
  const setzen = (offen) => {
    navi.classList.toggle("offen", offen);
    knopf.setAttribute("aria-expanded", String(offen));
    knopf.textContent = offen ? "Schließen" : "Menü";
  };
  knopf.addEventListener("click", () => setzen(!navi.classList.contains("offen")));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navi.classList.contains("offen")) { setzen(false); knopf.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (navi.classList.contains("offen") && !navi.contains(e.target) && !knopf.contains(e.target)) setzen(false);
  });
}

// Jahr im Fuß
document.querySelectorAll("[data-jahr]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

// Bildschirmfotos zum Vergrößern anklicken (Schließen: Klick, Esc oder ×)
const bilder = document.querySelectorAll(".bildschirm img");
if (bilder.length && window.HTMLDialogElement) {
  const gross = document.createElement("dialog");
  gross.className = "gross";
  gross.innerHTML = '<button type="button" class="gross-zu" aria-label="Schließen">×</button><img alt=""><p class="gross-text"></p>';
  document.body.appendChild(gross);
  const grossBild = gross.querySelector("img");
  const grossText = gross.querySelector(".gross-text");
  gross.addEventListener("click", () => gross.close());
  gross.addEventListener("close", () => { document.documentElement.classList.remove("gross-offen"); });
  const oeffnen = (img) => {
    grossBild.src = img.currentSrc || img.src;
    grossBild.alt = img.alt;
    grossText.textContent = img.alt;
    document.documentElement.classList.add("gross-offen");
    gross.showModal();
  };
  bilder.forEach((img) => {
    img.classList.add("zoombar");
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.title = "Zum Vergrößern anklicken";
    img.addEventListener("click", () => oeffnen(img));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); oeffnen(img); }
    });
  });
}

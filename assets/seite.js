// CueDesk-Website – gemeinsames Skript aller Seiten.
// VERSION ist die einzige Stelle, an der die Versionsnummer der Website steht.
const VERSION = "1.3.0";

document.querySelectorAll("[data-version]").forEach((el) => {
  el.textContent = "Version " + VERSION;
});

// Aktuelle Seite im Menü markieren
const seite = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".navi a[href]").forEach((a) => {
  if (a.getAttribute("href") === seite) a.setAttribute("aria-current", "page");
});

// Menü auf schmalen Bildschirmen
const knopf = document.querySelector(".menue-knopf");
const navi = document.querySelector(".navi");
if (knopf && navi) {
  knopf.addEventListener("click", () => {
    const offen = navi.classList.toggle("offen");
    knopf.setAttribute("aria-expanded", String(offen));
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

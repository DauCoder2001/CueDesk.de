// CueDesk-Website – gemeinsames Skript aller Seiten.
// VERSION ist die einzige Stelle, an der die Versionsnummer der Website steht.
const VERSION = "1.1.1";

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

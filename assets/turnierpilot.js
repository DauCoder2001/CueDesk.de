// TurnierPilot-Seite: Versionen von GitHub holen (Repository DauCoder2001/turnierpilot).
// Knopf, Versionsangabe, "Was ist neu?" und "Frühere Versionen" stimmen damit nach jedem
// "npm run veroeffentlichen" von selbst. Verlinkt werden nur die Installer-Dateien selbst,
// keine GitHub-Seiten. Klappt die Abfrage nicht, laden die Knöpfe den Installer, der im
// HTML steht (ältere Version, die sich danach selbst aktualisiert).

(function () {
  const API = "https://api.github.com/repos/DauCoder2001/turnierpilot/releases?per_page=10";

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (z) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[z]);
  }

  // Einfache Umsetzung der Release-Notizen (Aufzaehlungen, `Code`, **fett**, Links).
  // Der Teil nach "---" (Installationshinweis) wird weggelassen.
  function notizen(text) {
    const inline = (s) => esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(https:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');
    const teile = String(text || "").replace(/\r\n/g, "\n").split(/\n---\n/)[0].trim().split("\n");
    let html = "", liste = false;
    for (const zeile of teile) {
      const m = zeile.match(/^\s*[-*]\s+(.*)$/);
      if (m) { if (!liste) { html += "<ul>"; liste = true; } html += "<li>" + inline(m[1]) + "</li>"; continue; }
      if (liste) { html += "</ul>"; liste = false; }
      if (zeile.trim()) html += "<p>" + inline(zeile) + "</p>";
    }
    if (liste) html += "</ul>";
    return html;
  }

  function angaben(rel) {
    return {
      version: String(rel.tag_name || "").replace(/^v/, ""),
      exe: (rel.assets || []).find((a) => /\.exe$/i.test(a.name)),
      datum: rel.published_at ? new Date(rel.published_at).toLocaleDateString("de-DE") : "",
    };
  }

  const neu = document.getElementById("tp-neu");

  fetch(API, { headers: { Accept: "application/vnd.github+json" } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((liste) => {
      const versionen = (liste || []).filter((r) => !r.draft && !r.prerelease);
      if (!versionen.length) return Promise.reject("leer");

      // Neueste Version
      const { version, exe, datum } = angaben(versionen[0]);
      if (exe) {
        document.querySelectorAll("#tp-download, [data-tp-download]").forEach((knopf) => {
          knopf.href = exe.browser_download_url;
          knopf.textContent = "TurnierPilot " + version + " herunterladen";
        });
        const name = document.getElementById("tp-dateiname");
        if (name) name.innerHTML = "<code>" + esc(exe.name) + "</code>";
      }
      const info = document.getElementById("tp-info");
      if (info) {
        const mb = exe ? " · " + Math.round(exe.size / 1048576) + " MB" : "";
        info.textContent = "Version " + version + (datum ? " vom " + datum : "") + mb + " · für Windows 10 und 11";
      }
      if (neu) neu.innerHTML = "<h3>Version " + esc(version) + (datum ? " · " + esc(datum) : "") + "</h3>" + notizen(versionen[0].body);

      // Frühere Versionen
      const frueher = document.getElementById("tp-frueher");
      const ziel = document.getElementById("tp-frueher-liste");
      if (frueher && ziel && versionen.length > 1) {
        ziel.innerHTML = versionen.slice(1).map((rel) => {
          const a = angaben(rel);
          const laden = a.exe ? '<p><a href="' + esc(a.exe.browser_download_url) + '">' + esc(a.exe.name) + "</a></p>" : "";
          return '<details class="karte" style="margin-bottom:.6rem"><summary><strong>Version ' + esc(a.version) + "</strong>" +
            (a.datum ? " · " + esc(a.datum) : "") + "</summary>" + notizen(rel.body) + laden + "</details>";
        }).join("");
        frueher.hidden = false;
      }
    })
    .catch(() => {
      if (neu) neu.innerHTML = "<p>Die Änderungen konnten gerade nicht geladen werden. Der Download-Knopf funktioniert trotzdem.</p>";
    });
})();

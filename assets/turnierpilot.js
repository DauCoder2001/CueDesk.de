// TurnierPilot-Seite: neueste Version von GitHub holen (Repository DauCoder2001/turnierpilot).
// Knopf, Versionsangabe und "Was ist neu?" stimmen damit nach jedem
// "npm run veroeffentlichen" von selbst. Klappt die Abfrage nicht, fuehrt der Knopf
// zur Release-Seite auf GitHub (steht schon so im HTML).

(function () {
  const API = "https://api.github.com/repos/DauCoder2001/turnierpilot/releases/latest";

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (z) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[z]);
  }

  // Einfache Umsetzung der Release-Notizen (Aufzaehlungen, `Code`, **fett**, Links)
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

  fetch(API, { headers: { Accept: "application/vnd.github+json" } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((rel) => {
      const version = String(rel.tag_name || "").replace(/^v/, "");
      const exe = (rel.assets || []).find((a) => /\.exe$/i.test(a.name));
      const datum = rel.published_at ? new Date(rel.published_at).toLocaleDateString("de-DE") : "";
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
      const neu = document.getElementById("tp-neu");
      if (neu && rel.body) neu.innerHTML = "<h3>Version " + esc(version) + (datum ? " · " + esc(datum) : "") + "</h3>" + notizen(rel.body);
    })
    .catch(() => { /* Knopf fuehrt zur Release-Seite */ });
})();

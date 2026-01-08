// Simple partial loader: injects /partials/navbar.html and /partials/footer.html
async function loadPartial(elId, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    const html = await res.text();
    const el = document.getElementById(elId);
    if (el) el.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPartial('navbar', '/partials/navbar.html');
  loadPartial('footer', '/partials/footer.html');
});
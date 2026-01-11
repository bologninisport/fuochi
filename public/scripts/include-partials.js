// Simple partial loader: injects /partials/navbar.html and /partials/footer.html
async function loadPartial(elId, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    const html = await res.text();
    const el = document.getElementById(elId);
    if (el) el.innerHTML = html;
    return el;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function loadScriptOnce(src){
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement('script');
  s.src = src; s.defer = true; s.async = false;
  document.body.appendChild(s);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadPartial('navbar', '/partials/navbar.html');
  await loadPartial('footer', '/partials/footer.html');

  // Load reusable scripts that depend on DOM/footer being present
  loadScriptOnce('/scripts/lightbox.js');
});
// lightbox.js
// Inietta automaticamente Lightbox2 (CSS + JS) e collega le immagini dei caroselli Bootstrap

(function() {
  const LIGHTBOX_CSS = "/vendor/lightbox2/css/lightbox.min.css";
  const LIGHTBOX_JS = "/vendor/lightbox2/js/lightbox.min.js";

  function loadResource(type, url) {
    return new Promise((resolve, reject) => {
      if (type === "css") {
        if (document.querySelector(`link[href="${url}"]`)) return resolve();
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      } else if (type === "js") {
        if (document.querySelector(`script[src="${url}"]`)) {
          if (typeof lightbox !== "undefined") return resolve();
          else return document.querySelector(`script[src="${url}"]`).addEventListener("load", resolve);
        }
        const script = document.createElement("script");
        script.src = url;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  }

  async function ensureLightbox() {
    try {
      await loadResource("css", LIGHTBOX_CSS);
      await loadResource("js", LIGHTBOX_JS);
    } catch (err) {
      console.error("Errore nel caricamento di Lightbox2:", err);
    }
  }

  function setupLightbox() {
    if (typeof lightbox === 'undefined') {
      console.warn("Lightbox2 non disponibile.");
      return;
    }

    // Impostazioni predefinite
    lightbox.option({
      resizeDuration: 200,
      wrapAround: true,
      alwaysShowNavOnTouchDevices: true
    });

    function attachCarouselImages() {
      const carousels = document.querySelectorAll('.carousel');
      
      carousels.forEach((carousel, carouselIndex) => {
        const imgs = carousel.querySelectorAll('.carousel-item img');

        imgs.forEach((img) => {
          if (img._lbAttached) return;
          img._lbAttached = true;

          if (!img.closest('a[data-lightbox]')) {
            const link = document.createElement('a');
            link.href = img.src;
            link.dataset.lightbox = `carousel-${carouselIndex}`;
            // link.dataset.title = img.alt || '';
            img.parentNode.insertBefore(link, img);
            link.appendChild(img);
          }

          img.style.cursor = 'zoom-in';
        });
      });
    }

    const observer = new MutationObserver(() => attachCarouselImages());
    observer.observe(document.body, { childList: true, subtree: true });
    attachCarouselImages();
  }

  async function init() {
    await ensureLightbox();
    setupLightbox();
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init);
  else
    init();
})();

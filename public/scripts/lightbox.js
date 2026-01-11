// Lightweight carousel image lightbox
(function(){
  function createModal(){
    if (document.getElementById('globalLightboxModal')) return document.getElementById('globalLightboxModal');

    const modal = document.createElement('div');
    modal.id = 'globalLightboxModal';
    modal.className = 'modal fade';
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-white border-0 shadow">
          <div class="modal-body p-3 position-relative">
            <button type="button" class="btn-close position-absolute top-0 end-0 m-2" data-bs-dismiss="modal" aria-label="Close"></button>
            <img src="" alt="" id="globalLightboxImage" class="d-block mx-auto">
          </div>
          <div class="modal-footer justify-content-between lightbox-controls border-0">
            <button type="button" class="btn btn-outline-dark" id="globalLightboxPrev" aria-label="Previous">&larr;</button>
            <button type="button" class="btn btn-outline-dark" id="globalLightboxNext" aria-label="Next">&rarr;</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  function setup(){
    const modalEl = createModal();
    const imgEl = modalEl.querySelector('#globalLightboxImage');
    const prevBtn = modalEl.querySelector('#globalLightboxPrev');
    const nextBtn = modalEl.querySelector('#globalLightboxNext');
    const bsModal = new bootstrap.Modal(modalEl);

    let currentIndex = 0;
    let currentSet = [];

    function openAt(index){
      currentIndex = (index + currentSet.length) % currentSet.length;
      imgEl.src = currentSet[currentIndex].src;
      imgEl.alt = currentSet[currentIndex].alt || '';
      bsModal.show();
    }

    function attachCarouselImgs(){
      // find all carousel images
      const images = document.querySelectorAll('.carousel .carousel-item img');
      images.forEach(img => {
        // ensure cursor style
        img.style.cursor = 'zoom-in';
        if (img._lbAttached) return;
        img._lbAttached = true;

        img.addEventListener('click', (e) => {
          e.preventDefault();
          const carousel = img.closest('.carousel');
          const setImgs = Array.from(carousel.querySelectorAll('.carousel-item img')).map(i=>({src:i.getAttribute('src'), alt:i.getAttribute('alt')||''}));
          currentSet = setImgs;
          const idx = setImgs.findIndex(i=>i.src === img.getAttribute('src'));
          openAt(idx === -1 ? 0 : idx);
        });
      });
    }

    // Previous / Next
    prevBtn.addEventListener('click', () => openAt(currentIndex - 1));
    nextBtn.addEventListener('click', () => openAt(currentIndex + 1));

    // Keyboard navigation
    modalEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') openAt(currentIndex -1);
      if (e.key === 'ArrowRight') openAt(currentIndex +1);
    });

    // Re-scan when DOM changes (in case carousels are injected later)
    const ro = new MutationObserver(() => attachCarouselImgs());
    ro.observe(document.body, {childList:true, subtree:true});

    // initial attach
    attachCarouselImgs();

    // Expose for debugging (optional)
    window.__globalLightbox = { openAt, attachCarouselImgs };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
})();
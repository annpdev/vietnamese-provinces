document.addEventListener('DOMContentLoaded', () => {

  const thumb   = document.getElementById('thumbnail');
      const overlay = document.getElementById('overlay');
      const img     = document.getElementById('overlayImg');

      const zoomLevels = [0.5,1,1.5,2,2.5,3];
      let idx = 1, scale = zoomLevels[idx];
      let tx = 0, ty = 0;
      let startX, startY, originTx, originTy, isDragging;

      function update() {
        img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
        img.style.cursor = scale>1 ? 'move' : 'zoom-in';
      }

      // Mở overlay
      thumb.addEventListener('click', () => {
        overlay.style.display = 'flex';
        idx = 1; scale=zoomLevels[idx];
        tx=0; ty=0;
        update();
      });

      // Đóng overlay
      overlay.addEventListener('click', e => {
        if (e.target===overlay) overlay.style.display='none';
      });
      document.addEventListener('keydown', e => {
        if (e.key==='Escape') overlay.style.display='none';
      });

      // Start pan/prepare click
      img.addEventListener('pointerdown', e => {
        img.setPointerCapture(e.pointerId);
        // tắt transition để pan mượt
        img.classList.remove('zoom-transition');
        startX=e.clientX; startY=e.clientY;
        originTx=tx; originTy=ty;
        isDragging=false;
      });

      // Pan
      img.addEventListener('pointermove', e => {
        if (!(e.buttons&1) || scale<=1) return;
        e.preventDefault();
        isDragging = true;
        tx = originTx + (e.clientX - startX);
        ty = originTy + (e.clientY - startY);
        update();
      });

      // End pan / click to zoom
      img.addEventListener('pointerup', e => {
        img.releasePointerCapture(e.pointerId);
        // bật lại transition cho zoom
        img.classList.add('zoom-transition');

        if (!isDragging) {
          idx = (idx+1)%zoomLevels.length;
          scale = zoomLevels[idx];
          if (scale<=1) { tx=0; ty=0; }
          update();
        }
      });

    const copyButtons = document.querySelectorAll('.copy-btn');
  
    copyButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const codeElement = document.getElementById(targetId);
        const codeText = codeElement.innerText;
        
        navigator.clipboard.writeText(codeText)
          .then(() => {
            // Lưu lại nội dung ban đầu của nút
            const originalText = button.innerText;
            button.innerText = 'Đã sao chép';
            setTimeout(() => {
              button.innerText = originalText;
            }, 2000);
          })
          .catch(err => {
            console.error('Error copying text: ', err);
            button.innerText = 'Error';
          });
      });
    });
  });
  
/* ==========================================================================
 * Lightbox — 图片点击放大 / 查看器
 * 纯原生 JavaScript，无第三方依赖。
 * 配套样式：assets/css/lightbox.css
 * 引入位置：layouts/partials/lightbox.html（走 Hugo 资源管线压缩+指纹）
 * 开关：hugo.yaml -> params.lightbox.enabled
 *
 * 功能：
 *   - 点击正文图片放大查看
 *   - ESC 或点遮罩空白处关闭
 *   - ←/→ 或左右按钮 在同一分组内切换图片
 *   - 滚轮 / +− 按钮 / 键盘 + − 0 缩放（以光标 / 图片中心为锚点）
 *   - 放大后可拖拽平移；移动端支持双指捏合缩放
 *   - data-full 指定高清大图；data-download + data-downloadName 提供下载
 *   - 按 data-lightbox 的值分组（同值同组）；.no-lightbox 类可排除某张图
 * ========================================================================== */
(function () {
  'use strict';

  // 只有这些正文容器内的 <img> 才启用灯箱（PaperMod 单篇/微博正文均为 .post-single .md-content）
  var IMG_SELECTOR = '.post-single .md-content img, .post-content img, .post-body img';
  // 没有 data-lightbox 属性的图片统一归入这个默认分组
  var DEFAULT_GROUP = '__default__';
  var MIN_SCALE = 0.5;    // 最小缩放倍数
  var MAX_SCALE = 6;      // 最大缩放倍数
  var ZOOM_STEP = 1.4;    // 按钮 / 键盘每次缩放倍数
  var WHEEL_STEP = 1.15;  // 滚轮每次缩放倍数

  class ImageLightbox {
    constructor() {
      this.overlay = null;
      this.images = [];            // 当前分组内的图片（供 ←/→ 切换）
      this.groups = new Map();     // 分组表：data-lightbox 值 -> [img, ...]
      this.currentIndex = -1;
      this.previousFocus = null;   // 打开前的焦点元素，关闭时还原
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.lastTouchDist = 0;
      this.bound = new WeakSet();  // 已绑定 click 的图片，避免重复绑定
      this.init();
    }

    /* 初始化：建 DOM -> 绑事件 -> 收集图片 */
    init() {
      this.createOverlay();
      this.bindEvents();
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.collectImages());
      } else {
        this.collectImages();
      }
    }

    /* 构建遮罩层及其内部控件（隐藏，打开时才显示） */
    createOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.className = 'lightbox-overlay';
      this.overlay.setAttribute('role', 'dialog');
      this.overlay.setAttribute('aria-modal', 'true');
      this.overlay.setAttribute('aria-hidden', 'true');
      this.overlay.setAttribute('tabindex', '-1');
      this.overlay.innerHTML = `
        <div class="lightbox-content">
          <img class="lightbox-image" src="" alt="" draggable="false">
        </div>
        <button class="lightbox-close" type="button" aria-label="关闭">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <a class="lightbox-download" href="" download hidden aria-label="下载原始高清图" title="下载原始高清图">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>
          </svg>
          <span>下载原图</span>
        </a>
        <button class="lightbox-nav lightbox-prev" type="button" aria-label="上一张">&#8249;</button>
        <button class="lightbox-nav lightbox-next" type="button" aria-label="下一张">&#8250;</button>
        <div class="lightbox-zoom-controls">
          <button class="lightbox-zoom-btn lightbox-zoom-out" type="button" aria-label="缩小">&#8722;</button>
          <span class="lightbox-zoom-level">100%</span>
          <button class="lightbox-zoom-btn lightbox-zoom-in" type="button" aria-label="放大">&#43;</button>
        </div>
      `;
      document.body.appendChild(this.overlay);
    }

    /* 收集正文图片：按 data-lightbox 值分组，并给每张图绑定 click。
       每次打开前会重新调用，以兼容动态插入的图片。 */
    collectImages() {
      var all = Array.from(document.querySelectorAll(IMG_SELECTOR))
        .filter(function (img) { return !img.classList.contains('no-lightbox'); });

      this.groups = new Map();
      all.forEach((img) => {
        // 分组键：data-lightbox 的值；未设置则归入默认分组
        var key = img.dataset.lightbox || DEFAULT_GROUP;
        if (!this.groups.has(key)) this.groups.set(key, []);
        this.groups.get(key).push(img);

        // 只绑定一次 click（用 WeakSet 记录，避免重复绑定）
        if (!this.bound.has(img)) {
          this.bound.add(img);
          img.addEventListener('click', () => this.open(img));
        }
      });
    }

    /* 绑定遮罩层内的所有交互事件 */
    bindEvents() {
      var overlay = this.overlay;
      var closeBtn = overlay.querySelector('.lightbox-close');
      var prevBtn = overlay.querySelector('.lightbox-prev');
      var nextBtn = overlay.querySelector('.lightbox-next');
      var zoomIn = overlay.querySelector('.lightbox-zoom-in');
      var zoomOut = overlay.querySelector('.lightbox-zoom-out');
      var download = overlay.querySelector('.lightbox-download');
      var image = overlay.querySelector('.lightbox-image');

      // 点遮罩空白处（非图片区域）关闭
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target === overlay.querySelector('.lightbox-content')) {
          this.close();
        }
      });

      closeBtn.addEventListener('click', () => this.close());
      prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prevImage(); });
      nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.nextImage(); });
      download.addEventListener('click', (e) => e.stopPropagation());
      zoomIn.addEventListener('click', (e) => { e.stopPropagation(); this.zoomBy(ZOOM_STEP); });
      zoomOut.addEventListener('click', (e) => { e.stopPropagation(); this.zoomBy(1 / ZOOM_STEP); });

      // 滚轮缩放（以鼠标位置为锚点）
      overlay.addEventListener('wheel', (e) => {
        if (overlay.getAttribute('aria-hidden') === 'true') return;
        e.preventDefault();
        var factor = e.deltaY < 0 ? WHEEL_STEP : 1 / WHEEL_STEP;
        this.zoomAt(factor, e.clientX, e.clientY);
      }, { passive: false });

      // 鼠标拖拽平移（仅在放大后）
      image.addEventListener('mousedown', (e) => {
        if (this.scale <= 1) return;
        e.preventDefault();
        this.isDragging = true;
        this.dragStartX = e.clientX - this.translateX;
        this.dragStartY = e.clientY - this.translateY;
        image.style.cursor = 'grabbing';
      });
      document.addEventListener('mousemove', (e) => {
        if (!this.isDragging) return;
        this.translateX = e.clientX - this.dragStartX;
        this.translateY = e.clientY - this.dragStartY;
        this.applyTransform(false);
      });
      document.addEventListener('mouseup', () => {
        if (!this.isDragging) return;
        this.isDragging = false;
        image.style.cursor = this.scale > 1 ? 'grab' : 'default';
      });

      // 触摸：双指捏合缩放 / 单指拖拽平移
      overlay.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          this.lastTouchDist = this.getTouchDist(e.touches);
          this.isDragging = false;
        } else if (e.touches.length === 1 && this.scale > 1) {
          this.isDragging = true;
          this.dragStartX = e.touches[0].clientX - this.translateX;
          this.dragStartY = e.touches[0].clientY - this.translateY;
        }
      }, { passive: false });

      overlay.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          var dist = this.getTouchDist(e.touches);
          if (this.lastTouchDist > 0) {
            var cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            var cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            this.zoomAt(dist / this.lastTouchDist, cx, cy);
          }
          this.lastTouchDist = dist;
        } else if (e.touches.length === 1 && this.isDragging) {
          e.preventDefault();
          this.translateX = e.touches[0].clientX - this.dragStartX;
          this.translateY = e.touches[0].clientY - this.dragStartY;
          this.applyTransform(false);
        }
      }, { passive: false });

      overlay.addEventListener('touchend', (e) => {
        this.lastTouchDist = 0;
        if (e.touches.length === 0) this.isDragging = false;
      });

      // 键盘：ESC 关闭、←/→ 切换、+ − 0 缩放
      document.addEventListener('keydown', (e) => {
        if (overlay.getAttribute('aria-hidden') === 'true') return;
        if (e.key === 'Escape') this.close();
        else if (e.key === 'ArrowLeft') this.prevImage();
        else if (e.key === 'ArrowRight') this.nextImage();
        else if (e.key === '+' || e.key === '=') this.zoomBy(ZOOM_STEP);
        else if (e.key === '-') this.zoomBy(1 / ZOOM_STEP);
        else if (e.key === '0') this.resetZoom();
      });
    }

    /* 计算两指间距 */
    getTouchDist(touches) {
      var dx = touches[0].clientX - touches[1].clientX;
      var dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    /* 以图片中心为锚点缩放 */
    zoomBy(factor) {
      var image = this.overlay.querySelector('.lightbox-image');
      var rect = image.getBoundingClientRect();
      this.zoomAt(factor, rect.left + rect.width / 2, rect.top + rect.height / 2, true);
    }

    /* 以 (px, py) 为锚点缩放，保持该点在屏幕上不动。
       animate=true 时给一个 0.2s 过渡（用于按钮/键盘），滚轮则即时跟随。 */
    zoomAt(factor, px, py, animate = false) {
      var next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, this.scale * factor));
      if (next === this.scale) return;

      var image = this.overlay.querySelector('.lightbox-image');
      var rect = image.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;

      // 平移量补偿：锚点相对中心偏移 * (1 - 新/旧)
      this.translateX += (px - centerX) * (1 - next / this.scale);
      this.translateY += (py - centerY) * (1 - next / this.scale);
      this.scale = next;

      this.applyTransform(animate);
      image.style.cursor = this.scale > 1 ? 'grab' : 'default';
    }

    /* 复位缩放与平移 */
    resetZoom() {
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.applyTransform(true);
      this.overlay.querySelector('.lightbox-image').style.cursor = 'default';
    }

    /* 把 scale / translate 写进 transform，并同步缩放百分比文字 */
    applyTransform(animate) {
      var image = this.overlay.querySelector('.lightbox-image');
      image.style.transition = animate ? 'transform 0.2s ease' : 'none';
      image.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
      var level = this.overlay.querySelector('.lightbox-zoom-level');
      if (level) level.textContent = Math.round(this.scale * 100) + '%';
    }

    /* 打开灯箱：以被点击的图片为基准，取出它所属的分组 */
    open(img) {
      this.collectImages(); // 重新收集，兼容动态插入的图片

      var key = img.dataset.lightbox || DEFAULT_GROUP;
      this.images = this.groups.get(key) || [img];
      this.currentIndex = Math.max(0, this.images.indexOf(img));

      this.previousFocus = document.activeElement;
      this.showImage(this.currentIndex);

      this.overlay.style.display = 'flex';
      this.overlay.setAttribute('aria-hidden', 'false');
      this.overlay.querySelector('.lightbox-close').focus();
      document.body.style.overflow = 'hidden'; // 锁滚动
    }

    /* 显示分组内第 i 张图（i 支持负值/越界，自动环绕） */
    showImage(i) {
      if (this.images.length === 0) return;
      this.currentIndex = (i + this.images.length) % this.images.length;

      var thumb = this.images[this.currentIndex];
      var image = this.overlay.querySelector('.lightbox-image');
      // 优先用 data-full（高清大图），否则回退到缩略图本身
      image.src = thumb.dataset.full || thumb.src || thumb.currentSrc;
      image.alt = thumb.alt;

      // 下载按钮：仅在图片带 data-download 时显示
      var download = this.overlay.querySelector('.lightbox-download');
      var dlHref = thumb.dataset.download;
      download.hidden = !dlHref;
      if (dlHref) {
        download.href = dlHref;
        download.download = thumb.dataset.downloadName || '';
      } else {
        download.removeAttribute('href');
        download.removeAttribute('download');
      }

      this.resetZoom();

      // 分组内多于一张才显示左右切换
      var multi = this.images.length > 1;
      this.overlay.querySelector('.lightbox-prev').hidden = !multi;
      this.overlay.querySelector('.lightbox-next').hidden = !multi;
    }

    /* 关闭灯箱并还原状态 */
    close() {
      this.overlay.style.display = 'none';
      this.overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      this.resetZoom();
      if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
        this.previousFocus.focus();
      }
    }

    prevImage() {
      if (this.images.length > 1) this.showImage(this.currentIndex - 1);
    }

    nextImage() {
      if (this.images.length > 1) this.showImage(this.currentIndex + 1);
    }
  }

  new ImageLightbox();
})();

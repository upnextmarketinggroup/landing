(() => {
  const config = window.LANDING_CONFIG;
  const intro = document.querySelector('#intro');
  const landing = document.querySelector('#landing');
  const baseLogo = document.querySelector('#intro-logo-base');
  const colorLogo = document.querySelector('#intro-logo-color');
  const skip = document.querySelector('#skip');
  const replay = document.querySelector('#replay');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let run = 0, timer, animations = [], effects, replaying = false;

  document.querySelector('#year').textContent = new Date().getFullYear();
  for (const item of config.links) {
    let url;
    try { url = new URL(item.url); } catch { /* Empty URLs are placeholders. */ }
    const linked = url && ['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol);
    const card = document.createElement(linked ? 'a' : 'div');
    card.className = 'link-card';
    if (linked) card.href = url.href;
    const copy = document.createElement('span'); copy.className = 'link-copy';
    const title = document.createElement('span'); title.className = 'link-title'; title.textContent = item.title;
    const subtitle = document.createElement('span'); subtitle.className = 'link-subtitle'; subtitle.textContent = item.subtitle;
    copy.append(title, subtitle);
    const badge = document.createElement('span');
    badge.className = linked ? 'link-arrow' : 'coming-soon';
    if (linked) {
      badge.setAttribute('aria-hidden', 'true');
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('viewBox', '0 0 24 24'); arrow.setAttribute('focusable', 'false');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M5 19 19 5M5 5h14v14');
      path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '2'); path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round');
      arrow.append(path); badge.append(arrow);
    } else badge.textContent = 'COMING SOON';
    card.append(copy, badge); document.querySelector('#links').append(card);
  }

  function animate(element, frames, options) {
    const animation = element.animate(frames, options); animations.push(animation); return animation;
  }
  function effect(className, x, y) {
    const element = document.createElement('i'); element.className = className;
    element.style.left = `${x}px`; element.style.top = `${y}px`; effects.append(element); return element;
  }
  function logoMark(object) { return object.contentDocument?.querySelector('.apostrophe-motion'); }
  function resetIntro() {
    baseLogo.style.visibility = colorLogo.style.visibility = '';
    colorLogo.style.clipPath = 'polygon(0% 100%,0% 100%,0% 100%)';
    [baseLogo, colorLogo].forEach(object => { const mark = logoMark(object); if (mark) { mark.style.visibility = ''; mark.style.transform = ''; } });
  }
  function finish() {
    run++; clearTimeout(timer); document.body.classList.remove('intro-active');
    intro.classList.remove('running'); intro.setAttribute('aria-hidden', 'true'); skip.tabIndex = -1;
    landing.inert = false; landing.classList.remove('revealing'); landing.style.clipPath = '';
    animations.forEach(animation => animation.cancel()); animations = []; effects?.remove(); effects = null; resetIntro();
    if (replaying || document.activeElement === skip) replay.focus({ preventScroll: true }); replaying = false;
  }

  async function activate() {
    if (reducedMotion.matches) return finish();
    const token = ++run;
    window.scrollTo({ top: 0, behavior: 'instant' }); document.body.classList.add('intro-active');
    intro.classList.add('running'); intro.setAttribute('aria-hidden', 'false'); skip.tabIndex = 0; landing.inert = true; resetIntro();
    timer = setTimeout(finish, 6000);
    effects = document.createElement('div'); effects.className = 'firework-effects'; effects.setAttribute('aria-hidden', 'true'); document.body.append(effects);
    try {
      await animate(colorLogo, [
        { clipPath: 'polygon(0% 100%,0% 100%,0% 100%)' },
        { clipPath: 'polygon(0% 100%,0% -100%,200% 100%)' }
      ], { duration: 2400, easing: 'linear', fill: 'forwards' }).finished;
      if (token !== run) return;
      const marks = [logoMark(baseLogo), logoMark(colorLogo)];
      if (marks.some(mark => !mark)) throw new Error('Logo mark unavailable');
      const rect = marks[1].getBoundingClientRect(), logoRect = colorLogo.getBoundingClientRect(), unit = logoRect.width / 315;
      const x = logoRect.left + rect.left + rect.width / 2, y = logoRect.top + rect.top + rect.height / 2, targetY = Math.max(28, innerHeight * .06), distance = Math.max(50, y - targetY);
      const trail = effect('air-trail', x, y); trail.style.height = `${Math.max(90, distance * .65)}px`;
      animate(trail, [{ transform: 'translate(-50%,0) scaleY(.08)', opacity: 0 }, { opacity: .85, offset: .2 }, { transform: `translate(-50%,${-distance}px) scaleY(1)`, opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.65,0,1,.35)', fill: 'forwards' });
      [-1, 1].forEach(side => { const cut = effect('air-cut', x + side * (rect.width / 2 + 8), y - 10); animate(cut, [{ transform: 'translateY(0) scaleY(.3)', opacity: 0 }, { opacity: .65, offset: .25 }, { transform: `translateY(${-distance}px) scaleY(1.6)`, opacity: 0 }], { duration: 520, fill: 'forwards' }); });
      await Promise.all(marks.map(mark => animate(mark, [{ transform: 'translateY(0)' }, { transform: `translateY(${-distance / unit}px)` }], { duration: 520, easing: 'cubic-bezier(.65,0,1,.35)', fill: 'forwards' }).finished));
      if (token !== run) return; baseLogo.style.visibility = colorLogo.style.visibility = 'hidden';
      const edge = .94, radius = (Math.hypot(Math.max(x, innerWidth - x), Math.max(targetY, innerHeight - targetY)) + 24) / .89;
      const wave = effect('blast-wave', x - radius, targetY - radius); wave.style.width = wave.style.height = `${2 * radius}px`;
      const timing = { duration: 420, easing: 'cubic-bezier(.12,.72,.16,1)', fill: 'forwards' }; landing.classList.add('revealing');
      const reveal = animate(landing, [{ clipPath: `circle(0px at ${x}px ${targetY}px)` }, { clipPath: `circle(${radius * edge}px at ${x}px ${targetY}px)` }], timing);
      const blast = animate(wave, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], timing);
      const start = document.timeline.currentTime; reveal.startTime = start; blast.startTime = start;
      await reveal.finished; if (token === run) finish();
    } catch { if (token === run) finish(); }
  }

  function startWhenReady() {
    if (baseLogo.contentDocument && colorLogo.contentDocument) return activate();
    let loaded = 0, started = false;
    const ready = () => { if (++loaded === 2 && !started) { started = true; activate(); } };
    baseLogo.addEventListener('load', ready, { once: true }); colorLogo.addEventListener('load', ready, { once: true });
    setTimeout(() => { if (!started) { started = true; activate(); } }, 1500);
  }

  skip.addEventListener('click', finish);
  replay.addEventListener('click', () => { replaying = true; startWhenReady(); skip.focus({ preventScroll: true }); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && intro.classList.contains('running')) finish(); });
  window.addEventListener('resize', () => { if (intro.classList.contains('running')) finish(); });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finish(); replay.hidden = reducedMotion.matches; });
  replay.hidden = reducedMotion.matches;
  if (!reducedMotion.matches) startWhenReady();
})();

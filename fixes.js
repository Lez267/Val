/* ══ fixes.js — cargar al FINAL del body, después del script principal ══ */
(function () {
  /* Quitar rotationX de las letras del nombre (evita capas 3D por letra) */
  ['set', 'to'].forEach(function (fn) {
    var orig = gsap[fn].bind(gsap);
    gsap[fn] = function (target, vars) {
      if (typeof target === 'string' && target.indexOf('hero-name') !== -1 && vars) {
        delete vars.rotationX;
      }
      return orig.apply(null, arguments);
    };
  });

  /* Pétalos: de 32 a 18 */
  var petals = document.querySelectorAll('#petals-container .petal');
  for (var i = 18; i < petals.length; i++) petals[i].remove();

  /* Punto que late en la insignia */
  var badgeDot = document.querySelector('#hero-badge > div:not(.dot)');
  if (badgeDot && !badgeDot.className) badgeDot.className = 'dot';

  /* Audio: al terminar, vuelve al segundo 30 */
  var audio = document.getElementById('bg-audio');
  if (audio) {
    audio.addEventListener('ended', function () {
      audio.currentTime = 30;
      audio.play();
    });
  }

  /* Cuando se desbloquea la página */
  var main = document.getElementById('main-content');
  new MutationObserver(function (m, obs) {
    if (!main.classList.contains('visible')) return;
    obs.disconnect();

    /* Sombra del nombre vuelve cuando termina la animación */
    setTimeout(function () {
      var n = document.getElementById('hero-name');
      if (n) n.style.textShadow = '0 4px 40px rgba(232,120,159,0.35)';
    }, 3500);

    /* Pausar tulipanes cuando el hero no se ve */
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      onToggle: function (self) {
        document.querySelector('.tulips-container')
          .classList.toggle('paused', !self.isActive);
      }
    });
  }).observe(main, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();

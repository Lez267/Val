/* ══════════════════════════════════════════════════════════════
   REGISTER GSAP PLUGINS
══════════════════════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger, CustomEase);

/* Custom easing curves */
CustomEase.create('softSpring',  'M0,0 C0.14,0 0.27,1.2 0.5,1.03 0.73,0.9 0.87,1 1,1');
CustomEase.create('smoothOut',   'M0,0 C0.16,1 0.3,1 1,1');
CustomEase.create('dramaticIn',  'M0,0 C0.4,0 0.2,1 1,1');

/* ══════════════════════════════════════════════════════════════
   PETALS
══════════════════════════════════════════════════════════════ */
(function() {
    const c = document.getElementById('petals-container');
    const colors = ['#F9BFCF','#F4A0BA','#E8789F','#C5E8B5','#A8D99A','#FFE4EE','#DDF5D5','#FDEEF4'];
    for (let i = 0; i < 32; i++) {
        const el = document.createElement('div');
        el.className = 'petal';
        const size = Math.random() * 12 + 7;
        el.style.cssText = `
            left: ${Math.random() * 100}vw;
            width: ${size}px; height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            animation-duration: ${Math.random() * 9 + 8}s;
            animation-delay: ${Math.random() * 15}s;
            border-radius: ${Math.random() > 0.5 ? '0 50% 0 50%' : '50% 0 50% 0'};
        `;
        c.appendChild(el);
    }
})();

/* ══════════════════════════════════════════════════════════════
   CURSOR GLOW
══════════════════════════════════════════════════════════════ */
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
    gsap.to(cursorGlow, {
        x: e.clientX, y: e.clientY,
        duration: 0.6,
        ease: 'power2.out'
    });
});

/* ══════════════════════════════════════════════════════════════
   PAGE LOAD — Password Screen Entrance
══════════════════════════════════════════════════════════════ */

/* Establish GSAP-owned initial states (avoid CSS transform conflicts) */
gsap.set('#pw-card',   { y: 44, scale: 0.93 });
gsap.set('#pw-rose',   { scale: 0, rotation: -160 });
gsap.set('#pw-title',  { y: 22, opacity: 0 });
gsap.set('#pw-subtitle',{ y: 16, opacity: 0 });
gsap.set('.pw-input',  { y: 14, opacity: 0 });
gsap.set('#pw-btn',    { y: 14, opacity: 0 });
gsap.set('.pw-hint',   { opacity: 0 });

const pwTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

pwTl
    .to('#password-screen', { opacity: 1, duration: 0.6 })
    .to('#pw-card', {
        opacity: 1, y: 0, scale: 1,
        duration: 1.1, ease: 'power4.out'
    }, '-=0.15')
    .to('#pw-rose', {
        scale: 1, rotation: 0,
        duration: 1, ease: 'back.out(1.8)'
    }, '-=0.65')
    .to('#pw-title',   { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
    .to('#pw-subtitle',{ y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
    .to('.pw-input',   { y: 0, opacity: 1, duration: 0.6 }, '-=0.45')
    .to('#pw-btn',     { y: 0, opacity: 1, duration: 0.6 }, '-=0.45')
    .to('.pw-hint',    { opacity: 1, duration: 0.5 }, '-=0.2');

/* Rose continuous float via GSAP */
gsap.to('#pw-rose', {
    y: -14,
    rotation: 6,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 1
});

/* ── Magnetic Button ──────────────────── */
function addMagnetic(selector, strength = 0.35) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - r.left - r.width  / 2;
            const y = e.clientY - r.top  - r.height / 2;
            gsap.to(el, { x: x * strength, y: y * strength, duration: 0.35, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
        });
        el.addEventListener('mouseenter', () => {
            gsap.to(el, { scale: 1.04, duration: 0.25, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
        });
        el.addEventListener('mousedown', () => gsap.to(el, { scale: 0.95, duration: 0.12, ease: 'power2.in' }));
        el.addEventListener('mouseup',   () => gsap.to(el, { scale: 1.04, duration: 0.2,  ease: 'back.out(2)' }));
    });
}

addMagnetic('#pw-btn');

/* ── Input focus glow ─────────────────── */
const pwInput = document.getElementById('pw-input');
pwInput.addEventListener('focus', () => {
    gsap.to(pwInput, { '--glow': '5px', duration: 0.3 });
});

/* ══════════════════════════════════════════════════════════════
   PASSWORD CHECK
══════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════
   PIN PAD LOGIC
══════════════════════════════════════════════════════════════ */
const CORRECT_PW = '17042026';
let pinDigits = '';

function updateDots() {
    for (let i = 0; i < 8; i++) {
        const dot = document.getElementById('d' + i);
        if (dot) dot.classList.toggle('filled', i < pinDigits.length);
    }
}

// Ensure GSAP functions even if called from HTML
window.pinPress = function(digit, btn) {
    if (pinDigits.length >= 8) return;
    pinDigits += digit;
    updateDots();
    gsap.timeline()
        .to(btn, { scale: 0.85, duration: 0.1, ease: 'power2.in' })
        .to(btn, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
    if (pinDigits.length === 8) setTimeout(checkPw, 180);
};

window.pinDelete = function(btn) {
    if (!pinDigits.length) return;
    pinDigits = pinDigits.slice(0, -1);
    updateDots();
    gsap.timeline()
        .to(btn, { scale: 0.85, duration: 0.1, ease: 'power2.in' })
        .to(btn, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
};

window.pinSlash = function(btn) {
    // Slashes are disabled in new pure-digit logic, just give feedback
    gsap.timeline()
        .to(btn, { x: -4, duration: 0.05 })
        .to(btn, { x: 4, duration: 0.05 })
        .to(btn, { x: 0, duration: 0.05 });
};

function checkPw() {
    const val = pinDigits;
    const err = document.getElementById('pw-error');
    const display = document.getElementById('pw-display');

    if (val === CORRECT_PW) {
        /* AnimatePresence equivalent — exit password screen */
        const exitTl = gsap.timeline({
            onComplete: () => {
                document.getElementById('password-screen').classList.add('hidden');
                gsap.set('#password-screen', { display: 'none' });
                const mc = document.getElementById('main-content');
                mc.classList.add('visible');
                startHeroAnimation();
                startCounter();
                initScrollAnimations();
                initMicrointeractions();
            }
        });
        exitTl
            .to('#pw-card', {
                scale: 1.08, opacity: 0, y: -30,
                duration: 0.55, ease: 'power3.in'
            })
            .to('#password-screen', {
                opacity: 0, duration: 0.4, ease: 'power2.in'
            }, '-=0.2');

    } else {
        /* Shake error */
        display.classList.add('error-state');
        gsap.timeline()
            .to('#pw-card', { x: -10, duration: 0.07, ease: 'power2.in',
                onStart: () => { err.classList.add('show'); }
            })
            .to('#pw-card', { x: 10, duration: 0.07 })
            .to('#pw-card', { x: -8, duration: 0.07 })
            .to('#pw-card', { x: 8,  duration: 0.07 })
            .to('#pw-card', { x: 0,  duration: 0.05 });
        setTimeout(() => {
            err.classList.remove('show');
            display.classList.remove('error-state');
            pinDigits = '';
            updateDots();
        }, 2000);
    }
}

/* ══════════════════════════════════════════════════════════════
   HERO ANIMATION (fires after password exit)
══════════════════════════════════════════════════════════════ */
function startHeroAnimation() {
    /* ── 1. Split "Valeria" into char spans ── */
    const nameEl = document.getElementById('hero-name');
    const text   = nameEl.textContent.trim();
    nameEl.innerHTML = text.split('').map(
        ch => `<span class="char">${ch}</span>`
    ).join('');

    /* ── 2. Set ALL initial states via GSAP (not CSS)
           This is the correct approach — gsap.set() owns the
           starting values so gsap.to() knows exactly where to go ── */
    gsap.set('#hero-eyebrow',       { opacity: 0, y: 28 });
    gsap.set('.hero-name .char',    { opacity: 0, y: 75, rotationX: 42, transformOrigin: '50% bottom' });
    gsap.set('#hero-lastname',      { opacity: 0, y: 22 });
    gsap.set('#hero-badge',         { opacity: 0, y: 18, scale: 0.88 });
    gsap.set('#hero-song',          { opacity: 0, x: 28 });
    gsap.set('#scroll-cue',         { opacity: 0 });

    /* ── 3. Animate TO final states ── */
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
        .to('#hero-eyebrow', {
            opacity: 1, y: 0,
            duration: 1
        })
        .to('.hero-name .char', {
            opacity: 1, y: 0, rotationX: 0,
            stagger: { each: 0.065, ease: 'power2.out' },
            duration: 1.05,
            ease: 'power4.out'
        }, '-=0.6')
        .to('#hero-lastname', {
            opacity: 1, y: 0,
            duration: 0.95
        }, '-=0.5')
        .to('#hero-badge', {
            opacity: 1, y: 0, scale: 1,
            duration: 0.85, ease: 'back.out(1.3)'
        }, '-=0.5')
        .to('#hero-song', {
            opacity: 1, x: 0,
            duration: 0.85, ease: 'back.out(1.3)'
        }, '-=0.55')
        .to('#scroll-cue', {
            opacity: 1,
            duration: 0.7
        }, '-=0.3');

    /* ── 4. Scroll parallax on hero ── */
    gsap.to('#hero-name', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
        },
        y: -70, scale: 0.94, opacity: 0.5, ease: 'none'
    });
}

/* ══════════════════════════════════════════════════════════════
   AUDIO PLAYER
══════════════════════════════════════════════════════════════ */
let isPlaying = false;
function toggleSong() {
    const audio = document.getElementById('bg-audio');
    const btn   = document.getElementById('mini-play');
    if (isPlaying) {
        audio.pause();
        btn.innerHTML = '&#9654;';
        isPlaying = false;
    } else {
        audio.play().catch(() => {});
        btn.innerHTML = '&#9646;&#9646;';
        isPlaying = true;
    }
    gsap.timeline()
        .to(btn, { scale: 0.85, duration: 0.1, ease: 'power2.in' })
        .to(btn, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
}

/* ══════════════════════════════════════════════════════════════
   COUNTER — with animated count-up
══════════════════════════════════════════════════════════════ */
function startCounter() {
    const origin = new Date('2026-04-17T00:00:00');

    function getValues() {
        const diff = Date.now() - origin.getTime();
        if (diff < 0) return { d:0, h:0, m:0, s:0 };
        return {
            d: Math.floor(diff / 864e5),
            h: Math.floor((diff % 864e5) / 36e5),
            m: Math.floor((diff % 36e5) / 6e4),
            s: Math.floor((diff % 6e4) / 1e3)
        };
    }

    /* Initial count-up animation */
    const target = getValues();
    const counter = { d:0, h:0, m:0, s:0 };

    gsap.to(counter, {
        d: target.d,
        h: target.h,
        m: target.m,
        duration: 2.2,
        ease: 'power3.out',
        onUpdate: () => {
            document.getElementById('cnt-days').textContent  = Math.round(counter.d).toLocaleString('es');
            document.getElementById('cnt-hours').textContent = String(Math.round(counter.h)).padStart(2,'0');
            document.getElementById('cnt-mins').textContent  = String(Math.round(counter.m)).padStart(2,'0');
        }
    });

    /* Live seconds tick */
    function tick() {
        const v = getValues();
        document.getElementById('cnt-days').textContent  = v.d.toLocaleString('es');
        document.getElementById('cnt-hours').textContent = String(v.h).padStart(2,'0');
        document.getElementById('cnt-mins').textContent  = String(v.m).padStart(2,'0');
        /* Seconds with a subtle scale pop */
        const secEl = document.getElementById('cnt-secs');
        secEl.textContent = String(v.s).padStart(2,'0');
        gsap.fromTo(secEl, { scale: 1.15 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
    }
    setTimeout(() => { tick(); setInterval(tick, 1000); }, 2200);
}

/* ══════════════════════════════════════════════════════════════
   SCROLL-TRIGGERED ANIMATIONS (whileInView equivalent)
══════════════════════════════════════════════════════════════ */
function initScrollAnimations() {

    /* Helper — uses fromTo for reliable opacity+y animation */
    function sectionHeader(eyebrowId, headingId, triggerEl) {
        gsap.fromTo(
            [eyebrowId, headingId],
            { opacity: 0, y: 38 },
            {
                scrollTrigger: { trigger: triggerEl, start: 'top 82%', once: true },
                opacity: 1, y: 0,
                stagger: 0.2,
                duration: 1,
                ease: 'power3.out'
            }
        );
    }

    /* ─ Counter ─ */
    sectionHeader('#cnt-eyebrow', '#cnt-heading', '.counter-section');
    gsap.fromTo(
        ['#tile-d','#tile-h','#tile-m','#tile-s'],
        { opacity: 0, y: 52, scale: 0.87 },
        {
            scrollTrigger: { trigger: '.counter-grid', start: 'top 82%', once: true },
            opacity: 1, y: 0, scale: 1,
            stagger: 0.13,
            duration: 0.9,
            ease: 'back.out(1.5)'
        }
    );
    gsap.fromTo('#cnt-caption',
        { opacity: 0, y: 20 },
        { scrollTrigger: { trigger: '#cnt-caption', start: 'top 92%', once: true },
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    /* ─ Letter ─ */
    sectionHeader('#let-eyebrow', '#let-heading', '.letter-section');
    gsap.fromTo('#letter-card',
        { opacity: 0, x: -55, rotationY: 4 },
        {
            scrollTrigger: { trigger: '#letter-card', start: 'top 82%', once: true },
            opacity: 1, x: 0, rotationY: 0,
            duration: 1.1, ease: 'power3.out'
        }
    );

    /* ─ Lyrics ─ */
    sectionHeader('#lyr-eyebrow', '#lyr-heading', '.lyrics-section');
    gsap.fromTo('#lyr-left',
        { opacity: 0, x: -65 },
        { scrollTrigger: { trigger: '.lyrics-layout', start: 'top 82%', once: true },
          opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo('#lyr-right',
        { opacity: 0, x: 65 },
        { scrollTrigger: { trigger: '.lyrics-layout', start: 'top 82%', once: true },
          opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo('.photo-frame-outer',
        { opacity: 0, scale: 0.74 },
        {
            scrollTrigger: { trigger: '.photo-frame-outer', start: 'top 85%', once: true },
            opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.35)'
        }
    );
    gsap.fromTo(['.photo-upload-label','#spotify-btn'],
        { opacity: 0, y: 22 },
        { scrollTrigger: { trigger: '#spotify-btn', start: 'top 92%', once: true },
          opacity: 1, y: 0, stagger: 0.16, duration: 0.8, ease: 'power3.out' }
    );

    /* ─ Reasons — stagger wave ─ */
    sectionHeader('#rea-eyebrow', '#rea-heading', '.reasons-section');
    gsap.fromTo('.reason-card',
        { opacity: 0, y: 52, scale: 0.91 },
        {
            scrollTrigger: { trigger: '#reasons-grid', start: 'top 82%', once: true },
            opacity: 1, y: 0, scale: 1,
            stagger: { each: 0.075, from: 'start', ease: 'power2.out' },
            duration: 0.8,
            ease: 'back.out(1.4)'
        }
    );

    /* ─ Footer ─ */
    gsap.fromTo(['#ft-label','#ft-main','#ft-sub','#ft-ornament'],
        { opacity: 0, y: 38 },
        {
            scrollTrigger: { trigger: '.footer-section', start: 'top 82%', once: true },
            opacity: 1, y: 0, stagger: 0.18, duration: 0.95, ease: 'power3.out'
        }
    );
}

/* ══════════════════════════════════════════════════════════════
   MICROINTERACTIONS
══════════════════════════════════════════════════════════════ */
function initMicrointeractions() {

    /* ─ Magnetic + scale on all CTA-like elements ─ */
    addMagnetic('#spotify-btn', 0.28);
    addMagnetic('.photo-upload-label', 0.2);
    addMagnetic('#hero-badge', 0.12);
    addMagnetic('#hero-song',  0.12);

    /* ─ Counter tiles hover ─ */
    document.querySelectorAll('.counter-tile').forEach(tile => {
        tile.addEventListener('mouseenter', () => {
            gsap.to(tile, { y: -10, scale: 1.04, boxShadow: '0 22px 55px rgba(157,212,139,0.3)', duration: 0.3, ease: 'power2.out' });
        });
        tile.addEventListener('mouseleave', () => {
            gsap.to(tile, { y: 0, scale: 1, boxShadow: '0 8px 36px rgba(157,212,139,0.18)', duration: 0.5, ease: 'back.out(1.8)' });
        });
    });

    /* ─ Reason cards hover — GSAP replaces CSS transitions ─ */
    document.querySelectorAll('.reason-card').forEach((card, i) => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -12,
                scale: 1.03,
                boxShadow: '0 28px 64px rgba(232,120,159,0.25)',
                borderColor: 'var(--pink-mid)',
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(card.querySelector('.reason-icon'), {
                scale: 1.25,
                rotation: 8,
                duration: 0.35,
                ease: 'back.out(2)'
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0, scale: 1,
                boxShadow: '0 8px 32px rgba(232,120,159,0.18)',
                borderColor: 'var(--pink-soft)',
                duration: 0.5,
                ease: 'back.out(1.6)'
            });
            gsap.to(card.querySelector('.reason-icon'), {
                scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2)'
            });
        });
        card.addEventListener('mousedown', () => {
            gsap.to(card, { scale: 0.97, duration: 0.1, ease: 'power2.in' });
        });
        card.addEventListener('mouseup', () => {
            gsap.to(card, { scale: 1.03, duration: 0.2, ease: 'back.out(2)' });
        });
    });

    /* ─ Letter card hover ─ */
    const letterCard = document.getElementById('letter-card');
    letterCard.addEventListener('mouseenter', () => {
        gsap.to(letterCard, {
            scale: 1.015,
            boxShadow: '0 32px 90px rgba(232,120,159,0.25)',
            duration: 0.4,
            ease: 'power2.out'
        });
    });
    letterCard.addEventListener('mouseleave', () => {
        gsap.to(letterCard, {
            scale: 1,
            boxShadow: '0 20px 70px rgba(232,120,159,0.18)',
            duration: 0.5,
            ease: 'back.out(1.5)'
        });
    });

    /* ─ Photo frame hover ─ */
    const photoFrame = document.getElementById('photo-frame');
    photoFrame.addEventListener('mouseenter', () => {
        gsap.to(photoFrame, { scale: 1.06, rotation: 3, duration: 0.4, ease: 'back.out(1.5)' });
    });
    photoFrame.addEventListener('mouseleave', () => {
        gsap.to(photoFrame, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.8)' });
    });

    /* ─ Spotify button hover ─ */
    const spotifyBtn = document.getElementById('spotify-btn');
    spotifyBtn.addEventListener('mouseenter', () => {
        gsap.to(spotifyBtn, {
            backgroundColor: 'rgba(255,228,238,0.9)',
            boxShadow: '0 12px 35px rgba(232,120,159,0.3)',
            duration: 0.3, ease: 'power2.out'
        });
    });
    spotifyBtn.addEventListener('mouseleave', () => {
        gsap.to(spotifyBtn, {
            backgroundColor: 'rgba(255,255,255,0.75)',
            boxShadow: '0 4px 20px rgba(232,120,159,0.18)',
            duration: 0.4, ease: 'power2.out'
        });
    });

    /* ─ Hero name characters hover ─ */
    document.querySelectorAll('.hero-name .char').forEach(ch => {
        ch.style.cursor = 'default';
        ch.addEventListener('mouseenter', () => {
            gsap.to(ch, { y: -12, color: '#C45A7E', duration: 0.25, ease: 'back.out(2)' });
        });
        ch.addEventListener('mouseleave', () => {
            gsap.to(ch, { y: 0, color: 'var(--pink-deep)', duration: 0.4, ease: 'back.out(1.8)' });
        });
    });
}

/* ══════════════════════════════════════════════════════════════
   PHOTO UPLOAD
══════════════════════════════════════════════════════════════ */
document.getElementById('photo-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        const img   = document.getElementById('photo-img');
        const frame = document.getElementById('photo-frame');
        img.src = ev.target.result;
        frame.classList.add('has-img');
        /* AnimatePresence — photo appears with scale spring */
        gsap.from(img, {
            scale: 0.7,
            opacity: 0,
            duration: 0.7,
            ease: 'back.out(1.8)'
        });
    };
    reader.readAsDataURL(file);
});

/* ═══════════════════════════════════════════════════════════
   ЗДРАВДОМ · site.js
   - Header scroll behaviour
   - Mobile menu
   - Scroll reveal animations
   - Counter animation
   - Reviews slider (drag + buttons + dots)
   - Hero particle canvas
   - Sound waves animation
   - Form handling
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── HEADER SCROLL ─── */
    const header = document.getElementById('siteHeader');
    const onScroll = () => {
        if (window.scrollY > 40) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ─── MOBILE MENU ─── */
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
        // Close on nav link click
        mobileMenu.querySelectorAll('.nav-link, .btn').forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('open');
                mobileMenu.classList.remove('open');
            });
        });
    }

    /* ─── SCROLL REVEAL ─── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    /* ─── COUNTER ANIMATION ─── */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                const duration = 1800;
                const startTime = performance.now();
                const easeOut = t => 1 - Math.pow(1 - t, 3);
                const tick = (now) => {
                    const progress = Math.min((now - startTime) / duration, 1);
                    el.textContent = Math.floor(easeOut(progress) * target);
                    if (progress < 1) requestAnimationFrame(tick);
                    else el.textContent = target;
                };
                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => counterObserver.observe(c));
    }

    /* ─── REVIEWS SLIDER ─── */
    const track = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('reviewsPrev');
    const nextBtn = document.getElementById('reviewsNext');
    const dotsWrap = document.getElementById('reviewsDots');

    if (track) {
        const cards = track.querySelectorAll('.review-card');
        const total = cards.length;
        let current = 0;

        // Build dots
        if (dotsWrap) {
            cards.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Отзыв ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(dot);
            });
        }

        const updateDots = () => {
            dotsWrap?.querySelectorAll('.reviews-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        };

        const goTo = (idx) => {
            current = (idx + total) % total;
            const card = cards[current];
            track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
            updateDots();
        };

        prevBtn?.addEventListener('click', () => goTo(current - 1));
        nextBtn?.addEventListener('click', () => goTo(current + 1));

        // Drag to scroll
        let isDragging = false, startX = 0, scrollLeft = 0;
        track.addEventListener('mousedown', e => {
            isDragging = true;
            track.classList.add('dragging');
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });
        track.addEventListener('mouseleave', () => { isDragging = false; track.classList.remove('dragging'); });
        track.addEventListener('mouseup', () => { isDragging = false; track.classList.remove('dragging'); });
        track.addEventListener('mousemove', e => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            track.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });

        // Touch
        let touchStart = 0;
        track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStart - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        }, { passive: true });

        // Track scroll to update dots
        track.addEventListener('scroll', () => {
            const idx = Math.round(track.scrollLeft / (cards[0].offsetWidth + 24));
            if (idx !== current) { current = Math.min(idx, total - 1); updateDots(); }
        }, { passive: true });
    }

    /* ─── HERO PARTICLES ─── */
    const particleContainer = document.getElementById('heroParticles');
    if (particleContainer) {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
        particleContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        const particles = [];
        const PARTICLE_COUNT = window.innerWidth > 768 ? 50 : 25;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = -Math.random() * 0.5 - 0.1;
                this.opacity = Math.random() * 0.4 + 0.05;
                this.life = 0;
                this.maxLife = Math.random() * 300 + 200;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life++;
                if (this.life > this.maxLife || this.y < -10) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(176, 120, 64, ${this.opacity * (1 - this.life / this.maxLife)})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = new Particle();
            p.life = Math.random() * p.maxLife; // stagger
            particles.push(p);
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        };
        animate();
    }

    /* ─── SOUND WAVES ANIMATION ─── */
    const soundWavesEl = document.getElementById('soundWaves');
    if (soundWavesEl) {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.cssText = 'position:absolute;inset:0;opacity:0.15;';
        soundWavesEl.appendChild(svg);

        const W = 1200, H = 600;
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

        for (let i = 0; i < 6; i++) {
            const circle = document.createElementNS(svgNS, 'circle');
            circle.setAttribute('cx', W / 2);
            circle.setAttribute('cy', H / 2);
            circle.setAttribute('r', 80 + i * 120);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', `rgba(100,180,140,0.6)`);
            circle.setAttribute('stroke-width', '1');
            circle.style.animation = `soundRing 4s ease-out ${i * 0.7}s infinite`;
            svg.appendChild(circle);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes soundRing {
                0% { r: ${80}; opacity: 0.6; }
                100% { r: 800; opacity: 0; }
            }
        `;
        // Use JS animation instead of CSS for simplicity
        const rings = svg.querySelectorAll('circle');
        let t = 0;
        const animateRings = () => {
            t += 0.008;
            rings.forEach((ring, i) => {
                const phase = (t + i * 0.7) % 4;
                const progress = phase / 4;
                const r = 80 + progress * 700;
                const opacity = (1 - progress) * 0.5;
                ring.setAttribute('r', r);
                ring.setAttribute('opacity', opacity);
            });
            requestAnimationFrame(animateRings);
        };
        animateRings();
    }

    /* ─── SERVICE CARD CLICK ─── */
    document.querySelectorAll('.service-card[data-href]').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = card.dataset.href;
        });
    });

    /* ─── CONTACT FORM ─── */
    const form = document.getElementById('contactForm');
    if (form) {
        const submitBtn = document.getElementById('submitBtn');
        const successEl = document.getElementById('formSuccess');

        form.addEventListener('submit', async (e) => {
            // Native submit for server-side; JS enhancement for AJAX
            if (!submitBtn) return;
            submitBtn.querySelector('.btn-text').style.display = 'none';
            submitBtn.querySelector('.btn-loader').style.display = 'inline';
            submitBtn.disabled = true;
        });

        // If server returned success (page reload with success message)
        if (successEl && successEl.dataset.show === 'true') {
            successEl.style.display = 'flex';
        }
    }

    /* ─── SMOOTH SCROLL for anchor links ─── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const id = this.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                const offset = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });

    /* ─── PHONE MASK ─── */
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.startsWith('8')) val = '7' + val.slice(1);
            if (!val.startsWith('7')) val = '7' + val;
            val = val.slice(0, 11);
            let masked = '+7';
            if (val.length > 1) masked += ' (' + val.slice(1, 4);
            if (val.length >= 4) masked += ') ' + val.slice(4, 7);
            if (val.length >= 7) masked += '-' + val.slice(7, 9);
            if (val.length >= 9) masked += '-' + val.slice(9, 11);
            e.target.value = masked;
        });
    }

});

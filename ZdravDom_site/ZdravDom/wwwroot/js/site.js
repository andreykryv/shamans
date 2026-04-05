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
   - Booking modal
   - Global booking buttons override
   - Contact highlight on click
═══════════════════════════════════════════════════════════ */

/* ─── BOOKING MODAL (global functions) ─── */
function openModal() {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        const input = document.getElementById('modalName');
        if (input) input.focus();
    }, 150);
}

function closeModal() {
    if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
    }
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
        const success = document.getElementById('modalSuccess');
        const body = document.getElementById('modalBody');
        if (success && body) {
            success.classList.remove('show');
            success.style.display = 'none';
            body.style.display = '';
        }
        const name = document.getElementById('modalName');
        const phone = document.getElementById('modalPhone');
        if (name) name.value = '';
        if (phone) phone.value = '';
    }, 400);
}

function closeMobileMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (burgerBtn) burgerBtn.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
}
let closeTimer = null;

function submitModal() {
    const nameEl = document.getElementById('modalName');
    const phoneEl = document.getElementById('modalPhone');
    const submitBtn = document.getElementById('modalSubmit');

    if (!nameEl || !phoneEl) return;

    const name = nameEl.value.trim();
    const rawPhone = phoneEl.value.replace(/\D/g, '');
    const phoneDigits = rawPhone.slice(1); // убираем +7

    if (!name) {
        nameEl.focus();
        nameEl.style.borderColor = '#c0392b';
        setTimeout(() => nameEl.style.borderColor = '', 2000);
        return;
    }
    if (phoneDigits.length !== 10) {
        phoneEl.focus();
        phoneEl.style.borderColor = '#c0392b';
        setTimeout(() => phoneEl.style.borderColor = '', 2000);
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Отправляем…';
    }

    if (closeTimer) clearTimeout(closeTimer);

    setTimeout(() => {
        const body = document.getElementById('modalBody');
        const success = document.getElementById('modalSuccess');
        if (body) body.style.display = 'none';
        if (success) {
            success.style.display = 'flex';
            success.classList.add('show');
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            const textEl = submitBtn.querySelector('.btn-text');
            if (textEl) textEl.textContent = 'Отправить заявку';
        }
        closeTimer = setTimeout(() => closeModal(), 3000);
    }, 800);
}

document.addEventListener('DOMContentLoaded', () => {

    /* ─── MODAL KEYBOARD CLOSE ─── */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

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
        mobileMenu.querySelectorAll('.nav-link').forEach(link => {
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

   /* ─── REVIEWS SLIDER — ровно одна карточка за свайп, бесконечная цикличность ─── */
const track = document.getElementById('reviewsTrack');
const prevBtn = document.getElementById('reviewsPrev');
const nextBtn = document.getElementById('reviewsNext');
const dotsWrap = document.getElementById('reviewsDots');

if (track) {
    const cards = Array.from(track.querySelectorAll('.review-card'));
    const total = cards.length;
    let currentIndex = 0;
    let isTransitioning = false;   // блокировка повторных вызовов во время анимации

    // 1. Создаём точки (dots)
    if (dotsWrap && total > 0) {
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Отзыв ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsWrap.appendChild(dot);
        });
    }

    function updateDots() {
        if (!dotsWrap) return;
        dotsWrap.querySelectorAll('.reviews-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // 2. Основная функция переключения слайда
    function goToSlide(newIndex, smooth = true) {
        if (isTransitioning || total === 0) return;
        newIndex = ((newIndex % total) + total) % total;
        if (newIndex === currentIndex) return;

        isTransitioning = true;
        currentIndex = newIndex;
        const targetCard = cards[currentIndex];
        const targetLeft = targetCard.offsetLeft - track.offsetLeft;

        track.scrollTo({
            left: targetLeft,
            behavior: smooth ? 'smooth' : 'auto'
        });

        updateDots();

        // Разблокируем после окончания анимации
        setTimeout(() => {
            isTransitioning = false;
        }, 500); // таймаут соответствует длительности smooth-прокрутки
    }

    // 3. Обработка кнопок
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // 4. Обработка свайпов / драга (мышь и тач)
    let startX = 0;
    let startScrollLeft = 0;
    let isDragging = false;
    let dragThreshold = 50; // минимальное смещение для срабатывания

    function onPointerStart(e) {
        if (isTransitioning) return;
        // Получаем координату X (поддерживаем мышь и тач)
        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        startX = clientX;
        startScrollLeft = track.scrollLeft;
        isDragging = true;
        track.style.scrollSnapType = 'none'; // отключаем привязку на время драга
        track.style.overflowX = 'auto';
    }

    function onPointerMove(e) {
        if (!isDragging || isTransitioning) return;
        // Активно не перемещаем скролл — только отслеживаем направление в конце
        // Но чтобы визуально карточка не дёргалась, можно ничего не делать.
        // Альтернатива: разрешить минимальный сдвиг, но для жёсткого контроля одной карточки лучше не позволять "полу-свайп".
        e.preventDefault(); // предотвращаем нативный скролл на тач-устройствах
    }

    function onPointerEnd(e) {
        if (!isDragging || isTransitioning) {
            isDragging = false;
            return;
        }
        const clientX = e.type.startsWith('touch') ? e.changedTouches[0].clientX : e.clientX;
        const deltaX = clientX - startX;

        if (Math.abs(deltaX) > dragThreshold) {
            if (deltaX > 0) {
                // свайп вправо -> предыдущий слайд
                goToSlide(currentIndex - 1);
            } else {
                // свайп влево -> следующий слайд
                goToSlide(currentIndex + 1);
            }
        } else {
            // если свайп слишком короткий — просто прилипаем к текущему слайду
            const targetLeft = cards[currentIndex].offsetLeft - track.offsetLeft;
            track.scrollTo({ left: targetLeft, behavior: 'smooth' });
        }

        isDragging = false;
        track.style.scrollSnapType = ''; // восстанавливаем (если нужно)
    }

    // Вешаем обработчики на мышь
    track.addEventListener('mousedown', onPointerStart);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerEnd);

    // Вешаем обработчики на тач-события
    track.addEventListener('touchstart', onPointerStart, { passive: false });
    track.addEventListener('touchmove', onPointerMove, { passive: false });
    track.addEventListener('touchend', onPointerEnd);

    // 5. Отключаем инерционный скролл, чтобы пользователь не мог прокрутить больше одной карточки
    track.style.scrollSnapType = 'x mandatory';
    cards.forEach(card => {
        card.style.scrollSnapAlign = 'start';
    });

    // 6. Блокируем нажатие на кнопки, если идёт анимация
    const allButtons = [prevBtn, nextBtn].filter(Boolean);
    allButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (isTransitioning) e.preventDefault();
        });
    });

    // 7. Инициализация: принудительно встаём на первый слайд
    goToSlide(0, false);
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
            p.life = Math.random() * p.maxLife;
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
            svg.appendChild(circle);
        }

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

    /* ─── ГЛОБАЛЬНАЯ ОБРАБОТКА КНОПОК ЗАПИСИ ─── */
    const bookingSelectors = [
        'a[href="#contact"]', 
        'a[href="/#contact"]',
        '.btn-cta:not([data-no-modal])',
        '.btn-primary:not([data-no-modal])',
        '[onclick*="openModal"]'
    ];
    
    function handleBookingClick(e) {
        if (e.currentTarget.tagName === 'A') {
            e.preventDefault();
        }
        openModal();
    }
    
    document.querySelectorAll(bookingSelectors.join(',')).forEach(el => {
        if (!el.hasAttribute('data-modal-bound')) {
            el.addEventListener('click', handleBookingClick);
            el.setAttribute('data-modal-bound', 'true');
        }
    });
    
    const allElements = document.querySelectorAll('a, button');
    allElements.forEach(el => {
        const text = el.innerText.trim().toLowerCase();
        if (text.includes('записаться') && !el.hasAttribute('data-modal-bound') && !el.closest('.service-card[data-href]')) {
            if (el.closest('.service-card') && el.closest('.service-card').getAttribute('data-href')) return;
            el.addEventListener('click', (e) => {
                if (el.tagName === 'A') e.preventDefault();
                openModal();
            });
            el.setAttribute('data-modal-bound', 'true');
        }
    });

    /* ─── ОБРАБОТКА КНОПКИ "КОНТАКТЫ" — плавный скролл к футеру и подсветка ─── */
    function scrollToContacts() {
    const contactsSection = document.getElementById('contact');
    if (contactsSection) {
        const offset = contactsSection.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
        contactsSection.style.transition = 'background 0.5s';
        contactsSection.style.backgroundColor = 'rgba(176,120,64,0.2)';
        setTimeout(() => contactsSection.style.backgroundColor = '', 1000);
    } else {
        const footer = document.querySelector('.site-footer');
        if (footer) {
            const offset = footer.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
            footer.style.transition = 'background 0.5s';
            footer.style.backgroundColor = 'rgba(176,120,64,0.2)';
            setTimeout(() => footer.style.backgroundColor = '', 1000);
        }
    }
}

    // Находим все ссылки с якорем #contact или текстом "Контакты"
    const contactLinks = document.querySelectorAll('a[href="#contact"], a[href="/#contact"], a.nav-link[href*="contact"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToContacts();
        });
    });

    /* ─── SMOOTH SCROLL for other anchor links (без data-modal-bound) ─── */
    document.querySelectorAll('a[href^="#"]:not([data-modal-bound]):not([href="#contact"])').forEach(anchor => {
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
    function applyPhoneMask(input) {
        input.addEventListener('input', (e) => {
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

    const phoneInput = document.getElementById('phone');
    if (phoneInput) applyPhoneMask(phoneInput);

    const modalPhone = document.getElementById('modalPhone');
    if (modalPhone) applyPhoneMask(modalPhone);

    document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });
});
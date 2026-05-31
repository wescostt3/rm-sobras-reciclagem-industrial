/* =========================================================================
   RM SOBRAS E RECICLAGEM INDUSTRIAL - INTERACTIVE JS
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNav();
    initScrollspy();
    initLeadForm();
    initStatsCounters();
    initSmoothScrolling();
    initCard3DFlip();
});

// Cache global views status
let currentActiveView = 'website';

/* 1. PROTOTYPE VIEW CONTROLLER (WEBSITE VS BRANDING HUB) */
function switchView(view) {
    currentActiveView = view;
    
    // Toggle active view container
    document.querySelectorAll('.prototype-view').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById(`view-${view}`).classList.add('active');

    // Toggle switcher buttons
    document.querySelectorAll('.switcher-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-view-${view}`).classList.add('active');

    // Scroll to top on switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset stats intersection observer triggers if switching back to website
    if (view === 'website') {
        resetStatsCounter();
    }
}

/* 2. BRANDING HUB SUB-TABS CONTROLLER */
function switchBrandTab(tabId) {
    // Toggle active tab content
    document.querySelectorAll('.brand-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    // Toggle active nav button
    const btnContainer = document.querySelector('.branding-tabs-nav');
    btnContainer.querySelectorAll('.brand-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Find the button that matches the onclick function
    const clickedBtn = Array.from(btnContainer.querySelectorAll('.brand-tab-btn')).find(btn => {
        return btn.getAttribute('onclick').includes(tabId);
    });
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
}

/* 3. HEADER SCROLL ANIMATION */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* 4. MOBILE NAVIGATION TOGGLE & BACKDROP */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggleBtn || !navMenu || !backdrop) return;

    function openMenu() {
        navMenu.classList.add('active');
        backdrop.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-xmark';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        backdrop.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
        document.body.style.overflow = ''; // Re-enable background scrolling
    }

    toggleBtn.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close when clicking the backdrop overlay
    backdrop.addEventListener('click', closeMenu);

    // Close on window resize if expanded
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    }, { passive: true });
}

/* 5. SCROLLSPY (ACTIVE LINK ON SCROLL WITH DYNAMIC OFFSET) */
function initScrollspy() {
    const sections = document.querySelectorAll('#view-website section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener('scroll', () => {
        if (currentActiveView !== 'website') return;

        // Calculate dynamic heights of sticky elements
        const switcher = document.getElementById('prototype-switcher');
        const header = document.querySelector('.main-header');
        const switcherHeight = switcher ? switcher.offsetHeight : 0;
        const headerHeight = header ? header.offsetHeight : 0;
        const totalOffset = switcherHeight + headerHeight + 30; // 30px safety buffer

        let currentSection = '';
        
        sections.forEach(section => {
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = section.getBoundingClientRect().top;
            const sectionTop = (elementRect - bodyRect) - totalOffset;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Corner case: if scrolled to the absolute bottom of the page
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10) {
            currentSection = 'contato';
        }

        if (currentSection) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === currentSection) {
                    link.classList.add('active');
                }
            });
        }
    }, { passive: true });
}

/* 6. SMOOTH ANCHOR SCROLLING (ROBUST RECT CALCULATION) */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                
                // Switch view to website if anchor is clicked from branding hub
                if (currentActiveView !== 'website') {
                    switchView('website');
                }
                
                // Dynamic header offset
                const switcher = document.getElementById('prototype-switcher');
                const header = document.querySelector('.main-header');
                const switcherHeight = switcher ? switcher.offsetHeight : 0;
                const headerHeight = header ? header.offsetHeight : 0;
                
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetEl.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - (switcherHeight + headerHeight + 15);
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* 7. PREMIUM TOAST ALERTS & CRM LEAD SIMULATOR */
function showToast(title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid fa-circle-check"></i>
        </div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Fechar notificação">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    const autoCloseTimeout = setTimeout(() => {
        closeToast(toast);
    }, 5000);

    // Close button click
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(autoCloseTimeout);
        closeToast(toast);
    });
}

function closeToast(toast) {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => {
        toast.remove();
    });
}

function initLeadForm() {
    const form = document.getElementById('lead-form');
    const simulator = document.getElementById('lead-simulator');
    const display = document.getElementById('lead-json-display');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract values
            const name = document.getElementById('form-name').value;
            const company = document.getElementById('form-company').value;
            const phone = document.getElementById('form-phone').value;
            const type = document.getElementById('form-type').value;
            const location = document.getElementById('form-location').value;
            const message = document.getElementById('form-message').value;

            // Form data object
            const leadData = {
                timestamp: new Date().toISOString(),
                status: "NOVO_LEAD",
                origem: "Landing Page Principal",
                dados_contato: {
                    nome: name,
                    empresa: company,
                    whatsapp: phone,
                    cidade_estado: location
                },
                requisicao: {
                    categoria_interesse: type,
                    mensagem_cliente: message || "Nenhuma mensagem inserida."
                },
                automacao_crm: {
                    alertar_comercial: true,
                    disparar_mensagem_whatsapp: `Disparado template comercial para ${phone}...`
                }
            };

            // Display simulator block
            simulator.classList.remove('hidden');
            
            // Nice scrolling to simulator card
            setTimeout(() => {
                simulator.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);

            // Simulate typing effect in JSON
            const jsonString = JSON.stringify(leadData, null, 4);
            let idx = 0;
            display.textContent = '';
            
            function typeJSON() {
                if (idx < jsonString.length) {
                    display.textContent += jsonString.charAt(idx);
                    idx++;
                    setTimeout(typeJSON, 3); // Super fast typing
                }
            }
            typeJSON();

            // Premium Toast success message
            showToast(
                `Solicitação Recebida!`,
                `Obrigado, ${name}! Seu orçamento de ${type} está sendo processado.`
            );
            
            // Reset form
            form.reset();
        });
    }
}

/* 8. STATISTICS COUNT UP ANIMATION WITH LOW THRESHOLD & RESET */
let statsAnimated = false;
let statsObserver = null;

function initStatsCounters() {
    const statsSection = document.querySelector('.stats-section');
    const statNums = document.querySelectorAll('.stat-num');

    if (!statsSection || statNums.length === 0) return;

    // Create the observer
    statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Lower threshold (0.15) triggers reliably on mobile viewports
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                statNums.forEach(num => {
                    const target = parseInt(num.getAttribute('data-val'), 10);
                    let count = 0;
                    const duration = 2000; // 2 seconds
                    const stepTime = Math.max(Math.floor(duration / target), 10);
                    
                    const timer = setInterval(() => {
                        if (target >= 1000) {
                            count += Math.ceil(target / 100);
                            if (count >= target) {
                                count = target;
                                clearInterval(timer);
                            }
                            num.textContent = (count / 1000).toFixed(1) + 'k+';
                        } else {
                            count += Math.ceil(target / 100) || 1;
                            if (count >= target) {
                                count = target;
                                clearInterval(timer);
                            }
                            num.textContent = count + '+';
                        }
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.15 });

    statsObserver.observe(statsSection);
}

function resetStatsCounter() {
    statsAnimated = false;
    const statNums = document.querySelectorAll('.stat-num');
    statNums.forEach(num => {
        num.textContent = '0+';
    });
    
    // Re-trigger intersection observer evaluation
    const statsSection = document.querySelector('.stats-section');
    if (statsSection && statsObserver) {
        statsObserver.unobserve(statsSection);
        statsObserver.observe(statsSection);
    }
}

/* 9. CARD 3D FLIP CONTROLLER FOR TOUCH SCREENS */
function initCard3DFlip() {
    const cardContainer = document.querySelector('.card-3d-container');
    if (!cardContainer) return;

    cardContainer.addEventListener('click', () => {
        cardContainer.classList.toggle('flipped-js');
    });
}

// Make globally accessible if needed for navigation inline calls
window.switchView = switchView;
window.switchBrandTab = switchBrandTab;

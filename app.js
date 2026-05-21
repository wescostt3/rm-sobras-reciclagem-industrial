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
});

/* 1. PROTOTYPE VIEW CONTROLLER (WEBSITE VS BRANDING HUB) */
function switchView(view) {
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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* 4. MOBILE NAVIGATION TOGGLE */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = toggleBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (toggleBtn) {
                toggleBtn.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    });
}

/* 5. SCROLLSPY (ACTIVE LINK ON SCROLL) */
function initScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === currentSection) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* 6. SMOOTH ANCHOR SCROLLING */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                
                // Cálculo dinâmico das alturas dos cabeçalhos fixos
                const switcher = document.getElementById('prototype-switcher');
                const header = document.querySelector('.main-header');
                const switcherHeight = switcher ? switcher.offsetHeight : 0;
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calcula o offset exato com 15px de respiro
                const offsetPosition = targetEl.offsetTop - (switcherHeight + headerHeight + 15);
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* 7. FORM SUBMISSION & CRM LEAD SIMULATOR */
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
            simulator.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

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

            // Success alert message
            alert(`Obrigado, ${name}! Sua solicitação de orçamento foi enviada. Simulação de cadastro no banco de dados ativada no painel ao lado.`);
            
            // Reset form
            form.reset();
        });
    }
}

/* 8. STATISTICS COUNT UP ANIMATION */
function initStatsCounters() {
    const statsSection = document.querySelector('.stats-section');
    const statNums = document.querySelectorAll('.stat-num');
    let animated = false;

    if (!statsSection || statNums.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
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
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

// Make globally accessible if needed for navigation inline calls
window.switchView = switchView;
window.switchBrandTab = switchBrandTab;

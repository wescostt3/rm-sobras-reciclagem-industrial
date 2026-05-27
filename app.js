/* =========================================================================
   RM SOBRAS E RECICLAGEM INDUSTRIAL - INTERACTIVE JS
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initBootLoader();
    initCustomCursor();
    initCanvasBackground();
    initHUDTracking();
    initMetalsTicker();
    initCADScanner();
    initSolarSystemDetails();
    initInteractiveCard3D();
    
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

    // Adjust body padding-top based on view (branding hides main-header)
    if (view === 'branding') {
        document.body.classList.add('view-branding-active');
    } else {
        document.body.classList.remove('view-branding-active');
    }

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
    }, { passive: true });
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
            const sectionTop = section.offsetTop - 160;
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
    }, { passive: true });
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

            // Trigger dynamic system logs in HUD
            addSystemLog("SINAL DE LEAD ENTRANDO DETECTADO...");
            setTimeout(() => addSystemLog(`CONECTANDO AO BANCO CRM PARA ${company.toUpperCase()}...`), 800);
            setTimeout(() => addSystemLog("INSERINDO REGISTRO DO CLIENTE... OK"), 1600);
            setTimeout(() => addSystemLog(`ENVIANDO DIRECIONAMENTO WA PARA ${phone}... OK`), 2400);
            setTimeout(() => addSystemLog("SINCRONIZAÇÃO DE PIPELINE CONCLUÍDA."), 3200);

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

/* =========================================================================
   HUD STYLES REDESIGN - BEHAVIORS & DYNAMICS
   ========================================================================= */

// Global coordinates for cursor lerp
let mousePos = { x: 0, y: 0 };
let cursorPos = { x: 0, y: 0 };

/* 9. BOOT LOADER */
function initBootLoader() {
    const loader = document.getElementById('boot-loader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderPercent = document.getElementById('loader-percentage');
    const loaderStatus = document.getElementById('loader-status-msg');
    
    if (!loader || !loaderBar) return;
    
    let progress = 0;
    const statusMsgs = [
        "INICIALIZANDO FLUX_RECYCLING OS...",
        "CONECTANDO AO ÍNDICE DE COMMODITIES LME...",
        "BUSCANDO PREÇOS DE METAIS EM TEMPO REAL...",
        "ESTABILIZANDO SISTEMA DE PARTÍCULAS WEBGL...",
        "DISPOSITIVOS E ATOMIZADORES ONLINE...",
        "RM OS ESTÁ ATIVO E SEGURO."
    ];
    
    const interval = setInterval(() => {
        // Accelerating progress bar simulation
        progress += Math.floor(Math.random() * 8) + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            loaderBar.style.width = '100%';
            loaderPercent.textContent = '100%';
            loaderStatus.textContent = statusMsgs[statusMsgs.length - 1];
            
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 400);
        } else {
            loaderBar.style.width = `${progress}%`;
            loaderPercent.textContent = `${progress}%`;
            
            // Cycle status messages based on percentage
            const msgIndex = Math.min(Math.floor((progress / 100) * statusMsgs.length), statusMsgs.length - 2);
            loaderStatus.textContent = statusMsgs[msgIndex];
        }
    }, 45);
}

/* 10. CUSTOM CURSOR WITH LERP PHYSICS */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const cursorText = document.getElementById('custom-cursor-text');
    
    if (!cursor) return;
    
    // Mouse movement listener
    window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });
    
    // Smooth lerp function
    function renderCursor() {
        // Lerp equation: pos = pos + (target - pos) * ease
        cursorPos.x += (mousePos.x - cursorPos.x) * 0.18;
        cursorPos.y += (mousePos.y - cursorPos.y) * 0.18;
        
        cursor.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
    
    // Interactive hover triggers
    const hoverElements = document.querySelectorAll('a, button, input, select, textarea, .brand-tab-btn, .switcher-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hovered');
            
            // Determine custom label
            let label = "VER";
            if (el.getAttribute('data-cursor')) {
                label = el.getAttribute('data-cursor');
            } else if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href').includes('wa.me')) {
                label = "CHAT";
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                label = "DIGITAR";
            } else if (el.classList.contains('btn-primary') || el.classList.contains('btn-block') || el.type === 'submit') {
                label = "ENVIAR";
            } else if (el.classList.contains('switcher-btn')) {
                label = "HUD";
            } else if (el.classList.contains('brand-tab-btn')) {
                label = "BRAND";
            } else if (el.classList.contains('logo-area')) {
                label = "RM OS";
            }
            cursorText.textContent = label;
        });
        
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hovered');
            cursorText.textContent = "";
        });
    });
}

/* 11. HUD NETWORKING PARTICLE CANVAS */
function initCanvasBackground() {
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce on edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            
            // Mouse gravity attraction (only on pointer devices to save mobile CPU)
            if (!window.matchMedia('(hover: none)').matches) {
                let dx = mousePos.x - this.x;
                let dy = mousePos.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x += dx * 0.005;
                    this.y += dy * 0.005;
                }
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 166, 81, 0.25)'; // RM green low-opacity
            ctx.fill();
        }
    }
    
    // Spawn particles based on screen area (reduced on mobile/tablet for performance)
    const isMobile = window.matchMedia('(hover: none)').matches || window.innerWidth < 768;
    const count = isMobile ? 15 : Math.min(Math.floor((width * height) / 13000), 100);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid coordinate overlay under particles
        drawGridOverlay();
        
        // Draw links and update particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 166, 81, ${0.08 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    function drawGridOverlay() {
        // Draw very faint CAD grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.006)';
        ctx.lineWidth = 0.5;
        let gridSize = 60;
        
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }
    
    animate();
}

/* 12. HUD LOGS & DEBUG TRACKING */
function initHUDTracking() {
    const debugX = document.getElementById('debug-x');
    const debugY = document.getElementById('debug-y');
    const debugScroll = document.getElementById('debug-scroll');
    const debugScrollPct = document.getElementById('debug-scroll-pct');
    const debugTime = document.getElementById('debug-time');
    
    let startTime = Date.now();
    
    // Coordinate tracker
    window.addEventListener('mousemove', (e) => {
        if (debugX && debugY) {
            debugX.textContent = e.clientX;
            debugY.textContent = e.clientY;
        }
    });
    
    // Scroll tracker
    window.addEventListener('scroll', () => {
        if (debugScroll && debugScrollPct) {
            let scrollTop = window.scrollY;
            let docHeight = document.documentElement.scrollHeight - window.innerHeight;
            let scrollPct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
            
            debugScroll.textContent = `${Math.round(scrollTop)}px`;
            debugScrollPct.textContent = `${scrollPct}%`;
        }
    }, { passive: true });
    
    // Timer log tracker
    function updateHUDTimer() {
        if (debugTime) {
            let elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            debugTime.textContent = `${elapsed}s`;
        }
        requestAnimationFrame(updateHUDTimer);
    }
    updateHUDTimer();
}

/* 13. REAL-TIME COMMODITIES PRICE FLUCTUATIONS */
function initMetalsTicker() {
    const tickerTrack = document.querySelector('.ticker-track');
    const tickerItems = document.querySelectorAll('.ticker-item');
    
    if (!tickerTrack || tickerItems.length === 0) return;
    
    // Duplicate items in javascript to guarantee infinite scrolling width
    let itemsHTML = tickerTrack.innerHTML;
    tickerTrack.innerHTML += itemsHTML; // Double the items for infinite sliding
    
    // Live fluctuations interval
    setInterval(() => {
        // Randomly pick one of the active commodities (0 to 3)
        const idx = Math.floor(Math.random() * tickerItems.length);
        const item = tickerItems[idx];
        const basePrice = parseFloat(item.getAttribute('data-base'));
        
        // Random variation between -0.3% and +0.3%
        const pctChange = (Math.random() * 0.6 - 0.3);
        const currentPrice = basePrice * (1 + pctChange / 100);
        
        const priceSpan = item.querySelector('.t-val');
        const changeSpan = item.querySelector('.t-change');
        
        if (priceSpan && changeSpan) {
            // Format price correctly
            if (basePrice < 1000) {
                priceSpan.textContent = `R$ ${currentPrice.toFixed(0)}/t`;
            } else {
                priceSpan.textContent = `R$ ${Math.round(currentPrice).toLocaleString('pt-BR')}/t`;
            }
            
            // Set change text and direction indicator
            const absChange = Math.abs(pctChange).toFixed(2);
            if (pctChange >= 0) {
                changeSpan.className = "t-change up";
                changeSpan.innerHTML = `<i class="fa-solid fa-caret-up"></i> +${absChange}%`;
            } else {
                changeSpan.className = "t-change down";
                changeSpan.innerHTML = `<i class="fa-solid fa-caret-down"></i> -${absChange}%`;
            }
        }
    }, 3500);
}

/* 14. HERO BLUEPRINT CAD SCANNER INTERACTION */
function initCADScanner() {
    const scanner = document.getElementById('hero-scanner-hud');
    const tabs = document.querySelectorAll('.scanner-tab');
    const blueprints = document.querySelectorAll('.blueprint-svg');
    const targetId = document.getElementById('scan-target-id');
    
    // Telemetry DOM elements
    const telVolts = document.getElementById('tel-volts');
    const telLoad = document.getElementById('tel-load');
    const telTemp = document.getElementById('tel-temp');
    const telFreq = document.getElementById('tel-freq');
    
    if (!scanner) return;
    
    // Active assets telemetry baselines
    const telemetryBaselines = {
        transformer: { volts: 13.8, vUnit: "kV", load: 82.4, temp: 41.2, ref: "REF.SIS: TR-004" },
        motor: { volts: 440, vUnit: "V", load: 64.2, temp: 58.4, ref: "REF.SIS: MT-122" },
        chiller: { volts: 380, vUnit: "V", load: 78.9, temp: 12.5, ref: "REF.SIS: CH-095" }
    };
    
    let currentAsset = "transformer";
    
    // Handle tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            blueprints.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.model-layers').forEach(l => l.classList.remove('active'));
            
            tab.classList.add('active');
            currentAsset = tab.getAttribute('data-asset');
            
            // Switch blueprint SVG
            const activeBlueprint = document.getElementById(`blueprint-${currentAsset}`);
            if (activeBlueprint) {
                activeBlueprint.classList.add('active');
                
                // Trigger stroke redraw animation
                const paths = activeBlueprint.querySelectorAll('rect, circle, path, line');
                paths.forEach(p => {
                    p.style.animation = 'none';
                    // Trigger reflow to reset animation
                    p.offsetHeight;
                    p.style.animation = null;
                });
            }
            
            // Switch 3D layered model
            const activeLayers = document.getElementById(`layers-${currentAsset}`);
            if (activeLayers) {
                activeLayers.classList.add('active');
            }
            
            // Update reference ID and base values instantly
            const base = telemetryBaselines[currentAsset];
            targetId.textContent = base.ref;
            telVolts.textContent = `${base.volts} ${base.vUnit}`;
            telLoad.textContent = `${base.load}%`;
            telTemp.textContent = `${base.temp}°C`;
            
            // Log action in terminal HUD
            addSystemLog(`ALTERANDO ALVO DE ESCANEAMENTO: ${currentAsset.toUpperCase()}`);
        });
    });
    
    // Telemetry random fluctuations
    setInterval(() => {
        const base = telemetryBaselines[currentAsset];
        
        // Random drift calculations
        const voltDrift = (Math.random() * 0.2 - 0.1);
        const loadDrift = (Math.random() * 1.2 - 0.6);
        const tempDrift = (Math.random() * 0.4 - 0.2);
        const freqDrift = (Math.random() * 0.04 - 0.02);
        
        // Update stats
        telVolts.textContent = `${(base.volts + voltDrift).toFixed(1)} ${base.vUnit}`;
        telLoad.textContent = `${(base.load + loadDrift).toFixed(1)}%`;
        telTemp.textContent = `${(base.temp + tempDrift).toFixed(1)}°C`;
        telFreq.textContent = `${(60.00 + freqDrift).toFixed(2)} Hz`;
    }, 700);
    
    // Holographic Parallax Mouse Tilt
    scanner.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 991) return; // Disable on tablet/mobile
        
        const rect = scanner.getBoundingClientRect();
        
        // Coordinates relative to card center
        const cardX = e.clientX - rect.left - (rect.width / 2);
        const cardY = e.clientY - rect.top - (rect.height / 2);
        
        // Maximum tilt limits (12 degrees)
        const tiltX = (cardX / (rect.width / 2)) * 12;
        const tiltY = (cardY / (rect.height / 2)) * 12;
        
        scanner.style.transform = `rotateX(${-tiltY}deg) rotateY(${tiltX}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    scanner.addEventListener('mouseleave', () => {
        scanner.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
}

/* 15. SOLAR SYSTEM ORBITS INTERACTIVITY DETAILS */
function initSolarSystemDetails() {
    const items = document.querySelectorAll('.orbit-item');
    const mobilePanel = document.getElementById('orbit-details-mobile');
    const solarSystem = document.querySelector('.sustain-solar-system');
    if (items.length === 0) return;
    
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                e.stopPropagation();
                
                const h4 = item.querySelector('.orbit-hud-card h4');
                const paragraphs = item.querySelectorAll('.orbit-hud-card p');
                
                if (mobilePanel && h4) {
                    let htmlContent = `
                        <div class="mobile-detail-card">
                            <h4><i class="fa-solid fa-recycle text-green animate-pulse"></i> ${h4.innerHTML}</h4>
                            <div class="mobile-detail-grid">
                    `;
                    
                    paragraphs.forEach(p => {
                        const text = p.innerHTML;
                        const parts = text.split(':');
                        if (parts.length === 2) {
                            htmlContent += `
                                <div class="mobile-detail-row">
                                    <span class="lbl">${parts[0].trim()}:</span>
                                    <span class="val">${parts[1].trim()}</span>
                                </div>
                            `;
                        } else {
                            htmlContent += `<p class="mobile-detail-full">${text}</p>`;
                        }
                    });
                    
                    htmlContent += `
                            </div>
                        </div>
                    `;
                    
                    mobilePanel.innerHTML = htmlContent;
                    mobilePanel.classList.add('active');
                }
                
                // Toggle active-touch class
                const isActive = item.classList.contains('active-touch');
                items.forEach(i => i.classList.remove('active-touch'));
                
                if (!isActive) {
                    item.classList.add('active-touch');
                    if (solarSystem) {
                        solarSystem.classList.add('paused');
                    }
                } else {
                    if (solarSystem) {
                        solarSystem.classList.remove('paused');
                    }
                    if (mobilePanel) {
                        mobilePanel.classList.remove('active');
                        mobilePanel.innerHTML = '<div class="orbit-details-placeholder">// Toque em um item da órbita para ver detalhes técnicos</div>';
                    }
                }
            }
        });
        
        // Custom cursor data label triggers for orbits
        item.addEventListener('mouseenter', () => {
            const card = item.querySelector('.orbit-hud-card h4');
            const customCursorText = document.getElementById('custom-cursor-text');
            if (card && customCursorText) {
                document.body.classList.add('cursor-hovered');
                customCursorText.textContent = "INFO";
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const customCursorText = document.getElementById('custom-cursor-text');
            if (customCursorText) {
                document.body.classList.remove('cursor-hovered');
                customCursorText.textContent = "";
            }
        });
    });

    // Tap on empty space resets rotation on mobile
    if (solarSystem) {
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 991 && !e.target.closest('.orbit-item')) {
                solarSystem.classList.remove('paused');
                items.forEach(i => i.classList.remove('active-touch'));
                if (mobilePanel) {
                    mobilePanel.classList.remove('active');
                    mobilePanel.innerHTML = '<div class="orbit-details-placeholder">// Toque em um item da órbita para ver detalhes técnicos</div>';
                }
            }
        });
    }
}

/* 16. SYSTEM LOGS TERMINAL FEEDBACK */
function addSystemLog(message) {
    const terminal = document.querySelector('.hud-debug-body');
    if (!terminal) return;
    
    // Create new log line element
    const line = document.createElement('div');
    line.className = 'hud-debug-line log-alert';
    line.style.color = 'var(--color-green)';
    line.innerHTML = `> <span>${message}</span>`;
    
    // Append to debug body
    terminal.appendChild(line);
    
    // Maximum debug rows limit (keep original 5 stat rows + 4 logs)
    while (terminal.children.length > 9) {
        terminal.removeChild(terminal.children[5]);
    }
}

/* 17. INTERACTIVE 3D BUSINESS CARD (FLUID VECTOR TILT + FLIP) */
function initInteractiveCard3D() {
    const container = document.querySelector('.card-3d-container');
    const card = document.querySelector('.card-3d');
    
    if (!container || !card) return;
    
    let isFlipped = false;
    
    // Mouse movement: smooth 3D tilt tracking (snappy, transition = none during move)
    container.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(hover: none)').matches) return;
        
        card.style.transition = 'none';
        
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Coordinates relative to card center (-1 to 1)
        const normX = (x / rect.width) * 2 - 1;
        const normY = (y / rect.height) * 2 - 1;
        
        // Tilt limits: 12 degrees pitch, 15 degrees yaw
        const tiltX = -normY * 12;
        const tiltY = normX * 15;
        
        // Invert Y tilt if card is flipped to maintain intuitive physical response
        const adjustedTiltY = isFlipped ? -tiltY : tiltY;
        const flipAngle = isFlipped ? 180 : 0;
        
        card.style.transform = `rotateX(${tiltX}deg) rotateY(${flipAngle + adjustedTiltY}deg) scale3d(1.03, 1.03, 1.03)`;
    });
    
    // Mouse leave: reset tilt smoothly
    container.addEventListener('mouseleave', () => {
        if (window.matchMedia('(hover: none)').matches) return;
        
        card.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        
        const flipAngle = isFlipped ? 180 : 0;
        card.style.transform = `rotateX(0deg) rotateY(${flipAngle}deg) scale3d(1, 1, 1)`;
    });
    
    // Custom cursor text hover updates
    container.addEventListener('mouseenter', () => {
        if (window.matchMedia('(hover: none)').matches) return;
        
        const customCursorText = document.getElementById('custom-cursor-text');
        if (customCursorText) {
            document.body.classList.add('cursor-hovered');
            customCursorText.textContent = isFlipped ? "VIRAR" : "GIRAR";
        }
    });
    
    container.addEventListener('mouseleave', () => {
        if (window.matchMedia('(hover: none)').matches) return;
        
        const customCursorText = document.getElementById('custom-cursor-text');
        if (customCursorText) {
            document.body.classList.remove('cursor-hovered');
            customCursorText.textContent = "";
        }
    });
    
    // Click: Toggle flip state
    container.addEventListener('click', () => {
        isFlipped = !isFlipped;
        
        // Restore smooth transition for the flip rotation
        card.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        
        if (isFlipped) {
            card.classList.add('flipped');
            addSystemLog("CARTÃO: VERSO ATIVO [DIRETOR COMERCIAL]");
        } else {
            card.classList.remove('flipped');
            addSystemLog("CARTÃO: FRENTE ATIVA [RM SOBRAS]");
        }
        
        // Update custom cursor text action label
        if (!window.matchMedia('(hover: none)').matches) {
            const customCursorText = document.getElementById('custom-cursor-text');
            if (customCursorText) {
                customCursorText.textContent = isFlipped ? "VIRAR" : "GIRAR";
            }
        }
        
        const flipAngle = isFlipped ? 180 : 0;
        card.style.transform = `rotateX(0deg) rotateY(${flipAngle}deg) scale3d(1.03, 1.03, 1.03)`;
    });
}

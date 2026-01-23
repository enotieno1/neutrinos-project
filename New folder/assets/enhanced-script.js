// Enhanced JavaScript for Neutrinos Capital Website
document.addEventListener('DOMContentLoaded', function() {
    
    // Error handling wrapper
    function safeExecute(fn, errorMessage = 'An error occurred') {
        try {
            return fn();
        } catch (error) {
            console.error(errorMessage, error);
            showNotification('An unexpected error occurred. Please try again.', 'error');
            return null;
        }
    }
    
    // Global modal functions
    window.openModal = function(serviceType) {
        return safeExecute(() => {
            const modal = document.getElementById('serviceModal');
            const modalTitle = document.getElementById('modalServiceTitle');
            const modalBody = document.getElementById('modalServiceBody');
            
            if (!modal || !modalTitle || !modalBody) {
                throw new Error('Modal elements not found');
            }
            
            const serviceContent = {
                portfolio: {
                    title: 'Portfolio Management',
                    content: `
                        <div class="service-detail">
                            <h3>Smart Diversification Strategy</h3>
                            <p>Our portfolio management service provides professional investment management tailored to your financial goals.</p>
                            <ul>
                                <li>Custom portfolio construction</li>
                                <li>Regular rebalancing</li>
                                <li>Risk management</li>
                                <li>Performance reporting</li>
                            </ul>
                            <div class="service-pricing">
                                <h4>Starting from $50,000</h4>
                                <p>Professional management included</p>
                            </div>
                        </div>
                    `
                },
                wealth: {
                    title: 'Financial Planning',
                    content: `
                        <div class="service-detail">
                            <h3>Complete Financial Strategy</h3>
                            <p>Comprehensive financial planning to secure your future and achieve your life goals.</p>
                            <ul>
                                <li>Retirement planning</li>
                                <li>Tax optimization</li>
                                <li>Estate planning</li>
                                <li>Education funding</li>
                            </ul>
                            <div class="service-pricing">
                                <h4>Starting from $25,000</h4>
                                <p>Personalized financial roadmap</p>
                            </div>
                        </div>
                    `
                },
                private: {
                    title: 'Private Equity',
                    content: `
                        <div class="service-detail">
                            <h3>High-Growth Investment Opportunities</h3>
                            <p>Access to exclusive private equity investments before companies go public.</p>
                            <ul>
                                <li>Pre-IPO opportunities</li>
                                <li>Venture capital access</li>
                                <li>Buyout opportunities</li>
                                <li>Secondary market deals</li>
                            </ul>
                            <div class="service-pricing">
                                <h4>Starting from $250,000</h4>
                                <p>Accredited investors only</p>
                            </div>
                        </div>
                    `
                },
                hedge: {
                    title: 'Hedge Funds',
                    content: `
                        <div class="service-detail">
                            <h3>Advanced Investment Strategies</h3>
                            <p>Sophisticated hedge fund strategies designed to maximize returns in any market condition.</p>
                            <ul>
                                <li>Long/short equity</li>
                                <li>Global macro strategies</li>
                                <li>Event-driven opportunities</li>
                                <li>Quantitative strategies</li>
                            </ul>
                            <div class="service-pricing">
                                <h4>Starting from $100,000</h4>
                                <p>Sophisticated investors</p>
                            </div>
                        </div>
                    `
                },
                research: {
                    title: 'Investment Research',
                    content: `
                        <div class="service-detail">
                            <h3>Data-Driven Investment Insights</h3>
                            <p>Access to professional investment research to make smarter investment decisions.</p>
                            <ul>
                                <li>Market analysis reports</li>
                                <li>Company research</li>
                                <li>Sector analysis</li>
                                <li>Investment recommendations</li>
                            </ul>
                            <div class="service-pricing">
                                <h4>Starting from $5,000</h4>
                                <p>Monthly research reports</p>
                            </div>
                        </div>
                    `
                },
                consulting: {
                    title: 'Strategic Consulting',
                    content: `
                        <div class="service-detail">
                            <h3>Expert Investment Advisory</h3>
                            <p>Personalized consulting to optimize your investment strategy and maximize returns.</p>
                            <ul>
                                <li>Portfolio review</li>
                                <li>Strategy development</li>
                                <li>Risk assessment</li>
                                <li>Performance optimization</li>
                            </ul>
                            <div class="service-pricing">
                                <h4>Starting from $15,000</h4>
                                <p>Personalized strategies</p>
                            </div>
                        </div>
                    `
                }
            };
            
            const service = serviceContent[serviceType];
            if (!service) {
                throw new Error('Service not found');
            }
            
            modalTitle.textContent = service.title;
            modalBody.innerHTML = service.content;
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus management
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }, 'Failed to open modal');
    };
    
    window.closeModal = function() {
        return safeExecute(() => {
            const modal = document.getElementById('serviceModal');
            if (modal) {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        }, 'Failed to close modal');
    };
    
    window.closeDropdown = function(dropdownId) {
        return safeExecute(() => {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) {
                dropdown.style.maxHeight = '0';
                dropdown.style.opacity = '0';
            }
        }, 'Failed to close dropdown');
    };
    
    window.handleCardKeypress = function(event, serviceType) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal(serviceType);
        }
    };
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animations for performance cards
                if (entry.target.classList.contains('performance-card')) {
                    animateCounter(entry.target.querySelector('.performance-number'));
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.performance-card, .service-card, .stagger-item');
    animatedElements.forEach(el => {
        el.classList.add('stagger-item');
        observer.observe(el);
    });

    // Counter animation for performance numbers
    function animateCounter(element) {
        if (!element || element.dataset.animated === 'true') return;
        
        element.dataset.animated = 'true';
        const finalText = element.textContent;
        const number = parseFloat(finalText.replace(/[^0-9.]/g, ''));
        const prefix = finalText.match(/[^0-9.]*/)[0];
        const suffix = finalText.match(/[^0-9.]*$/)[0];
        
        let current = 0;
        const increment = number / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            let displayValue = prefix + current.toFixed(1) + suffix;
            if (finalText.includes('$')) {
                displayValue = '$' + current.toFixed(1) + suffix;
            } else if (finalText.includes('%')) {
                displayValue = Math.round(current) + '%';
            } else {
                displayValue = Math.round(current) + suffix;
            }
            
            element.textContent = displayValue;
        }, 30);
    }

    // Enhanced navigation scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced mobile navigation
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate menu items
            const menuItems = navMenu.querySelectorAll('.nav-link');
            menuItems.forEach((item, index) => {
                if (navMenu.classList.contains('active')) {
                    item.style.animation = `fadeInRight 0.3s ease-out ${index * 0.1}s forwards`;
                } else {
                    item.style.animation = '';
                }
            });
        });
    }

    // Tab functionality for services
    window.switchTab = function(tabName) {
        return safeExecute(() => {
            // Remove active class from all tabs and panels
            document.querySelectorAll('.tab-header').forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });
            
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
                panel.setAttribute('hidden', 'true');
            });
            
            // Add active class to selected tab and panel
            const selectedTab = document.getElementById(`${tabName}-tab-btn`);
            const selectedPanel = document.getElementById(`${tabName}-tab`);
            
            if (selectedTab && selectedPanel) {
                selectedTab.classList.add('active');
                selectedTab.setAttribute('aria-selected', 'true');
                selectedPanel.classList.add('active');
                selectedPanel.removeAttribute('hidden');
                
                // Animate service cards in the active panel
                const serviceCards = selectedPanel.querySelectorAll('.service-card');
                serviceCards.forEach((card, index) => {
                    card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`;
                });
            }
        }, 'Failed to switch tab');
    };

    // Enhanced dropdown menus
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        link.addEventListener('mouseenter', () => {
            if (menu) {
                menu.style.maxHeight = '300px';
                menu.style.opacity = '1';
            }
        });
        
        dropdown.addEventListener('mouseleave', () => {
            if (menu) {
                menu.style.maxHeight = '0';
                menu.style.opacity = '0';
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Enhanced form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            let isValid = true;
            
            // Validate required fields
            const requiredFields = this.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    showError(field, 'This field is required');
                    isValid = false;
                } else {
                    clearError(field);
                }
            });
            
            // Email validation
            const emailFields = this.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value && !isValidEmail(field.value)) {
                    showError(field, 'Please enter a valid email address');
                    isValid = false;
                }
            });
            
            if (isValid) {
                showNotification('Form submitted successfully! We will contact you within 24 hours.', 'success');
                this.reset();
            }
        });
    });

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(field, message) {
        clearError(field);
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        field.parentNode.appendChild(errorElement);
    }

    function clearError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Enhanced notification system
    function showNotification(message, type = 'info') {
        return safeExecute(() => {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.setAttribute('role', 'alert');
            notification.setAttribute('aria-live', 'polite');
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close" onclick="this.parentElement.remove()" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }, 5000);
        }, 'Failed to show notification');
    }

    // Modal close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Modal close on background click
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    console.log('Enhanced Neutrinos Capital website loaded successfully!');
});

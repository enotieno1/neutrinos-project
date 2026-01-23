document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle smooth scrolling for anchor links on the same page
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    
                    // Update active state
                    navLinks.forEach(navLink => {
                        navLink.classList.remove('active');
                        navLink.setAttribute('aria-current', 'false');
                    });
                    this.classList.add('active');
                    this.setAttribute('aria-current', 'page');
                    
                    // Focus management for accessibility
                    targetSection.setAttribute('tabindex', '-1');
                    targetSection.focus();
                }
            }
        });
        
        // Add keyboard support for navigation
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.click();
                }
            }
        });
    });

    // Update active nav link on scroll with smooth transitions
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        // Debounce scroll events for better performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            let current = '';
            const sections = document.querySelectorAll('section[id], main[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            // Only update if the current section has changed
            const activeLink = document.querySelector('.nav-link.active');
            const targetLink = document.querySelector(`.nav-link[href="#${current}"]`);
            
            if (targetLink && (!activeLink || activeLink.getAttribute('href') !== `#${current}`)) {
                // Remove active class from all links with transition
                navLinks.forEach(link => {
                    if (link.classList.contains('active')) {
                        link.classList.add('transitioning-out');
                        setTimeout(() => {
                            link.classList.remove('active', 'transitioning-out');
                            link.setAttribute('aria-current', 'false');
                        }, 150);
                    }
                });
                
                // Add active class to current link with transition
                targetLink.classList.add('transitioning-in');
                setTimeout(() => {
                    targetLink.classList.remove('transitioning-in');
                    targetLink.classList.add('active');
                    targetLink.setAttribute('aria-current', 'page');
                }, 50);
            }
        }, 50); // 50ms debounce for smooth updates
    });

    // Enhanced click handling with smooth transitions
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            
            // Handle external links (different pages)
            if (href && !href.startsWith('#')) {
                // Add visual feedback for external navigation
                this.classList.add('navigating-away');
                setTimeout(() => {
                    this.classList.remove('navigating-away');
                }, 300);
                return;
            }
            
            // Only handle smooth scrolling for anchor links on the same page
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    // Smooth scroll to target
                    window.scrollTo({ 
                        top: offsetTop, 
                        behavior: 'smooth' 
                    });
                    
                    // Update active state with transition
                    navLinks.forEach(navLink => {
                        if (navLink.classList.contains('active')) {
                            navLink.classList.add('transitioning-out');
                            setTimeout(() => {
                                navLink.classList.remove('active', 'transitioning-out');
                                navLink.setAttribute('aria-current', 'false');
                            }, 150);
                        }
                    });
                    
                    setTimeout(() => {
                        this.classList.remove('transitioning-in');
                        this.classList.add('active');
                        this.setAttribute('aria-current', 'page');
                    }, 50);
                    
                    // Focus management for accessibility
                    targetSection.setAttribute('tabindex', '-1');
                    targetSection.focus();
                }
            }
        });
        
        // Add keyboard support for navigation
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.click();
                }
            }
        });
    });

    // Dropdown menu functionality
    const servicesNavLink = document.getElementById('services-nav-link');
    const servicesDropdown = document.getElementById('services-dropdown');
    
    if (servicesNavLink && servicesDropdown) {
        // Toggle dropdown on click
        servicesNavLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = servicesDropdown.classList.contains('active');
            closeAllDropdowns();
            if (!isOpen) {
                servicesDropdown.classList.add('active');
                servicesNavLink.setAttribute('aria-expanded', 'true');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-dropdown')) {
                closeAllDropdowns();
            }
        });

        // Keyboard navigation for dropdown
        servicesNavLink.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                const isOpen = servicesDropdown.classList.contains('active');
                closeAllDropdowns();
                if (!isOpen) {
                    servicesDropdown.classList.add('active');
                    servicesNavLink.setAttribute('aria-expanded', 'true');
                    // Focus first dropdown item
                    const firstItem = servicesDropdown.querySelector('.dropdown-item');
                    if (firstItem) firstItem.focus();
                }
            } else if (e.key === 'Escape') {
                closeAllDropdowns();
            }
        });

        // Keyboard navigation within dropdown
        const dropdownItems = servicesDropdown.querySelectorAll('.dropdown-item');
        dropdownItems.forEach((item, index) => {
            item.addEventListener('keydown', function(e) {
                let targetIndex = index;
                
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        targetIndex = index < dropdownItems.length - 1 ? index + 1 : 0;
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        targetIndex = index > 0 ? index - 1 : dropdownItems.length - 1;
                        break;
                    case 'Home':
                        e.preventDefault();
                        targetIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        targetIndex = dropdownItems.length - 1;
                        break;
                    case 'Escape':
                        e.preventDefault();
                        closeAllDropdowns();
                        servicesNavLink.focus();
                        return;
                }
                
                if (targetIndex !== index) {
                    dropdownItems[targetIndex].focus();
                }
            });
        });
    }

    function closeAllDropdowns() {
        const allDropdowns = document.querySelectorAll('.dropdown-menu');
        allDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        document.querySelectorAll('[aria-expanded="true"]').forEach(element => {
            element.setAttribute('aria-expanded', 'false');
        });
    }

    function closeDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            dropdown.classList.remove('active');
            const navLink = dropdown.previousElementSibling;
            if (navLink) {
                navLink.setAttribute('aria-expanded', 'false');
            }
        }
    }

    // Make closeDropdown available globally
    window.closeDropdown = closeDropdown;

    // Screen reader announcement function
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
    }

    // Add sr-only class if not already in CSS
    if (!document.querySelector('style[data-sr-only]')) {
        const style = document.createElement('style');
        style.setAttribute('data-sr-only', '');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0,0,0,0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }
});

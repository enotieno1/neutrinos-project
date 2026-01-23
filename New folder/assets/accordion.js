document.addEventListener('DOMContentLoaded', function() {
    // Accordion functionality
    function initAccordion(accordionElement) {
        const headers = accordionElement.querySelectorAll('.accordion-header');
        
        headers.forEach(header => {
            header.addEventListener('click', function() {
                toggleAccordionItem(this);
            });
            
            // Keyboard accessibility
            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleAccordionItem(this);
                }
            });
        });
    }

    function toggleAccordionItem(clickedHeader) {
        const accordion = clickedHeader.closest('.accordion');
        const clickedContent = clickedHeader.nextElementSibling;
        const clickedItem = clickedHeader.closest('.accordion-item');
        const isCurrentlyActive = clickedHeader.classList.contains('active');
        
        // If the clicked item is already active, close it
        if (isCurrentlyActive) {
            closeAccordionItem(clickedHeader, clickedContent);
            return;
        }
        
        // Close all other items in this accordion
        const allHeaders = accordion.querySelectorAll('.accordion-header');
        allHeaders.forEach(header => {
            if (header !== clickedHeader && header.classList.contains('active')) {
                const content = header.nextElementSibling;
                closeAccordionItem(header, content);
            }
        });
        
        // Open the clicked item
        openAccordionItem(clickedHeader, clickedContent);
    }

    function openAccordionItem(header, content) {
        header.classList.add('active');
        content.classList.add('active');
        
        // Set max-height to the actual content height for smooth animation
        const contentHeight = content.scrollHeight;
        content.style.maxHeight = contentHeight + 'px';
        
        // Announce to screen readers
        const title = header.querySelector('.accordion-title').textContent;
        announceToScreenReader(`Expanded: ${title}`);
        
        // Update ARIA attributes
        header.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
    }

    function closeAccordionItem(header, content) {
        header.classList.remove('active');
        content.classList.remove('active');
        content.style.maxHeight = '0';
        
        // Announce to screen readers
        const title = header.querySelector('.accordion-title').textContent;
        announceToScreenReader(`Collapsed: ${title}`);
        
        // Update ARIA attributes
        header.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
    }

    // Initialize all accordions on the page
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
        initAccordion(accordion);
    });

    // Auto-initialize for dynamically added accordions
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the added node is an accordion or contains accordions
                    if (node.classList && node.classList.contains('accordion')) {
                        initAccordion(node);
                    } else {
                        // Check for accordions within the added node
                        const nestedAccordions = node.querySelectorAll('.accordion');
                        nestedAccordions.forEach(accordion => {
                            initAccordion(accordion);
                        });
                    }
                }
            });
        });
    });

    // Start observing the document body for added accordions
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

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

    // Global function for manual accordion control
    window.accordionAPI = {
        open: function(accordionIndex, itemIndex) {
            const accordion = document.querySelectorAll('.accordion')[accordionIndex];
            if (accordion) {
                const header = accordion.querySelectorAll('.accordion-header')[itemIndex];
                if (header) {
                    toggleAccordionItem(header);
                }
            }
        },
        
        close: function(accordionIndex, itemIndex) {
            const accordion = document.querySelectorAll('.accordion')[accordionIndex];
            if (accordion) {
                const header = accordion.querySelectorAll('.accordion-header')[itemIndex];
                if (header && header.classList.contains('active')) {
                    toggleAccordionItem(header);
                }
            }
        },
        
        closeAll: function(accordionIndex) {
            const accordion = document.querySelectorAll('.accordion')[accordionIndex];
            if (accordion) {
                const headers = accordion.querySelectorAll('.accordion-header.active');
                headers.forEach(header => {
                    const content = header.nextElementSibling;
                    closeAccordionItem(header, content);
                });
            }
        },
        
        openAll: function(accordionIndex) {
            const accordion = document.querySelectorAll('.accordion')[accordionIndex];
            if (accordion) {
                const headers = accordion.querySelectorAll('.accordion-header');
                headers.forEach(header => {
                    const content = header.nextElementSibling;
                    if (!header.classList.contains('active')) {
                        openAccordionItem(header, content);
                    }
                });
            }
        }
    };

    // Handle window resize to adjust max-height for open items
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const openContents = document.querySelectorAll('.accordion-content.active');
            openContents.forEach(content => {
                const currentHeight = content.scrollHeight;
                content.style.maxHeight = currentHeight + 'px';
            });
        }, 250);
    });
});

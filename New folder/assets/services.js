document.addEventListener('DOMContentLoaded', function() {
    // Initialize tab functionality
    initTabSwitching();
    initFilters();
    initModal();
});

// Tab switching functionality - make globally accessible
function switchTab(tabName) {
    // Get all tab headers and panels
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    // Remove active class from all tabs and panels
    tabHeaders.forEach(header => {
        header.classList.remove('active');
        header.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(panel => {
        panel.classList.remove('active');
        panel.setAttribute('hidden', '');
    });
    
    // Add active class to selected tab and panel
    const activeHeader = document.getElementById(`${tabName}-tab-btn`);
    const activePanel = document.getElementById(`${tabName}-tab`);
    
    if (activeHeader && activePanel) {
        activeHeader.classList.add('active');
        activeHeader.setAttribute('aria-selected', 'true');
        activePanel.classList.remove('hidden');
        activePanel.classList.add('active');
        
        // Announce to screen readers
        const tabTitle = activeHeader.textContent.trim();
        announceToScreenReader(`Switched to ${tabTitle} tab`);
    }
}

function initTabSwitching() {
    // Keyboard navigation for tabs
    const tabHeaders = document.querySelectorAll('.tab-header');
    tabHeaders.forEach((header, index) => {
        header.addEventListener('keydown', function(e) {
            let targetIndex = index;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    targetIndex = index > 0 ? index - 1 : tabHeaders.length - 1;
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    targetIndex = index < tabHeaders.length - 1 ? index + 1 : 0;
                    break;
                case 'Home':
                    e.preventDefault();
                    targetIndex = 0;
                    break;
                case 'End':
                    e.preventDefault();
                    targetIndex = tabHeaders.length - 1;
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.click();
                    return;
            }
            
            if (targetIndex !== index) {
                tabHeaders[targetIndex].focus();
            }
        });
    });
}

function initFilters() {
    // Filter and Search functionality
    const filterState = {
        risk: null,
        horizon: null,
        investor: null,
        search: ''
    };

    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('serviceSearch');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    const servicesGrid = document.getElementById('servicesGrid');

    // Initialize filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            const filterValue = this.dataset.value;
            
            if (filterState[filterType] === filterValue) {
                // Toggle off if same filter
                filterState[filterType] = null;
                this.classList.remove('active');
            } else {
                // Remove active from other buttons of same type
                document.querySelectorAll(`[data-filter="${filterType}"]`).forEach(b => {
                    b.classList.remove('active');
                });
                
                // Set new filter
                filterState[filterType] = filterValue;
                this.classList.add('active');
            }
            
            applyFilters();
        });
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterState.search = this.value.toLowerCase();
            applyFilters();
        });
    }

    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Reset all filters
            filterState.risk = null;
            filterState.horizon = null;
            filterState.investor = null;
            filterState.search = '';
            
            // Remove active class from all filter buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Clear search input
            if (searchInput) searchInput.value = '';
            
            applyFilters();
        });
    }

    function applyFilters() {
        const serviceCards = document.querySelectorAll('.service-card');
        let visibleCount = 0;
        
        serviceCards.forEach(card => {
            const risk = card.dataset.risk;
            const horizon = card.dataset.horizon;
            const investor = card.dataset.investor;
            const title = card.dataset.title.toLowerCase();
            const description = card.dataset.description.toLowerCase();
            
            // Check if card matches all filters
            const matchesRisk = !filterState.risk || risk === filterState.risk;
            const matchesHorizon = !filterState.horizon || horizon === filterState.horizon;
            const matchesInvestor = !filterState.investor || investor === filterState.investor;
            const matchesSearch = !filterState.search || title.includes(filterState.search) || description.includes(filterState.search);
            
            const isVisible = matchesRisk && matchesHorizon && matchesInvestor && matchesSearch;
            
            if (isVisible) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Update results count
        if (resultsCount) {
            resultsCount.textContent = `Showing ${visibleCount} service${visibleCount !== 1 ? 's' : ''}`;
        }
        
        // Show/hide no results message
        if (noResults && servicesGrid) {
            if (visibleCount === 0) {
                noResults.style.display = 'block';
                servicesGrid.style.display = 'none';
            } else {
                noResults.style.display = 'none';
                servicesGrid.style.display = 'block';
            }
        }
    }

    // Initialize filters on page load
    applyFilters();
}

function initModal() {
    // Modal functionality
    const modal = document.getElementById('serviceModal');
    const modalTitle = document.getElementById('modalServiceTitle');
    const modalBody = document.getElementById('modalServiceBody');

    window.openModal = function(serviceType) {
        if (!modal || !modalTitle || !modalBody) return;
        
        const serviceData = {
            portfolio: {
                title: 'Portfolio Management',
                description: 'Strategic diversification with expert oversight',
                risk: 'Medium Risk',
                horizon: '3-5 years',
                amount: '$50,000+',
                features: [
                    'Mix of stocks, bonds, and other investments',
                    'Regular adjustments to market changes',
                    'Expert team watching your money 24/7',
                    'Monthly performance reports',
                    'Quarterly rebalancing'
                ]
            },
            wealth: {
                title: 'Financial Planning',
                description: 'Complete financial strategy for long-term success',
                risk: 'Low Risk',
                horizon: '5-10 years',
                amount: '$25,000+',
                features: [
                    'Comprehensive financial assessment',
                    'Retirement planning',
                    'Tax optimization strategies',
                    'Estate planning',
                    'Education funding planning'
                ]
            },
            private: {
                title: 'Private Equity',
                description: 'High-growth potential in private markets',
                risk: 'High Risk',
                horizon: '7-10 years',
                amount: '$250,000+',
                features: [
                    'Access to pre-IPO companies',
                    'Venture capital opportunities',
                    'Buyout strategies',
                    'Growth equity investments',
                    'Illiquid investments with high returns'
                ]
            },
            hedge: {
                title: 'Hedge Funds',
                description: 'Advanced strategies for sophisticated investors',
                risk: 'High Risk',
                horizon: '1-3 years',
                amount: '$100,000+',
                features: [
                    'Long/short equity strategies',
                    'Global macro investments',
                    'Event-driven opportunities',
                    'Quantitative strategies',
                    'Alternative asset classes'
                ]
            },
            research: {
                title: 'Investment Research',
                description: 'Data-driven insights for informed decisions',
                risk: 'Low Risk',
                horizon: 'Ongoing',
                amount: '$5,000+',
                features: [
                    'Market analysis reports',
                    'Company research',
                    'Sector analysis',
                    'Economic outlook',
                    'Investment recommendations'
                ]
            },
            consulting: {
                title: 'Strategic Consulting',
                description: 'Expert guidance for portfolio optimization',
                risk: 'Low Risk',
                horizon: '3-6 months',
                amount: '$15,000+',
                features: [
                    'Portfolio analysis',
                    'Risk assessment',
                    'Performance optimization',
                    'Strategy development',
                    'Implementation support'
                ]
            }
        };
        
        const data = serviceData[serviceType];
        if (!data) return;
        
        modalTitle.textContent = data.title;
        
        modalBody.innerHTML = `
            <div class="service-detail-section">
                <div class="detail-label">Description</div>
                <div class="detail-value">${data.description}</div>
            </div>
            
            <div class="service-detail-section">
                <div class="detail-label">Risk Level</div>
                <div class="detail-value">
                    <span class="risk-indicator risk-${data.risk.toLowerCase().split(' ')[0]}">${data.risk}</span>
                </div>
            </div>
            
            <div class="service-detail-section">
                <div class="detail-label">Investment Horizon</div>
                <div class="detail-value">${data.horizon}</div>
            </div>
            
            <div class="investment-amount">
                <div class="amount-label">Minimum Investment</div>
                <div class="amount-value">${data.amount}</div>
            </div>
            
            <div class="service-detail-section">
                <div class="detail-label">Key Features</div>
                <ul class="feature-list">
                    ${data.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <button class="modal-cta" onclick="closeModal()">Get Started</button>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Close modal on outside click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Keyboard navigation for service cards
    window.handleCardKeypress = function(event, serviceType) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal(serviceType);
        }
    };
}

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

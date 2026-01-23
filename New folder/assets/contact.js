document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!validateForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success message
                showSuccessMessage();
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    function validateForm(data) {
        let isValid = true;
        const errors = [];
        
        // Required fields validation
        if (!data.firstName || data.firstName.trim() === '') {
            errors.push('First name is required');
            isValid = false;
        }
        
        if (!data.lastName || data.lastName.trim() === '') {
            errors.push('Last name is required');
            isValid = false;
        }
        
        if (!data.email || data.email.trim() === '') {
            errors.push('Email address is required');
            isValid = false;
        } else if (!isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
            isValid = false;
        }
        
        if (!data.agreement) {
            errors.push('You must agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }
        
        // Show errors if any
        if (!isValid) {
            showErrors(errors);
        }
        
        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showErrors(errors) {
        // Remove existing error messages
        const existingErrors = document.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Create error container
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.style.cssText = `
            background: #dc2626;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        `;
        
        errorContainer.innerHTML = `
            <strong>Please correct the following errors:</strong>
            <ul style="margin: 0.5rem 0 0 1rem; padding-left: 1.5rem;">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        
        // Insert at the top of the form
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(errorContainer, form);
        
        // Scroll to error message
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove error message after 10 seconds
        setTimeout(() => {
            errorContainer.remove();
        }, 10000);
    }

    function showSuccessMessage() {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create success container
        const successContainer = document.createElement('div');
        successContainer.className = 'success-message';
        successContainer.style.cssText = `
            background: #10b981;
            color: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            text-align: center;
            font-size: 1.1rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        
        successContainer.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">✓</div>
            <strong>Thank you for your inquiry!</strong>
            <p style="margin: 0.5rem 0 0 0;">One of our investment advisors will contact you within 24 hours.</p>
        `;
        
        // Insert at the top of the form container
        const formContainer = document.querySelector('.contact-form-container');
        formContainer.insertBefore(successContainer, formContainer.firstChild);
        
        // Scroll to success message
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove success message after 10 seconds
        setTimeout(() => {
            successContainer.remove();
        }, 10000);
    }

    // FAQ accordion functionality
    function toggleFAQ(element) {
        const answer = element.nextElementSibling;
        const isActive = element.classList.contains('active');
        
        // Close all other FAQs in the same section
        const faqSection = element.closest('.faq-section');
        const allQuestions = faqSection.querySelectorAll('.faq-question');
        const allAnswers = faqSection.querySelectorAll('.faq-answer');
        
        if (!isActive) {
            // Close all others
            allQuestions.forEach(q => q.classList.remove('active'));
            allAnswers.forEach(a => {
                a.style.maxHeight = '0';
                a.classList.remove('active');
            });
            
            // Open current
            element.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.classList.add('active');
        } else {
            // Close current
            element.classList.remove('active');
            answer.style.maxHeight = '0';
            answer.classList.remove('active');
        }
    }

    // Add click handlers to FAQ questions
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
        
        // Add keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(this);
            }
        });
    });

    // Form field focus effects
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    formattedValue = value;
                } else if (value.length <= 6) {
                    formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            
            e.target.value = formattedValue;
        });
    }

    // Newsletter signup
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const button = this.querySelector('.newsletter-btn');
            const originalText = button.textContent;
            
            if (!emailInput.value || !isValidEmail(emailInput.value)) {
                // Show error
                emailInput.style.borderColor = '#dc2626';
                emailInput.placeholder = 'Please enter a valid email';
                return;
            }
            
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Subscribed!';
                button.style.background = '#10b981';
                emailInput.value = '';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // Location cards hover effect
    const locationCards = document.querySelectorAll('.location-card');
    locationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add styles for focused form fields
    if (!document.querySelector('style[data-contact-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-contact-styles', '');
        style.textContent = `
            .form-group.focused label {
                color: var(--orange-primary);
            }
            
            .form-group.focused input,
            .form-group.focused select,
            .form-group.focused textarea {
                border-color: var(--orange-primary);
                box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
            }
            
            .error-message {
                animation: slideDown 0.3s ease-out;
            }
            
            .success-message {
                animation: slideDown 0.3s ease-out;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
});

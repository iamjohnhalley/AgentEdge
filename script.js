// AgentEdge Website JavaScript

// Global variables
let currentStep = 1;
const totalSteps = 4;

document.addEventListener('DOMContentLoaded', function() {
    // Check for success parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        const successBanner = document.getElementById('form-success');
        const formSection = document.getElementById('audit-form');
        
        if (successBanner) {
            successBanner.style.display = 'block';
            // Scroll to success message
            successBanner.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Hide the form section since it's been submitted
        if (formSection) {
            formSection.style.display = 'none';
        }
        
        // Clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
    // Enhanced Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Sticky CTA Bar
    initStickyCTA();
    
    // Multi-step Form
    initMultiStepForm();
    
    // County Availability Checker
    initCountyAvailability();

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });

    // Contact Form Handling
    const auditForm = document.getElementById('auditForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close');
    
    if (auditForm) {
        console.log('🔧 DEBUG: Audit form found and event listener attached');
        auditForm.addEventListener('submit', function(e) {
            console.log('🚀 DEBUG: Form submission triggered');
            console.log('📝 DEBUG: Current step:', currentStep);
            console.log('📊 DEBUG: Total steps:', totalSteps);
            
            // Always prevent default and use JavaScript submission
            e.preventDefault();
            console.log('⛔ DEBUG: Default form submission prevented');
            
            // Validate the final step
            if (!validateCurrentStep()) {
                console.log('❌ DEBUG: Form validation failed');
                console.log('🔍 DEBUG: Checking required fields...');
                
                // Debug which fields are missing
                const requiredFields = auditForm.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        console.log('❌ DEBUG: Missing field:', field.name, field.id);
                    } else {
                        console.log('✅ DEBUG: Field filled:', field.name, field.id, field.value);
                    }
                });
                
                alert('Please fill in all required fields before submitting.');
                return;
            }
            
            console.log('✅ DEBUG: Form validation passed');
            
            const submitButton = auditForm.querySelector('.submit-button');
            const buttonText = submitButton.querySelector('.button-text');
            const buttonLoading = submitButton.querySelector('.button-loading');
            
            console.log('🔄 DEBUG: Starting form submission process');
            
            // Show loading state
            if (buttonText && buttonLoading) {
                console.log('⏳ DEBUG: Showing loading state');
                buttonText.style.display = 'none';
                buttonLoading.style.display = 'inline-flex';
                submitButton.disabled = true;
            } else {
                console.log('⚠️ DEBUG: Submit button elements not found');
            }
            
            // Collect form data
            console.log('📊 DEBUG: Collecting form data');
            const formData = new FormData(auditForm);
            const templateParams = {
                firstName: formData.get('firstName') || '',
                lastName: formData.get('lastName') || '',
                email: formData.get('email') || '',
                phone: formData.get('phone') || '',
                county: formData.get('county') || '',
                agencyName: formData.get('agencyName') || '',
                website: formData.get('website') || '',
                challenges: formData.get('challenges') || '',
                goals: formData.get('goals') || '',
                submissionDate: new Date().toLocaleDateString('en-IE'),
                submissionTime: new Date().toLocaleTimeString('en-IE')
            };
            
            console.log('📋 DEBUG: Template params:', templateParams);

            // Create mailto link with form data
            const subject = encodeURIComponent('🚀 New Audit Request from ' + templateParams.firstName + ' ' + templateParams.lastName);
            const body = encodeURIComponent(`
📋 NEW AUDIT REQUEST RECEIVED

👤 CONTACT INFORMATION:
Name: ${templateParams.firstName} ${templateParams.lastName}
Email: ${templateParams.email}
Phone: ${templateParams.phone}

🏢 BUSINESS DETAILS:
County: ${templateParams.county}
Agency Name: ${templateParams.agencyName}
Current Website: ${templateParams.website || 'None provided'}

🎯 MAIN CHALLENGE:
${getChallengeText(templateParams.challenges)}

📝 GOALS:
${templateParams.goals || 'Not specified'}

⏰ SUBMITTED:
${templateParams.submissionDate} at ${templateParams.submissionTime}

---
Reply to this email to contact the lead directly.
            `.trim());
            
            // Try EmailJS first, fallback to mailto
            console.log('📧 DEBUG: Checking EmailJS availability');
            console.log('📧 DEBUG: EmailJS available:', typeof emailjs !== 'undefined');
            
            if (typeof emailjs !== 'undefined') {
                console.log('✅ DEBUG: EmailJS is available, attempting to send');
                
                const emailJSParams = {
                    from_name: templateParams.firstName + ' ' + templateParams.lastName,
                    from_email: templateParams.email,
                    phone: templateParams.phone || 'Not provided',
                    county: templateParams.county,
                    agency_name: templateParams.agencyName || 'Not provided',
                    website: templateParams.website || 'None',
                    challenge: getChallengeText(templateParams.challenges),
                    goals: templateParams.goals || 'Not specified',
                    submission_date: templateParams.submissionDate,
                    submission_time: templateParams.submissionTime,
                    to_email: 'sarah@agentedge.ie'
                };
                
                console.log('📧 DEBUG: EmailJS params:', emailJSParams);
                console.log('🔧 DEBUG: Using service_j6k4k8m and template_8h9x2vr');
                
                // Use EmailJS for professional email delivery
                emailjs.send('service_j6k4k8m', 'template_8h9x2vr', emailJSParams)
                .then(() => {
                    console.log('✅ DEBUG: EmailJS success');
                    // Show success modal
                    if (successModal) {
                        successModal.classList.add('show');
                    }
                    
                    // Reset form
                    auditForm.reset();
                    currentStep = 1;
                    updateFormStep();
                    
                    // Track successful form submission
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'engagement',
                            'event_label': 'audit_request_emailjs'
                        });
                    }
                    
                    // Reset button state
                    if (buttonText && buttonLoading) {
                        buttonText.style.display = 'inline';
                        buttonLoading.style.display = 'none';
                        submitButton.disabled = false;
                    }
                })
                .catch((error) => {
                    console.error('❌ DEBUG: EmailJS failed:', error);
                    console.log('🔄 DEBUG: Falling back to mailto');
                    
                    // Fallback to mailto
                    const mailtoUrl = `mailto:sarah@agentedge.ie?subject=${subject}&body=${body}`;
                    console.log('📧 DEBUG: Opening mailto URL:', mailtoUrl);
                    window.open(mailtoUrl);
                    
                    // Show success modal anyway
                    console.log('✅ DEBUG: Showing success modal (mailto fallback)');
                    if (successModal) {
                        successModal.classList.add('show');
                    } else {
                        console.log('⚠️ DEBUG: Success modal not found');
                    }
                    
                    // Reset form
                    auditForm.reset();
                    currentStep = 1;
                    updateFormStep();
                    
                    // Track fallback submission
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit_fallback', {
                            'event_category': 'engagement',
                            'event_label': 'audit_request_mailto'
                        });
                    }
                    
                    // Reset button state
                    if (buttonText && buttonLoading) {
                        buttonText.style.display = 'inline';
                        buttonLoading.style.display = 'none';
                        submitButton.disabled = false;
                    }
                });
            } else {
                console.log('⚠️ DEBUG: EmailJS not available, using mailto fallback');
                
                // Fallback to mailto if EmailJS not available
                setTimeout(() => {
                    const mailtoUrl = `mailto:sarah@agentedge.ie?subject=${subject}&body=${body}`;
                    console.log('📧 DEBUG: Opening mailto URL (no EmailJS):', mailtoUrl);
                    window.open(mailtoUrl);
                    
                    // Show success modal
                    console.log('✅ DEBUG: Showing success modal (no EmailJS)');
                    if (successModal) {
                        successModal.classList.add('show');
                        console.log('✅ DEBUG: Success modal shown');
                    } else {
                        console.log('⚠️ DEBUG: Success modal not found');
                    }
                    
                    // Reset form
                    auditForm.reset();
                    currentStep = 1;
                    updateFormStep();
                    
                    // Track successful form submission
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'engagement',
                            'event_label': 'audit_request_mailto'
                        });
                    }
                    
                    // Reset button state
                    if (buttonText && buttonLoading) {
                        buttonText.style.display = 'inline';
                        buttonLoading.style.display = 'none';
                        submitButton.disabled = false;
                    }
                }, 1500);
            }
            
            // Helper function to convert challenge codes to readable text
            function getChallengeText(challenge) {
                const challenges = {
                    'no-website': 'No website or outdated website',
                    'no-leads': 'Not getting enough leads',
                    'social-media': 'Poor social media presence',
                    'google-visibility': 'Not showing up on Google',
                    'competition': 'Losing business to competitors',
                    'time': 'No time for marketing'
                };
                return challenges[challenge] || challenge || 'Not specified';
            }
        });
    } else {
        console.log('❌ DEBUG: Audit form element not found - form submission will not work');
        console.log('🔍 DEBUG: Looking for element with ID "auditForm"');
        const allForms = document.querySelectorAll('form');
        console.log('📋 DEBUG: Found', allForms.length, 'form elements on page');
        allForms.forEach((form, index) => {
            console.log(`📋 DEBUG: Form ${index + 1}:`, form.id, form.className);
        });
    }
    
    // Modal Close Functionality
    if (closeModal && successModal) {
        closeModal.addEventListener('click', function() {
            successModal.classList.remove('show');
        });
    }
    
    // Close modal when clicking outside
    if (successModal) {
        window.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.classList.remove('show');
            }
        });
    }



    // Smooth Scrolling for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for sticky header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Validation Enhancement
    const formInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Check if field is required and empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation (optional)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // URL validation
        if (field.type === 'url' && value) {
            try {
                new URL(value);
            } catch {
                isValid = false;
                errorMessage = 'Please enter a valid website URL';
            }
        }
        
        if (!isValid) {
            field.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            errorElement.style.color = '#ef4444';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            field.parentNode.appendChild(errorElement);
        }
        
        return isValid;
    }

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.benefit-card, .service-card, .package-card, .testimonial-card, .step-item');
    animateElements.forEach(el => observer.observe(el));

    // CTA Button Click Tracking
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'engagement',
                    'event_label': buttonText,
                    'value': 1
                });
            }
        });
    });

    // Page Load Performance Tracking
    window.addEventListener('load', function() {
        if (typeof gtag !== 'undefined') {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            gtag('event', 'page_load_time', {
                'event_category': 'performance',
                'value': Math.round(loadTime)
            });
        }
    });

    // Scroll Depth Tracking
    let maxScroll = 0;
    const scrollMilestones = [25, 50, 75, 100];
    const trackedMilestones = new Set();
    
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            scrollMilestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll_depth', {
                            'event_category': 'engagement',
                            'event_label': `${milestone}%`,
                            'value': milestone
                        });
                    }
                }
            });
        }
    });

    // Dynamic County Selection Enhancement
    const countySelect = document.getElementById('county');
    
    if (countySelect) {
        // Add popular counties to top of list
        const popularCounties = ['leitrim', 'longford', 'mayo', 'kerry', 'sligo'];
        const allOptions = Array.from(countySelect.options).slice(1); // Skip the first "Select" option
        
        // Sort options: popular first, then alphabetical
        const sortedOptions = allOptions.sort((a, b) => {
            const aIsPopular = popularCounties.includes(a.value);
            const bIsPopular = popularCounties.includes(b.value);
            
            if (aIsPopular && !bIsPopular) return -1;
            if (!aIsPopular && bIsPopular) return 1;
            if (aIsPopular && bIsPopular) {
                return popularCounties.indexOf(a.value) - popularCounties.indexOf(b.value);
            }
            return a.text.localeCompare(b.text);
        });
        
        // Clear and rebuild options
        while (countySelect.options.length > 1) {
            countySelect.remove(1);
        }
        
        sortedOptions.forEach(option => {
            countySelect.appendChild(option);
        });
    }
});

// Sticky CTA Bar Functions
function initStickyCTA() {
    const stickyCTA = document.getElementById('stickyCTA');
    if (!stickyCTA) return;
    
    let hasScrolled = false;
    
    window.addEventListener('scroll', function() {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent > 25 && !hasScrolled) {
            stickyCTA.classList.add('show');
            hasScrolled = true;
        } else if (scrollPercent <= 10 && hasScrolled) {
            stickyCTA.classList.remove('show');
            hasScrolled = false;
        }
    });
}

// Multi-step Form Functions
function initMultiStepForm() {
    updateProgressBar();
    
    // Add real-time validation
    const formInputs = document.querySelectorAll('.form-step input, .form-step select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateCurrentStep();
        });
    });
}

function nextStep() {
    if (!validateCurrentStep()) return;
    
    if (currentStep < totalSteps) {
        // Hide current step
        const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
        if (currentStepEl) currentStepEl.classList.remove('active');
        
        // Show next step
        currentStep++;
        const nextStepEl = document.querySelector(`[data-step="${currentStep}"]`);
        if (nextStepEl) nextStepEl.classList.add('active');
        
        updateProgressBar();
        updateProgressText();
        
        // Show submit button on last step
        if (currentStep === totalSteps) {
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) submitBtn.style.display = 'block';
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        // Hide current step
        const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
        if (currentStepEl) currentStepEl.classList.remove('active');
        
        // Show previous step
        currentStep--;
        const prevStepEl = document.querySelector(`[data-step="${currentStep}"]`);
        if (prevStepEl) prevStepEl.classList.add('active');
        
        updateProgressBar();
        updateProgressText();
        
        // Hide submit button
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.style.display = 'none';
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const percentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = percentage + '%';
    }
}

function updateProgressText() {
    const progressText = document.getElementById('progressText');
    if (!progressText) return;
    
    const stepTexts = {
        1: 'Step 1 of 4: Basic Information',
        2: 'Step 2 of 4: Business Details',
        3: 'Step 3 of 4: Your Challenge',
        4: 'Step 4 of 4: Your Goals'
    };
    
    progressText.textContent = stepTexts[currentStep] || '';
}

function validateCurrentStep() {
    const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
    if (!currentStepEl) return true;
    
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        // Handle different field types
        if (field.type === 'checkbox') {
            if (!field.checked) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        } else if (field.type === 'radio') {
            const radioGroup = currentStepEl.querySelectorAll(`input[name="${field.name}"]`);
            const isRadioChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isRadioChecked) {
                isValid = false;
                radioGroup.forEach(radio => radio.classList.add('error'));
            } else {
                radioGroup.forEach(radio => radio.classList.remove('error'));
            }
        } else {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        }
    });
    
    return isValid;
}

// County Availability Functions
function initCountyAvailability() {
    const countySelect = document.getElementById('county');
    const availabilityEl = document.getElementById('countyAvailability');
    
    if (!countySelect || !availabilityEl) return;
    
    // Mock availability data (replace with real API call)
    const countyAvailability = {
        'leitrim': 'available',
        'longford': 'available',
        'mayo': 'taken',
        'kerry': 'available',
        'sligo': 'available',
        'dublin': 'unavailable',
        'cork': 'unavailable'
    };
    
    countySelect.addEventListener('change', function() {
        const selectedCounty = this.value;
        if (!selectedCounty) {
            availabilityEl.textContent = '';
            availabilityEl.className = 'county-availability';
            return;
        }
        
        const status = countyAvailability[selectedCounty] || 'available';
        availabilityEl.className = `county-availability ${status}`;
        
        switch (status) {
            case 'available':
                availabilityEl.textContent = '✓ Available - Reserve your spot now!';
                break;
            case 'taken':
                availabilityEl.textContent = '⚠ Currently taken - Join waiting list';
                break;
            case 'unavailable':
                availabilityEl.textContent = '✗ Not available for our service';
                break;
        }
    });
}

// Video Demo Function
function playDemoVideo() {
    // Mock video player (replace with actual video implementation)
    alert('Demo video would play here. This could open a modal with embedded video or redirect to a video platform.');
    
    // Track video play event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'video_play', {
            'event_category': 'engagement',
            'event_label': 'demo_video'
        });
    }
}

// Enhanced Form Submission with Steps
function handleFormSubmission(formData) {
    // Collect all form data across steps
    const allData = {
        step1: {
            firstName: document.getElementById('firstName')?.value,
            lastName: document.getElementById('lastName')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value
        },
        step2: {
            county: document.getElementById('county')?.value,
            agencyName: document.getElementById('agencyName')?.value,
            website: document.getElementById('website')?.value
        },
        step3: {
            challenges: document.querySelector('input[name="challenges"]:checked')?.value
        },
        step4: {
            goals: document.getElementById('goals')?.value,
            consent: document.getElementById('consent')?.checked
        }
    };
    
    // Track detailed form data
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit_detailed', {
            'event_category': 'lead_generation',
            'county': allData.step2.county,
            'challenge': allData.step3.challenges,
            'has_website': !!allData.step2.website
        });
    }
    
    return allData;
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy Loading for Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Mobile-specific optimizations
function initMobileOptimizations() {
    // Touch feedback for buttons
    const buttons = document.querySelectorAll('.cta-button, .btn-next, .btn-prev, .submit-button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('touchcancel', function() {
            this.style.transform = '';
        });
    });
    
    // Improve form input focus on mobile
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Scroll input into view on mobile
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    this.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
            }
        });
    });
    
    // Optimize scroll performance
    let ticking = false;
    function updateScrollElements() {
        // Update sticky CTA and other scroll-dependent elements
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const stickyCTA = document.getElementById('stickyCTA');
        
        if (stickyCTA) {
            if (scrollPercent > 25) {
                stickyCTA.classList.add('show');
            } else if (scrollPercent <= 10) {
                stickyCTA.classList.remove('show');
            }
        }
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }
    
    // Use passive listeners for better performance
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        // Recalculate layouts after orientation change
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });
    
    // Add viewport height fix for mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
}

// Initialize mobile optimizations
initMobileOptimizations();

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

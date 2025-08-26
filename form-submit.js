// Simple form submission using Formspree
// This provides a reliable way to send form data to sarah@agentedge.ie

function submitToFormspree(formData) {
    // Formspree endpoint - replace with actual endpoint after setup
    const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';
    
    return fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });
}

// Alternative: Use Netlify Forms (if deployed on Netlify)
function submitToNetlify(formData) {
    const form = new FormData();
    
    // Add form-name for Netlify
    form.append('form-name', 'audit-request');
    
    // Add all form data
    Object.keys(formData).forEach(key => {
        form.append(key, formData[key]);
    });
    
    return fetch('/contact.html', {
        method: 'POST',
        body: form
    });
}

// Email service using EmailJS (requires setup)
function submitToEmailJS(templateParams) {
    // Initialize EmailJS (replace with your keys)
    emailjs.init('YOUR_USER_ID');
    
    return emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { submitToFormspree, submitToNetlify, submitToEmailJS };
}

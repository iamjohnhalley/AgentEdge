// Pricing Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const agentButtons = document.querySelectorAll('.agent-btn');
    const countySelect = document.getElementById('county');
    const additionalAgentsLine = document.querySelector('.additional-agents');
    const agentCountSpan = document.querySelector('.agent-count');
    const additionalCostSpan = document.querySelector('.additional-cost');
    const totalAmountSpan = document.querySelector('.total-amount');
    const dailyCostSpan = document.querySelector('.daily-cost');
    const perAgentDailySpan = document.querySelector('.per-agent-daily');
    const countyExclusiveP = document.querySelector('.county-exclusive');
    const countyNameSpan = document.querySelector('.county-name');

    let selectedAgentCount = 1;
    const basePrice = 396;
    const additionalAgentPrice = 97;

    // Handle agent count selection
    agentButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            agentButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected count
            selectedAgentCount = parseInt(this.dataset.count);
            
            // Update pricing with animation
            updatePricingWithAnimation();
        });
    });

    // Handle county selection
    countySelect.addEventListener('change', function() {
        const selectedCounty = this.value;
        if (selectedCounty) {
            const countyName = this.options[this.selectedIndex].text;
            countyNameSpan.textContent = countyName;
            countyExclusiveP.style.display = 'block';
        } else {
            countyExclusiveP.style.display = 'none';
        }
    });

    function updatePricing() {
        const additionalAgents = selectedAgentCount - 1;
        const additionalCost = additionalAgents * additionalAgentPrice;
        const totalMonthly = basePrice + additionalCost;
        const dailyCost = Math.round(totalMonthly / 30);
        const perAgentDaily = Math.round(totalMonthly / selectedAgentCount / 30);

        // Update additional agents line
        if (additionalAgents > 0) {
            additionalAgentsLine.style.display = 'flex';
            agentCountSpan.textContent = additionalAgents;
            additionalCostSpan.textContent = additionalCost;
        } else {
            additionalAgentsLine.style.display = 'none';
        }

        // Update totals
        totalAmountSpan.textContent = totalMonthly;
        dailyCostSpan.textContent = dailyCost;
        perAgentDailySpan.textContent = perAgentDaily;
    }

    function updatePricingWithAnimation() {
        // Add animation class
        const totalPriceLine = document.querySelector('.total-price');
        if (totalPriceLine) {
            totalPriceLine.classList.add('price-update-animation');
        }
        
        // Update pricing
        updatePricing();
        
        // Remove animation class after animation completes
        setTimeout(() => {
            if (totalPriceLine) {
                totalPriceLine.classList.remove('price-update-animation');
            }
        }, 300);
    }

    // Set default selection
    if (agentButtons.length > 0) {
        agentButtons[0].classList.add('active');
        updatePricing();
    }

    // Add smooth transitions for better UX
    const calculatorResult = document.querySelector('.calculator-result');
    
    function addLoadingEffect() {
        if (calculatorResult) {
            calculatorResult.style.opacity = '0.9';
            setTimeout(() => {
                calculatorResult.style.opacity = '1';
            }, 150);
        }
    }

    // Apply to all interactive elements
    agentButtons.forEach(btn => {
        btn.addEventListener('click', addLoadingEffect);
    });

    if (countySelect) {
        countySelect.addEventListener('change', addLoadingEffect);
    }

    // Track interactions for analytics
    const ctaButton = document.querySelector('.calculator-cta .cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            // Track calculator usage
            const totalPrice = basePrice + ((selectedAgentCount - 1) * additionalAgentPrice);
            console.log('Calculator CTA clicked:', {
                agentCount: selectedAgentCount,
                county: countySelect ? countySelect.value : '',
                totalPrice: totalPrice,
                dailyCost: Math.round(totalPrice / 30),
                perAgentDaily: Math.round(totalPrice / selectedAgentCount / 30)
            });
        });
    }
});

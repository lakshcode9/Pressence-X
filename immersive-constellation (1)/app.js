// Enhanced Immersive Press Placement Experience
class ImmersivePressApp {
    constructor() {
        this.currentScreen = 'landing';
        this.currentTier = 'silver';
        this.tooltip = null;
        this.animationIds = [];
        this.isTransitioning = false;
        
        // Application data
        this.publications = {
            "silver": [
                {"name": "Medium", "client": "Hana Cha - Real Estate Professional", "date": "Feb 2024", "reach": "2M+ readers"},
                {"name": "Time Bulletin", "client": "Samuel Leeds - Property Investor", "date": "Mar 2024", "reach": "500K+ readers"},
                {"name": "US Times Now", "client": "Alex Kowtun - Entrepreneur", "date": "Jan 2024", "reach": "1M+ readers"},
                {"name": "Globe Stats", "client": "Andy Daro - Real Estate Developer", "date": "Apr 2024", "reach": "750K+ readers"},
                {"name": "Insta Bulletin", "client": "Dhirendra Singh - Hospitality Trainer", "date": "May 2024", "reach": "300K+ readers"}
            ],
            "gold": [
                {"name": "Digital Journal", "client": "Frantisek - Crypto Investor", "date": "Jun 2024", "reach": "2.5M+ readers"},
                {"name": "Time Business News", "client": "Gerry Gadoury - Executive Coach", "date": "Mar 2024", "reach": "1.8M+ readers"},
                {"name": "Fox Interviewer", "client": "Hamzah Kassab - Entrepreneur", "date": "Apr 2024", "reach": "3M+ readers"},
                {"name": "Voyage NY", "client": "Karan Bindra - Founder & CEO", "date": "May 2024", "reach": "1.2M+ readers"},
                {"name": "London Reporter", "client": "Luis Faiardo - Founder", "date": "Feb 2024", "reach": "900K+ readers"},
                {"name": "Tech Bullion", "client": "Seth Vandaele - Co-Founder", "date": "Jul 2024", "reach": "2.1M+ readers"}
            ],
            "platinum": [
                {"name": "Forbes", "client": "Top-tier CEO", "date": "Jun 2024", "reach": "8M+ readers"},
                {"name": "Entrepreneur", "client": "Tech Visionary", "date": "May 2024", "reach": "6M+ readers"},
                {"name": "NY Weekly", "client": "Tomas Chlup - Health Entrepreneur", "date": "Apr 2024", "reach": "4M+ readers"},
                {"name": "CEO Weekly", "client": "Sunil Tulisani - Real Estate Investor", "date": "Jun 2024", "reach": "3.5M+ readers"},
                {"name": "Wall Street Times", "client": "Trenton Wisecup - CEO Arrow Roofing", "date": "Mar 2024", "reach": "5M+ readers"}
            ]
        };

        this.inspirationalQuotes = [
            "When people know you, you don't chase leads. You attract them.",
            "Authority is earned through visibility.",
            "Your story deserves to be heard by millions.",
            "From unknown to unstoppable.",
            "Transform your presence into influence."
        ];

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        console.log('Setting up immersive press application...');
        this.bindEvents();
        this.initializeParticles();
        this.startFloatingQuotes();
        this.tooltip = document.getElementById('tooltip');
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Landing screen buttons - with proper event prevention
        const showCurrentBtn = document.getElementById('showCurrent');
        const showFutureBtn = document.getElementById('showFuture');
        
        if (showCurrentBtn) {
            showCurrentBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Show current button clicked');
                this.showCurrentState();
            });
            
            showCurrentBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.showCurrentState();
            });
        }

        if (showFutureBtn) {
            showFutureBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Show future button clicked');
                this.showConstellation();
            });
            
            showFutureBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.showConstellation();
            });
        }

        // Transition button
        const transitionBtn = document.getElementById('transitionToFuture');
        if (transitionBtn) {
            transitionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Transition button clicked');
                this.showConstellation();
            });
        }

        // Comparison toggle
        const comparisonToggle = document.querySelector('.toggle-btn');
        if (comparisonToggle) {
            comparisonToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Comparison toggle clicked');
                this.toggleComparison();
            });
        }

        // Galaxy navigation tabs
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tier = e.currentTarget.dataset.tier;
                console.log(`Galaxy tab clicked: ${tier}`);
                this.switchGalaxy(tier);
            });
        });

        // CTA button
        const ctaBtn = document.querySelector('.cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('CTA button clicked');
                this.createSparkleEffect(ctaBtn);
            });
        }

        // Initialize star events
        this.bindStarEvents();
    }

    showCurrentState() {
        if (this.isTransitioning) {
            console.log('Already transitioning, ignoring request');
            return;
        }
        
        console.log('Showing current state...');
        this.isTransitioning = true;

        const landing = document.getElementById('landing');
        const currentState = document.getElementById('currentState');
        const constellation = document.getElementById('constellation');

        // Hide other screens
        if (landing) {
            landing.classList.remove('active');
            setTimeout(() => {
                landing.style.display = 'none';
            }, 400);
        }
        
        if (constellation) {
            constellation.classList.remove('active');
            constellation.style.display = 'none';
        }

        // Show current state
        if (currentState) {
            currentState.style.display = 'block';
            setTimeout(() => {
                currentState.classList.add('active');
                this.currentScreen = 'current';
                this.startCricketAnimation();
                this.isTransitioning = false;
                console.log('Current state displayed');
            }, 100);
        }
    }

    showConstellation() {
        if (this.isTransitioning) {
            console.log('Already transitioning, ignoring request');
            return;
        }
        
        console.log('Showing constellation...');
        this.isTransitioning = true;

        const landing = document.getElementById('landing');
        const currentState = document.getElementById('currentState');
        const constellation = document.getElementById('constellation');

        // Hide other screens
        if (landing) {
            landing.classList.remove('active');
            setTimeout(() => {
                landing.style.display = 'none';
            }, 400);
        }
        
        if (currentState) {
            currentState.classList.remove('active');
            setTimeout(() => {
                currentState.style.display = 'none';
            }, 400);
        }

        // Show constellation
        if (constellation) {
            constellation.style.display = 'block';
            setTimeout(() => {
                constellation.classList.add('active');
                this.currentScreen = 'constellation';
                this.bindStarEvents();
                this.animateGalaxyEntrance();
                this.startMetricsCounter();
                this.startShootingStars();
                this.isTransitioning = false;
                console.log('Constellation displayed');
            }, 100);
        }
    }

    toggleComparison() {
        console.log('Toggling comparison view...');
        const toggleBtn = document.querySelector('.toggle-btn');
        const currentState = toggleBtn?.dataset.state || 'current';

        if (currentState === 'current') {
            this.showConstellation();
            if (toggleBtn) {
                toggleBtn.dataset.state = 'constellation';
                toggleBtn.innerHTML = `
                    <span class="toggle-icon">😔</span>
                    <span class="toggle-text">See Current Reality</span>
                `;
            }
        } else {
            this.showCurrentState();
            if (toggleBtn) {
                toggleBtn.dataset.state = 'current';
                toggleBtn.innerHTML = `
                    <span class="toggle-icon">✨</span>
                    <span class="toggle-text">See Future Potential</span>
                `;
            }
        }
    }

    startCricketAnimation() {
        console.log('Starting cricket animation...');
        const crickets = document.querySelectorAll('.cricket');
        crickets.forEach((cricket, index) => {
            setTimeout(() => {
                cricket.style.animationPlayState = 'running';
            }, index * 500);
        });
    }

    switchGalaxy(tier) {
        if (this.currentTier === tier || this.isTransitioning) {
            console.log(`Already on ${tier} galaxy or transitioning`);
            return;
        }

        console.log(`Switching to ${tier} galaxy...`);

        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-tier="${tier}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update active galaxy
        document.querySelectorAll('.galaxy').forEach(galaxy => {
            galaxy.classList.remove('active');
        });
        const activeGalaxy = document.querySelector(`.galaxy[data-tier="${tier}"]`);
        if (activeGalaxy) {
            activeGalaxy.classList.add('active');
        }

        this.currentTier = tier;
        this.hideTooltip();

        // Re-bind star events and animate
        setTimeout(() => {
            this.bindStarEvents();
            this.animateGalaxyTransition();
        }, 100);
    }

    bindStarEvents() {
        const stars = document.querySelectorAll('.star');
        console.log(`Binding events to ${stars.length} stars`);
        
        stars.forEach(star => {
            // Clone the star to remove all existing event listeners
            const newStar = star.cloneNode(true);
            star.parentNode.replaceChild(newStar, star);
            
            // Add new event listeners to the cloned star
            newStar.addEventListener('mouseenter', (e) => {
                console.log('Star mouse enter');
                this.showTooltip(e);
            });
            
            newStar.addEventListener('mouseleave', () => {
                console.log('Star mouse leave');
                this.hideTooltip();
            });
            
            newStar.addEventListener('mousemove', (e) => {
                this.updateTooltipPosition(e);
            });
            
            newStar.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Star clicked');
                this.createStarEffect(e);
            });
        });

        // Hide tooltip when leaving constellation area
        const wrapper = document.querySelector('.constellation-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        }
    }

    showTooltip(event) {
        if (!this.tooltip) {
            console.log('Tooltip element not found');
            return;
        }

        const star = event.target;
        const publicationName = star.dataset.publication;
        console.log(`Showing tooltip for: ${publicationName}`);
        
        const publicationData = this.getPublicationData(publicationName);
        
        if (!publicationData) {
            console.log('No publication data found');
            return;
        }

        const tooltipTitle = this.tooltip.querySelector('.tooltip-title');
        const tooltipClient = this.tooltip.querySelector('.tooltip-client');
        const tooltipDate = this.tooltip.querySelector('.tooltip-date');
        const tooltipReach = this.tooltip.querySelector('.tooltip-reach');
        const tooltipLogo = this.tooltip.querySelector('.tooltip-logo');

        if (tooltipTitle) tooltipTitle.textContent = publicationData.name;
        if (tooltipClient) tooltipClient.textContent = `Client: ${publicationData.client}`;
        if (tooltipDate) tooltipDate.textContent = `Published: ${publicationData.date}`;
        if (tooltipReach) tooltipReach.textContent = `Reach: ${publicationData.reach}`;

        // Create text-based logo
        if (tooltipLogo) {
            tooltipLogo.textContent = publicationData.name.charAt(0).toUpperCase();
        }

        this.tooltip.classList.add('visible');
        this.updateTooltipPosition(event);
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.remove('visible');
        }
    }

    updateTooltipPosition(event) {
        if (!this.tooltip) return;

        const wrapper = document.querySelector('.constellation-wrapper');
        if (!wrapper) return;
        
        const rect = wrapper.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        let left = x + 15;
        let top = y + 15;

        const tooltipRect = this.tooltip.getBoundingClientRect();

        if (left + tooltipRect.width > rect.width) {
            left = x - tooltipRect.width - 15;
        }
        if (top + tooltipRect.height > rect.height) {
            top = y - tooltipRect.height - 15;
        }

        this.tooltip.style.left = `${Math.max(0, left)}px`;
        this.tooltip.style.top = `${Math.max(0, top)}px`;
    }

    getPublicationData(publicationName) {
        for (const tier of ['silver', 'gold', 'platinum']) {
            const publication = this.publications[tier].find(pub => pub.name === publicationName);
            if (publication) return publication;
        }
        return null;
    }

    animateGalaxyTransition() {
        const activeGalaxy = document.querySelector('.galaxy.active');
        if (!activeGalaxy) return;
        
        const stars = activeGalaxy.querySelectorAll('.star');
        
        stars.forEach((star, index) => {
            star.style.animation = 'none';
            setTimeout(() => {
                star.style.animation = `starAppear 0.6s ease-out ${index * 0.1}s forwards`;
            }, 50);
        });
    }

    animateGalaxyEntrance() {
        const activeGalaxy = document.querySelector('.galaxy.active');
        if (!activeGalaxy) return;
        
        const stars = activeGalaxy.querySelectorAll('.star');
        const lines = activeGalaxy.querySelectorAll('.constellation-lines line');
        
        // Animate stars
        stars.forEach((star, index) => {
            star.style.opacity = '0';
            star.style.transform = 'scale(0)';
            setTimeout(() => {
                star.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                star.style.opacity = '1';
                star.style.transform = 'scale(1)';
            }, index * 150);
        });

        // Animate constellation lines
        lines.forEach((line, index) => {
            line.style.strokeDasharray = '1000';
            line.style.strokeDashoffset = '1000';
            setTimeout(() => {
                line.style.transition = 'stroke-dashoffset 1s ease-out';
                line.style.strokeDashoffset = '0';
            }, stars.length * 150 + index * 100);
        });
    }

    startMetricsCounter() {
        const numberMetrics = document.querySelectorAll('.metric-number-enhanced[data-target]');
        
        numberMetrics.forEach(metric => {
            const target = parseInt(metric.dataset.target);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    metric.textContent = target + '+';
                } else {
                    metric.textContent = Math.floor(current);
                }
            }, 50);
        });
    }

    initializeParticles() {
        const particleSystem = document.querySelector('.particle-system');
        if (!particleSystem) return;

        // Create floating particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: radial-gradient(circle, ${this.getRandomGoldColor()}, transparent);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particle-float ${5 + Math.random() * 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                opacity: ${0.3 + Math.random() * 0.7};
                pointer-events: none;
            `;
            particleSystem.appendChild(particle);
        }

        // Add particle float animation
        if (!document.getElementById('particle-float-style')) {
            const style = document.createElement('style');
            style.id = 'particle-float-style';
            style.textContent = `
                @keyframes particle-float {
                    0% { transform: translateY(100vh) rotate(0deg); }
                    100% { transform: translateY(-100px) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    getRandomGoldColor() {
        const colors = ['#FFD700', '#FFA500', '#FFE55C', '#FFDA44', '#FFC107'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    startFloatingQuotes() {
        const quotes = document.querySelectorAll('.quote');
        
        quotes.forEach((quote, index) => {
            const quoteText = this.inspirationalQuotes[index % this.inspirationalQuotes.length];
            quote.textContent = `"${quoteText}"`;
            
            // Set random position
            quote.style.left = `${5 + Math.random() * 80}%`;
            quote.style.top = `${10 + Math.random() * 70}%`;
        });
    }

    createStarEffect(event) {
        const star = event.target;
        const rect = star.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create particle burst
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const size = 3 + Math.random() * 4;

            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: ${size}px;
                height: ${size}px;
                background: ${this.getCurrentTierColor()};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: particle-burst 1s ease-out forwards;
                --dx: ${Math.cos(angle) * velocity}px;
                --dy: ${Math.sin(angle) * velocity}px;
            `;

            document.body.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 1000);
        }

        // Add particle burst animation
        if (!document.getElementById('particle-burst-style')) {
            const style = document.createElement('style');
            style.id = 'particle-burst-style';
            style.textContent = `
                @keyframes particle-burst {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--dx), var(--dy)) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    getCurrentTierColor() {
        switch (this.currentTier) {
            case 'silver': return '#E8E8E8';
            case 'gold': return '#FFD700';
            case 'platinum': return '#4A9EFF';
            default: return '#FFD700';
        }
    }

    createSparkleEffect(button) {
        const rect = button.getBoundingClientRect();
        
        for (let i = 0; i < 12; i++) {
            const sparkle = document.createElement('div');
            const size = 4 + Math.random() * 8;
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            const duration = 0.5 + Math.random() * 0.5;

            sparkle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, #FFD700, #FFA500);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: sparkle-burst ${duration}s ease-out forwards;
            `;

            document.body.appendChild(sparkle);

            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, duration * 1000);
        }

        // Add sparkle animation
        if (!document.getElementById('sparkle-burst-style')) {
            const style = document.createElement('style');
            style.id = 'sparkle-burst-style';
            style.textContent = `
                @keyframes sparkle-burst {
                    0% {
                        transform: scale(0) rotate(0deg);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.2) rotate(180deg);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(0) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Add shooting star effects
    createShootingStar() {
        const shootingStar = document.createElement('div');
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight * 0.5;
        const endX = startX + (200 + Math.random() * 300);
        const endY = startY + (100 + Math.random() * 200);

        shootingStar.style.cssText = `
            position: fixed;
            left: ${startX}px;
            top: ${startY}px;
            width: 2px;
            height: 2px;
            background: linear-gradient(45deg, #fff, #FFD700);
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
            box-shadow: 0 0 6px #FFD700, 0 0 12px #FFD700, 0 0 18px #FFD700;
        `;

        document.body.appendChild(shootingStar);

        shootingStar.animate([
            { transform: `translate(0, 0) scale(0)`, opacity: 0 },
            { transform: `translate(${(endX - startX) * 0.3}px, ${(endY - startY) * 0.3}px) scale(1)`, opacity: 1 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).addEventListener('finish', () => {
            if (shootingStar.parentNode) {
                shootingStar.remove();
            }
        });
    }

    startShootingStars() {
        if (this.currentScreen === 'constellation') {
            const shootingStarInterval = setInterval(() => {
                if (this.currentScreen === 'constellation' && Math.random() < 0.3) {
                    this.createShootingStar();
                } else if (this.currentScreen !== 'constellation') {
                    clearInterval(shootingStarInterval);
                }
            }, 3000);
        }
    }

    destroy() {
        // Clean up animations and intervals
        this.animationIds.forEach(id => cancelAnimationFrame(id));
        this.animationIds = [];
    }
}

// Initialize the application
let app;
console.log('Initializing Immersive Press App...');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, creating app instance');
        app = new ImmersivePressApp();
    });
} else {
    console.log('DOM already loaded, creating app instance');
    app = new ImmersivePressApp();
}

// Add CSS animations for enhanced effects
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes starAppear {
        0% {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.3) rotate(0deg);
        }
        100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }
    
    @keyframes constellation-glow {
        0%, 100% { 
            background-position: 0% 50%; 
            filter: brightness(1) saturate(1);
        }
        33% { 
            background-position: 50% 25%; 
            filter: brightness(1.2) saturate(1.3);
        }
        66% { 
            background-position: 100% 75%; 
            filter: brightness(0.9) saturate(1.1);
        }
    }
    
    @keyframes energy-pulse {
        0%, 100% { 
            stroke-opacity: 0.3; 
            stroke-dashoffset: 0; 
            filter: brightness(1);
        }
        50% { 
            stroke-opacity: 1; 
            stroke-dashoffset: 12; 
            filter: brightness(1.5) drop-shadow(0 0 5px currentColor);
        }
    }
    
    /* Enhanced hover effects for stars */
    .star {
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .star:hover {
        filter: drop-shadow(0 0 20px currentColor) 
                drop-shadow(0 0 40px currentColor) 
                drop-shadow(0 0 60px currentColor);
    }
    
    /* Floating animation for quotes */
    .quote {
        animation: quote-float 15s ease-in-out infinite;
    }
    
    @keyframes quote-float {
        0%, 20%, 80%, 100% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        25%, 75% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        50% {
            opacity: 0.8;
            transform: translateY(-10px) scale(1.02);
        }
    }
`;

document.head.appendChild(additionalStyles);
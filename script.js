// Smooth scrolling functionality
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scroll for navigation links
    const navLinksElements = document.querySelectorAll('.nav-link');
    navLinksElements.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('.chapter');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Form submission
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
    }

    // Initialize animations
    initializeAnimations();
});

// Form submission handler
function handleFormSubmission() {
    const formData = new FormData(document.getElementById('leadForm'));
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    const submitButton = document.querySelector('#leadForm button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        submitButton.textContent = 'Message Sent!';
        submitButton.style.background = '#4CAF50';
        
        // Reset form
        document.getElementById('leadForm').reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.style.background = '';
        }, 3000);
        
        // Show success message
        showNotification('Thank you! We\'ll be in touch within 24 hours.', 'success');
    }, 2000);
}

// Service modal functionality
function openServiceModal(tier) {
    const modal = document.getElementById('serviceModal');
    const modalContent = document.getElementById('modalContent');
    
    const serviceData = {
        silver: {
            title: 'Silver Package',
            outlets: ['Yahoo Finance', 'MarketWatch', 'Business Insider'],
            features: [
                'Press release distribution to 500+ outlets',
                'Media list curation and targeting',
                'Basic media monitoring and reporting',
                '30-day campaign duration',
                'Email support',
                'Monthly performance report'
            ],
            price: '$2,500/month',
            timeline: '30 days',
            testimonials: [
                {
                    text: "Got our first press mention within 2 weeks. Great value for money.",
                    author: "Layla Al Rashid",
                    company: "Dubai Properties"
                }
            ]
        },
        gold: {
            title: 'Gold Package',
            outlets: ['Khaleej Times', 'Entrepreneur', 'Gulf Business'],
            features: [
                'Everything in Silver',
                'Direct journalist outreach',
                'Interview coordination and preparation',
                '60-day campaign duration',
                'Priority support',
                'Bi-weekly performance reports',
                'Social media amplification'
            ],
            price: '$5,000/month',
            timeline: '60 days',
            testimonials: [
                {
                    text: "The Entrepreneur feature brought us 3 new luxury clients immediately.",
                    author: "Ahmed Hassan",
                    company: "Elite Real Estate"
                }
            ]
        },
        platinum: {
            title: 'Platinum Package',
            outlets: ['Bloomberg', 'Forbes Middle East', 'Financial Times'],
            features: [
                'Everything in Gold',
                'Exclusive story angles and positioning',
                'Media training and interview coaching',
                '90-day campaign duration',
                'Dedicated account manager',
                'Weekly strategy calls',
                'Crisis management support',
                'Exclusive media events access'
            ],
            price: '$10,000/month',
            timeline: '90 days',
            testimonials: [
                {
                    text: "Bloomberg feature changed everything. Our credibility is now unquestionable.",
                    author: "Maria Rodriguez",
                    company: "Luxury Estates Dubai"
                }
            ]
        },
        black: {
            title: 'Black Package',
            outlets: ['Invite-Only Ultra-Premium'],
            features: [
                'Everything in Platinum',
                'Custom media strategy development',
                'Exclusive events and networking access',
                'Dedicated PR manager',
                'Unlimited campaign duration',
                '24/7 priority support',
                'Personal media introductions',
                'Custom content creation',
                'Brand positioning strategy'
            ],
            price: 'Contact for pricing',
            timeline: 'Custom',
            testimonials: [
                {
                    text: "The Black package is worth every penny. We're now the go-to experts in luxury real estate.",
                    author: "Omar Khalil",
                    company: "Prestige Properties"
                }
            ]
        }
    };
    
    const service = serviceData[tier];
    
    modalContent.innerHTML = `
        <div class="service-modal">
            <h2>${service.title}</h2>
            <div class="service-details">
                <div class="outlets">
                    <h3>Press Outlets</h3>
                    <ul>
                        ${service.outlets.map(outlet => `<li>${outlet}</li>`).join('')}
                    </ul>
                </div>
                <div class="features">
                    <h3>What's Included</h3>
                    <ul>
                        ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="pricing">
                    <h3>Investment</h3>
                    <div class="price-display">${service.price}</div>
                    <p>Timeline: ${service.timeline}</p>
                </div>
                <div class="testimonial">
                    <h3>Client Success</h3>
                    <blockquote>"${service.testimonials[0].text}"</blockquote>
                    <cite>— ${service.testimonials[0].author}, ${service.testimonials[0].company}</cite>
                </div>
            </div>
            <div class="modal-cta">
                <button class="btn-primary" onclick="contactForPackage('${tier}')">Get Started</button>
                <button class="btn-secondary" onclick="closeModal()">Learn More</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Tool modal functionality
function openArticleSimulator() {
    const modal = document.getElementById('toolModal');
    const modalContent = document.getElementById('toolModalContent');
    
    modalContent.innerHTML = `
        <div class="tool-modal">
            <h2>Article Simulator</h2>
            <p>See how your story would look in top publications</p>
            
            <div class="simulator-form">
                <div class="form-group">
                    <label>Your Name</label>
                    <input type="text" id="simName" placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" id="simCompany" placeholder="Enter your company">
                </div>
                <div class="form-group">
                    <label>Story Angle</label>
                    <select id="simAngle">
                        <option value="">Select your story angle</option>
                        <option value="market-expert">Market Expert</option>
                        <option value="luxury-specialist">Luxury Specialist</option>
                        <option value="innovation-leader">Innovation Leader</option>
                        <option value="success-story">Success Story</option>
                    </select>
                </div>
                <button class="btn-primary" onclick="generateArticle()">Generate Article</button>
            </div>
            
            <div id="articlePreview" class="article-preview" style="display: none;">
                <div class="publication-header">
                    <h3>FORBES</h3>
                    <p>Business • Real Estate</p>
                </div>
                <div class="article-content">
                    <h1 id="articleHeadline">How [Name] is Redefining Luxury Real Estate in Dubai</h1>
                    <p id="articleBody">[Article content will be generated here]</p>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function openFameCalculator() {
    const modal = document.getElementById('toolModal');
    const modalContent = document.getElementById('toolModalContent');
    
    modalContent.innerHTML = `
        <div class="tool-modal">
            <h2>Fame Score Calculator</h2>
            <p>Calculate your current media presence score</p>
            
            <div class="calculator-form">
                <div class="form-group">
                    <label>Current Press Mentions</label>
                    <input type="number" id="pressMentions" placeholder="0" min="0">
                </div>
                <div class="form-group">
                    <label>Social Media Followers</label>
                    <input type="number" id="socialFollowers" placeholder="0" min="0">
                </div>
                <div class="form-group">
                    <label>Years in Business</label>
                    <input type="number" id="yearsBusiness" placeholder="0" min="0">
                </div>
                <div class="form-group">
                    <label>Luxury Properties Sold</label>
                    <input type="number" id="propertiesSold" placeholder="0" min="0">
                </div>
                <button class="btn-primary" onclick="calculateFameScore()">Calculate Score</button>
            </div>
            
            <div id="fameResult" class="fame-result" style="display: none;">
                <div class="score-display">
                    <h3>Your Fame Score</h3>
                    <div class="score-number" id="fameScoreNumber">0</div>
                    <div class="score-description" id="fameScoreDesc">Beginner</div>
                </div>
                <div class="score-breakdown">
                    <h4>Score Breakdown</h4>
                    <div id="scoreBreakdown"></div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function openHeadlineGenerator() {
    const modal = document.getElementById('toolModal');
    const modalContent = document.getElementById('toolModalContent');
    
    modalContent.innerHTML = `
        <div class="tool-modal">
            <h2>Headline Generator</h2>
            <p>Generate compelling headlines for your story</p>
            
            <div class="headline-form">
                <div class="form-group">
                    <label>Your Name</label>
                    <input type="text" id="headlineName" placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label>Key Achievement</label>
                    <input type="text" id="headlineAchievement" placeholder="e.g., Sold $50M in luxury properties">
                </div>
                <div class="form-group">
                    <label>Publication Type</label>
                    <select id="headlinePublication">
                        <option value="forbes">Forbes</option>
                        <option value="bloomberg">Bloomberg</option>
                        <option value="entrepreneur">Entrepreneur</option>
                        <option value="khaleej">Khaleej Times</option>
                    </select>
                </div>
                <button class="btn-primary" onclick="generateHeadlines()">Generate Headlines</button>
            </div>
            
            <div id="headlineResults" class="headline-results" style="display: none;">
                <h3>Generated Headlines</h3>
                <div id="headlinesList"></div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Tool functions
function generateArticle() {
    const name = document.getElementById('simName').value;
    const company = document.getElementById('simCompany').value;
    const angle = document.getElementById('simAngle').value;
    
    if (!name || !company || !angle) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const headlines = {
        'market-expert': `How ${name} is Shaping Dubai's Luxury Real Estate Market`,
        'luxury-specialist': `${name}: The Visionary Behind Dubai's Most Exclusive Properties`,
        'innovation-leader': `${name} is Revolutionizing Luxury Real Estate in the Middle East`,
        'success-story': `From Zero to Hero: ${name}'s Journey to Real Estate Success`
    };
    
    const articles = {
        'market-expert': `In the competitive world of Dubai's luxury real estate, ${name} has emerged as a leading authority on high-end property markets. As the founder of ${company}, ${name} has successfully navigated the complex landscape of ultra-luxury properties, establishing themselves as a trusted advisor to discerning clients worldwide.`,
        'luxury-specialist': `${name} has redefined what it means to be a luxury real estate specialist in Dubai. Through ${company}, they have curated some of the most exclusive property portfolios in the region, serving an elite clientele that demands nothing but the best.`,
        'innovation-leader': `The real estate industry is undergoing a transformation, and ${name} is at the forefront of this change. At ${company}, they have introduced innovative approaches to luxury property sales that are setting new standards in the market.`,
        'success-story': `The story of ${name} is one of determination, vision, and unparalleled success in Dubai's luxury real estate sector. From humble beginnings to leading ${company}, their journey inspires aspiring real estate professionals across the region.`
    };
    
    document.getElementById('articleHeadline').textContent = headlines[angle];
    document.getElementById('articleBody').textContent = articles[angle];
    document.getElementById('articlePreview').style.display = 'block';
}

function calculateFameScore() {
    const pressMentions = parseInt(document.getElementById('pressMentions').value) || 0;
    const socialFollowers = parseInt(document.getElementById('socialFollowers').value) || 0;
    const yearsBusiness = parseInt(document.getElementById('yearsBusiness').value) || 0;
    const propertiesSold = parseInt(document.getElementById('propertiesSold').value) || 0;
    
    let score = 0;
    let breakdown = [];
    
    // Press mentions (max 30 points)
    const pressScore = Math.min(pressMentions * 3, 30);
    score += pressScore;
    breakdown.push(`Press Mentions: ${pressScore}/30 points`);
    
    // Social followers (max 25 points)
    const socialScore = Math.min(Math.floor(socialFollowers / 1000), 25);
    score += socialScore;
    breakdown.push(`Social Media: ${socialScore}/25 points`);
    
    // Years in business (max 20 points)
    const yearsScore = Math.min(yearsBusiness * 2, 20);
    score += yearsScore;
    breakdown.push(`Experience: ${yearsScore}/20 points`);
    
    // Properties sold (max 25 points)
    const propertiesScore = Math.min(propertiesSold, 25);
    score += propertiesScore;
    breakdown.push(`Properties Sold: ${propertiesScore}/25 points`);
    
    let description = '';
    if (score < 30) description = 'Beginner - Time to build your presence';
    else if (score < 60) description = 'Emerging - Good foundation, ready to grow';
    else if (score < 80) description = 'Established - Strong presence, potential for more';
    else description = 'Influencer - Excellent media presence';
    
    document.getElementById('fameScoreNumber').textContent = score;
    document.getElementById('fameScoreDesc').textContent = description;
    document.getElementById('scoreBreakdown').innerHTML = breakdown.map(item => `<div>${item}</div>`).join('');
    document.getElementById('fameResult').style.display = 'block';
}

function generateHeadlines() {
    const name = document.getElementById('headlineName').value;
    const achievement = document.getElementById('headlineAchievement').value;
    const publication = document.getElementById('headlinePublication').value;
    
    if (!name || !achievement) {
        showNotification('Please fill in your name and achievement', 'error');
        return;
    }
    
    const headlines = {
        'forbes': [
            `How ${name} is Redefining Luxury Real Estate in Dubai`,
            `${name}: The Visionary Behind Dubai's Most Exclusive Properties`,
            `Meet ${name}, the Real Estate Expert Billionaires Trust`,
            `${name}'s Strategy for Dominating Dubai's Luxury Market`
        ],
        'bloomberg': [
            `Dubai's Luxury Real Estate Boom: ${name} Leads the Charge`,
            `${name} on Why Dubai Remains the Ultimate Investment Destination`,
            `The ${name} Effect: Transforming Dubai's Property Landscape`,
            `${name}: The Numbers Behind Dubai's Luxury Real Estate Success`
        ],
        'entrepreneur': [
            `Building an Empire: ${name}'s Journey to Real Estate Success`,
            `${name} Shares the Secrets of Luxury Real Estate Success`,
            `How ${name} Built a Multi-Million Dollar Real Estate Business`,
            `${name}: The Entrepreneur Redefining Luxury Property Sales`
        ],
        'khaleej': [
            `Dubai's Top Real Estate Professional: ${name} Shares Market Insights`,
            `${name}: The Expert Behind Dubai's Most Prestigious Sales`,
            `Luxury Real Estate in Dubai: ${name} Reveals What's Next`,
            `${name} on Dubai's Real Estate Market: Trends and Opportunities`
        ]
    };
    
    const headlinesList = document.getElementById('headlinesList');
    headlinesList.innerHTML = headlines[publication].map(headline => 
        `<div class="headline-item">${headline}</div>`
    ).join('');
    
    document.getElementById('headlineResults').style.display = 'block';
}

// Modal close functionality
function closeModal() {
    document.getElementById('serviceModal').style.display = 'none';
    document.getElementById('toolModal').style.display = 'none';
}

function contactForPackage(tier) {
    closeModal();
    scrollToSection('contact');
    document.getElementById('package').value = tier;
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const serviceModal = document.getElementById('serviceModal');
    const toolModal = document.getElementById('toolModal');
    
    if (event.target === serviceModal) {
        serviceModal.style.display = 'none';
    }
    if (event.target === toolModal) {
        toolModal.style.display = 'none';
    }
});

// Close modals with close button
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('close')) {
        closeModal();
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 4px;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Animation initialization
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .tool-card, .testimonial-card, .press-screenshot');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Smooth reveal animations for stats
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
        }, 30);
    });
}

// Trigger stats animation when about section is visible
const aboutSection = document.querySelector('.about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    aboutObserver.observe(aboutSection);
} 
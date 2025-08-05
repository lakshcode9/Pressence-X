// Smooth scrolling functionality
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Three.js 3D Model Integration
let scene, camera, renderer, model, mixer, clock;
let isModelLoaded = false;
let modelContainer = null;

function init3DModel() {
    // Try hero container first, then showcase container
    modelContainer = document.getElementById('hero-credit-card-model') || document.getElementById('credit-card-model');
    if (!modelContainer) {
        console.log('No 3D model container found');
        return;
    }

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        createFallbackModel();
        return;
    }

    // Scene setup - completely transparent
    scene = new THREE.Scene();
    scene.background = null; // Completely transparent

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // Renderer setup - completely transparent
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: false
    });
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Completely transparent
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    modelContainer.appendChild(renderer.domElement);

    // Professional lighting setup like OnlyCard
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Fill light from opposite side
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 5, 5);
    scene.add(fillLight);

    // Rim light for edge definition
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(0, -5, 5);
    scene.add(rimLight);

    // Clock for animations
    clock = new THREE.Clock();

    // Check if GLTFLoader is available
    if (typeof THREE.GLTFLoader === 'undefined') {
        console.log('GLTFLoader not available, creating fallback model');
        createFallbackModel();
        return;
    }

    // Load the 3D model
    const loader = new THREE.GLTFLoader();
    console.log('Loading 3D model...');
    
    // Add timeout for model loading
    const loadTimeout = setTimeout(() => {
        console.log('Model loading timeout, creating fallback');
        createFallbackModel();
    }, 5000); // 5 second timeout
    
    loader.load(
        'inal.glb',
        function (gltf) {
            clearTimeout(loadTimeout);
            console.log('3D model loaded successfully');
            model = gltf.scene;
            model.scale.set(2.5, 2.5, 2.5);
            model.position.set(0, 0, 0);
            
            // Enable shadows
            model.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(model);
            isModelLoaded = true;

            // Remove loading indicator
            const loadingIndicator = modelContainer.querySelector('.model-loading');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }

            // Setup animations if they exist
            if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(model);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
            }

            // Start render loop
            animate();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            clearTimeout(loadTimeout);
            console.error('An error occurred loading the model:', error);
            createFallbackModel();
        }
    );

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createFallbackModel() {
    console.log('Creating premium fallback credit card model');
    
    // Create a premium credit card with rounded edges
    const cardGeometry = new THREE.BoxGeometry(4, 2.5, 0.1);
    const cardMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a1a1a,
        transparent: true,
        opacity: 0.98,
        shininess: 150,
        specular: 0x222222
    });
    
    // Main card
    model = new THREE.Mesh(cardGeometry, cardMaterial);
    
    // Premium metallic chip
    const chipGeometry = new THREE.BoxGeometry(0.7, 0.6, 0.05);
    const chipMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffd700,
        shininess: 300,
        specular: 0x666666,
        emissive: 0x222222
    });
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chip.position.set(-1.3, 0.4, 0.05);
    model.add(chip);
    
    // Premium logo/emblem
    const logoGeometry = new THREE.PlaneGeometry(1, 0.5);
    const logoMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
        shininess: 100
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0.8, 0.5, 0.05);
    model.add(logo);
    
    // Card number groups (4 groups of 4 digits)
    for (let group = 0; group < 4; group++) {
        for (let digit = 0; digit < 4; digit++) {
            const digitGeometry = new THREE.PlaneGeometry(0.15, 0.08);
            const digitMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xcccccc,
                transparent: true,
                opacity: 0.8
            });
            const digitMesh = new THREE.Mesh(digitGeometry, digitMaterial);
            digitMesh.position.set(-1.2 + (group * 0.4) + (digit * 0.1), -0.1, 0.05);
            model.add(digitMesh);
        }
    }
    
    // Expiry date
    const expiryGeometry = new THREE.PlaneGeometry(0.8, 0.25);
    const expiryMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x999999,
        transparent: true,
        opacity: 0.7
    });
    const expiry = new THREE.Mesh(expiryGeometry, expiryMaterial);
    expiry.position.set(-0.8, -0.4, 0.05);
    model.add(expiry);
    
    // Cardholder name
    const nameGeometry = new THREE.PlaneGeometry(1.5, 0.2);
    const nameMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x999999,
        transparent: true,
        opacity: 0.7
    });
    const name = new THREE.Mesh(nameGeometry, nameMaterial);
    name.position.set(0.2, -0.4, 0.05);
    model.add(name);
    
    // CVV code
    const cvvGeometry = new THREE.PlaneGeometry(0.3, 0.15);
    const cvvMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x666666,
        transparent: true,
        opacity: 0.6
    });
    const cvv = new THREE.Mesh(cvvGeometry, cvvMaterial);
    cvv.position.set(1.2, -0.4, 0.05);
    model.add(cvv);
    
    scene.add(model);
    isModelLoaded = true;
    
    // Remove loading indicator
    const loadingIndicator = modelContainer.querySelector('.model-loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (isModelLoaded && model) {
        // Very slow, smooth rotation
        model.rotation.y += 0.003;
        
        // Very gentle floating animation
        model.position.y = Math.sin(Date.now() * 0.0002) * 0.01;
    }

    if (mixer) {
        mixer.update(clock.getDelta());
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function onWindowResize() {
    if (!modelContainer) return;
    
    camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
}

// Model travel animation through sections - OnlyCard style
function setupModelTravel() {
    // Hero section - model starts in center-right
    gsap.set('#hero-credit-card-model', {
        top: '50%',
        right: '10%',
        scale: 1,
        rotationY: 0
    });

    // About section - model moves to top-right with slight rotation
    gsap.to('#hero-credit-card-model', {
        top: '25%',
        right: '8%',
        scale: 0.95,
        rotationY: 10,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.about',
            start: "top center",
            end: "bottom center",
            scrub: 2
        }
    });

    // Results section - model moves to bottom-right
    gsap.to('#hero-credit-card-model', {
        top: '75%',
        right: '12%',
        scale: 0.9,
        rotationY: -8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.results',
            start: "top center",
            end: "bottom center",
            scrub: 2
        }
    });

    // Testimonials section - model moves to center-left
    gsap.to('#hero-credit-card-model', {
        top: '50%',
        right: '85%',
        scale: 0.95,
        rotationY: 15,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.testimonials',
            start: "top center",
            end: "bottom center",
            scrub: 2
        }
    });

    // Services section - model moves to top-left
    gsap.to('#hero-credit-card-model', {
        top: '20%',
        right: '90%',
        scale: 1.05,
        rotationY: -12,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.services',
            start: "top center",
            end: "bottom center",
            scrub: 2
        }
    });

    // Contact section - model moves to bottom-left
    gsap.to('#hero-credit-card-model', {
        top: '80%',
        right: '85%',
        scale: 0.85,
        rotationY: 18,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.contact',
            start: "top center",
            end: "bottom center",
            scrub: 2
        }
    });

    // Continuous smooth rotation based on scroll
    gsap.to('#hero-credit-card-model', {
        rotationY: 360,
        ease: "none",
        scrollTrigger: {
            trigger: 'body',
            start: "top top",
            end: "bottom bottom",
            scrub: 3
        }
    });

    // Very gentle floating animation
    gsap.to('#hero-credit-card-model', {
        y: -10,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        duration: 4
    });
}

// GSAP Animations
function initializeGSAPAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animate service cards on scroll
    gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.fromTo(card, 
            {
                opacity: 0,
                y: 50,
                scale: 0.9
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power2.out",
                delay: index * 0.2,
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Animate pricing numbers
    gsap.utils.toArray('.price').forEach(price => {
        const text = price.textContent;
        const number = text.match(/\d+/);
        if (number) {
            const targetNumber = parseInt(number[0]);
            gsap.fromTo(price,
                { textContent: "0" },
                {
                    textContent: targetNumber,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: price,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    onUpdate: function() {
                        price.textContent = Math.floor(this.targets()[0].textContent) + " NZD";
                    }
                }
            );
        }
    });

    // Animate 3D model section
    gsap.fromTo('.showcase-text',
        {
            opacity: 0,
            x: -50
        },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.showcase-3d',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    gsap.fromTo('.model-container',
        {
            opacity: 0,
            scale: 0.8
        },
        {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.showcase-3d',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Parallax effect for 3D model
    gsap.to('#credit-card-model', {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: '.showcase-3d',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Animate testimonials
    gsap.utils.toArray('.testimonial-item').forEach((item, index) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Animate logo grid
    gsap.utils.toArray('.logo-grid .logo-item').forEach((logo, index) => {
        gsap.fromTo(logo,
            {
                opacity: 0,
                scale: 0.5
            },
            {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                delay: index * 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: logo,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}

// Enhanced hover effects for service cards
function initializeHoverEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
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
    
    // Initialize GSAP animations
    initializeGSAPAnimations();
    
    // Initialize hover effects
    initializeHoverEffects();
    
    // Initialize 3D model
    init3DModel();
    
    // Setup model travel animations
    setupModelTravel();
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
            price: '250 NZD/month',
            timeline: '30 days',
            testimonials: [
                {
                    quote: "The Silver package got us featured in Yahoo Finance within 2 weeks. Great ROI!",
                    author: "Sarah Chen",
                    company: "Luxury Properties Dubai"
                }
            ]
        },
        gold: {
            title: 'Gold Package',
            outlets: ['Khaleej Times', 'Entrepreneur', 'Gulf Business'],
            features: [
                'Everything in Silver',
                'Direct journalist outreach',
                'Interview coordination',
                '60-day campaign duration',
                'Priority support',
                'Bi-weekly performance reports',
                'Media training session'
            ],
            price: '340 NZD/month',
            timeline: '60 days',
            testimonials: [
                {
                    quote: "Gold package delivered Khaleej Times coverage. Our credibility skyrocketed!",
                    author: "Ahmed Hassan",
                    company: "Elite Real Estate"
                }
            ]
        },
        platinum: {
            title: 'Platinum Package',
            outlets: ['Bloomberg', 'Forbes Middle East', 'Arabian Business'],
            features: [
                'Everything in Gold',
                'Exclusive story angles',
                'Media training included',
                '90-day campaign duration',
                'Dedicated PR manager',
                'Weekly performance reports',
                'Crisis management support'
            ],
            price: '645 NZD/month',
            timeline: '90 days',
            testimonials: [
                {
                    quote: "Bloomberg feature changed everything. We're now the authority in luxury real estate.",
                    author: "Maria Rodriguez",
                    company: "Prestige Properties"
                }
            ]
        },
        black: {
            title: 'Black Package',
            outlets: ['Invite-Only Ultra-Premium'],
            features: [
                'Everything in Platinum',
                'Custom media strategy',
                'Exclusive events access',
                'Dedicated PR manager',
                'Crisis management support',
                'Personal media coaching',
                'VIP networking events'
            ],
            price: 'Contact Us for pricing',
            timeline: 'Custom',
            testimonials: [
                {
                    quote: "The Black package is worth every penny. We're now featured in every major publication.",
                    author: "Omar Khalil",
                    company: "Luxury Estates Dubai"
                }
            ]
        }
    };

    const data = serviceData[tier];
    
    modalContent.innerHTML = `
        <div class="service-modal">
            <h2>${data.title}</h2>
            <div class="service-details">
                <h3>Target Outlets</h3>
                <ul>
                    ${data.outlets.map(outlet => `<li>${outlet}</li>`).join('')}
                </ul>
                
                <h3>Features</h3>
                <ul>
                    ${data.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                
                <div class="price-display">
                    <div class="pricing">
                        <p><strong>${data.price}</strong></p>
                        <p>Timeline: ${data.timeline}</p>
                    </div>
                </div>
                
                <div class="testimonial">
                    <blockquote>"${data.testimonials[0].quote}"</blockquote>
                    <cite>— ${data.testimonials[0].author}, ${data.testimonials[0].company}</cite>
                </div>
            </div>
            <div class="modal-cta">
                <button class="btn-primary" onclick="contactForPackage('${tier}')">Get Started</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Animate modal opening
    gsap.fromTo('.modal-content',
        {
            opacity: 0,
            scale: 0.8,
            y: 50
        },
        {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        }
    );
}

// Tool modal functions
function openArticleSimulator() {
    const modal = document.getElementById('toolModal');
    const modalContent = document.getElementById('toolModalContent');
    
    modalContent.innerHTML = `
        <div class="tool-modal">
            <h2>Article Simulator</h2>
            <p>See how your story would look in top publications</p>
            <form class="simulator-form">
                <div class="form-group">
                    <label>Your Name</label>
                    <input type="text" id="simName" placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label>Your Story</label>
                    <textarea id="simStory" placeholder="Describe your story or achievement"></textarea>
                </div>
                <button type="button" class="btn-primary" onclick="generateArticle()">Generate Preview</button>
            </form>
            <div id="articlePreview" class="article-preview" style="display: none;"></div>
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
            <form class="calculator-form">
                <div class="form-group">
                    <label>Social Media Followers</label>
                    <input type="number" id="followers" placeholder="Enter your total followers">
                </div>
                <div class="form-group">
                    <label>Press Mentions</label>
                    <input type="number" id="mentions" placeholder="Number of press mentions">
                </div>
                <div class="form-group">
                    <label>Years in Business</label>
                    <input type="number" id="years" placeholder="Years in business">
                </div>
                <button type="button" class="btn-primary" onclick="calculateFameScore()">Calculate Score</button>
            </form>
            <div id="fameResult" class="fame-result" style="display: none;"></div>
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
            <form class="generator-form">
                <div class="form-group">
                    <label>Your Story Topic</label>
                    <input type="text" id="topic" placeholder="e.g., Luxury real estate success">
                </div>
                <div class="form-group">
                    <label>Key Achievement</label>
                    <input type="text" id="achievement" placeholder="e.g., Sold 10 luxury properties">
                </div>
                <button type="button" class="btn-primary" onclick="generateHeadlines()">Generate Headlines</button>
            </form>
            <div id="headlineResults" class="headline-results" style="display: none;"></div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function generateArticle() {
    const name = document.getElementById('simName').value;
    const story = document.getElementById('simStory').value;
    
    if (!name || !story) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const preview = document.getElementById('articlePreview');
    preview.innerHTML = `
        <div class="publication-header">
            <h3>Forbes Middle East</h3>
            <p>Business & Innovation</p>
        </div>
        <div class="article-content">
            <h1>${name}: The Real Estate Visionary Redefining Luxury in Dubai</h1>
            <p>In the competitive world of luxury real estate, ${name} has emerged as a true innovator. ${story}</p>
            <p>With a proven track record of success and a deep understanding of the high-end market, ${name} continues to set new standards in the industry.</p>
        </div>
    `;
    
    preview.style.display = 'block';
    
    // Animate the preview
    gsap.fromTo(preview,
        {
            opacity: 0,
            y: 20
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        }
    );
}

function calculateFameScore() {
    const followers = parseInt(document.getElementById('followers').value) || 0;
    const mentions = parseInt(document.getElementById('mentions').value) || 0;
    const years = parseInt(document.getElementById('years').value) || 0;
    
    let score = 0;
    score += Math.min(followers / 1000, 50); // Max 50 points for followers
    score += mentions * 10; // 10 points per mention
    score += years * 5; // 5 points per year
    
    const result = document.getElementById('fameResult');
    result.innerHTML = `
        <div class="score-display">
            <span class="score-number">${Math.round(score)}</span>
            <div class="score-description">Your Fame Score</div>
        </div>
        <div class="score-breakdown">
            <h4>Breakdown:</h4>
            <div>Social Media: ${Math.min(followers / 1000, 50).toFixed(1)} points</div>
            <div>Press Mentions: ${mentions * 10} points</div>
            <div>Experience: ${years * 5} points</div>
        </div>
    `;
    
    result.style.display = 'block';
    
    // Animate the score
    gsap.fromTo('.score-number',
        { textContent: 0 },
        {
            textContent: Math.round(score),
            duration: 2,
            ease: "power2.out",
            onUpdate: function() {
                document.querySelector('.score-number').textContent = Math.round(this.targets()[0].textContent);
            }
        }
    );
}

function generateHeadlines() {
    const topic = document.getElementById('topic').value;
    const achievement = document.getElementById('achievement').value;
    
    if (!topic || !achievement) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const headlines = [
        `"${topic} Expert ${achievement} in Record Time"`,
        `"How This ${topic} Professional ${achievement} Against All Odds"`,
        `"The ${topic} Revolution: ${achievement} and Beyond"`,
        `"From Zero to Hero: ${topic} Success Story"`,
        `"Breaking Records: ${topic} Professional ${achievement}"`
    ];
    
    const results = document.getElementById('headlineResults');
    results.innerHTML = `
        <h3>Generated Headlines</h3>
        ${headlines.map(headline => `
            <div class="headline-item">
                <p>${headline}</p>
            </div>
        `).join('')}
    `;
    
    results.style.display = 'block';
    
    // Animate headlines
    gsap.fromTo('.headline-item',
        {
            opacity: 0,
            x: -20
        },
        {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }
    );
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

function contactForPackage(tier) {
    closeModal();
    scrollToSection('contact');
    
    // Pre-select the package in the form
    const packageSelect = document.getElementById('package');
    if (packageSelect) {
        packageSelect.value = tier;
    }
    
    showNotification(`Interested in ${tier} package? Let's discuss your needs!`, 'info');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    gsap.to(notification, {
        x: 0,
        duration: 0.3,
        ease: "power2.out"
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        gsap.to(notification, {
            x: '100%',
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
}

function initializeAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial-item, .logo-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

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

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal();
        }
    });
});

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}); 
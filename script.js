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

    // Renderer setup - completely transparent with mobile optimizations
    const isMobile = window.innerWidth <= 768;
    renderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile, // Disable antialiasing on mobile for performance
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
    });
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)); // Lower pixel ratio on mobile
    renderer.setClearColor(0x000000, 0); // Completely transparent
    renderer.shadowMap.enabled = !isMobile; // Disable shadows on mobile for performance
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    modelContainer.appendChild(renderer.domElement);

    // Brilliant lighting setup for maximum visual impact and majestic appearance
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Increased ambient for majesty
    scene.add(ambientLight);

    // Main key light - bright and dramatic
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0); // Increased intensity for majesty
    keyLight.position.set(25, 25, 20); // Adjusted position for better coverage
    if (!isMobile) {
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048; // Reduced shadow map size for mobile
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 100;
        keyLight.shadow.camera.left = -15;
        keyLight.shadow.camera.right = 15;
        keyLight.shadow.camera.top = 15;
        keyLight.shadow.camera.bottom = -15;
    }
    scene.add(keyLight);

    // Fill light - bright and wide
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5); // Increased intensity
    fillLight.position.set(-20, 15, 15); // Adjusted position
    scene.add(fillLight);

    // Rim light - strong edge definition for majesty
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.0); // Increased intensity
    rimLight.position.set(0, -20, 20); // Adjusted position
    scene.add(rimLight);

    // Accent lights - multiple point lights for brilliance and majesty
    const accentLight1 = new THREE.PointLight(0xffffff, 1.2); // Increased intensity
    accentLight1.position.set(15, 15, 15);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0xffffff, 1.0); // Increased intensity
    accentLight2.position.set(-15, 10, 10);
    scene.add(accentLight2);

    const accentLight3 = new THREE.PointLight(0xffffff, 0.8); // Increased intensity
    accentLight3.position.set(10, -10, 10);
    scene.add(accentLight3);

    // Colored accent lights for extra brilliance and majesty
    const blueAccent = new THREE.PointLight(0x4a90e2, 0.6); // Increased intensity
    blueAccent.position.set(20, 10, 10);
    scene.add(blueAccent);

    const purpleAccent = new THREE.PointLight(0x9b59b6, 0.5); // Increased intensity
    purpleAccent.position.set(-10, 20, 10);
    scene.add(purpleAccent);

    // Additional majestic lighting
    const goldAccent = new THREE.PointLight(0xffd700, 0.4); // Gold accent for majesty
    goldAccent.position.set(0, 15, 15);
    scene.add(goldAccent);

    const warmAccent = new THREE.PointLight(0xff6b35, 0.3); // Warm accent for majesty
    warmAccent.position.set(15, -5, 5);
    scene.add(warmAccent);

    // Clock for animations
    clock = new THREE.Clock();

    // Load the GLTF model
    const loader = new THREE.GLTFLoader();
    const modelPath = 'inal.glb';
    
    // Show loading indicator
    const loadingIndicator = modelContainer.querySelector('.model-loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }

    // Set a timeout for model loading
    const loadTimeout = setTimeout(() => {
        console.log('Model loading timeout, creating fallback');
        createFallbackModel();
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }, 10000); // 10 second timeout

    loader.load(
        modelPath,
        function (gltf) {
            clearTimeout(loadTimeout);
            console.log('GLTF model loaded successfully');
            
            model = gltf.scene;
            
            // Log all children of the loaded GLTF scene for inspection
            console.log('GLTF scene children before cleanup:', model.children);
            console.log('Total objects in scene:', model.children.length);

            // Identify and remove unwanted children (cameras, lights, empty nodes, etc.)
            const childrenToRemove = [];
            model.children.forEach(child => {
                console.log('Child object:', child.name, child.type, child);
                // Remove cameras, lights, and other non-mesh objects that might be part of the GLB
                if (child.type === 'Camera' || child.type === 'Light' ||
                    (child.type === 'Object3D' && !child.isMesh && !child.isGroup)) {
                    childrenToRemove.push(child);
                }
            });

            // Remove identified children
            childrenToRemove.forEach(child => {
                model.remove(child);
                console.log('Removed unwanted GLTF child:', child.name, child.type);
            });

            console.log('GLTF scene children after cleanup:', model.children);
            console.log('Remaining objects in scene:', model.children.length);

            // Enable shadows and log all meshes
            model.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = !isMobile; // Disable shadows on mobile
                    child.receiveShadow = !isMobile;
                    console.log('Mesh found:', child.name, child.geometry.type, child.material.type);
                    
                    // Optimize materials for mobile
                    if (isMobile && child.material) {
                        child.material.needsUpdate = true;
                    }
                }
            });

            // Scale and position the model
            model.scale.set(2, 2, 2);
            model.position.set(0, 0, 0);
            scene.add(model);

            // Set up animation mixer if animations exist
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
            }

            // Hide loading indicator
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }

            isModelLoaded = true;
            console.log('3D model setup complete');
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            clearTimeout(loadTimeout);
            console.error('Error loading GLTF model:', error);
            createFallbackModel();
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
    );

    // Start animation loop
    animate();
}

function createFallbackModel() {
    console.log('Creating clean fallback credit card model');
    
    // Create a simple, clean credit card
    const cardGeometry = new THREE.BoxGeometry(4, 2.5, 0.1);
    const cardMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a1a1a,
        transparent: true,
        opacity: 0.95,
        shininess: 100
    });
    
    // Main card - clean and simple
    model = new THREE.Mesh(cardGeometry, cardMaterial);
    
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
        // Only rotation - no floating, no movement
        model.rotation.y += 0.004; // Very slow, constant rotation
        
        // Remove all position changes - keep model perfectly stationary
        // model.position.y = 0; // Keep at fixed position
    }

    if (mixer) {
        mixer.update(clock.getDelta());
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function onWindowResize() {
    if (!modelContainer || !camera || !renderer) return;
    
    const isMobile = window.innerWidth <= 768;
    
    // Update camera aspect ratio
    camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer size
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    
    // Adjust pixel ratio for mobile
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    
    // Re-optimize for mobile if needed
    if (isMobile) {
        // Disable antialiasing on mobile for better performance
        renderer.setAntialias(false);
        renderer.shadowMap.enabled = false;
    } else {
        renderer.setAntialias(true);
        renderer.shadowMap.enabled = true;
    }
    
    // Ensure model stays fixed in position during resize
    gsap.set('#hero-credit-card-model', {
        top: '20%',
        right: '5%',
        x: 0,
        y: 0
    });
    
    console.log('Window resized, model container dimensions:', modelContainer.clientWidth, 'x', modelContainer.clientHeight);
}

// Stationary 3D model - completely fixed with only rotation
function setupModelTravel() {
    // Set the model to be completely stationary in the top-right corner
    gsap.set('#hero-credit-card-model', {
        top: '20%',
        right: '5%',
        scale: 1.2, // Scaled up for prominence
        rotationY: 0,
        position: 'fixed', // Ensure it's fixed in viewport
        zIndex: 1000, // Ensure it's above other content
        x: 0, // Ensure no horizontal movement
        y: 0  // Ensure no vertical movement
    });

    // Only rotation animation - no movement, no floating
    gsap.to('#hero-credit-card-model', {
        rotationY: 360,
        ease: "none",
        duration: 15, // Very slow rotation for calm, constant motion
        repeat: -1
    });

    // Remove all floating/movement animations - keep only rotation
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
            
            // Prevent body scroll when mobile menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = navLinks.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
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

    // Enhanced mobile touch interactions
    if ('ontouchstart' in window) {
        // Add touch feedback to buttons
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-card, .btn-tool');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
        
        // Add touch feedback to cards
        const cards = document.querySelectorAll('.service-card, .testimonial-item, .contact-method');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }

    // Enhanced modal handling for mobile
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        // Close modal on backdrop click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
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
    
    // Mobile-specific optimizations
    optimizeForMobile();
});

// Mobile optimization function
function optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Optimize 3D model for mobile
        if (modelContainer) {
            // Reduce model complexity on mobile
            if (renderer) {
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            }
        }
        
        // Optimize animations for mobile
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.timeScale(0.8); // Slightly slower animations on mobile
        }
        
        // Add mobile-specific event listeners
        document.addEventListener('touchstart', function() {}, {passive: true});
        document.addEventListener('touchmove', function() {}, {passive: true});
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            if (renderer && modelContainer) {
                onWindowResize();
            }
            optimizeForMobile();
        }, 100);
    });
    
    // Handle resize for responsive design
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (renderer && modelContainer) {
                onWindowResize();
            }
            optimizeForMobile();
        }, 250);
    });
}

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
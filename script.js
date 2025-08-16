// Custom Elegant Cursor Implementation
function initCustomCursor() {
    // Create custom cursor element
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .btn-card, .btn-tool, .service-card, .testimonial-item, .contact-method, .nav-link, input, textarea, select, .pxc-tab');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Add click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
    });
}

// Initialize custom cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize custom cursor on desktop
    if (window.innerWidth > 768) {
        initCustomCursor();
    }

    // Progressive image hints for better mobile perf
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
        if (!img.hasAttribute('fetchpriority')) {
            img.setAttribute('fetchpriority', 'low');
        }
    });
});

// Smooth scrolling functionality
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Ensure body scrolling is restored before scrolling to section
        document.body.style.overflow = '';
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Three.js 3D Model Integration
let scene, camera, renderer, model, mixer, clock;
let isModelLoaded = false;
let modelContainer = null;
let blackModelScene, blackModelCamera, blackModelRenderer, blackModel, blackModelMixer;
let isBlackModelLoaded = false;

// Initialize Black ticket 3D model
function initBlack3DModel() {
    const blackModelContainer = document.getElementById('black-credit-card-model');
    if (!blackModelContainer) {
        console.log('No Black 3D model container found');
        return;
    }

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }

    // Ensure container has proper dimensions for mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        // Force minimum dimensions for mobile
        blackModelContainer.style.minHeight = '250px';
        blackModelContainer.style.width = '100%';
        console.log('Mobile detected, setting container dimensions');
    }

    // Scene setup for Black ticket
    blackModelScene = new THREE.Scene();
    blackModelScene.background = null; // Completely transparent

    // Camera setup with mobile optimization
    const containerWidth = blackModelContainer.clientWidth || 300; // Fallback width
    const containerHeight = blackModelContainer.clientHeight || 250; // Fallback height
    blackModelCamera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    // Position camera to show the entire model while keeping it close enough to look impressive
    blackModelCamera.position.set(0, 0, 10);

    // Renderer setup
    blackModelRenderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile,
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
    });
    blackModelRenderer.setSize(containerWidth, containerHeight);
    blackModelRenderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    blackModelRenderer.setClearColor(0x000000, 0);
    blackModelRenderer.shadowMap.enabled = !isMobile;
    blackModelRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    blackModelRenderer.outputEncoding = THREE.sRGBEncoding;
    blackModelRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    blackModelRenderer.toneMappingExposure = 1.2;
    blackModelContainer.appendChild(blackModelRenderer.domElement);

    // Majestic lighting setup for Black ticket
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    blackModelScene.add(ambientLight);

    // Golden key light for majesty
    const keyLight = new THREE.DirectionalLight(0xffd700, 4.0);
    keyLight.position.set(30, 30, 25);
    if (!isMobile) {
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 100;
        keyLight.shadow.camera.left = -15;
        keyLight.shadow.camera.right = 15;
        keyLight.shadow.camera.top = 15;
        keyLight.shadow.camera.bottom = -15;
    }
    blackModelScene.add(keyLight);

    // Silver fill light for contrast
    const fillLight = new THREE.DirectionalLight(0xc0c0c0, 2.5);
    fillLight.position.set(-25, 20, 20);
    blackModelScene.add(fillLight);

    // Platinum rim light for edge definition
    const rimLight = new THREE.DirectionalLight(0xe5e4e2, 3.5);
    rimLight.position.set(0, -25, 25);
    blackModelScene.add(rimLight);

    // Accent lights for brilliance
    const accentLight1 = new THREE.PointLight(0xffd700, 2.0);
    accentLight1.position.set(20, 20, 20);
    blackModelScene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0xffb347, 1.5);
    accentLight2.position.set(-20, 15, 15);
    blackModelScene.add(accentLight2);

    const accentLight3 = new THREE.PointLight(0xffffff, 1.8);
    accentLight3.position.set(15, -15, 15);
    blackModelScene.add(accentLight3);

    // Load the 3D model
    const loader = new THREE.GLTFLoader();
    loader.load(
        'inal.glb',
        function (gltf) {
            blackModel = gltf.scene;
            // Adjust scale for mobile and ensure full visibility with good visual impact
            const modelScale = isMobile ? 2.3 : 2.8;
            blackModel.scale.set(modelScale, modelScale, modelScale);
            blackModel.position.set(0, 0, 0);
            
            if (gltf.animations && gltf.animations.length > 0) {
                blackModelMixer = new THREE.AnimationMixer(blackModel);
                const action = blackModelMixer.clipAction(gltf.animations[0]);
                action.play();
            }
            
            blackModelScene.add(blackModel);
            isBlackModelLoaded = true;
            
            // Hide loading spinner
            const loadingElement = blackModelContainer.querySelector('.black-model-loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            console.log('Black 3D model loaded successfully', isMobile ? '(Mobile)' : '(Desktop)');
            
            // Start animation loop
            clock = new THREE.Clock();
            animateBlackModel();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error occurred loading the Black ticket model:', error);
        }
    );
}

function animateBlackModel() {
    if (!isBlackModelLoaded) return;
    
    requestAnimationFrame(animateBlackModel);
    
    if (blackModelMixer) {
        blackModelMixer.update(clock.getDelta());
    }
    
    if (blackModel) {
        blackModel.rotation.y += 0.005;
    }
    
    blackModelRenderer.render(blackModelScene, blackModelCamera);
}

// Initialize Modal Black 3D model
function initModalBlack3DModel() {
    const modalBlackModelContainer = document.getElementById('modal-black-credit-card-model');
    if (!modalBlackModelContainer) {
        console.log('No Modal Black 3D model container found');
        return;
    }

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }

    // Scene setup for Modal Black ticket
    const modalBlackModelScene = new THREE.Scene();
    modalBlackModelScene.background = null; // Completely transparent

    // Camera setup
    const modalBlackModelCamera = new THREE.PerspectiveCamera(75, modalBlackModelContainer.clientWidth / modalBlackModelContainer.clientHeight, 0.1, 1000);
    // Position camera to show the entire model while keeping it close enough to look impressive
    modalBlackModelCamera.position.set(0, 0, 10);

    // Renderer setup
    const isMobile = window.innerWidth <= 768;
    const modalBlackModelRenderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile,
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
    });
    modalBlackModelRenderer.setSize(modalBlackModelContainer.clientWidth, modalBlackModelContainer.clientHeight);
    modalBlackModelRenderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    modalBlackModelRenderer.setClearColor(0x000000, 0);
    modalBlackModelRenderer.shadowMap.enabled = !isMobile;
    modalBlackModelRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    modalBlackModelRenderer.outputEncoding = THREE.sRGBEncoding;
    modalBlackModelRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    modalBlackModelRenderer.toneMappingExposure = 1.2;
    modalBlackModelContainer.appendChild(modalBlackModelRenderer.domElement);

    // Majestic lighting setup for Modal Black ticket
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    modalBlackModelScene.add(ambientLight);

    // Golden key light for majesty
    const keyLight = new THREE.DirectionalLight(0xffd700, 4.0);
    keyLight.position.set(30, 30, 25);
    if (!isMobile) {
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 100;
        keyLight.shadow.camera.left = -15;
        keyLight.shadow.camera.right = 15;
        keyLight.shadow.camera.top = 15;
        keyLight.shadow.camera.bottom = -15;
    }
    modalBlackModelScene.add(keyLight);

    // Silver fill light for contrast
    const fillLight = new THREE.DirectionalLight(0xc0c0c0, 2.5);
    fillLight.position.set(-25, 20, 20);
    modalBlackModelScene.add(fillLight);

    // Platinum rim light for edge definition
    const rimLight = new THREE.DirectionalLight(0xe5e4e2, 3.5);
    rimLight.position.set(0, -25, 25);
    modalBlackModelScene.add(rimLight);

    // Accent lights for brilliance
    const accentLight1 = new THREE.PointLight(0xffd700, 2.0);
    accentLight1.position.set(20, 20, 20);
    modalBlackModelScene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0xffb347, 1.5);
    accentLight2.position.set(-20, 15, 15);
    modalBlackModelScene.add(accentLight2);

    const accentLight3 = new THREE.PointLight(0xffffff, 1.8);
    accentLight3.position.set(15, -15, 15);
    modalBlackModelScene.add(accentLight3);

    // Load the 3D model
    const loader = new THREE.GLTFLoader();
    loader.load(
        'inal.glb',
        function (gltf) {
                         const modalBlackModel = gltf.scene;
             // Adjust scale for mobile and ensure full visibility with good visual impact
             const modalModelScale = isMobile ? 2.3 : 2.8;
             modalBlackModel.scale.set(modalModelScale, modalModelScale, modalModelScale);
             modalBlackModel.position.set(0, 0, 0);
            
            let modalBlackModelMixer = null;
            if (gltf.animations && gltf.animations.length > 0) {
                modalBlackModelMixer = new THREE.AnimationMixer(modalBlackModel);
                const action = modalBlackModelMixer.clipAction(gltf.animations[0]);
                action.play();
            }
            
            modalBlackModelScene.add(modalBlackModel);
            
            // Hide loading spinner
            const loadingElement = modalBlackModelContainer.querySelector('.modal-black-model-loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            // Start animation loop
            const modalClock = new THREE.Clock();
            function animateModalBlackModel() {
                requestAnimationFrame(animateModalBlackModel);
                
                if (modalBlackModelMixer) {
                    modalBlackModelMixer.update(modalClock.getDelta());
                }
                
                if (modalBlackModel) {
                    modalBlackModel.rotation.y += 0.005;
                }
                
                modalBlackModelRenderer.render(modalBlackModelScene, modalBlackModelCamera);
            }
            animateModalBlackModel();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error occurred loading the Modal Black ticket model:', error);
        }
    );
}

/* 3D Model commented out - function init3DModel() {
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
    } */

    /* 3D Model commented out - Scene setup and model loading code
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
    */
    
    /* 3D Model commented out - Model loading and setup code
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
    */

/* 3D Model commented out - function createFallbackModel() {
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
} */

/* 3D Model commented out - function animate() {
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
} */

/* 3D Model commented out - function onWindowResize() {
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
} */

/* 3D Model commented out - Stationary 3D model - completely fixed with only rotation
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
} */

// GSAP Animations
function initializeGSAPAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    console.log('GSAP ScrollTrigger registered:', typeof ScrollTrigger !== 'undefined');

    // Thermometer removed

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

    // Animate pricing numbers (only for text prices, not ticket images)
    gsap.utils.toArray('.price').forEach(price => {
        // Skip if this is a ticket image (only animate text prices)
        if (price.tagName === 'IMG') {
            return;
        }
        
        const text = price.textContent;
        const number = text.match(/\d+/);
        if (number) {
            const targetNumber = parseInt(number[0]);
            console.log('Setting up price animation for:', price.textContent, 'Target:', targetNumber);
            
            // Store original text for non-numeric prices
            const originalText = price.textContent;
            
            // Create a simple counter animation
            const counter = { value: 0 };
            
            // Test animation without ScrollTrigger first
            gsap.to(counter, {
                value: targetNumber,
                duration: 2,
                ease: "power2.out",
                delay: 1, // Start after 1 second for testing
                onUpdate: function() {
                    const currentValue = Math.floor(counter.value);
                    price.textContent = currentValue + " NZD";
                    console.log('Price animation update:', currentValue);
                },
                onComplete: function() {
                    // Ensure final value is correct
                    price.textContent = targetNumber + " NZD";
                    console.log('Price animation complete:', targetNumber);
                }
            });
            
            // Also set up ScrollTrigger version
            gsap.to(counter, {
                value: targetNumber,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: price,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    onUpdate: function() {
                    const currentValue = Math.floor(counter.value);
                    price.textContent = currentValue + " NZD";
                },
                onComplete: function() {
                    price.textContent = targetNumber + " NZD";
                }
            });
        } else {
            console.log('No number found in price:', price.textContent);
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
    // Ensure body scrolling is restored on page load
    document.body.style.overflow = '';
    
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

    let isScrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            window.requestAnimationFrame(() => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (window.pageYOffset >= sectionTop - 200) {
                        current = section.getAttribute('id');
                    }
                });

                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${current}`) {
                        item.classList.add('active');
                    }
                });

                isScrollTicking = false;
            });
            isScrollTicking = true;
        }
    }, { passive: true });

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
    
    // Ensure body scrolling is restored on window resize
    window.addEventListener('resize', function() {
        // Only restore scrolling if no modal is open and mobile menu is closed
        const modals = document.querySelectorAll('.modal');
        const navLinks = document.querySelector('.nav-links');
        const isModalOpen = Array.from(modals).some(modal => modal.style.display === 'block');
        const isMobileMenuOpen = navLinks && navLinks.classList.contains('active');
        
        if (!isModalOpen && !isMobileMenuOpen) {
            document.body.style.overflow = '';
        }
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
    
    // 3D Model commented out
    // Initialize 3D model
    // init3DModel();
    
    // Setup model travel animations
    // setupModelTravel();
    
    // 3D Model commented out - Mobile-specific optimizations
    // optimizeForMobile();

    // Global scroll progress bar
    (function initScrollProgressBar() {
        const bar = document.getElementById('progress-bar');
        if (!bar) return;
        const update = () => {
            const doc = document.documentElement;
            const scrollTop = doc.scrollTop || document.body.scrollTop;
            const scrollHeight = (doc.scrollHeight - doc.clientHeight) || 1;
            const pct = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
            bar.style.width = pct + '%';
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
    })();
});

/* 3D Model commented out - Mobile optimization function
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
} */

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
    // Ensure body scrolling is restored before opening modal
    document.body.style.overflow = '';
    
    const modal = document.getElementById('serviceModal');
    const modalContent = document.getElementById('modalContent');
    
    const serviceData = {
        silver: {
            title: 'Silver Package',
            outlets: ['Medium', 'Time Bulletin', 'US Times Now', 'Globe Stats', 'Insta Bulletin'],
            features: [
                'One-time fee for guaranteed publication',
                'Professional article writing and editing',
                'Direct submission to target publications',
                'Publication within 7-14 days',
                'Lifetime access to published article'
            ],
            price: '300 NZD',
            timeline: 'One-time fee',
            testimonials: [
                {
                    quote: "Got published in Medium within a week. The one-time fee was totally worth it!",
                    author: "Sarah Chen",
                    company: "Luxury Properties Dubai"
                }
            ]
        },
        gold: {
            title: 'Gold Package',
            outlets: ['Digital Journal', 'Time Business News', 'Fox Interviewer', 'Voyage NY', 'London Reporter', 'Big Time Daily', 'Tricity Daily', 'Vents Magazine', 'Seekers Time', 'San Francisco Post', 'One World Herald', 'Verna Magazine', 'Tech Bullion'],
            features: [
                'One-time fee for guaranteed publication',
                'Professional article writing and editing',
                'Direct submission to target publications',
                'Publication within 7-14 days',
                'Lifetime access to published article'
            ],
            price: '410 NZD',
            timeline: 'One-time fee',
            testimonials: [
                {
                    quote: "Published in Digital Journal and Time Business News. The Gold package delivered exactly what we needed!",
                    author: "Ahmed Hassan",
                    company: "Elite Real Estate"
                }
            ]
        },
        platinum: {
            title: 'Platinum Package',
            outlets: ['Real Estate Today', 'CEO Weekly', 'NY Weekly', 'The Wall Street Times', 'US Insider', 'Latin Post', 'LA Progressive', 'Net News Ledger', 'NY Wire', 'Miami Wire', 'US Reporter', 'The American Reporter', 'London Daily Post', 'Kivo Daily', 'Los Angeles Tribune', 'America Daily Post', 'Atlanta Wire', 'LA Wire', 'The Chicago Journal', 'California Herald', 'California Gazette', 'Auto World News', 'Food World News', 'Sports World News', 'BO Herald', 'Future Sharks', 'Active Rain', 'Block Telegraph', 'IBT Singapore', 'IBT India', 'Daily Scanner', 'Influencer Daily', 'Cali Post', 'Famous Times', 'Space Coast Daily', 'NY Tech Media', 'The UBJ', 'Explosion', 'Business Deccan', 'Lawyer Herald', 'Miditech Today', 'The Frisky', 'Disrupt Magazine'],
            features: [
                'One-time fee for guaranteed publication',
                'Professional article writing and editing',
                'Direct submission to target publications',
                'Publication within 7-14 days',
                'Lifetime access to published article'
            ],
            price: '700 NZD',
            timeline: 'One-time fee',
            testimonials: [
                {
                    quote: "Published in Real Estate Today and CEO Weekly. The Platinum package exceeded our expectations!",
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
            <div class="modal-header">
                <h2 class="modal-title">${data.title}</h2>
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
            
            <!-- Column 1: Testimonial Collage or 3D Model for Black -->
            <div class="modal-testimonials">
                ${tier === 'black' ? `
                    <div class="modal-black-3d-model" style="width: 100%; height: 350px; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, rgba(192, 192, 192, 0.2) 0%, rgba(169, 169, 169, 0.3) 100%); backdrop-filter: blur(10px); border: 1px solid rgba(192, 192, 192, 0.3); box-shadow: 0 8px 32px rgba(192, 192, 192, 0.2); position: relative;">
                        <div id="modal-black-credit-card-model" style="width: 100%; height: 100%; position: relative; background: transparent; border: none; overflow: visible;">
                            <div class="modal-black-model-loading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #ffffff; z-index: 1;">
                                <div class="modal-black-loading-spinner" style="width: 30px; height: 30px; border: 2px solid rgba(255, 255, 255, 0.3); border-top: 2px solid #ffffff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 0.5rem;"></div>
                                <p style="font-size: 0.8rem; color: #cccccc;">Loading 3D Model...</p>
                            </div>
                        </div>
                    </div>
                ` : `
                    <h3 style="color: #ffffff; margin-bottom: 1.5rem; font-size: 1.3rem; text-align: center;">Success Stories</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
                            <img src="Testimonials_Client Proof/Grit Brokerage/Grit-Brokerage.png" alt="Grit Brokerage Success" style="width: 100%; height: 140px; object-fit: cover; filter: brightness(0.8);">
                            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 0.5rem; color: white; font-size: 0.8rem; text-align: center;">Grit Brokerage</div>
                        </div>
                        <div style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
                            <img src="Testimonials_Client Proof/Frantisek/FRANTISEK-r0bsbqmk9i1fuugh1v2oq4dev8tpyb86t8rlzkehq0.png" alt="Frantisek Success" style="width: 100%; height: 140px; object-fit: cover; filter: brightness(0.8);">
                            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 0.5rem; color: white; font-size: 0.8rem; text-align: center;">Frantisek</div>
                        </div>
                        <div style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
                            <img src="Testimonials_Client Proof/Luis/new-Luis-Faiardo-r0bsbrkdueoslr0duydyi4mp4vtdh2pni7vfemdz20.png" alt="Luis Success" style="width: 100%; height: 140px; object-fit: cover; filter: brightness(0.8);">
                            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 0.5rem; color: white; font-size: 0.8rem; text-align: center;">Luis Faiardo</div>
                        </div>
                        <div style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
                            <img src="Testimonials_Client Proof/Markus/Untitled-design-16-r0bsbk1obqei0vbb2v4xy6j0dsufrhvst6njkep4fs.png" alt="Markus Success" style="width: 100%; height: 140px; object-fit: cover; filter: brightness(0.8);">
                            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 0.5rem; color: white; font-size: 0.8rem; text-align: center;">Markus</div>
                        </div>
                        <div style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
                            <img src="Testimonials_Client Proof/Grit Brokerage/Screenshot-2025-01-06-140520.png" alt="Grit Brokerage Press" style="width: 100%; height: 140px; object-fit: cover; filter: brightness(0.8);">
                            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 0.5rem; color: white; font-size: 0.8rem; text-align: center;">Press Coverage</div>
                        </div>
                        <div style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3); background: linear-gradient(135deg, #ffd700, #ffb347); display: flex; align-items: center; justify-content: center;">
                            <div style="color: #000; font-weight: bold; font-size: 1.2rem; text-align: center;">
                                <div style="font-size: 2rem; margin-bottom: 0.5rem;">+50</div>
                                <div>Success Stories</div>
                            </div>
                        </div>
                    </div>
                `}
            </div>
            
            <!-- Column 2: Package Details -->
            <div class="modal-details">
                <div class="modal-features">
                    <h3 style="color: #ffffff; margin-bottom: 1rem; font-size: 1.3rem;">What's Included</h3>
                    ${data.features.map((feature, index) => `
                        <div class="modal-feature">
                            <div class="modal-feature-icon">${index + 1}</div>
                            <span style="color: #ffffff;">${feature}</span>
                        </div>
                    `).join('')}
                </div>
                
            <div class="service-details">
                    <h3 style="color: #ffffff; margin-bottom: 1rem;">Target Publications</h3>
                    <ul style="color: #cccccc; line-height: 1.8;">
                    ${data.outlets.map(outlet => `<li>${outlet}</li>`).join('')}
                </ul>
                
                    <div class="testimonial" style="margin-top: 2rem; padding: 1.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 12px; border-left: 4px solid #ffd700;">
                        <blockquote style="color: #ffffff; font-style: italic; margin-bottom: 0.5rem;">"${data.testimonials[0].quote}"</blockquote>
                        <cite style="color: #cccccc; font-size: 0.9rem;">— ${data.testimonials[0].author}, ${data.testimonials[0].company}</cite>
                    </div>
                    </div>
                </div>
                
            <!-- Column 3: Ticket and CTA -->
            <div class="modal-cta">
                ${tier === 'black' ? '' : `<img src="pricing images/${tier}.png" alt="${data.title} Package" class="modal-ticket">`}
                
                <div class="modal-cta-section">
                    <h3 class="modal-cta-title">Ready to Get Started?</h3>
                    <p class="modal-cta-description">Join the elite group of real estate professionals who've already achieved media success with our ${data.title} package.</p>
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: #ffd700; font-size: 1.2rem;">${data.price}</strong>
                        <p style="color: #cccccc; margin-top: 0.5rem;">Timeline: ${data.timeline}</p>
                </div>
                    <button class="btn-primary" onclick="contactForPackage('${tier}')" style="width: 100%; padding: 1rem 2rem; font-size: 1.1rem;">Get Started Now</button>
            </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Initialize 3D model for Black ticket modal
    if (tier === 'black') {
        setTimeout(() => {
            initModalBlack3DModel();
        }, 100);
    }
    
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
    // Ensure body scrolling is restored before opening modal
    document.body.style.overflow = '';
    
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
    // Ensure body scrolling is restored before opening modal
    document.body.style.overflow = '';
    
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
    // Ensure body scrolling is restored before opening modal
    document.body.style.overflow = '';
    
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
    
    // Ensure body scrolling is restored when modal is closed
    document.body.style.overflow = '';
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

// Mobile Testimonial Ticker Functions
let currentTickerIndex = 0;
const tickerItems = document.querySelectorAll('.ticker-item');
const tickerTrack = document.querySelector('.ticker-track');
const tickerDots = document.querySelector('.ticker-dots');

// Initialize ticker dots
function initTickerDots() {
    if (!tickerDots) return;
    
    tickerDots.innerHTML = '';
    tickerItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `ticker-dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToTicker(index);
        tickerDots.appendChild(dot);
    });
}

// Go to specific ticker item
function goToTicker(index) {
    if (index < 0 || index >= tickerItems.length) return;
    
    currentTickerIndex = index;
    const translateX = -index * 100;
    tickerTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update dots
    document.querySelectorAll('.ticker-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Next ticker item
function nextTicker() {
    const nextIndex = (currentTickerIndex + 1) % tickerItems.length;
    goToTicker(nextIndex);
}

// Previous ticker item
function prevTicker() {
    const prevIndex = (currentTickerIndex - 1 + tickerItems.length) % tickerItems.length;
    goToTicker(prevIndex);
}

// Auto-advance ticker (optional)
function startTickerAutoAdvance() {
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            nextTicker();
        }
    }, 5000); // Change every 5 seconds
}

// Initialize ticker when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start intro animation
    startIntroAnimation();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize hover effects
    initializeHoverEffects();
    
    // Initialize GSAP animations
    initializeGSAPAnimations();
    
    initTickerDots();
    // Uncomment the line below if you want auto-advancing ticker
    // startTickerAutoAdvance();
    
    // Initialize logo slider
    initLogoSlider();
    
    // Initialize Black ticket 3D model
    initBlack3DModel();
    // Initialize horizontal scrolling for homepage (desktop only)
    initHomeHorizontalScroll();
    
    // Add window resize handler for 3D model
    window.addEventListener('resize', function() {
        if (blackModelRenderer && blackModelCamera) {
            const blackModelContainer = document.getElementById('black-credit-card-model');
            if (blackModelContainer) {
                const containerWidth = blackModelContainer.clientWidth || 300;
                const containerHeight = blackModelContainer.clientHeight || 250;
                
                blackModelCamera.aspect = containerWidth / containerHeight;
                blackModelCamera.updateProjectionMatrix();
                
                blackModelRenderer.setSize(containerWidth, containerHeight);
                console.log('3D model resized for new dimensions:', containerWidth, 'x', containerHeight);
            }
        }
    });
    // Pressence Search: form + personalized message
    (function initPressenceSearch() {
        const form = document.getElementById('pressence-search-form');
        if (!form) return;
        const nameInput = document.getElementById('pressenceFullName');
        const queryInput = nameInput; // single field used for search term and name
        const messageEl = null; // message removed to prevent duplicate lines
        const summaryEl = document.getElementById('pressence-summary');

        function updateMessage() {
            const name = (nameInput && nameInput.value || '').trim();
            if (!messageEl) return;
            if (name.length === 0) {
                messageEl.textContent = '';
                messageEl.style.display = 'none';
                return;
            }
            messageEl.textContent = `${name}, your current pressence isn\'t enough. Let\'s elevate your PR and make sure you\'re seen as #1.`;
            messageEl.style.display = 'block';
        }

        // message removed

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const q = (queryInput && queryInput.value) ? queryInput.value : '';
            if (summaryEl) summaryEl.textContent = 'Analyzing your visibility...';
            try {
                const res = await fetch('/.netlify/functions/summarizeSearch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: q, debug: true })
                });
                const data = await res.json();
                console.log('Pressence summarize diagnostics:', data.diagnostics || {});
                if (summaryEl) {
                    summaryEl.textContent = data.summary && data.summary.trim().length > 0
                        ? data.summary
                        : `${q}, your current pressence isn't enough. Let's elevate your PR and make sure you're seen as #1.`;
                }
            } catch (err) {
                if (summaryEl) summaryEl.textContent = 'Unable to analyze right now. Please try again.';
                console.warn('summarize call failed:', err);
            }
            // message removed
        });
    })();
});

// Opening animation function
function startIntroAnimation() {
    const introOverlay = document.getElementById('intro-overlay');
    const body = document.body;
    
    // Add intro-active class to body
    body.classList.add('intro-active');
    
    // Create majestic particle effect
    createMajesticParticles();
    
    // Wait for logo animation to complete, then reveal content
    setTimeout(() => {
        // Fade out the intro overlay with majestic effect
        introOverlay.classList.add('fade-out');
        
        // Remove intro-active class and reveal content
        setTimeout(() => {
            body.classList.remove('intro-active');
            
            // Majestic hero content reveal
            gsap.fromTo('.hero-content', 
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.9,
                    rotationX: 15
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotationX: 0,
                    duration: 1.5,
                    ease: "power3.out",
                    stagger: 0.3
                }
            );
            
            // Majestic navbar reveal
            gsap.fromTo('.navbar', 
                {
                    opacity: 0,
                    y: -30,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out"
                }
            );
            
            // Majestic hero quotes reveal
            gsap.fromTo('.hero-quotes', 
                {
                    opacity: 0,
                    y: 40,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.5,
                    ease: "power3.out",
                    delay: 0.8
                }
            );
            
            // Remove intro overlay from DOM after animation
            setTimeout(() => {
                introOverlay.remove();
            }, 1500);
            
        }, 1000);
        
    }, 3000); // Wait 3 seconds for majestic logo animation
}

// Create majestic particle effect
function createMajesticParticles() {
    const introOverlay = document.getElementById('intro-overlay');
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'majestic-particles';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    introOverlay.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 215, 0, 0.6);
            border-radius: 50%;
            pointer-events: none;
        `;
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        particleContainer.appendChild(particle);
        
        // Animate particle
        gsap.to(particle, {
            y: -100,
            opacity: 0,
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            ease: "power2.out"
        });
    }
} 

// Logo Slider Functions
function initLogoSlider() {
    const logoSliderTrack = document.querySelector('.logo-slider-track');
    if (!logoSliderTrack) return;
    
    // Ensure smooth infinite scrolling
    const logoItems = document.querySelectorAll('.logo-slider-item');
    if (logoItems.length === 0) return;
    
    // Add event listeners for pause on hover
    const logoSliderContainer = document.querySelector('.logo-slider-container');
    if (logoSliderContainer) {
        logoSliderContainer.addEventListener('mouseenter', () => {
            logoSliderTrack.style.animationPlayState = 'paused';
        });
        
        logoSliderContainer.addEventListener('mouseleave', () => {
            logoSliderTrack.style.animationPlayState = 'running';
        });
    }
    
    // Optimize animation for mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        logoSliderTrack.style.animationDuration = '15s'; // Faster on mobile
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 768;
        logoSliderTrack.style.animationDuration = newIsMobile ? '15s' : '20s';
    });
}

// Horizontal scroll for homepage (desktop only)
function initHomeHorizontalScroll() {
    const isDesktop = window.innerWidth >= 768; // enable on tablets/phones too with tweaks
    const home = document.getElementById('home');
    const track = home && home.querySelector('.home-horizontal');
    if (!isDesktop || !home || !track || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }

    const panels = gsap.utils.toArray('#home .panel');
    if (panels.length <= 1) return;

    // Ensure body can scroll horizontally via GSAP pinning, but page remains vertical
    const totalScroll = (panels.length - 1) * window.innerWidth;

    gsap.set(track, { width: panels.length * window.innerWidth });

    const horizontalTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: home,
            start: 'top top',
            end: () => `+=${totalScroll}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    // After the horizontal finishes, pin the hero and advance phone stories
    setupPhoneStoriesInHero();

    // Refresh on resize to keep layout accurate
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1025) {
            ScrollTrigger.refresh();
        }
    });

    // Scroll indicator removed
}

// Phone stories sequence: pin section and map scroll to vertical story progression
function setupPhoneStoriesInHero() {
    const container = document.getElementById('phone-stories');
    const track = container && container.querySelector('.story-track');
    const slides = container && container.querySelectorAll('.story-slide');
    const skipBtn = document.getElementById('skip-stories-btn');
    if (!container || !track || !slides || slides.length === 0 || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }

    const slidesCount = slides.length;
    const isDesktop = window.innerWidth >= 1025;

    if (isDesktop) {
        // Desktop: decouple from scroll and autoplay at steady pace
        gsap.set(track, { yPercent: 0 });
        const secondsPerSlide = 3.5;
        const desktopTl = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } });
        for (let i = 1; i < slidesCount; i++) {
            desktopTl.to(track, { yPercent: -i * 100, duration: secondsPerSlide });
        }
        // Reset to first slide instantly at loop
        desktopTl.add(() => gsap.set(track, { yPercent: 0 }));

        // Show skip button after a few slides worth of time
        if (skipBtn) {
            skipBtn.style.display = 'none';
            const showAfterMs = Math.min(4, slidesCount - 1) * secondsPerSlide * 1000;
            setTimeout(() => { skipBtn.style.display = 'inline-flex'; }, showAfterMs);
        }
    } else {
        // Non-desktop (tablet/mobile): keep scroll-driven behavior
        const tl = gsap.timeline({ paused: true });
        for (let i = 1; i < slidesCount; i++) {
            tl.to(track, { yPercent: -i * 100, duration: 1, ease: 'none' }, i - 1);
        }

        const homeEl = document.getElementById('home');
        const pinDistance = slidesCount * window.innerHeight; // one viewport per story

        const horizontalEnd = () => {
            const panelsLen = document.querySelectorAll('#home .panel').length;
            return Math.max(0, (panelsLen - 1) * window.innerWidth);
        };

        const startPos = () => horizontalEnd() + window.innerHeight * 0.14;

        ScrollTrigger.create({
            trigger: homeEl,
            start: () => startPos(),
            end: () => startPos() + pinDistance,
            pin: homeEl,
            pinSpacing: true,
            scrub: true,
            anticipatePin: 1,
            onEnter: () => gsap.set(track, { yPercent: 0 }),
            onUpdate: self => {
                tl.progress(self.progress);
                if (skipBtn) {
                    const threshold = Math.min(4 / slidesCount, 0.75);
                    skipBtn.style.display = self.progress >= threshold ? 'inline-flex' : 'none';
                }
            }
        });
    }

    // Skip button scrolls to the next section after hero (works for both modes)
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            const nextSection = document.getElementById('about') || document.querySelector('.chapter.about');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, { passive: true });
    }
}

// =======================
// Press Constellation (pxc)
// =======================
(function initPressConstellation() {
	let pxcInitialized = false;
	const pxcData = {
		silver: [
			{ name: 'Medium', client: 'Hana Cha - Real Estate Professional', date: 'Feb 2024', reach: '2M+ readers' },
			{ name: 'Time Bulletin', client: 'Samuel Leeds - Property Investor', date: 'Mar 2024', reach: '500K+ readers' },
			{ name: 'US Times Now', client: 'Alex Kowtun - Entrepreneur', date: 'Jan 2024', reach: '1M+ readers' },
			{ name: 'Globe Stats', client: 'Andy Daro - Real Estate Developer', date: 'Apr 2024', reach: '750K+ readers' },
			{ name: 'Insta Bulletin', client: 'Dhirendra Singh - Hospitality Trainer', date: 'May 2024', reach: '300K+ readers' }
		],
		gold: [
			{ name: 'Digital Journal', client: 'Frantisek - Crypto Investor', date: 'Jun 2024', reach: '2.5M+ readers' },
			{ name: 'Time Business News', client: 'Gerry Gadoury - Executive Coach', date: 'Mar 2024', reach: '1.8M+ readers' },
			{ name: 'Fox Interviewer', client: 'Hamzah Kassab - Entrepreneur', date: 'Apr 2024', reach: '3M+ readers' },
			{ name: 'Voyage NY', client: 'Karan Bindra - Founder & CEO', date: 'May 2024', reach: '1.2M+ readers' },
			{ name: 'London Reporter', client: 'Luis Faiardo - Founder', date: 'Feb 2024', reach: '900K+ readers' },
			{ name: 'Tech Bullion', client: 'Seth Vandaele - Co-Founder', date: 'Jul 2024', reach: '2.1M+ readers' }
		],
		platinum: [
			{ name: 'Forbes', client: 'Top-tier CEO', date: 'Jun 2024', reach: '8M+ readers' },
			{ name: 'Entrepreneur', client: 'Tech Visionary', date: 'May 2024', reach: '6M+ readers' },
			{ name: 'NY Weekly', client: 'Tomas Chlup - Health Entrepreneur', date: 'Apr 2024', reach: '4M+ readers' },
			{ name: 'CEO Weekly', client: 'Sunil Tulisani - Real Estate Investor', date: 'Jun 2024', reach: '3.5M+ readers' },
			{ name: 'Wall Street Times', client: 'Trenton Wisecup - CEO Arrow Roofing', date: 'Mar 2024', reach: '5M+ readers' }
		]
	};

	function getPublication(tier, publicationName) {
		const tiers = tier ? [tier] : ['silver', 'gold', 'platinum'];
		for (const t of tiers) {
			const hit = (pxcData[t] || []).find(p => p.name === publicationName);
			if (hit) return hit;
		}
		return null;
	}

	function animateGalaxyEntrance(root) {
		const stars = root.querySelectorAll('.pxc-star');
		const lines = root.querySelectorAll('.pxc-lines line');
		stars.forEach((star, i) => {
			star.style.opacity = '0';
			star.style.transform = 'scale(0)';
			setTimeout(() => {
				star.style.transition = 'all .6s cubic-bezier(0.34, 1.56, 0.64, 1)';
				star.style.opacity = '1';
				star.style.transform = 'scale(1)';
			}, i * 120);
		});
		lines.forEach((line, i) => {
			line.style.strokeDasharray = '1000';
			line.style.strokeDashoffset = '1000';
			setTimeout(() => {
				line.style.transition = 'stroke-dashoffset 1s ease-out';
				line.style.strokeDashoffset = '0';
			}, stars.length * 120 + i * 80);
		});
	}

	function bindStarEvents(spaceEl, currentTierRef) {
		const tooltip = document.getElementById('pxc-tooltip');
		const stars = spaceEl.querySelectorAll('.pxc-star');
		stars.forEach(star => {
			const clone = star.cloneNode(true);
			star.parentNode.replaceChild(clone, star);
			clone.addEventListener('mouseenter', e => {
				if (!tooltip) return;
				const name = clone.getAttribute('data-publication');
				const pub = getPublication(currentTierRef.value, name) || getPublication(null, name);
				if (!pub) return;
				tooltip.querySelector('.pxc-tooltip-title').textContent = pub.name;
				tooltip.querySelector('.pxc-tooltip-client').textContent = `Client: ${pub.client}`;
				tooltip.querySelector('.pxc-tooltip-date').textContent = `Published: ${pub.date}`;
				tooltip.querySelector('.pxc-tooltip-reach').textContent = `Reach: ${pub.reach}`;
				const logo = tooltip.querySelector('.pxc-tooltip-logo');
				if (logo) logo.textContent = pub.name.charAt(0).toUpperCase();
				tooltip.classList.add('visible');
			});
			clone.addEventListener('mouseleave', () => { if (tooltip) tooltip.classList.remove('visible'); });
			clone.addEventListener('mousemove', e => positionTooltip(spaceEl, e));
		});
		spaceEl.addEventListener('mouseleave', () => { if (tooltip) tooltip.classList.remove('visible'); });
	}

	function positionTooltip(spaceEl, mouseEvent) {
		const tooltip = document.getElementById('pxc-tooltip');
		if (!tooltip) return;
		const rect = spaceEl.getBoundingClientRect();
		const x = mouseEvent.clientX - rect.left;
		const y = mouseEvent.clientY - rect.top;
		let left = x + 14;
		let top = y + 14;
		const tRect = tooltip.getBoundingClientRect();
		if (left + tRect.width > rect.width) left = x - tRect.width - 14;
		if (top + tRect.height > rect.height) top = y - tRect.height - 14;
		tooltip.style.left = Math.max(0, left) + 'px';
		tooltip.style.top = Math.max(0, top) + 'px';
	}

	function bindTabs(containerEl, currentTierRef) {
		const tabs = containerEl.querySelectorAll('.pxc-tab');
		const galaxies = containerEl.querySelectorAll('.pxc-galaxy');
		tabs.forEach(tab => {
			tab.addEventListener('click', e => {
				e.preventDefault();
				tabs.forEach(t => t.classList.remove('active'));
				tab.classList.add('active');
				const tier = tab.getAttribute('data-tier');
				currentTierRef.value = tier;
				galaxies.forEach(g => g.classList.remove('active'));
				const active = containerEl.querySelector(`.pxc-galaxy[data-tier="${tier}"]`);
				if (active) {
					active.classList.add('active');
					bindStarEvents(containerEl.querySelector('.pxc-space'), currentTierRef);
					animateGalaxyEntrance(active);
				}
			});
		});
	}

	function initCounters(root) {
		const numbers = root.querySelectorAll('.pxc-metric-number[data-target]');
		if (numbers.length === 0) return;
		let started = false;
		const io = new IntersectionObserver((entries) => {
			if (started) return;
			if (entries.some(e => e.isIntersecting)) {
				started = true;
				numbers.forEach(el => {
					const target = parseInt(el.getAttribute('data-target') || '0', 10);
					let current = 0;
					const step = Math.max(1, Math.floor(target / 60));
					const timer = setInterval(() => {
						current += step;
						if (current >= target) { current = target; clearInterval(timer); }
						el.textContent = current + (target >= 100 ? '+' : '');
					}, 30);
				});
				io.disconnect();
			}
		}, { threshold: 0.2 });
		numbers.forEach(n => io.observe(n));
	}

	function ensureParticleKeyframes() {
		if (document.getElementById('pxc-particle-style')) return;
		const style = document.createElement('style');
		style.id = 'pxc-particle-style';
		style.textContent = `@keyframes pxcParticleFloat { 0%{ transform: translateY(0) translateX(0); opacity:.4;} 50%{ transform: translateY(-40vh) translateX(20px); opacity:.8;} 100%{ transform: translateY(-80vh) translateX(-10px); opacity:.2;} }`;
		document.head.appendChild(style);
	}

	function initParticles(spaceEl) {
		const layer = spaceEl.querySelector('.pxc-particles');
		if (!layer) return;
		ensureParticleKeyframes();
		const count = 45;
		for (let i = 0; i < count; i++) {
			const d = document.createElement('div');
			const size = 1 + Math.random() * 3;
			d.style.position = 'absolute';
			d.style.width = size + 'px';
			d.style.height = size + 'px';
			d.style.left = (Math.random() * 100) + '%';
			d.style.top = (Math.random() * 100) + '%';
			d.style.borderRadius = '50%';
			d.style.background = 'radial-gradient(circle, #FFD700, transparent)';
			d.style.animation = `pxcParticleFloat ${6 + Math.random() * 10}s linear infinite`;
			d.style.animationDelay = (Math.random() * 5) + 's';
			d.style.pointerEvents = 'none';
			layer.appendChild(d);
		}
	}

	function createShootingStar() {
		const star = document.createElement('div');
		const startX = Math.random() * window.innerWidth;
		const startY = Math.random() * window.innerHeight * 0.4;
		const endX = startX + (180 + Math.random() * 260);
		const endY = startY + (90 + Math.random() * 180);
		star.style.position = 'fixed';
		star.style.left = startX + 'px';
		star.style.top = startY + 'px';
		star.style.width = '2px';
		star.style.height = '2px';
		star.style.borderRadius = '50%';
		star.style.background = 'linear-gradient(45deg, #ffffff, #FFD700)';
		star.style.boxShadow = '0 0 6px #FFD700, 0 0 12px #FFD700, 0 0 18px #FFD700';
		star.style.pointerEvents = 'none';
		star.style.zIndex = '50';
		document.body.appendChild(star);
		star.animate([
			{ transform: 'translate(0,0) scale(0)', opacity: 0 },
			{ transform: `translate(${(endX - startX) * 0.3}px, ${(endY - startY) * 0.3}px) scale(1)`, opacity: 1 },
			{ transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`, opacity: 0 }
		], { duration: 1400, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }).addEventListener('finish', () => {
			if (star.parentNode) star.remove();
		});
	}

	function startShootingStars(sectionEl) {
		let intervalId = setInterval(() => {
			const rect = sectionEl.getBoundingClientRect();
			if (rect.top < window.innerHeight && rect.bottom > 0) {
				if (Math.random() < 0.35) createShootingStar();
			}
		}, 3000);
		// Optional: clear when not needed; keep simple for now
	}

	function initCTA(containerEl) {
		const btn = containerEl.querySelector('.pxc-cta-btn');
		if (!btn) return;
		btn.addEventListener('click', () => {
			for (let i = 0; i < 10; i++) {
				const sp = document.createElement('div');
				const rect = btn.getBoundingClientRect();
				sp.style.position = 'fixed';
				sp.style.left = (rect.left + Math.random() * rect.width) + 'px';
				sp.style.top = (rect.top + Math.random() * rect.height) + 'px';
				const s = 3 + Math.random() * 6;
				sp.style.width = s + 'px';
				sp.style.height = s + 'px';
				sp.style.borderRadius = '50%';
				sp.style.background = 'radial-gradient(circle, #FFD700, #FFA500)';
				sp.style.pointerEvents = 'none';
				sp.style.zIndex = '1000';
				document.body.appendChild(sp);
				const dx = (Math.random() - 0.5) * 120;
				const dy = (Math.random() - 0.5) * 120;
				sp.animate([
					{ transform: 'translate(0,0) scale(0)', opacity: 1 },
					{ transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 1 },
					{ transform: `translate(${dx * 1.2}px, ${dy * 1.2}px) scale(0)`, opacity: 0 }
				], { duration: 600 + Math.random() * 400, easing: 'ease-out' }).addEventListener('finish', () => sp.remove());
			}
		});
	}

	function showPxcScreen(section, target, currentTierRef) {
		const landing = section.querySelector('#pxc-landing');
		const current = section.querySelector('#pxc-current');
		const constellation = section.querySelector('#pxc-constellation');
		[landing, current, constellation].forEach(el => el && el.classList.remove('active'));
		switch (target) {
			case 'landing':
				if (landing) landing.classList.add('active');
				break;
			case 'current':
				if (current) current.classList.add('active');
				break;
			case 'constellation':
				if (constellation) {
					constellation.classList.add('active');
					const space = section.querySelector('.pxc-space');
					bindStarEvents(space, currentTierRef);
					animateGalaxyEntrance(section.querySelector('.pxc-galaxy.active') || section);
					initCounters(section);
					initParticles(space);
					startShootingStars(section);
				}
				break;
		}
	}

	function bindFlowButtons(section, currentTierRef) {
		const btnCurrent = section.querySelector('#pxc-show-current');
		const btnFuture = section.querySelector('#pxc-show-future');
		const btnToConst = section.querySelector('#pxc-to-constellation');

		if (btnCurrent) {
			const handler = (e) => { e.preventDefault(); e.stopPropagation(); showPxcScreen(section, 'current', currentTierRef); };
			btnCurrent.addEventListener('click', handler);
			btnCurrent.addEventListener('touchstart', handler, { passive: false });
		}
		if (btnFuture) {
			const handler = (e) => { e.preventDefault(); e.stopPropagation(); showPxcScreen(section, 'constellation', currentTierRef); };
			btnFuture.addEventListener('click', handler);
			btnFuture.addEventListener('touchstart', handler, { passive: false });
		}
		if (btnToConst) {
			const handler = (e) => { e.preventDefault(); e.stopPropagation(); showPxcScreen(section, 'constellation', currentTierRef); };
			btnToConst.addEventListener('click', handler);
			btnToConst.addEventListener('touchstart', handler, { passive: false });
		}
	}

	function bindCompareToggle(section, currentTierRef) {
		const toggle = document.getElementById('pxc-toggle');
		if (!toggle) return;
		toggle.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			const state = toggle.getAttribute('data-state') || 'current';
			const textEl = toggle.querySelector('.pxc-toggle-text');
			if (state === 'current') {
				showPxcScreen(section, 'constellation', currentTierRef);
				toggle.setAttribute('data-state', 'constellation');
				if (textEl) textEl.textContent = 'See Current Reality';
			} else {
				showPxcScreen(section, 'current', currentTierRef);
				toggle.setAttribute('data-state', 'current');
				if (textEl) textEl.textContent = 'See Future Potential';
			}
		});
	}

	function setup() {
		if (pxcInitialized) return;
		const section = document.getElementById('press-constellation');
		if (!section) return;
		pxcInitialized = true;
		const space = section.querySelector('.pxc-space');
		const currentTierRef = { value: 'silver' };
		bindTabs(section, currentTierRef);
		bindStarEvents(space, currentTierRef);
		animateGalaxyEntrance(section.querySelector('.pxc-galaxy.active') || section);
		initCounters(section);
		initParticles(space);
		initCTA(section);
		startShootingStars(section);
		bindFlowButtons(section, currentTierRef);
		bindCompareToggle(section, currentTierRef);
	}

	document.addEventListener('DOMContentLoaded', setup);
	// Fallback if DOMContentLoaded has already fired
	if (document.readyState !== 'loading') {
		setTimeout(setup, 0);
	}
})();

// =======================
// Mobile Testimonials Carousel
// =======================
let currentSlide = 0;
let totalSlides = 10;
let autoAdvanceInterval;

function initMobileTestimonialsCarousel() {
    if (window.innerWidth <= 768) {
        setupCarousel();
        startAutoAdvance();
        setupTouchSupport();
    }
}

function setupCarousel() {
    updateCarouselDisplay();
    updateDots();
}

function nextCarouselSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarouselDisplay();
    updateDots();
    resetAutoAdvance();
}

function prevCarouselSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarouselDisplay();
    updateDots();
    resetAutoAdvance();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarouselDisplay();
    updateDots();
    resetAutoAdvance();
}

function updateCarouselDisplay() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    
    if (track && slides.length > 0) {
        // Update track position
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update active slide states
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dots .dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function startAutoAdvance() {
    autoAdvanceInterval = setInterval(() => {
        nextCarouselSlide();
    }, 5000); // Change slide every 5 seconds
}

function resetAutoAdvance() {
    if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        startAutoAdvance();
    }
}

function setupTouchSupport() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        carouselContainer.style.transition = 'none';
    });
    
    carouselContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    });
    
    carouselContainer.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextCarouselSlide();
            } else {
                prevCarouselSlide();
            }
        }
        
        isDragging = false;
        carouselContainer.style.transition = '';
    });
    
    // Mouse drag support for desktop testing
    carouselContainer.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        carouselContainer.style.transition = 'none';
        carouselContainer.style.cursor = 'grabbing';
    });
    
    carouselContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        currentX = e.clientX;
        const diff = startX - currentX;
        
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    });
    
    carouselContainer.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextCarouselSlide();
            } else {
                prevCarouselSlide();
            }
        }
        
        isDragging = false;
        carouselContainer.style.transition = '';
        carouselContainer.style.cursor = 'grab';
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            carouselContainer.style.transition = '';
            carouselContainer.style.cursor = 'grab';
        }
    });
}

// Pause auto-advance when user interacts
function pauseAutoAdvance() {
    if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
    }
}

function resumeAutoAdvance() {
    startAutoAdvance();
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (window.innerWidth <= 768) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevCarouselSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextCarouselSlide();
        }
    }
});

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileTestimonialsCarousel();
});

// Reinitialize on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        initMobileTestimonialsCarousel();
    } else {
        // Clean up on desktop
        if (autoAdvanceInterval) {
            clearInterval(autoAdvanceInterval);
        }
    }
});

// Pause auto-advance when page is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseAutoAdvance();
    } else {
        resumeAutoAdvance();
    }
});

// =======================
// Press Constellation (pxc)
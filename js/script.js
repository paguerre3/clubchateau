// ===== MODERN JAVASCRIPT FOR CLUB SOCIAL CHATEAU CARRERAS =====

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const backToTop = document.getElementById('backToTop');
const loadingScreen = document.getElementById('loading-screen');
const contactForm = document.getElementById('contactForm');

// ===== LOADING SCREEN =====
class LoadingManager {
    constructor() {
        this.init();
    }

    init() {
        // Simulate loading time
        setTimeout(() => {
            this.hideLoading();
        }, 2500);
    }

    hideLoading() {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Initialize animations after loading
        setTimeout(() => {
            this.initPageAnimations();
        }, 500);
    }

    initPageAnimations() {
        // Initialize AOS
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// ===== ADVANCED IMAGE MANAGEMENT =====
class ImageManager {
    constructor() {
        this.images = [];
        this.lazyLoadObserver = null;
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.optimizeImageSizes();
        this.createImageGallery();
        this.setupImageHover();
        this.setupImageModal();
        this.startGalleryRotation();
    }

    setupLazyLoading() {
        // Intersection Observer for lazy loading
        this.lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.lazyLoadObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe all images
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.lazyLoadObserver.observe(img);
        });
    }

    loadImage(img) {
        img.src = img.dataset.src;
        img.classList.add('fade-in');
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    }

    optimizeImageSizes() {
        // Ensure all images have proper aspect ratios and sizing
        const galleryImages = document.querySelectorAll('.gallery-item img');
        const installationImages = document.querySelectorAll('.installation-card img');
        const activityImages = document.querySelectorAll('.activity-item img');

        // Gallery Images - Perfect squares
        galleryImages.forEach(img => {
            img.style.aspectRatio = '1 / 1';
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
        });

        // Installation Images - 16:9 aspect ratio
        installationImages.forEach(img => {
            img.style.aspectRatio = '16 / 9';
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
        });

        // Activity Images - 4:3 aspect ratio
        activityImages.forEach(img => {
            img.style.aspectRatio = '4 / 3';
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
        });

        // Hero slider images - maintain full viewport
        const heroSlides = document.querySelectorAll('.slide');
        heroSlides.forEach(slide => {
            slide.style.backgroundSize = 'cover';
            slide.style.backgroundPosition = 'center center';
        });
    }

    createImageGallery() {
        // Advanced masonry layout for gallery
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
            this.createMasonryLayout(galleryGrid);
        }
    }

    createMasonryLayout(container) {
        // Create responsive masonry layout
        const items = Array.from(container.children);
        
        // Responsive column count
        const updateLayout = () => {
            const containerWidth = container.offsetWidth;
            let columns = 1;
            
            if (containerWidth > 768) columns = 2;
            if (containerWidth > 1024) columns = 3;
            if (containerWidth > 1200) columns = 4;
            
            container.style.columnCount = columns;
            container.style.columnGap = '2rem';
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);
    }

    setupImageHover() {
        // Advanced hover effects for all images
        const imageContainers = document.querySelectorAll('.gallery-item, .installation-card, .activity-item');
        
        imageContainers.forEach(container => {
            const img = container.querySelector('img');
            if (!img) return;

            container.addEventListener('mouseenter', () => {
                this.animateImageHover(img, true);
            });

            container.addEventListener('mouseleave', () => {
                this.animateImageHover(img, false);
            });
        });
    }

    animateImageHover(img, isHover) {
        const scale = isHover ? 1.1 : 1;
        const brightness = isHover ? 1.2 : 1;
        
        img.style.transition = 'transform 0.6s ease, filter 0.3s ease';
        img.style.transform = `scale(${scale})`;
        img.style.filter = `brightness(${brightness})`;
    }

    setupImageModal() {
        // Create modal for image viewing
        this.createImageModal();
        
        const galleryItems = document.querySelectorAll('.gallery-item');
        this.galleryImages = Array.from(galleryItems).map(item => {
            const img = item.querySelector('img');
            return {
                src: img.src,
                alt: img.alt
            };
        });
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                const img = item.querySelector('img');
                this.currentImageIndex = index;
                this.openImageModal(img.src, img.alt);
            });
        });
    }

    createImageModal() {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <img class="modal-image" src="" alt="">
                    <div class="modal-navigation">
                        <button class="modal-prev">&#8249;</button>
                        <button class="modal-next">&#8250;</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal events
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeImageModal();
        });
        
        modal.querySelector('.modal-backdrop').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeImageModal();
            }
        });
        
        // Navigation buttons
        modal.querySelector('.modal-prev').addEventListener('click', () => {
            this.navigateModal(-1);
        });
        
        modal.querySelector('.modal-next').addEventListener('click', () => {
            this.navigateModal(1);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('active')) {
                if (e.key === 'Escape') this.closeImageModal();
                if (e.key === 'ArrowLeft') this.navigateModal(-1);
                if (e.key === 'ArrowRight') this.navigateModal(1);
            }
        });
    }

    openImageModal(src, alt) {
        const modal = document.querySelector('.image-modal');
        const modalImg = modal.querySelector('.modal-image');
        
        modalImg.src = src;
        modalImg.alt = alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeImageModal() {
        const modal = document.querySelector('.image-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    navigateModal(direction) {
        if (!this.galleryImages || this.galleryImages.length === 0) return;
        
        this.currentImageIndex += direction;
        
        if (this.currentImageIndex < 0) {
            this.currentImageIndex = this.galleryImages.length - 1;
        } else if (this.currentImageIndex >= this.galleryImages.length) {
            this.currentImageIndex = 0;
        }
        
        const currentImage = this.galleryImages[this.currentImageIndex];
        const modal = document.querySelector('.image-modal');
        const modalImg = modal.querySelector('.modal-image');
        
        modalImg.src = currentImage.src;
        modalImg.alt = currentImage.alt;
    }

    startGalleryRotation() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length === 0) return;

        let currentRotationIndex = 0;
        
        // Inicializar todas las imágenes sin rotación
        galleryItems.forEach(item => {
            item.style.transform = 'rotate(0deg)';
            item.style.transition = 'transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
        });

        const rotateGallery = () => {
            galleryItems.forEach((item, index) => {
                // Resetear todas las rotaciones
                item.style.transform = 'rotate(0deg) scale(1)';
                item.style.zIndex = '1';
                item.style.filter = 'brightness(1)';
            });

            // Aplicar efecto especial a la imagen actual
            const currentItem = galleryItems[currentRotationIndex];
            const rotations = [-8, -4, 0, 4, 8, 12, -12];
            const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
            
            currentItem.style.transform = `rotate(${randomRotation}deg) scale(1.05)`;
            currentItem.style.zIndex = '10';
            currentItem.style.filter = 'brightness(1.1) saturate(1.1)';
            
            // Efecto de rebote suave
            setTimeout(() => {
                currentItem.style.transform = `rotate(${randomRotation * 0.3}deg) scale(1.02)`;
            }, 400);
            
            setTimeout(() => {
                currentItem.style.transform = 'rotate(0deg) scale(1)';
                currentItem.style.filter = 'brightness(1)';
            }, 800);

            currentRotationIndex = (currentRotationIndex + 1) % galleryItems.length;
        };

        // Iniciar la rotación después de 3 segundos y repetir cada 4 segundos
        setTimeout(() => {
            rotateGallery();
            setInterval(rotateGallery, 4000);
        }, 3000);
    }
}

// ===== HERO SLIDER =====
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.init();
    }

    init() {
        if (this.slides.length > 1) {
            this.startAutoSlide();
            this.setupNavigationDots();
        }
    }

    startAutoSlide() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    nextSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
        this.updateDots();
    }

    goToSlide(index) {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
        this.updateDots();
    }

    setupNavigationDots() {
        const hero = document.querySelector('.hero');
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        hero.appendChild(dotsContainer);
    }

    updateDots() {
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
}

// ===== NAVIGATION =====
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollDetection();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveSection();
    }

    setupScrollDetection() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class
            navbar.classList.toggle('scrolled', currentScrollY > 100);
            
            // Show/hide navbar based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            // Back to top button
            backToTop.classList.toggle('show', currentScrollY > 300);
            
            lastScrollY = currentScrollY;
        });
    }

    setupMobileMenu() {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let currentSection = '';
            const scrollPosition = window.scrollY + 150;
            
            sections.forEach(section => {
                if (scrollPosition >= section.offsetTop) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// ===== ACTIVITY TABS =====
class ActivityTabs {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.init();
    }

    init() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchTab(button.dataset.target);
            });
        });
    }

    switchTab(targetId) {
        // Remove active classes
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active classes
        document.querySelector(`[data-target="${targetId}"]`).classList.add('active');
        document.getElementById(targetId).classList.add('active');
        
        // Trigger animation
        const activeContent = document.getElementById(targetId);
        activeContent.style.animation = 'fadeIn 0.5s ease-in-out';
    }
}

// ===== STATISTICS COUNTER =====
class StatCounter {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ===== VIDEO MANAGER =====
class VideoManager {
    constructor() {
        this.video = document.getElementById('clubVideo');
        this.init();
    }

    init() {
        if (this.video) {
            this.setupVideoControls();
        }
    }

    setupVideoControls() {
        // Handle video loading states
        this.video.addEventListener('loadstart', () => {
            console.log('Video loading...');
        });

        this.video.addEventListener('canplay', () => {
            console.log('Video ready to play');
        });

        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            this.handleVideoError();
        });

        // Mobile-specific video handling
        if (this.isMobileDevice()) {
            this.setupMobileVideoFeatures();
            // Chrome mobile specific fixes
            setTimeout(() => {
                this.forceChromeVideoDisplay();
            }, 1000);
        }

        // Optional: Add click to play/pause
        this.video.addEventListener('click', () => {
            if (this.video.paused) {
                this.video.play().catch(e => {
                    console.log('Video play failed:', e);
                    this.handleVideoError();
                });
            } else {
                this.video.pause();
            }
        });
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    setupMobileVideoFeatures() {
        // Set mobile-friendly attributes
        this.video.setAttribute('playsinline', 'true');
        this.video.setAttribute('webkit-playsinline', 'true');
        this.video.setAttribute('controls', 'true');
        
        // Handle mobile video play issues
        this.video.addEventListener('loadeddata', () => {
            console.log('Video data loaded for mobile');
        });

        // Fallback for older mobile browsers
        if (this.video.readyState < 3) {
            this.video.load();
        }
    }

    forceChromeVideoDisplay() {
        if (!this.video) return;
        
        // Force bright display for Chrome mobile
        this.video.style.display = 'block';
        this.video.style.width = '100%';
        this.video.style.height = '250px';
        this.video.style.objectFit = 'cover';
        this.video.style.background = '#ffffff';
        this.video.style.opacity = '1';
        this.video.style.visibility = 'visible';
        this.video.style.filter = 'brightness(1.1) contrast(1.1)';
        
        // Force repaint
        this.video.style.transform = 'translateZ(0)';
        this.video.style.willChange = 'transform';
        
        // Try to load if not loaded
        if (this.video.readyState === 0) {
            this.video.load();
        }
    }

    handleVideoError() {
        console.log('Error loading video, trying alternative approach...');
        this.forceChromeVideoDisplay();
    }
}

// ===== MEMBERSHIP FORM MANAGER =====
class MembershipFormManager {
    constructor() {
        this.membershipForm = document.getElementById('membershipForm');
        this.init();
    }

    init() {
        if (this.membershipForm) {
            this.setupFormHandlers();
            this.setupValidation();
        }
    }

    setupFormHandlers() {
        this.membershipForm.addEventListener('submit', (e) => {
            this.handleMembershipSubmit(e);
        });

        // Enhanced form interactions
        this.setupFormAnimations();
    }

    setupFormAnimations() {
        const inputs = this.membershipForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.animateInputFocus(input);
            });

            input.addEventListener('blur', () => {
                this.animateInputBlur(input);
            });
        });
    }

    animateInputFocus(input) {
        const formGroup = input.closest('.form-group');
        formGroup.style.transform = 'scale(1.02)';
        formGroup.style.zIndex = '10';
    }

    animateInputBlur(input) {
        const formGroup = input.closest('.form-group');
        formGroup.style.transform = 'scale(1)';
        formGroup.style.zIndex = '1';
    }

    handleMembershipSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.membershipForm);
        const membershipData = Object.fromEntries(formData);
        
        // Show loading state
        this.showMembershipLoading();
        
        // Simulate form submission
        setTimeout(() => {
            this.showMembershipSuccess();
            this.membershipForm.reset();
        }, 2500);
    }

    showMembershipLoading() {
        const submitBtn = this.membershipForm.querySelector('.btn-membership');
        submitBtn.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <span>Procesando...</span>
        `;
        submitBtn.disabled = true;
        submitBtn.style.background = 'var(--gray-500)';
    }

    showMembershipSuccess() {
        const submitBtn = this.membershipForm.querySelector('.btn-membership');
        submitBtn.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>¡Solicitud Enviada!</span>
        `;
        submitBtn.style.background = '#10B981';
        
        // Show success message
        this.showSuccessModal();
        
        setTimeout(() => {
            submitBtn.innerHTML = `
                <i class="fas fa-crown"></i>
                <span>¡Quiero ser Socio!</span>
            `;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 4000);
    }

    showSuccessModal() {
        // Create success modal
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="success-backdrop">
                <div class="success-content">
                    <div class="success-icon">
                        <i class="fas fa-crown"></i>
                    </div>
                    <h3>¡Bienvenido a la Familia!</h3>
                    <p>Tu solicitud de membresía ha sido enviada correctamente. En breve nos contactaremos contigo para completar el proceso.</p>
                    <button class="btn btn-primary success-close">Continuar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        modal.querySelector('.success-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.success-backdrop').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.remove();
            }
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 5000);
    }

    setupValidation() {
        const inputs = this.membershipForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateMembershipField(input);
            });

            input.addEventListener('input', () => {
                this.clearMembershipValidation(input);
            });
        });
    }

    validateMembershipField(field) {
        const value = field.value.trim();
        let isValid = true;

        if (field.required && !value) {
            isValid = false;
        } else if (field.type === 'email' && !this.isValidEmail(value)) {
            isValid = false;
        } else if (field.type === 'tel' && !this.isValidPhone(value)) {
            isValid = false;
        }

        field.classList.toggle('invalid', !isValid);
        field.classList.toggle('valid', isValid);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    clearMembershipValidation(field) {
        field.classList.remove('invalid', 'valid');
    }
}

// ===== CONTACT FORM =====
class ContactFormManager {
    constructor() {
        this.init();
    }

    init() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleSubmit(e);
            });

            // Real-time validation
            this.setupValidation();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        this.showLoadingState();
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage();
            contactForm.reset();
        }, 2000);
    }

    setupValidation() {
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearValidation(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        if (field.required && !value) {
            isValid = false;
        } else if (field.type === 'email' && !this.isValidEmail(value)) {
            isValid = false;
        }

        field.classList.toggle('invalid', !isValid);
        field.classList.toggle('valid', isValid);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    clearValidation(field) {
        field.classList.remove('invalid', 'valid');
    }

    showLoadingState() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
    }

    showSuccessMessage() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje Enviado!';
        submitBtn.style.background = '#10B981';
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.preloadCriticalImages();
        this.optimizeAnimations();
        this.setupIntersectionObserver();
    }

    preloadCriticalImages() {
        const criticalImages = [
            'assets/images/logo-escudo.png',
            'assets/images/logo-circular.png',
            'assets/images/plaza-noche-mejorada.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    optimizeAnimations() {
        // Reduce animations for users who prefer reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0s');
            document.documentElement.style.setProperty('--transition-base', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
        }
    }

    setupIntersectionObserver() {
        // Generic intersection observer for animations
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = entry.target.dataset.animate;
                    entry.target.classList.add(animation);
                }
            });
        });

        animatedElements.forEach(el => observer.observe(el));
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIALabels();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key handling
            if (e.key === 'Escape') {
                this.closeAllModals();
            }

            // Tab navigation for mobile menu
            if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                this.trapFocus(e, navMenu);
            }
        });
    }

    setupFocusManagement() {
        // Focus visible for keyboard users
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupARIALabels() {
        // Add ARIA labels to interactive elements
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });
    }

    closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new LoadingManager();
    new ImageManager();
    new HeroSlider();
    new NavigationManager();
    new ActivityTabs();
    new StatCounter();
    new VideoManager();
    new MembershipFormManager();
    new ContactFormManager();
    new PerformanceOptimizer();
    new AccessibilityManager();

    // Back to top functionality
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Add loading class to body for initial animations
    document.body.classList.add('loaded');
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here for PWA functionality
        console.log('Ready for service worker registration');
    });
}
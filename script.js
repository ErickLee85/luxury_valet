document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('load', function() {
        // Initialize GSAP
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        // Hero section animations
        gsap.from("#hero p", {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        });

        gsap.from("#hero .subtext", {
            y: 50,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: "power4.out"
        });

        gsap.from("#hero .cta-button", {
            y: 30,
            duration: 1,
            delay: 0.6,
            ease: "power4.out"
        });
    

        // Cars section animations
        gsap.from(".cars-intro h2", {
            scrollTrigger: {
                trigger: ".cars-intro",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        });

        gsap.from(".cars-intro .subtext", {
            scrollTrigger: {
                trigger: ".cars-intro",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: "power4.out"
        });

        // Card animations
        gsap.from(".card", {
            scrollTrigger: {
                trigger: ".car-show",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            x: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out"
        });

        // Pricing cards animations
        gsap.from(".pricing-card", {
            scrollTrigger: {
                trigger: ".holder",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power4.out"
        });

        // Extra services animations
        gsap.from(".service-category", {
            scrollTrigger: {
                trigger: ".extra-services-section",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power4.out"
        });

        // Service items stagger animation
        gsap.from(".service-item", {
            scrollTrigger: {
                trigger: ".services-grid",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            x: -50,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out"
        });

        // Promo section animations
        gsap.from(".promo-tag", {
            scrollTrigger: {
                trigger: ".promo-section",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            scale: 0.5,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        });

        gsap.from(".promo-section h2, .promo-text", {
            scrollTrigger: {
                trigger: ".promo-section",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power4.out"
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: target,
                            offsetY: 70
                        },
                        ease: "power4.inOut"
                    });
                }
            });
        });

        // Services toggle function
        function toggleServices(serviceType, event) {
            // Get current active content
            const currentActive = document.querySelector('.service-content.active');
            const nextContent = document.getElementById(serviceType + '-prices');
            
            if (currentActive === nextContent) return;
        
            // Update button styles first
            document.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.currentTarget.classList.add('active');
            
            // Handle content transition
            if (currentActive) {
                currentActive.classList.add('exit');
                currentActive.classList.remove('active');
            }
            
            // Small delay to allow exit animation to start
            setTimeout(() => {
                nextContent.classList.add('active');
                
                // Remove exit class after transition completes
                setTimeout(() => {
                    currentActive?.classList.remove('exit');
                }, 500);
            }, 50);
        }

        // Make toggleServices available globally
        window.toggleServices = toggleServices;
    });
});
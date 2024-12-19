document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('load', function() {
        const exteriorContent = document.querySelector('.service-content-exterior');
        exteriorContent.classList.add('active');
     
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        // Hero section animations
        // gsap.from("#hero p", {
        //     y: 100,
        //     opacity: 0,
        //     duration: 1,
        //     ease: "power4.out"
        // });

        // gsap.from("#hero .subtext", {
        //     y: 50,
        //     opacity: 0,
        //     duration: 1,
        //     delay: 0.3,
        //     ease: "power4.out"
        // });

        // gsap.from("#hero .cta-button", {
        //     y: 30,
        //     duration: 1,
        //     delay: 0.6,
        //     ease: "power4.out"
        // });
    

        // // Cars section animations
        // gsap.from(".cars-intro h2", {
        //     scrollTrigger: {
        //         trigger: ".cars-intro",
        //         start: "top 80%",
        //         toggleActions: "play none none reverse"
        //     },
        //     y: 100,
        //     opacity: 0,
        //     duration: 1,
        //     ease: "power4.out"
        // });

        // gsap.from(".cars-intro .subtext", {
        //     scrollTrigger: {
        //         trigger: ".cars-intro",
        //         start: "top 80%",
        //         toggleActions: "play none none reverse"
        //     },
        //     y: 50,
        //     opacity: 0,
        //     duration: 1,
        //     delay: 0.3,
        //     ease: "power4.out"
        // });

        // // Card animations
        // gsap.from(".card", {
        //     scrollTrigger: {
        //         trigger: ".car-show",
        //         start: "top 80%",
        //         toggleActions: "play none none reverse"
        //     },
        //     x: 100,
        //     opacity: 0,
        //     duration: 1,
        //     stagger: 0.2,
        //     ease: "power4.out"
        // });

        // // Pricing cards animations
        // // gsap.from(".pricing-card", {
        // //     scrollTrigger: {
        // //         trigger: ".holder",
        // //         start: "top 80%",
        // //         toggleActions: "play none none reverse"
        // //     },
        // //     x: 100,
        // //     opacity: 0,
        // //     duration: 0.8,
        // //     stagger: 0.2,
        // //     ease: "power4.out"
        // // });

        // // Extra services animations
        // gsap.from(".service-category", {
        //     scrollTrigger: {
        //         trigger: ".extra-services-section",
        //         start: "top 80%",
        //         toggleActions: "play none none reverse"
        //     },
        //     y: 50,
        //     opacity: 0,
        //     duration: 0.8,
        //     stagger: 0.2,
        //     ease: "power4.out"
        // });

        // // Service items stagger animation
        // gsap.from(".service-item", {
        //     scrollTrigger: {
        //         trigger: ".services-grid",
        //         start: "top 80%",
        //         toggleActions: "play none none reverse"
        //     },
        //     x: -50,
        //     opacity: 0,
        //     duration: 0.5,
        //     stagger: 0.05,
        //     ease: "power2.out"
        // });

        // // Promo section animations
        // gsap.from(".promo-tag", {
        //     scrollTrigger: {
        //         trigger: ".promo-section",
        //         start: "top 80%",
        //         toggleActions: "play none none reverse"
        //     },
        //     scale: 0.5,
        //     opacity: 0,
        //     duration: 0.8,
        //     ease: "back.out(1.7)"
        // });

        // gsap.from(".promo-section h2, .promo-text", {
        //     scrollTrigger: {
        //         trigger: ".promo-section",
        //         start: "top 80%",
        //         toggleActions: "play none none reverse"
        //     },
        //     y: 50,
        //     opacity: 0,
        //     duration: 0.8,
        //     stagger: 0.2,
        //     ease: "power4.out"
        // });

        const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].style.opacity = '0';
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].style.opacity = '1';
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);

        const faqItems = document.querySelectorAll('.faq-item');
    
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // If the clicked item wasn't active, open it
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });

        // Services toggle function
        function toggleServices(serviceType, event) {
            // Update button styles
            const buttons = document.querySelectorAll('.toggle-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.currentTarget.classList.add('active');
        
            // Get content elements
            const exteriorContent = document.querySelector('.service-content-exterior');
            const interiorContent = document.querySelector('.service-content-interior');
        
            // Toggle content visibility based on service type
            if (serviceType === 'exterior') {
                exteriorContent.classList.add('active');
                interiorContent.classList.remove('active');
            } else {
                interiorContent.classList.add('active');
                exteriorContent.classList.remove('active');
            }
        }

        // Make toggleServices available globally
        window.toggleServices = toggleServices;
    });
});
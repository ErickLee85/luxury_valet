document.addEventListener('DOMContentLoaded', function() {

    // Import GSAP from CDN first
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    document.head.appendChild(script);

    // Import ScrollTrigger
    const scrollTriggerScript = document.createElement('script');
    scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
    document.head.appendChild(scrollTriggerScript);

    // Wait for GSAP and ScrollTrigger to load
    scrollTriggerScript.onload = () => {
        gsap.registerPlugin(ScrollTrigger);
        initAnimations();
    };

    function initAnimations() {
        // Hero section animations
        const heroTimeline = gsap.timeline({
            defaults: { duration: 1, ease: "power2.out" }
        });

        const promoTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".promo-section",
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });

        promoTimeline
            .from(".promo-tag", { y: 30, opacity: 0, duration: 0.7 })
            .from(".promo-section h2", { y: 30, opacity: 0, duration: 0.7 }, "-=0.5")
            .from(".promo-section .service-items", { y: 30, opacity: 0, duration: 0.7 }, "-=0.3")
            .from(".promo-section .shiny-cta", { y: 30, opacity: 0, duration: 0.7 }, "-=0.3");

        heroTimeline
            .from(".hero-slides", { opacity: 0, scale: 1.3, duration: 1.5 })
            .from(".highlight", { y: 30, opacity: 0, duration: 0.7 }, "-=1")
            .from("h1.subtext", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
            .from(".shiny-cta", { y: 20, opacity: 0, duration: 0.7 }, "-=0.3")
            .from(".availability", { y: 20, opacity: 0, duration: 0.7 }, "-=0.3");

        // Cars section animations
        gsap.from(".cars-intro h2", {
            scrollTrigger: {
                trigger: ".cars-intro",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1
        });

        gsap.from(".cars-intro .subtext", {
            scrollTrigger: {
                trigger: ".cars-intro",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.3
        });

        // Card animations with stagger effect
        const cardsTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".car-show",
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        cardsTimeline.from(".card", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: {
                amount: 0.6, // Total amount of time to stagger over
                ease: "power2.out"
            }
        });

        // Pricing section animations (only for list items)
        document.querySelectorAll('.pricing-card .features li').forEach((li, i) => {
            gsap.from(li, {
                scrollTrigger: {
                    trigger: li,
                    start: "top 200%",
                    toggleActions: "play none none reverse"
                },
                x: -20,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.1
            });
        });

        // Service items animation with mobile optimization
        gsap.utils.toArray(".service-item").forEach((item, i) => {
            let animation = gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%", // Adjusted trigger point
                    end: "bottom 70%", // Added end point
                    toggleActions: "play none none none", // Modified toggle actions
                    markers: false,
                    onEnter: () => {
                        // Ensure the animation plays smoothly on mobile
                        gsap.to(item, {
                            opacity: 1,
                            x: 0,
                            duration: 0.5,
                            ease: "power2.out",
                            overwrite: true
                        });
                    }
                },
                opacity: 0,
                x: -30,
                duration: 0.5,
                ease: "power2.out",
                paused: true // Start paused to prevent initial flash
            });

            // Add hover animation for service items
            item.addEventListener("mouseenter", () => {
                gsap.to(item, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
                // Animate the price line on hover
                gsap.to(item.querySelector('.service-price-line'), {
                    scaleX: 1.1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            item.addEventListener("mouseleave", () => {
                gsap.to(item, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                // Reset the price line animation
                gsap.to(item.querySelector('.service-price-line'), {
                    scaleX: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // FAQ cards animation
        gsap.utils.toArray(".faq-card").forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.15
            });
        });

        // Contact section animations
        const contactTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".contact-section",
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });

        contactTimeline
            .from(".contact-info", { x: -50, opacity: 0, duration: 1 })
            .from(".contact-form", { x: 50, opacity: 0, duration: 1 }, "-=0.8")
            .from(".form-group", {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1
            }, "-=0.5");

        // Mobile-specific animations
        if (window.innerWidth <= 768) {
            // Optimize animations for mobile with stagger
            const mobileCardsTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: ".car-show-mobile",
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            });

            mobileCardsTimeline.from(".card-mobile", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: {
                    amount: 0.6,
                    ease: "power2.out"
                },
                ease: "power2.out"
            });

            // Optimize service items for mobile
            ScrollTrigger.batch(".service-item", {
                start: "top 90%",
                end: "bottom 70%",
                onEnter: batch => {
                    gsap.to(batch, {
                        opacity: 1,
                        x: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "power2.out",
                        overwrite: true
                    });
                }
            });
        }
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Refresh ScrollTrigger on resize
            ScrollTrigger.refresh();
        }, 250);
    });

    var form = document.getElementById("contactForm");
    var status = document.getElementById("my-form-status");

    async function handleSubmit(event) {
        event.preventDefault();
        let isValid = true;
        const submitButton = form.querySelector('.submit-btn');
        const loader = submitButton.querySelector('.loader');

        // Start loading state
        submitButton.disabled = true;
        loader.style.display = 'inline-block';

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                status.innerHTML = "Thanks! Your message has been sent.";
                status.style.color = "lime";
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form";
                }
                status.style.color = "red";
            }
        } catch (error) {
            status.innerHTML = "Oops! There was a problem submitting your form";
            status.style.color = "red";
            console.log(error.message)
        } finally {
            submitButton.disabled = false;
            loader.style.display = 'none';
        }
    }

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }

    window.addEventListener('load', function() {
        const exteriorContent = document.querySelector('.service-content-exterior');
        exteriorContent.classList.add('active');

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
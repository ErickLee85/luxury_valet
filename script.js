document.addEventListener('DOMContentLoaded', function() {

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
                status.style.color = "green";
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
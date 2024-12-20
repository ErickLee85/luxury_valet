document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('load', function() {
        const exteriorContent = document.querySelector('.service-content-exterior');
        exteriorContent.classList.add('active');
     
        const form = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');

        // Regex patterns
                        const patterns = {
            email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
            phone: /^(?:\+?64|0)(?:2\d|3\d|4\d|6\d|7\d|8\d|9\d)(?:\d{3}){2}$/
        };

        // Show error message
        function showError(field, message) {
            const errorElement = document.getElementById(`${field}Error`);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            document.getElementById(field).classList.add('error');
        }

        // Hide error message
        function hideError(field) {
            const errorElement = document.getElementById(`${field}Error`);
            errorElement.style.display = 'none';
            document.getElementById(field).classList.remove('error');
        }

        // Validate form
        function validateForm(e) {
            e.preventDefault();
            let isValid = true;

            // Name validation
            const name = document.getElementById('name').value.trim();
            if (name === '') {
                showError('name', 'Please enter your name');
                isValid = false;
            } else {
                hideError('name');
            }

            // Email validation
            const email = document.getElementById('email').value.trim();
            if (!patterns.email.test(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            } else {
                hideError('email');
            }

            // Phone validation
            const phone = document.getElementById('phone').value.trim();
            if (!patterns.phone.test(phone)) {

                isValid = false;
            } else {
                hideError('phone');
            }

            // Message validation
            const message = document.getElementById('message').value.trim();
            if (message === '') {
                showError('message', 'Please enter your message');
                isValid = false;
            } else {
                hideError('message');
            }

            // If form is valid, show success message
            if (isValid) {
                form.reset();
                successMessage.style.display = 'block';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }
        }

        // Add form submit event listener
        form.addEventListener('submit', validateForm);

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    hideError(this.id);
                }
            });
        });
        
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
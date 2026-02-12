// ============================================
// REVIEWS - API Integration & Display Logic
// ============================================

// Base URL for the reviews API
// TODO: Update this to your production server URL
const REVIEWS_API_URL = 'https://dbb-node-server.vercel.app/reviews';

// Local cache of fetched reviews
let cachedReviews = [];


// ============================================
// Fetch approved reviews from the API
// ============================================
async function fetchReviews() {
    try {
        const response = await fetch(REVIEWS_API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.reviews)) {
            // Filter to only approved reviews and sort newest first
            cachedReviews = data.reviews
                .filter(r => r.reviewed === true)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            return cachedReviews;
        }

        return [];
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        return [];
    }
}


// ============================================
// Render approved reviews to the page
// ============================================
function renderReviews(reviews) {
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;

    if (!reviews || reviews.length === 0) {
        grid.innerHTML = '<div class="reviews-empty">No reviews yet. Be the first to leave one!</div>';
        return;
    }

    // Use centered single-column layout for 1-2 reviews, grid for 3+
    if (reviews.length <= 2) {
        grid.classList.add('reviews-few');
    } else {
        grid.classList.remove('reviews-few');
    }

    grid.innerHTML = reviews.map(review => {
        const initials = review.name.charAt(0).toUpperCase();
        const rating = review.rating || 5;
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        const formattedDate = formatDate(review.date);

        return `
            <div class="review-card">
                <div class="review-card-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${initials}</div>
                        <div>
                            <div class="reviewer-name">${escapeHTML(review.name)}</div>
                            <div class="review-date">${formattedDate}</div>
                        </div>
                    </div>
                    <div class="review-stars">${stars}</div>
                </div>
                <div class="review-service-tag">${escapeHTML(review.service)}</div>
                <p class="review-text">${escapeHTML(review.review)}</p>
            </div>
        `;
    }).join('');
}


// ============================================
// Star rating interaction
// ============================================
function initStarRating() {
    const starContainer = document.getElementById('starRatingInput');
    const ratingInput = document.getElementById('reviewRating');
    if (!starContainer || !ratingInput) return;

    const stars = starContainer.querySelectorAll('.star-input');
    let selectedRating = 0;

    stars.forEach(star => {
        // Hover effect
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('hovered', parseInt(s.dataset.value) <= val);
            });
        });

        // Click to select
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            ratingInput.value = selectedRating;
            stars.forEach(s => {
                s.classList.toggle('selected', parseInt(s.dataset.value) <= selectedRating);
            });
        });
    });

    // Remove hover when leaving the container
    starContainer.addEventListener('mouseleave', () => {
        stars.forEach(s => {
            s.classList.remove('hovered');
            s.classList.toggle('selected', parseInt(s.dataset.value) <= selectedRating);
        });
    });
}


// ============================================
// Character count for review text
// ============================================
function initCharCount() {
    const textarea = document.getElementById('reviewText');
    const charCount = document.getElementById('charCount');
    if (!textarea || !charCount) return;

    textarea.addEventListener('input', () => {
        charCount.textContent = textarea.value.length;
    });
}


// ============================================
// Review form submission (POST to API)
// ============================================
function initReviewForm() {
    const form = document.getElementById('reviewForm');
    const status = document.getElementById('review-form-status');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-review-btn');
        const name = document.getElementById('reviewName').value.trim();
        const service = document.getElementById('reviewService').value;
        const rating = parseInt(document.getElementById('reviewRating').value);
        const review = document.getElementById('reviewText').value.trim();

        // Validation
        if (!name || !service || !rating || !review) {
            status.textContent = 'Please fill out all fields and select a rating.';
            status.style.color = '#dc2626';
            return;
        }

        // Disable button while submitting
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        status.textContent = '';

        try {
            const response = await fetch(REVIEWS_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ name, service, rating, review })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                status.textContent = 'Thank you! Your review has been submitted and is awaiting approval.';
                status.style.color = 'lime';

                // Reset form
                form.reset();
                document.getElementById('charCount').textContent = '0';
                document.getElementById('reviewRating').value = '';
                document.querySelectorAll('.star-input').forEach(s => s.classList.remove('selected'));
            } else {
                status.textContent = data.message || 'Something went wrong. Please try again.';
                status.style.color = '#dc2626';
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            status.textContent = 'Network error. Please check your connection and try again.';
            status.style.color = '#dc2626';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Review';
        }
    });
}


// ============================================
// Utility functions
// ============================================
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}


// ============================================
// Initialize everything on DOM ready
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and render reviews from the API
    const reviews = await fetchReviews();
    renderReviews(reviews);

    // Init interactive elements
    initStarRating();
    initCharCount();
    initReviewForm();
});

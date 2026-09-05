// Modal functionality
const bookingModal = document.getElementById('bookingModal');
const ctaButton = document.querySelector('.cta-button');
const closeButton = document.querySelector('.close');
const bookButtons = document.querySelectorAll('.book-button');
const bookingForm = document.getElementById('bookingForm');
const contactForm = document.getElementById('contactForm');
const backToTopButton = document.getElementById('backToTop');
const reviewForm = document.getElementById('reviewForm');
const reviewsList = document.getElementById('reviewsList');

const displayReview = ({ name, rating, review }) => {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'testimonial-card';
    reviewCard.innerHTML = `
        <p class="quote"></p>
        <p class="author"></p>
    `;
    reviewCard.querySelector('.quote').textContent = `"${review}"`;
    reviewCard.querySelector('.author').textContent = `— ${name} ${'★'.repeat(Number(rating))}`;
    reviewsList.appendChild(reviewCard);
};

// Open modal when CTA or book buttons are clicked
ctaButton.addEventListener('click', () => {
    bookingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

bookButtons.forEach(button => {
    button.addEventListener('click', () => {
        bookingModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Close modal when close button is clicked
closeButton.addEventListener('click', () => {
    bookingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === bookingModal) {
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Handle booking form submission with Formspree
bookingForm.addEventListener('submit', (e) => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    if (!name || !email || !subject || !date || !time) {
        e.preventDefault();
        alert('Please fill out all required fields.');
        return;
    }
    
    // Show processing message
    const submitBtn = bookingForm.querySelector('.submit-button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Let Formspree handle the submission
    setTimeout(() => {
        alert(`Thank you, ${name}! 🎉\n\nYour booking request has been submitted!\n\nService: ${subject}\nDate: ${date}\nTime: ${time}\n\nWe'll confirm via email at ${email}\n\nYou can also reach us on WhatsApp: +12566912989`);
        
        // Reset form after submission
        bookingForm.reset();
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1000);
});

// Handle contact form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    if (!name || !email || !subject || !message) {
        alert('Please fill out all fields.');
        return;
    }
    
    // Show success message
    alert(`Thank you, ${name}! ✅\n\nWe received your message and will get back to you at ${email} within 24 hours.\n\nYou can also reach us on WhatsApp: +12566912989 for faster response!`);
    
    // Reset form
    contactForm.reset();
});

// Submit reviews to Formspree and display them immediately on this page
reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = reviewForm.querySelector('.submit-button');
    const formData = new FormData(reviewForm);
    const name = String(formData.get('name')).trim();
    const rating = formData.get('rating');
    const review = String(formData.get('review')).trim();

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        const response = await fetch(reviewForm.action, {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Review submission failed.');
        }

        displayReview({ name, rating, review });
        reviewForm.reset();
        alert('Thank you! Your review is now visible on the website.');
    } catch (error) {
        alert('We could not submit your review. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Review';
    }
});

// Smooth navigation to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Back to Top Button Functionality
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add intersection observer for fade-in animations on scroll
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

// Observe all cards and sections
document.querySelectorAll('.service-card, .tutor-card, .pricing-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Interactive rating hover effect
document.querySelectorAll('.rating').forEach(rating => {
    rating.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.3s ease';
    });
    rating.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Keyboard navigation for close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.style.display === 'block') {
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Add success feedback to form inputs on focus
document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
    field.addEventListener('change', function() {
        if (this.value) {
            this.style.borderColor = 'var(--accent-color)';
            this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        }
    });
});
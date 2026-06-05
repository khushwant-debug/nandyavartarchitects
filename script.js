// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// ------------------------------
// EmailJS Integration (Contact Form)
// ------------------------------
// Notes:
// - Keeps existing UI/markup/styling unchanged.
// - Uses the already-present form + field IDs.
// - Prevents page refresh and shows success/error messages.
// - Disables/enables submit button while sending.
// - Resets form on success.

// EmailJS constants (provided by the user)
const EMAILJS_PUBLIC_KEY = 'CW716D81gewxYSZrQ';
const EMAILJS_SERVICE_ID = 'service_wh01iwk';
const EMAILJS_TEMPLATE_ID = 'template_3dea9if';


window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Intersection Observer for Fade-up Animations
const fadeElements = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing once animated
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
    fadeObserver.observe(element);
});

// Founder (and any other) subtle fade-in sections
const fadeInElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
});

fadeInElements.forEach(el => fadeInObserver.observe(el));


// Simple Testimonial Slider
const slides = document.querySelectorAll('.testimonial-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    slides[currentSlide].classList.add('active');
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });
}

// Auto slide every 6 seconds
setInterval(() => {
    if(slides.length > 0) {
        showSlide(currentSlide + 1);
    }
}, 6000);

// WhatsApp click from contact section
// Makes clicking the phone number open WhatsApp (wa.me). Fallback stays as tel: navigation.
const contactPhoneEl = document.querySelector('.contact-phone');
if (contactPhoneEl) {
    contactPhoneEl.addEventListener('click', (e) => {
        const phone = contactPhoneEl.getAttribute('data-phone');
        if (!phone) return; // no number => let default behavior happen

        e.preventDefault();
        const waUrl = `https://wa.me/${phone}`;
        const win = window.open(waUrl, '_blank', 'noopener,noreferrer');

        // If popup blocked, fallback to tel:
        if (!win) {
            window.location.href = contactPhoneEl.getAttribute('href');
        }
    });
}

// ------------------------------------------------------------
// EmailJS Integration (Contact Form)
// ------------------------------------------------------------
// This uses EmailJS to send the contact form without reloading.
// It preserves the existing markup and styling.

(function initEmailJSContactForm() {
    // Only run on pages that actually contain the contact form.
    const formEl = document.querySelector('form.contact-form');
    if (!formEl) return;

    // Form fields (existing IDs)
    const nameEl = formEl.querySelector('#name');
    const emailEl = formEl.querySelector('#email');
    const inquiryTypeEl = formEl.querySelector('#inquiry-type');
    const messageEl = formEl.querySelector('#message');

    // Submit button
    const submitBtn = formEl.querySelector('button[type="submit"]');

    // Small helper to create/update a message element without affecting layout.
    // (Uses inline styles only for emailjs messages; does not touch existing CSS/layout.)
    function showInlineMessage(text, kind) {
        // Reuse an existing node if we already created one.
        let msgEl = formEl.querySelector('.emailjs-message');
        if (!msgEl) {
            msgEl = document.createElement('div');
            msgEl.className = 'emailjs-message';
            // Keep it unobtrusive and non-breaking for the current layout.
            msgEl.style.marginTop = '16px';
            msgEl.style.fontSize = '1rem';
            msgEl.style.color = kind === 'success' ? '#222222' : '#b00020';
            msgEl.style.fontWeight = '400';
            formEl.appendChild(msgEl);
        }

        msgEl.textContent = text;
    }

    function setSubmitDisabled(isDisabled) {
        if (!submitBtn) return;
        submitBtn.disabled = isDisabled;
        // Maintain visuals; just prevent interaction.
        if (isDisabled) {
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.style.opacity = '0.7';
        } else {
            submitBtn.style.cursor = '';
            submitBtn.style.opacity = '';
        }
    }

    // Wait until EmailJS script is available.
    function waitForEmailJS() {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const maxWaitMs = 8000;

            const tick = () => {
                // EmailJS global objects
                if (window.emailjs && typeof window.emailjs.init === 'function') {
                    resolve();
                    return;
                }

                if (Date.now() - start > maxWaitMs) {
                    reject(new Error('EmailJS failed to load.')); 
                    return;
                }

                setTimeout(tick, 200);
            };

            tick();
        });
    }

    // Initialize + wire up submit.
    waitForEmailJS()
        .then(() => {
            // EmailJS init using provided Public Key
            // (required before calling sendForm/send).
            window.emailjs.init(EMAILJS_PUBLIC_KEY);

            formEl.addEventListener('submit', async (e) => {
                // Prevent page refresh (requirement #6)
                e.preventDefault();

                // Clear any previous messages.
                const existingMsg = formEl.querySelector('.emailjs-message');
                if (existingMsg) existingMsg.remove();

                // Disable while sending (requirement #9)
                setSubmitDisabled(true);

                // Map template variables exactly as required.
                const templateParams = {
                    from_name: nameEl ? nameEl.value.trim() : '',
                    from_email: emailEl ? emailEl.value.trim() : '',
                    inquiry_type: inquiryTypeEl ? inquiryTypeEl.value : '',
                    message: messageEl ? messageEl.value.trim() : ''
                };

                try {
                    // Send via EmailJS using the provided IDs.
                    // We use send (template-based) so only template params are required.
                    await window.emailjs.send(
                        EMAILJS_SERVICE_ID,
                        EMAILJS_TEMPLATE_ID,
                        templateParams
                    );

                    // Success message (requirement #7)
                    showInlineMessage('Thank you! Your message has been sent successfully.', 'success');

                    // Reset form on success (requirement #11)
                    formEl.reset();
                } catch (err) {
                    // Error message (requirement #8)
                    showInlineMessage('Something went wrong. Please try again.', 'error');
                } finally {
                    // Re-enable submit after success/failure (requirement #10)
                    setSubmitDisabled(false);
                }
            });
        })
        .catch(() => {
            // If EmailJS doesn't load, show the required generic error message.
            // (No layout/CSS changes.)
            showInlineMessage('Something went wrong. Please try again.', 'error');
        });
})();



// ===================================
// Navigation — handled by js/nav.js
// ===================================

// ===================================
// Smooth Scroll for Anchor Links
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for internal anchor links
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// Intersection Observer for Animations
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add stagger animation for child elements
            const children = entry.target.querySelectorAll('.step, .feature, .testimonial-card');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe sections
const sections = document.querySelectorAll('.how-it-works, .features, .pricing, .testimonials');
sections.forEach(section => {
    observer.observe(section);
});

// ===================================
// Stats Counter Animation
// ===================================

const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16); // 60fps
    const isDecimal = target.toString().includes('.');
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            if (isDecimal) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current).toLocaleString() + '+';
            }
            requestAnimationFrame(updateCounter);
        } else {
            if (isDecimal) {
                element.textContent = target + '/5';
            } else {
                element.textContent = target.toLocaleString() + '+';
            }
        }
    };
    
    updateCounter();
};

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const text = stat.textContent;
                let target;
                
                if (text.includes('/')) {
                    target = parseFloat(text);
                } else {
                    target = parseInt(text.replace(/\D/g, ''));
                }
                
                setTimeout(() => {
                    animateCounter(stat, target);
                }, index * 200);
            });
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===================================
// Tutor Cards Animation
// ===================================

const tutorCards = document.querySelectorAll('.tutor-card');
tutorCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
});

// ===================================
// Form Validation (for future forms)
// ===================================

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// ===================================
// Loading State for Buttons
// ===================================

const addLoadingState = (button) => {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Loading...';
    button.style.opacity = '0.7';
    
    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        button.style.opacity = '1';
    }, 2000);
};

// Add click handlers to CTA buttons (placeholder functionality)
document.querySelectorAll('.btn-primary, .btn-hero-primary, .btn-cta-primary, .btn-pricing').forEach(button => {
    button.addEventListener('click', (e) => {
        // Prevent navigation for demo purposes
        // Remove this in production
        const href = button.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            addLoadingState(button);
        }
    });
});

// ===================================
// Parallax Effect for Background Orbs
// ===================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.1);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===================================
// Dynamic Year in Footer
// ===================================

const updateFooterYear = () => {
    const yearEl = document.querySelector('.footer-bottom p');
    if (yearEl) {
        yearEl.textContent = `© ${new Date().getFullYear()} LEARN. All rights reserved.`;
    }
};

updateFooterYear();

// ===================================
// iOS Video Autoplay Fix
// ===================================

const heroVideo = document.getElementById('heroVideo') || document.querySelector('.hero-media-wrap video');
if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('webkit-playsinline', '');

    const tryPlay = () => heroVideo.play().catch(() => {});
    tryPlay();

    // iOS requires a user gesture on first load — retry on any interaction
    ['touchstart', 'touchend', 'click', 'scroll'].forEach(evt => {
        document.addEventListener(evt, tryPlay, { once: true, passive: true });
    });

    // Also retry when it becomes visible (fixes scroll-to-play on iOS)
    if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) tryPlay();
        }, { threshold: 0.1 }).observe(heroVideo);
    }
}

// ===================================
// Lazy Loading Images (future enhancement)
// ===================================

const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

lazyLoadImages();

// ===================================
// Testimonial Carousel (future enhancement)
// ===================================

class TestimonialCarousel {
    constructor(container) {
        this.container = container;
        this.testimonials = container.querySelectorAll('.testimonial-card');
        this.currentIndex = 0;
        this.autoplayInterval = null;
    }
    
    init() {
        if (window.innerWidth <= 768) {
            this.setupCarousel();
            this.startAutoplay();
        }
    }
    
    setupCarousel() {
        // Hide all testimonials except the first
        this.testimonials.forEach((testimonial, index) => {
            if (index !== 0) {
                testimonial.style.display = 'none';
            }
        });
    }
    
    showTestimonial(index) {
        this.testimonials.forEach((testimonial, i) => {
            if (i === index) {
                testimonial.style.display = 'block';
                testimonial.style.animation = 'fadeInUp 0.5s ease';
            } else {
                testimonial.style.display = 'none';
            }
        });
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.showTestimonial(this.currentIndex);
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, 5000);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

// Initialize carousel on mobile
const testimonialsGrid = document.querySelector('.testimonials-grid');
if (testimonialsGrid) {
    const carousel = new TestimonialCarousel(testimonialsGrid);
    carousel.init();
    
    // Reinitialize on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            carousel.init();
        } else {
            carousel.stopAutoplay();
            // Show all testimonials on desktop
            document.querySelectorAll('.testimonial-card').forEach(card => {
                card.style.display = 'block';
            });
        }
    });
}

// ===================================
// Performance Optimization
// ===================================

// Debounce function for scroll events
const debounce = (func, wait = 10) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Apply debounce to scroll-heavy operations
window.addEventListener('scroll', debounce(() => {
    // Debounced scroll operations here
}, 10));

// ===================================
// Accessibility Enhancements
// ===================================

// Keyboard navigation for buttons
document.querySelectorAll('button, a').forEach(element => {
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            element.click();
        }
    });
});

// Focus trap for mobile menu
const trapFocus = (element) => {
    const focusableElements = element.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
        
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
};

if (navMenu) {
    trapFocus(navMenu);
}

// ===================================
// Console Welcome Message
// ===================================

console.log('%c Welcome to LEARN! ', 'background: #8c3cdc; color: #fff; padding: 8px 16px; font-size: 14px; font-weight: bold; border-radius: 4px;');
console.log('%c Master English with Expert C1 Tutors ', 'color: #8c3cdc; font-size: 12px;');
console.log('%c Powered by Brelinx ', 'background: #18181b; color: #fff; padding: 4px 10px; font-size: 11px; font-weight: bold; border-radius: 4px;');
console.log('%c Web Development & IT Solutions — brelinx.com ', 'color: #6b6b78; font-size: 11px;');

// ===================================
// Page Load Complete
// ===================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('Page fully loaded and ready!');
});

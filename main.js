document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SMOOTH REVEAL ON SCROLL (Intersection Observer)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, no need to observe anymore
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        revealObserver.observe(el);
    });

    // 2. NAVBAR SCROLL EFFECT
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. HORIZONTAL GALLERY AUTO-SCROLL & PARALLAX
    const gallery = document.getElementById('galleryContainer');
    const gallerySection = document.getElementById('gallery');
    
    // Auto-scroll functionality
    function startAutoScroll() {
        if (gallery) {
            gallery.classList.add('auto-scroll');
        }
    }
    
    function stopAutoScroll() {
        if (gallery) {
            gallery.classList.remove('auto-scroll');
        }
    }
    
    // Start auto-scroll when gallery is visible
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoScroll();
            } else {
                stopAutoScroll();
            }
        });
    }, { threshold: 0.3 });
    
    if (gallerySection) {
        galleryObserver.observe(gallerySection);
    }
    
    // Manual scroll on mouse move (parallax effect)
    window.addEventListener('scroll', () => {
        if (gallerySection && gallery) {
            const rect = gallerySection.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInView) {
                const scrollPercent = (window.scrollY - gallerySection.offsetTop) / gallerySection.offsetHeight;
                const move = scrollPercent * 15; // Slower parallax speed
                gallery.style.transform = `translateX(-${move}%)`;
            }
        }
    });

    // 4. CUSTOM CURSOR (Optional - for that extra FYN touch)
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 5. HERO SCROLL BUTTON
    document.getElementById('heroScroll').addEventListener('click', () => {
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });
});
// মেনু টোগল ফাংশন (Mobile Friendly)
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    // এখন বিদ্যমান .nav-links ব্যবহার করা হবে
    const navLinks = document.querySelector('.nav-links'); 
    const icon = hamburger ? hamburger.querySelector('i') : null;

    if (!hamburger || !navLinks || !icon) return; 

    hamburger.addEventListener('click', (event) => {
        event.stopPropagation(); // যাতে মেনু খোলার সময় অন্য কোনো ক্লিক ইভেন্ট ট্রিগার না হয়
        
        // navLinks এ 'open' ক্লাস টোগল করা হলো
        navLinks.classList.toggle('open');
        
        // হ্যামবার্গার আইকন পরিবর্তন
        if (navLinks.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times'); // বন্ধ করার আইকন
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars'); // হ্যামবার্গার আইকন
        }

        // মেনু খোলা/বন্ধ হলে স্ক্রল লক করা (CSS এ .menu-open এর জন্য overflow: hidden দিতে হবে)
        document.body.classList.toggle('menu-open', navLinks.classList.contains('open'));
    });
    
    // মেনুর লিঙ্কে ক্লিক করলে মেনু বন্ধ করা
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // যদি মেনু খোলা থাকে, তবে বন্ধ করে দাও
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // মেনু বাইরে ক্লিক করলে বন্ধ করা
    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !hamburger.contains(event.target) && navLinks.classList.contains('open')) {
             navLinks.classList.remove('open');
             icon.classList.remove('fa-times');
             icon.classList.add('fa-bars');
             document.body.classList.remove('menu-open');
        }
    });
}

// স্কল করার সময় এন্ট্রি অ্যানিমেশন (Intersection Observer)
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1 // 10% অংশ দেখা গেলেই অ্যানিমেট করবে
    });

    // অ্যানিমেশনযোগ্য এলিমেন্ট: .about-card, .service-card, .project-item, .contact-grid
    const animatedElements = document.querySelectorAll('.about-card, .service-card, .project-item, .contact-grid');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// নেভিগেশনে বর্তমান পেজ হাইলাইট করা
function highlightActiveLink() {
    const path = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.nav-links a'); // শুধু .nav-links এর লিঙ্কগুলো চেক করা হলো

    links.forEach(link => {
        // আগে থেকে active ক্লাস থাকলে তা সরিয়ে দিন
        link.classList.remove('active'); 
        
        const linkPath = link.getAttribute('href');
        
        if (linkPath === path) {
            link.classList.add('active');
        } else if (path === '' && linkPath === 'index.html') { 
            // Handle root path case
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // এই ফাংশনটি কল করা জরুরি
    setupMobileMenu(); 
    setupScrollAnimations();
    highlightActiveLink(); // পেজ লোড হওয়ার পর একবার কল করুন
    
    // Testimonial Slider Setup (যদি প্রয়োজন হয়)
    if (typeof setupTestimonialSlider === 'function') {
        setupTestimonialSlider();
    }
});

/* --- Testimonial Slider (script.js থেকে অবশিষ্ট কোড) --- */
function setupTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;

    const testimonialContainer = document.querySelector('.testimonial-container');
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevTestimonialBtn = document.querySelector('.prev-testimonial');
    const nextTestimonialBtn = document.querySelector('.next-testimonial');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (!testimonialContainer || testimonials.length === 0 || !prevTestimonialBtn || !nextTestimonialBtn || !dotsContainer) return;

    let currentTestimonialIndex = 0;
    let autoSlideInterval;

    // স্ক্রিনের আকারের উপর ভিত্তি করে কতোটা স্লাইড দেখা যাবে তা নির্ধারণ
    function getTestimonialsPerView() {
        if (window.innerWidth >= 1024) return 3; // লার্জ স্ক্রিন
        if (window.innerWidth >= 768) return 2; // মিডিয়াম স্ক্রিন
        return 1; // ছোট স্ক্রিন (মোবাইল)
    }

    // ডট তৈরি করা
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalSlides = testimonials.length - getTestimonialsPerView() + 1;
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (i === currentTestimonialIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentTestimonialIndex = i;
                updateTestimonialSlider();
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
    }

    // স্লাইডারের পজিশন আপডেট করা
    function updateTestimonialSlider() {
        const perView = getTestimonialsPerView();
        
        const cardPercentage = 100 / testimonials.length;
        const transformValue = -currentTestimonialIndex * cardPercentage;

        testimonialContainer.style.transform = `translateX(${transformValue}%)`;

        // ডট অ্যাক্টিভ করা
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTestimonialIndex);
        });
    }


    // পরবর্তী স্লাইড (লুপিং সহ)
    function nextTestimonial() {
        const totalTestimonials = testimonials.length;
        const maxIndex = totalTestimonials - getTestimonialsPerView();

        if (currentTestimonialIndex < maxIndex) {
            currentTestimonialIndex++;
        } else {
            currentTestimonialIndex = 0; // শেষ থেকে প্রথম
        }
        updateTestimonialSlider();
    }

    // প্রিভিয়াস স্লাইড (লুপিং সহ)
    function prevTestimonial() {
        const totalTestimonials = testimonials.length;
        const maxIndex = totalTestimonials - getTestimonialsPerView();

        if (currentTestimonialIndex > 0) {
            currentTestimonialIndex--;
        } else {
            currentTestimonialIndex = maxIndex; // প্রথম থেকে শেষ
        }
        updateTestimonialSlider();
    }

    // স্বয়ংক্রিয় স্লাইড চালু করা
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextTestimonial, 5000); // 5 সেকেন্ড পর পর স্লাইড হবে
    }

    // স্বয়ংক্রিয় স্লাইড রিসেট করা
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // ইভেন্ট লিসেনার
    prevTestimonialBtn.addEventListener('click', () => {
        prevTestimonial();
        resetAutoSlide();
    });

    nextTestimonialBtn.addEventListener('click', () => {
        nextTestimonial();
        resetAutoSlide();
    });

    // স্ক্রিনের আকার পরিবর্তন হলে স্লাইডার আপডেট করা
    window.addEventListener('resize', () => {
        // ডট এবং স্লাইডার পজিশন পুনরায় সেট করুন
        updateTestimonialSlider();
        createDots(); 
    });
    
    // শুরুতেই একবার কল করা
    updateTestimonialSlider();
    createDots();
    startAutoSlide();
}
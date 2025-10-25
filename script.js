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

// --- Testimonial Slider JavaScript ---
document.addEventListener('DOMContentLoaded', () => {
    const testimonialTrack = document.getElementById('testimonial-track');
    const prevTestimonialBtn = document.getElementById('prevTestimonial');
    const nextTestimonialBtn = document.getElementById('nextTestimonial');
    const testimonialDotsContainer = document.getElementById('testimonial-dots');
    
    // Testimonial Cards এবং তাদের সংখ্যা
    const testimonialCards = Array.from(testimonialTrack.children).filter(node => node.classList.contains('testimonial-card'));
    const totalTestimonials = testimonialCards.length;
    let currentTestimonialIndex = 0;
    let autoSlideInterval;

    // মিডিয়াম স্ক্রিনের উপরে একসাথে কতগুলো কার্ড দেখাবে (আপনার অনুরোধ অনুযায়ী 3টি)
    const getTestimonialsPerView = () => window.innerWidth >= 768 ? 3 : 1; 
    const numDots = totalTestimonials - getTestimonialsPerView() + 1; // ডট সংখ্যা

    // স্লাইডারের পজিশন আপডেট করা
    function updateTestimonialSlider() {
        // ডেসকটপে 33.33% সরাবে, মোবাইলে 100%
        const movePercentage = window.innerWidth >= 768 ? 100 / 3 : 100;
        const offset = -currentTestimonialIndex * movePercentage;
        testimonialTrack.style.transform = `translateX(${offset}%)`;
        updateTestimonialDots();
    }

    // নেভিগেশন ডট তৈরি করা
    function createTestimonialDots() {
        testimonialDotsContainer.innerHTML = ''; // পুরোনো ডট মুছে ফেলা
        const currentNumDots = totalTestimonials - getTestimonialsPerView() + 1; // ডট সংখ্যা গণনা
        for (let i = 0; i < currentNumDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-gray-300', 'hover:bg-[#4CAF50]', 'transition', 'duration-300', 'mx-1');
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', () => {
                currentTestimonialIndex = i;
                updateTestimonialSlider();
                resetAutoSlide();
            });
            testimonialDotsContainer.appendChild(dot);
        }
    }

    // ডট হাইলাইট আপডেট করা
    function updateTestimonialDots() {
        const dots = testimonialDotsContainer.querySelectorAll('button');
        dots.forEach((dot, index) => {
            dot.classList.remove('bg-white', 'scale-125'); // Active ক্লাস সরাচ্ছে
            dot.classList.add('bg-gray-300');
            if (index === currentTestimonialIndex) {
                dot.classList.remove('bg-gray-300');
                dot.classList.add('bg-white', 'scale-125'); // Active ক্লাস যুক্ত করছে
            }
        });
    }

    // নেক্সট স্লাইড (লুপিং সহ)
    function nextTestimonial() {
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
        // ডট এবং স্লাইডার পজিশন পুনরায় ঠিক করা
        createTestimonialDots();
        updateTestimonialSlider(); 
        resetAutoSlide();
    });

    // প্রাথমিক লোড
    createTestimonialDots();
    updateTestimonialSlider();
    startAutoSlide();
});

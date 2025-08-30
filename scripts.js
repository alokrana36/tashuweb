// ===== MAIN PAGE FUNCTIONALITY =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  
  // Additional attempt to ensure video plays
  setTimeout(() => {
    const video = document.querySelector('.bg-video');
    if (video && video.paused) {
      video.play().then(() => {
        console.log('🎵 Video playing after DOM load');
      }).catch(e => {
        console.log('Still waiting for user interaction');
      });
    }
  }, 500);
});

// Initialize all page functionality
function initializePage() {
  setupVideo();
  setupLoadingScreen();
  setupAnimations();
  setupMobileOptimizations();
  setupAccessibility();
  setupPerformanceOptimizations();
}

// ===== VIDEO HANDLING =====
function setupVideo() {
  const video = document.querySelector('.bg-video');
  if (!video) return;

  // Set initial video properties for autoplay (start muted to bypass restrictions)
  video.volume = 0.5;
  video.muted = true; // Start muted to allow autoplay
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;

  // Video loading handlers
  video.addEventListener('loadeddata', function() {
    console.log('✅ Video loaded successfully');
    
    // Force play the video immediately (muted)
    video.play().then(() => {
      console.log('🎵 Video playing (muted for autoplay)');
      
      // Unmute after a short delay to enable sound
      setTimeout(() => {
        video.muted = false;
        video.volume = 0.5;
        console.log('🔊 Video unmuted and sound enabled');
        
        // Update sound button state
        const soundBtn = document.getElementById('soundBtn');
        if (soundBtn) {
          soundBtn.innerHTML = '🔊';
          soundBtn.classList.remove('muted');
        }
      }, 100);
      
      hideLoadingScreen();
    }).catch(e => {
      console.log('⚠️ Autoplay prevented, waiting for user interaction');
    });
  });

  video.addEventListener('error', function(e) {
    console.error('❌ Video failed to load:', e);
    handleVideoError();
  });

  // Ensure video plays on mobile devices
  setupMobileVideoPlayback(video);
}

function setupMobileVideoPlayback(video) {
  // Setup sound control button
  setupSoundControl(video);
  
  // Try to play video immediately (muted first, then unmute)
  const tryPlayVideo = () => {
    if (video.paused) {
      // Start muted to bypass autoplay restrictions
      video.muted = true;
      video.play().then(() => {
        console.log('🎵 Video started playing (muted)');
        
        // Unmute after successful play
        setTimeout(() => {
          video.muted = false;
          video.volume = 0.5;
          console.log('🔊 Video unmuted and sound enabled');
          
          // Update sound button state
          const soundBtn = document.getElementById('soundBtn');
          if (soundBtn) {
            soundBtn.innerHTML = '🔊';
            soundBtn.classList.remove('muted');
          }
        }, 200);
      }).catch(e => {
        console.log('⚠️ Autoplay prevented:', e.message);
      });
    }
  };

  // Try to play immediately
  tryPlayVideo();
  
  // Force play on user interaction for mobile
  const playVideo = () => {
    if (video.paused) {
      video.muted = true; // Start muted
      video.play().then(() => {
        console.log('🎵 Video started playing after user interaction');
        
        // Unmute after successful play
        setTimeout(() => {
          video.muted = false;
          video.volume = 0.5;
          console.log('🔊 Video unmuted after user interaction');
          
          // Update sound button state
          const soundBtn = document.getElementById('soundBtn');
          if (soundBtn) {
            soundBtn.innerHTML = '🔊';
            soundBtn.classList.remove('muted');
          }
        }, 100);
      }).catch(e => {
        console.log('Video play failed:', e.message);
      });
    }
  };

  // Multiple interaction events for better mobile support
  ['click', 'touchstart', 'touchend'].forEach(event => {
    document.addEventListener(event, playVideo, { once: true });
  });

  // Handle visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      video.pause();
    } else {
      video.muted = true; // Start muted when resuming
      video.play().then(() => {
        setTimeout(() => {
          video.muted = false;
          video.volume = 0.5;
        }, 100);
      }).catch(e => console.log('Resume failed:', e.message));
    }
  });
  
  // Additional play attempts
  setTimeout(tryPlayVideo, 1000);
  setTimeout(tryPlayVideo, 2000);
}

function setupSoundControl(video) {
  const soundBtn = document.getElementById('soundBtn');
  
  if (!soundBtn) return;
  
  // Set initial state (video starts muted for autoplay)
  soundBtn.innerHTML = '🔇';
  soundBtn.classList.add('muted');
  
  // Toggle sound on/off
  soundBtn.addEventListener('click', () => {
    if (video.muted) {
      // Turn sound ON
      video.muted = false;
      video.volume = 0.5;
      soundBtn.innerHTML = '🔊';
      soundBtn.classList.remove('muted');
      console.log('Sound turned ON');
    } else {
      // Turn sound OFF
      video.muted = true;
      soundBtn.innerHTML = '🔇';
      soundBtn.classList.add('muted');
      console.log('Sound turned OFF');
    }
  });
  
  // Handle video load
  video.addEventListener('loadeddata', () => {
    // Video starts muted for autoplay, will be unmuted after play starts
    soundBtn.innerHTML = '🔇';
    soundBtn.classList.add('muted');
    console.log('Video loaded (muted for autoplay)');
  });
  
  // Handle volume changes
  video.addEventListener('volumechange', () => {
    console.log('Volume changed - Muted:', video.muted, 'Volume:', video.volume);
    
    // Update button state based on actual video state
    if (video.muted) {
      soundBtn.innerHTML = '🔇';
      soundBtn.classList.add('muted');
    } else {
      soundBtn.innerHTML = '🔊';
      soundBtn.classList.remove('muted');
    }
  });
}

function handleVideoError() {
  // Fallback background if video fails
  const videoTrack = document.querySelector('.video-track');
  if (videoTrack) {
    videoTrack.style.background = `
      linear-gradient(135deg, #ff4f9e, #ff9bc9, #ffd6ec),
      linear-gradient(180deg, #fff7fb, #ffffff)
    `;
  }
  hideLoadingScreen();
}

// ===== LOADING SCREEN =====
function setupLoadingScreen() {
  const loading = document.getElementById('loading');
  if (!loading) return;

  // Hide loading screen after a minimum time
  setTimeout(() => {
    hideLoadingScreen();
  }, 1500);
}

function hideLoadingScreen() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.classList.add('hidden');
    // Remove from DOM after animation
    setTimeout(() => {
      loading.remove();
    }, 500);
  }
}

// ===== ANIMATIONS =====
function setupAnimations() {
  // Intersection Observer for performance
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

  // Observe animated elements
  const animatedElements = document.querySelectorAll('.chip, .title, .accent');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Stagger animation for chips
  const chips = document.querySelectorAll('.chip');
  chips.forEach((chip, index) => {
    chip.style.transitionDelay = `${index * 0.1}s`;
  });
}

// ===== MOBILE OPTIMIZATIONS =====
function setupMobileOptimizations() {
  // Prevent zoom on double tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      // Recalculate viewport
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 100);
  });

  // Set initial viewport height
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// ===== ACCESSIBILITY =====
function setupAccessibility() {
  // Skip to content link
  const skipLink = document.createElement('a');
  skipLink.href = '#content';
  skipLink.textContent = 'Skip to content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #ff4f9e;
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10000;
    transition: top 0.3s;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add content ID
  const content = document.querySelector('.content');
  if (content) {
    content.id = 'content';
  }

  // Keyboard navigation for chips
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chip.click();
      }
    });
  });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function setupPerformanceOptimizations() {
  // Smooth scroll behavior
  if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  // Preload critical resources
  const preloadLinks = [
    { rel: 'preload', href: 'gallery/tashu1.mp4', as: 'video' },
    { rel: 'preload', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800;900&display=swap', as: 'style' }
  ];

  preloadLinks.forEach(link => {
    const linkElement = document.createElement('link');
    Object.assign(linkElement, link);
    document.head.appendChild(linkElement);
  });

  // Lazy load non-critical elements
  if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          lazyObserver.unobserve(entry.target);
        }
      });
    });

    // Observe elements that should be lazy loaded
    const lazyElements = document.querySelectorAll('[data-lazy]');
    lazyElements.forEach(el => lazyObserver.observe(el));
  }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
});

// ===== ANALYTICS (if needed) =====
function trackEvent(eventName, data = {}) {
  // Add your analytics tracking here
  console.log('Event tracked:', eventName, data);
}

// Track page views and interactions
document.addEventListener('click', function(e) {
  if (e.target.closest('.chip')) {
    const chip = e.target.closest('.chip');
    const text = chip.textContent.trim();
    trackEvent('chip_click', { text });
  }
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializePage,
    setupVideo,
    setupLoadingScreen,
    setupAnimations,
    setupMobileOptimizations,
    setupAccessibility,
    setupPerformanceOptimizations
  };
}

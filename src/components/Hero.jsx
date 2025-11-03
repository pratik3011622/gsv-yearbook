import { useState, useEffect } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Instagram, ChevronLeft, ChevronRight, ChevronDown, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const heroSlides = [
  {
    image: 'https://gsv.ac.in/wp-content/uploads/slider/cache/c51c9c0e2027b0762605e4380a2439cd/new-slider-01.jpg',
    alt: 'Gati Shakti Vishwavidyalaya Campus'
  },
  {
    image: 'https://gsv.ac.in/wp-content/uploads/slider/cache/8bef1522bf9985ed15004d1a5d70af15/BOSS0373-scaled.jpg',
    alt: 'GSV Campus Life'
  },
  {
    image: '/_DKK5312.JPG',
    alt: 'GSV Community and Events'
  },
  {
    image: '/slide5.jpg',
    alt: 'Additional Slide Image'
  }
];

export const Hero = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isYearbookDropdownOpen, setIsYearbookDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest('.about-dropdown') && !e.target.closest('.yearbook-dropdown') && !e.target.closest('.mobile-menu')) {
        setIsAboutDropdownOpen(false);
        setIsYearbookDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="relative">
      {/* Hero Section with Clean Slideshow - Full height */}
      <div className="relative h-screen overflow-hidden">
        {/* Gradient overlay for better text visibility and visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-10"></div>

        {/* Slideshow Background */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              style={{
                transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)',
                transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Transparent Navigation Bar Overlay */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
            {/* Top Section with Logo, Title, and Auth Buttons */}
            <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/d/d2/Gati_Shakti_Vishwavidyalaya_Logo.png"
                  alt="Gati Shakti Vishwavidyalaya Logo"
                  className="h-8 sm:h-10 lg:h-12 xl:h-14 w-auto"
                />
                <div className="text-white drop-shadow-lg">
                  <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold leading-tight text-white drop-shadow-lg">GSVConnect</h1>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-white/90 drop-shadow-lg">गति शक्ति विश्वविद्यालय</p>
                  <p className="text-xs sm:text-sm text-white/90 drop-shadow-lg">Gati Shakti Vishwavidyalaya</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-white hover:text-white rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-110 drop-shadow-lg"
                  title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 text-white hover:text-white font-semibold transition-all duration-300 text-sm sm:text-base border border-white/40 rounded-lg hover:border-white/60 hover:bg-white/20 hover:scale-105 drop-shadow-lg transform"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 font-semibold text-sm sm:text-base border border-white/30 hover:scale-105 drop-shadow-lg transform"
                >
                  Join Now
                </button>
              </div>
            </div>

            {/* Navigation Menu Section */}
            <div className="py-1">
              <nav className="flex justify-center sm:justify-end space-x-1 sm:space-x-2 lg:space-x-4 xl:space-x-6">
                <button onClick={() => onNavigate('home')} className="text-white hover:text-white font-semibold transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/20 hover:scale-105 drop-shadow-lg transform">Home</button>
                <button onClick={() => onNavigate('directory')} className="text-white hover:text-white font-semibold transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/20 hover:scale-105 drop-shadow-lg transform">Directory</button>
                <button onClick={() => onNavigate('events')} className="text-white hover:text-white font-semibold transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/20 hover:scale-105 drop-shadow-lg transform">Events</button>
                {/* Yearbook Dropdown */}
                <div className="relative yearbook-dropdown">
                  <button
                    onClick={() => setIsYearbookDropdownOpen(!isYearbookDropdownOpen)}
                    className="text-white hover:text-white font-semibold transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/20 hover:scale-105 drop-shadow-lg transform flex items-center space-x-1"
                  >
                    <span>Yearbook</span>
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${isYearbookDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu - Positioned below the button */}
                  {isYearbookDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 sm:w-56 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[70]">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onNavigate('photo-gallery');
                            setIsYearbookDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium text-sm">Photo Gallery</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('video-gallery');
                            setIsYearbookDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium text-sm">Video Gallery</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('magazine');
                            setIsYearbookDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span className="font-medium text-sm">Alumni Magazine</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* About Dropdown */}
                <div className="relative about-dropdown">
                  <button
                    onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                    className="text-white hover:text-white font-semibold transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/20 hover:scale-105 drop-shadow-lg transform flex items-center space-x-1"
                  >
                    <span>About</span>
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu - Positioned below the button */}
                  {isAboutDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 sm:w-56 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[70]">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onNavigate('vision-mission');
                            setIsAboutDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="font-medium text-sm">Vision & Mission</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('leadership');
                            setIsAboutDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="font-medium text-sm">Leadership Messages</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('team');
                            setIsAboutDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <span className="font-medium text-sm">Our Team</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>


        {/* Navigation Arrows - Hidden on mobile */}
        <button
          onClick={prevSlide}
          className="hidden md:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 smooth-hover"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 smooth-hover"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        {/* Slide Indicators - Responsive */}
        <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-1 sm:space-x-2 md:space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 sm:h-1.5 md:h-2 lg:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-4 sm:w-6 md:w-8 lg:w-12 bg-white'
                  : 'w-1 sm:w-1.5 md:w-2 lg:w-3 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Content Section Below Slideshow - Responsive */}
      <div className="bg-white dark:bg-gray-900 py-4 sm:py-6 md:py-8 lg:py-12 xl:py-16 parallax-bg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight">
              Gati Shakti Vishwavidyalaya
              <br />
              <span className="text-blue-600 dark:text-blue-400">Alumni Network</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 md:mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
              Connect with fellow alumni, share experiences, and build lifelong relationships that transcend time and distance.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center px-2 sm:px-4">
              <button
                onClick={() => onNavigate('directory')}
                className="w-full sm:w-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 btn-smooth font-semibold text-xs sm:text-sm md:text-base lg:text-lg shadow-lg hover:shadow-xl"
              >
                Explore Directory
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 btn-smooth font-semibold text-xs sm:text-sm md:text-base lg:text-lg"
              >
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

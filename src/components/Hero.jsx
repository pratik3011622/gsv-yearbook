import { useState, useEffect } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Instagram, ChevronDown, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';


export const Hero = ({ onNavigate }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isYearbookDropdownOpen, setIsYearbookDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

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


  return (
    <div className="relative">
      {/* Hero Section with Clean Slideshow - Full height */}
      <div className="relative h-screen overflow-hidden">
        {/* Gradient overlay for better text visibility and visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 z-10"></div>

        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center"
            style={{
              imageRendering: 'auto',
              imageRendering: '-webkit-optimize-contrast',
              filter: 'contrast(1.1) brightness(1.05)'
            }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
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
                  className="h-6 sm:h-8 lg:h-10 xl:h-12 w-auto"
                />
                <div className="text-white drop-shadow-lg">
                  <h1 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold leading-tight text-white drop-shadow-lg">GSVConnect</h1>
                  <p className="text-xs sm:text-sm lg:text-base text-white/90 drop-shadow-lg">गति शक्ति विश्वविद्यालय</p>
                  <p className="text-xs text-white/90 drop-shadow-lg hidden sm:block">Gati Shakti Vishwavidyalaya</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 sm:p-2 text-white hover:text-white rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-110 drop-shadow-lg"
                  title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDark ? <Sun className="w-3 h-3 sm:w-4 sm:h-4" /> : <Moon className="w-3 h-3 sm:w-4 sm:h-4" />}
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-white hover:text-white font-semibold transition-all duration-300 text-xs sm:text-sm border border-white/40 rounded-lg hover:border-white/60 hover:bg-white/20 hover:scale-105 drop-shadow-lg transform"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 font-semibold text-xs sm:text-sm border border-white/30 hover:scale-105 drop-shadow-lg transform"
                >
                  Join Now
                </button>
              </div>
            </div>

            {/* Navigation Menu Section */}
            <div className="py-1">
              <nav className="flex justify-center sm:justify-end space-x-1 sm:space-x-2 lg:space-x-4 xl:space-x-6">
                <button onClick={() => onNavigate('home')} className="text-white hover:text-white font-semibold transition-all duration-300 text-xs sm:text-sm px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-white/20 hover:scale-105 drop-shadow-lg transform">Home</button>
                <button onClick={() => onNavigate('directory')} className="text-white hover:text-white font-semibold transition-all duration-300 text-xs sm:text-sm px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-white/20 hover:scale-105 drop-shadow-lg transform">Directory</button>
                <button onClick={() => onNavigate('events')} className="text-white hover:text-white font-semibold transition-all duration-300 text-xs sm:text-sm px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-white/20 hover:scale-105 drop-shadow-lg transform">Events</button>
                {/* Yearbook Dropdown */}
                <div className="relative yearbook-dropdown">
                  <button
                    onClick={() => {
                      setIsYearbookDropdownOpen(!isYearbookDropdownOpen);
                      setIsAboutDropdownOpen(false);
                    }}
                    className="text-white hover:text-white font-semibold transition-all duration-300 text-xs sm:text-sm px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-white/20 hover:scale-105 drop-shadow-lg transform flex items-center space-x-1"
                  >
                    <span>Yearbook</span>
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${isYearbookDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu - Positioned below the button */}
                  {isYearbookDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-44 sm:w-48 lg:w-56 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[70]">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onNavigate('photo-gallery');
                            setIsYearbookDropdownOpen(false);
                          }}
                          className="w-full text-left px-2 sm:px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium text-xs sm:text-sm">Photo Gallery</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('video-gallery');
                            setIsYearbookDropdownOpen(false);
                          }}
                          className="w-full text-left px-2 sm:px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium text-xs sm:text-sm">Video Gallery</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('magazine');
                            setIsYearbookDropdownOpen(false);
                          }}
                          className="w-full text-left px-2 sm:px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span className="font-medium text-xs sm:text-sm">Alumni Magazine</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* About Dropdown */}
                <div className="relative about-dropdown">
                  <button
                    onClick={() => {
                      setIsAboutDropdownOpen(!isAboutDropdownOpen);
                      setIsYearbookDropdownOpen(false);
                    }}
                    className="text-white hover:text-white font-semibold transition-all duration-300 text-xs sm:text-sm px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-white/20 hover:scale-105 drop-shadow-lg transform flex items-center space-x-1"
                  >
                    <span>About</span>
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu - Positioned below the button */}
                  {isAboutDropdownOpen && (
                    <div className="absolute top-full -left-28 mt-2 w-44 sm:w-48 lg:w-56 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[70]">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onNavigate('vision-mission');
                            setIsAboutDropdownOpen(false);
                          }}
                          className="w-full text-left px-2 sm:px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="font-medium text-xs sm:text-sm">Vision & Mission</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('leadership');
                            setIsAboutDropdownOpen(false);
                          }}
                          className="w-full text-left px-2 sm:px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="font-medium text-xs sm:text-sm">Leadership Messages</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('team');
                            setIsAboutDropdownOpen(false);
                          }}
                          className="w-full text-left px-2 sm:px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <span className="font-medium text-xs sm:text-sm">Our Team</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>


      </div>

      {/* Content Section Below Slideshow - Responsive */}
      <div className="bg-white dark:bg-gray-900 py-4 sm:py-6 md:py-8 lg:py-12 xl:py-16 parallax-bg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 md:mb-6 leading-tight">
              Gati Shakti Vishwavidyalaya
              <br />
              <span className="text-blue-600 dark:text-blue-400">Alumni Network</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with fellow alumni, share experiences, and build lifelong relationships that transcend time and distance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center">
              <button
                onClick={() => onNavigate('directory')}
                className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 btn-smooth font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl"
              >
                Explore Directory
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 btn-smooth font-semibold text-sm sm:text-base md:text-lg"
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

import { useState, useEffect } from 'react';
import { ContactSection } from '../components/ContactSection';
import { Hero } from '../components/Hero';
import { StatsCounter } from '../components/StatsCounter';
import { FeatureHighlights } from '../components/FeatureHighlights';
import { ThisDayWidget } from '../components/ThisDayWidget';
import { Testimonials } from '../components/Testimonials';
import { AnimatedText } from '../components/AnimatedText';
import { ScrollReveal } from '../components/ScrollReveal';
import { ParallaxSection } from '../components/ParallaxSection';
import { FloatingParticles } from '../components/FloatingParticles';
import { Mail, ArrowUp, Moon, Sun, User, Briefcase, BookOpen, Image, Users, TrendingUp } from 'lucide-react';
import { api } from '../lib/api';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export const HomePage = ({ onNavigate, currentPage }) => {
   const [stats, setStats] = useState({});
   const [email, setEmail] = useState('');
   const [showScrollTop, setShowScrollTop] = useState(false);
   const { isDark, toggleTheme } = useTheme();
   const { user, profile } = useAuth();

   const isAlumni = profile?.role === 'alumni';

  useEffect(() => {
    fetchStats();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getPlatformStats();
      setStats(data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing! Stay tuned for updates.');
    setEmail('');
  };

  return (
    <div className="relative">
      <Hero onNavigate={onNavigate} currentPage={currentPage} />

      {/* User Dashboard Section */}
      {user && (
        <div className="relative py-8 sm:py-12 md:py-16 bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                      Welcome back, {profile?.fullName?.split(' ')[0] || 'User'}!
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      {isAlumni ? 'Alumni Dashboard' : 'Guest Dashboard'} • {profile?.role === 'alumni' ? 'Full Access' : 'View Only'}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {profile?.fullName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {profile?.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                    <Users className="w-8 h-8 mb-2" />
                    <h3 className="font-bold text-lg">Directory</h3>
                    <p className="text-sm opacity-90">Connect with alumni</p>
                    <button
                      onClick={() => onNavigate('directory')}
                      className="mt-2 px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
                    >
                      Explore
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                    <TrendingUp className="w-8 h-8 mb-2" />
                    <h3 className="font-bold text-lg">Events</h3>
                    <p className="text-sm opacity-90">Upcoming reunions</p>
                    <button
                      onClick={() => onNavigate('events')}
                      className="mt-2 px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
                    >
                      View Events
                    </button>
                  </div>

                  {isAlumni && (
                    <>
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
                        <Briefcase className="w-8 h-8 mb-2" />
                        <h3 className="font-bold text-lg">Jobs</h3>
                        <p className="text-sm opacity-90">Post opportunities</p>
                        <button
                          onClick={() => onNavigate('jobs')}
                          className="mt-2 px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
                        >
                          Post Job
                        </button>
                      </div>

                      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
                        <BookOpen className="w-8 h-8 mb-2" />
                        <h3 className="font-bold text-lg">Stories</h3>
                        <p className="text-sm opacity-90">Share your journey</p>
                        <button
                          onClick={() => onNavigate('stories')}
                          className="mt-2 px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
                        >
                          Write Story
                        </button>
                      </div>

                      <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white md:col-span-2">
                        <Image className="w-8 h-8 mb-2" />
                        <h3 className="font-bold text-lg">Memories</h3>
                        <p className="text-sm opacity-90">Upload college memories</p>
                        <button
                          onClick={() => onNavigate('memories')}
                          className="mt-2 px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
                        >
                          Upload Memory
                        </button>
                      </div>
                    </>
                  )}

                  {!isAlumni && (
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white md:col-span-2">
                      <User className="w-8 h-8 mb-2" />
                      <h3 className="font-bold text-lg">Guest Access</h3>
                      <p className="text-sm opacity-90">View content from alumni</p>
                      <button
                        onClick={() => onNavigate('register')}
                        className="mt-2 px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
                      >
                        Become Alumni
                      </button>
                    </div>
                  )}
                </div>

                {isAlumni && (
                  <div className="bg-gradient-to-r from-blue-50 to-amber-50 dark:from-blue-900/20 dark:to-amber-900/20 rounded-xl p-4">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Alumni Privileges</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      As an alumni, you can post jobs, share stories, upload memories, and connect with fellow graduates.
                      Your contributions help build our vibrant community!
                    </p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      )}

      {/* Professional Section */}
      <div className="relative py-8 sm:py-12 md:py-16 overflow-hidden bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center">
              <AnimatedText
                text="Connect & Celebrate"
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4"
                delay={0.3}
              />
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Join our vibrant community where memories are made and futures are shaped
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>


      <div className="relative">
        <FloatingParticles count={6} className="z-0" />
        <ParallaxSection speed={0.3} direction="up">
          <ScrollReveal direction="up" delay={0.1}>
            <StatsCounter stats={stats} />
          </ScrollReveal>
        </ParallaxSection>
        <ParallaxSection speed={0.2} direction="down">
          <ScrollReveal direction="up" delay={0.2}>
            <FeatureHighlights onNavigate={onNavigate} />
          </ScrollReveal>
        </ParallaxSection>
        <ParallaxSection speed={0.4} direction="up">
          <ScrollReveal direction="up" delay={0.3}>
            <ThisDayWidget />
          </ScrollReveal>
        </ParallaxSection>
        <ParallaxSection speed={0.1} direction="down">
          <ScrollReveal direction="up" delay={0.4}>
            <ContactSection />
          </ScrollReveal>
        </ParallaxSection>
        <ParallaxSection speed={0.3} direction="up">
          <ScrollReveal direction="up" delay={0.5}>
            <Testimonials />
          </ScrollReveal>
        </ParallaxSection>
      </div>


      <footer className="relative overflow-hidden bg-gray-900">
        {/* Professional gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>

        <div className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/d/d2/Gati_Shakti_Vishwavidyalaya_Logo.png"
                    alt="Gati Shakti Vishwavidyalaya Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    GSVConnect
                  </h3>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                  Where Memories Meet Futures. Connecting Gati Shakti Vishwavidyalaya alumni worldwide.
                </p>
                <div className="flex space-x-2 sm:space-x-3">
                  <a
                    href="https://www.facebook.com/gsv.ac.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110"
                    aria-label="Follow us on Facebook"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/school/gatishaktivishwavidyalaya/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-110"
                    aria-label="Connect with us on LinkedIn"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/gsv.vadodara/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all hover:scale-110"
                    aria-label="Follow us on Instagram"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://x.com/gsv_vadodara?t=EfCgxwtFAx95GvtBgIJjbw&s=08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-black transition-all hover:scale-110"
                    aria-label="Follow us on X"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg text-white">Quick Links</h4>
                <ul className="space-y-2 sm:space-y-3 text-gray-300">
                  <li>
                    <button onClick={() => onNavigate('directory')} className="hover:text-white transition-colors text-xs sm:text-sm hover:translate-x-1 transform duration-200">
                      Alumni Directory
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('events')} className="hover:text-white transition-colors text-xs sm:text-sm hover:translate-x-1 transform duration-200">
                      Events & Reunions
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('jobs')} className="hover:text-white transition-colors text-xs sm:text-sm hover:translate-x-1 transform duration-200">
                      Job Board
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg text-white">Community</h4>
                <ul className="space-y-2 sm:space-y-3 text-gray-300">
                  <li>
                    <button onClick={() => onNavigate('stories')} className="hover:text-white transition-colors text-xs sm:text-sm hover:translate-x-1 transform duration-200">
                      Alumni Stories
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('memories')} className="hover:text-white transition-colors text-xs sm:text-sm hover:translate-x-1 transform duration-200">
                      Yearbook Gallery
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg text-white">Get Started</h4>
                <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                  Join our vibrant community today and start building meaningful connections.
                </p>
                <button
                  onClick={() => onNavigate('register')}
                  className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-all hover:scale-105"
                >
                  Join GSVConnect
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/d/d2/Gati_Shakti_Vishwavidyalaya_Logo.png"
                alt="Gati Shakti Vishwavidyalaya Logo"
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              />
              <p className="text-gray-400 text-xs sm:text-sm">
                &copy; 2025 Gati Shakti Vishwavidyalaya. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Footer */}
      <div className="bg-gray-900 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/d/d2/Gati_Shakti_Vishwavidyalaya_Logo.png"
                alt="Gati Shakti Vishwavidyalaya Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <p className="text-sm sm:text-base text-gray-400">
                © 2025 Gati Shakti Vishwavidyalaya. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 sm:bottom-8 right-4 sm:right-8 p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-amber-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
};

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
import { Mail, ArrowUp, Moon, Sun } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

export const HomePage = ({ onNavigate, currentPage }) => {
  const [stats, setStats] = useState({});
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { isDark, toggleTheme } = useTheme();

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
      const { data, error } = await supabase
        .from('platform_stats')
        .select('*')
        .maybeSingle();

      if (error) throw error;
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

      {/* Professional Section */}
      <div className="relative py-16 overflow-hidden bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center">
              <AnimatedText
                text="Connect & Celebrate"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
                delay={0.3}
              />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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

        <div className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="lg:col-span-1">
                <h3 className="text-2xl font-bold mb-6 text-white">
                  GSVConnect
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Where Memories Meet Futures. Connecting Gati Shakti Vishwavidyalaya alumni worldwide.
                </p>
                <div className="flex space-x-3">
                  <a
                    href="https://www.facebook.com/gsv.ac.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110"
                    aria-label="Follow us on Facebook"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/school/gatishaktivishwavidyalaya/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-110"
                    aria-label="Connect with us on LinkedIn"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/gsv.ac.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all hover:scale-110"
                    aria-label="Follow us on Instagram"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://x.com/gsv_vadodara?t=EfCgxwtFAx95GvtBgIJjbw&s=08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-black transition-all hover:scale-110"
                    aria-label="Follow us on X"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-6 text-lg text-white">Quick Links</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>
                    <button onClick={() => onNavigate('directory')} className="hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200">
                      Alumni Directory
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('events')} className="hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200">
                      Events & Reunions
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('jobs')} className="hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200">
                      Job Board
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-6 text-lg text-white">Community</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>
                    <button onClick={() => onNavigate('stories')} className="hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200">
                      Alumni Stories
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('memories')} className="hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200">
                      Yearbook Gallery
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-6 text-lg text-white">Get Started</h4>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Join our vibrant community today and start building meaningful connections.
                </p>
                <button
                  onClick={() => onNavigate('register')}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all hover:scale-105"
                >
                  Join GSVConnect
                </button>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-gray-400 text-sm">
                  &copy; 2025 Gati Shakti Vishwavidyalaya. All rights reserved.
                </p>
                <div className="flex space-x-6 text-sm text-gray-400">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Dark Mode Toggle Button - Visible at Top, Hidden on Scroll */}
      {!showScrollTop && (
        <button
          onClick={toggleTheme}
          className="fixed top-6 right-6 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200 dark:border-gray-700 z-50"
          aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

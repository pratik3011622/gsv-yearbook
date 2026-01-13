import { useState, useEffect } from 'react';
import { Menu, X, GraduationCap, Moon, Sun, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const Navigation = ({ onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown, userMenuOpen]);

  const baseNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'directory', label: 'Directory' },
    { id: 'events', label: 'Events' },
    {
      id: 'about',
      label: 'About',
      subItems: [
        { id: 'vision-mission', label: 'Vision & Mission' },
        { id: 'leadership', label: 'Leadership' },
        { id: 'team', label: 'Team' },
      ]
    },
    {
      id: 'yearbook',
      label: 'Yearbook',
      subItems: [
        { id: 'magazine', label: 'Magazine' },
        { id: 'photo-gallery', label: 'Photo Gallery' },
        { id: 'video-gallery', label: 'Video Gallery' },
      ]
    },
  ];

  const userNavItems = user
    ? [
      ...baseNavItems,
      { id: 'jobs', label: 'Jobs' },
      ...(profile?.role === 'alumni' ? [
        { id: 'stories', label: 'Stories' },
      ] : []),
    ]
    : baseNavItems;

  const navItems = userNavItems;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${currentPage === 'home' && !isScrolled
        ? 'bg-transparent py-4'
        : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-slate-800/50 py-3 supports-[backdrop-filter]:bg-white/60'
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-16">
          <div
            className={`flex items-center space-x-3 cursor-pointer group ${currentPage === 'home' ? 'cursor-default' : ''}`}
            onClick={() => currentPage !== 'home' && onNavigate('home')}
          >
            <img
              src="/gsv-logo.png"
              alt="Gati Shakti Vishwavidyalaya Logo"
              className={`w-10 h-10 object-contain transition-all duration-300 ${currentPage === 'home' && !isScrolled ? 'brightness-0 invert' : ''
                }`}
            />
            <div className="flex flex-col">
              <h1 className={`text-xl font-bold tracking-tight transition-colors duration-300 leading-none ${currentPage === 'home' && !isScrolled ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}>
                GSVConnect
              </h1>
              <span className={`text-xs font-medium transition-colors duration-300 ${currentPage === 'home' && !isScrolled ? 'text-blue-100' : 'text-slate-600 dark:text-slate-300'
                }`}>
                गति शक्ति विश्वविद्यालय
              </span>
              <p className={`text-[11px] font-brand font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${currentPage === 'home' && !isScrolled ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'
                }`}>
                Gati Shakti Vishwavidyalaya
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.id} className="relative group perspective-1000 z-50">
                <button
                  onClick={() => !item.subItems && onNavigate(item.id)}
                  className={`flex items-center px-2 py-1 relative font-medium text-sm tracking-wide transition-all duration-300 ${currentPage === item.id || (item.subItems && item.subItems.some(sub => sub.id === currentPage))
                    ? 'text-blue-600'
                    : currentPage === 'home' && !isScrolled
                      ? 'text-white hover:text-blue-400'
                      : 'text-neutral-600 hover:text-blue-600 dark:text-neutral-300'
                    }`}
                >
                  {item.label}
                  {item.subItems && (
                    <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                  )}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-300 ${currentPage === item.id || (item.subItems && item.subItems.some(sub => sub.id === currentPage)) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                </button>

                {item.subItems && (
                  <div className="absolute left-0 top-full pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden p-2">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => onNavigate(subItem.id)}
                          className={`block w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${currentPage === subItem.id
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full font-medium text-sm transition-all duration-300 ${currentPage === 'home' && !isScrolled
                ? 'text-white hover:bg-white/20'
                : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-900 dark:text-neutral-300 dark:hover:bg-slate-800 dark:hover:text-blue-400'
                }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="hidden lg:flex items-center space-x-3">
              <a
                href="https://www.facebook.com/gsv.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all hover:scale-110 shadow-lg"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/school/gatishaktivishwavidyalaya/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110 shadow-lg"
                aria-label="Connect with us on LinkedIn"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/gsv.vadodara/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition-all hover:scale-110 shadow-lg"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://x.com/gsv_vadodara?t=EfCgxwtFAx95GvtBgIJjbw&s=08"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-110 shadow-lg"
                aria-label="Follow us on X"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {user && (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`p-2 rounded-full font-medium text-sm transition-all duration-300 ${currentPage === 'home' && !isScrolled
                    ? 'text-white hover:bg-white/20'
                    : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-900 dark:text-neutral-300 dark:hover:bg-slate-800 dark:hover:text-blue-400'
                    }`}
                  title="User Menu"
                >
                  <User className="w-5 h-5" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden p-2">
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-full transition-all duration-300 ${currentPage === 'home' ? 'bg-neutral-100 hover:bg-neutral-200' : 'bg-neutral-100 dark:bg-gray-800 hover:bg-neutral-200 dark:hover:bg-gray-700'
                }`}
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 transition-colors duration-300 ${currentPage === 'home' ? 'text-neutral-700' : 'text-neutral-700 dark:text-neutral-300'
                  }`} />
              ) : (
                <Menu className={`w-6 h-6 transition-colors duration-300 ${currentPage === 'home' ? 'text-neutral-700' : 'text-neutral-700 dark:text-neutral-300'
                  }`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={`lg:hidden border-t shadow-medium transition-all duration-300 ${currentPage === 'home' ? 'bg-white border-neutral-200' : 'bg-white dark:bg-gray-900 border-neutral-200 dark:border-gray-700'
          }`}>
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.id} className="dropdown-container">
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-full font-medium transition-all ${item.subItems.some(subItem => currentPage === subItem.id)
                        ? 'bg-primary-900 text-white'
                        : currentPage === 'home'
                          ? 'text-neutral-700 hover:bg-primary-50'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                        }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.id && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.subItems.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              onNavigate(subItem.id);
                              setIsMobileMenuOpen(false);
                              setOpenDropdown(null);
                            }}
                            className={`block w-full text-left px-4 py-2 rounded-lg font-medium text-sm transition-all ${currentPage === subItem.id
                              ? 'bg-blue-600 text-white'
                              : currentPage === 'home'
                                ? 'text-neutral-600 hover:bg-blue-50'
                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                              }`}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-full font-medium transition-all ${currentPage === item.id
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : currentPage === 'home'
                        ? 'text-neutral-700 hover:bg-blue-50'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

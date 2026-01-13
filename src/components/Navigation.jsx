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
            className={`flex-1 flex justify-start items-start space-x-3 cursor-pointer group ${currentPage === 'home' ? 'cursor-default' : ''}`}
            onClick={() => currentPage !== 'home' && onNavigate('home')}
          >
            <img
              src="/gsv-logo.png"
              alt="Gati Shakti Vishwavidyalaya Logo"
              className="h-11 w-auto transition-all duration-300"
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

          <div className="hidden lg:flex flex-1 justify-center items-center space-x-6">
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

          <div className="flex-1 flex justify-end items-center space-x-4">
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
              {/* Social media icons removed as per request */}
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

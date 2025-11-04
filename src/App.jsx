import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { MemoriesPage } from './pages/MemoriesPage';
import { EventsPage } from './pages/EventsPage';
import { JobsPage } from './pages/JobsPage';
import { StoriesPage } from './pages/StoriesPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { VideoGalleryPage } from './pages/VideoGalleryPage';
import { PhotoGalleryPage } from './pages/PhotoGalleryPage';
import { MagazinePage } from './pages/MagazinePage';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    // Get initial page from URL hash or default to home
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  const handleNavigate = (page) => {
    setCurrentPage(page);
    // Update URL hash for browser back/forward support
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    // Set initial hash if not present
    if (!window.location.hash) {
      window.location.hash = 'home';
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} currentPage={currentPage} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        return (
          <div className="min-h-screen">
            <RegisterPage onNavigate={handleNavigate} />
          </div>
        );
      case 'directory':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <DirectoryPage />
            </div>
          </div>
        );
      case 'memories':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <MemoriesPage />
            </div>
          </div>
        );
      case 'events':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <EventsPage onNavigate={handleNavigate} />
            </div>
          </div>
        );
      case 'jobs':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <JobsPage />
            </div>
          </div>
        );
      case 'stories':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <StoriesPage />
            </div>
          </div>
        );
      case 'vision-mission':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
              {/* Hero Banner Image */}
              <div className="mb-16">
                <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://corporate.apollotyres.com/content/dam/orbit/apollo-corporate/sustainability-and-ethics/health--safety-_-environment/health-_-safety/vision-_-mission/Vision%20and%20Mission%20-%20Banner%20image.jpg"
                    alt="Vision and Mission - Excellence in Transportation and Logistics"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-indigo-900/80"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white max-w-4xl px-6">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                          Vision & Mission
                        </h1>
                        <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                          Our guiding principles and commitment to excellence in transportation and logistics education
                        </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                {/* Vision Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden flex items-center justify-center">
                    <div className="text-center text-blue-600">
                      <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <h3 className="text-2xl font-bold">Our Vision</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                      Vision
                    </h3>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                        To be a world-class university in the field of transportation and logistics, recognized for excellence in teaching, research, and innovation, contributing significantly to the development of India's transportation sector and becoming a global leader in transportation education.
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        Gati Shakti Vishwavidyalaya aspires to create an ecosystem that fosters innovation, entrepreneurship, and sustainable development in the transportation and logistics sector, while addressing the challenges of the 21st century.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mission Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden flex items-center justify-center">
                    <div className="text-center text-green-600">
                      <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-2xl font-bold">Our Mission</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                      Mission
                    </h3>
                    <div className="prose prose-slate max-w-none">
                      <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                        <li className="flex items-start space-x-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>To provide high-quality education in transportation and logistics through innovative teaching methods, industry-relevant curriculum, and experiential learning.</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>To conduct cutting-edge research in transportation technologies, logistics management, and sustainable mobility solutions.</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>To foster industry-academia collaboration through partnerships, internships, and joint research initiatives.</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>To develop skilled professionals who can contribute to the growth and modernization of India's transportation infrastructure.</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>To promote sustainable and inclusive development in the transportation sector through policy research and advocacy.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Content Sections */}
              <div className="mt-16 space-y-12">
                {/* Core Values */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
                      Core Values
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Innovation</h4>
                        <p className="text-slate-600 dark:text-slate-300">Fostering creativity and technological advancement</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Excellence</h4>
                        <p className="text-slate-600 dark:text-slate-300">Striving for the highest standards in education</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Collaboration</h4>
                        <p className="text-slate-600 dark:text-slate-300">Building partnerships for mutual growth</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Sustainability</h4>
                        <p className="text-slate-600 dark:text-slate-300">Promoting environmentally conscious practices</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategic Objectives */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div className="p-8">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
                      Strategic Objectives
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Academic Excellence</h4>
                        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                          <li>• Develop industry-aligned curriculum</li>
                          <li>• Implement experiential learning programs</li>
                          <li>• Establish research centers of excellence</li>
                          <li>• Foster interdisciplinary education</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Industry Integration</h4>
                        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                          <li>• Build strong industry partnerships</li>
                          <li>• Create internship and placement opportunities</li>
                          <li>• Develop executive education programs</li>
                          <li>• Establish innovation hubs</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Research & Innovation</h4>
                        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                          <li>• Conduct cutting-edge transportation research</li>
                          <li>• Develop sustainable mobility solutions</li>
                          <li>• Create intellectual property</li>
                          <li>• Publish in high-impact journals</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Global Leadership</h4>
                        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                          <li>• Establish international collaborations</li>
                          <li>• Participate in global conferences</li>
                          <li>• Attract international faculty and students</li>
                          <li>• Contribute to global transportation policies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'leadership':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
              <div className="text-center mb-16">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                  Messages from Leadership
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Inspiring words from our esteemed Chancellor and Vice Chancellor guiding our community forward
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 max-w-7xl mx-auto">
                {/* Chancellor Section */}
                <div className="flex flex-col h-full">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex-1 flex flex-col">
                    <div className="h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 relative overflow-hidden flex-shrink-0">
                      <img
                        src="https://indiapressrelease.com/wp-content/uploads/2022/02/IT-Minister-Shri-Ashwini-Vaishnaw-to-release-National-Strategy-on-Additive-Manufacturing-tomorrow.jpg"
                        alt="Chancellor Shri Ashwini Vaishnaw"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Chancellor's Message
                      </h3>
                      <h4 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                        Shri Ashwini Vaishnaw
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4 lg:mb-6">
                        Hon'ble Minister for Railways, Information and Broadcasting, Electronics & Information Technology, Government of India.
                      </p>
                      <div className="prose prose-slate max-w-none flex-1 text-sm sm:text-base">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3 lg:mb-4">
                          Gati Shakti Vishwavidyalaya (GSV) has been set up to create specialized and talented human resources that will accelerate the development of India's entire transportation and logistics sector. GSV highlights government's significant effort to enlarge PM GatiShakti National Master Plan and enhance logistics efficiency across the country.
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3 lg:mb-4">
                          The university's scope and vision, in the true sense of National Education Policy 2020, covers the entire transportation including railways, aviation, roadways, maritime sector, etc.
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          The university offers a white-board to the Industry in terms of curriculum inputs of relevance and significance. Apart from regular education programs, the university shall put significant emphasis on executive training and skilling. The university's curriculum shall focus employment-oriented programs, keeping collaboration with Industry as a foundational approach.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vice Chancellor Section */}
                <div className="flex flex-col h-full">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-1 flex flex-col">
                    <div className="h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 relative overflow-hidden flex-shrink-0">
                      <img
                        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiUG1QCmh58L_dw5Q9kEm7IfoyFTuSQgWF5M67lYp-bWbyE0WrT3MpT2N4sLdoChVTtDc7eaG-pz8sFqulZtVrHFl_g1U1_0UTUhkJUbczPc870VGGBHoq1cnGuHFchJ2HONauto0Xn2RM3dRtphDc880Jz1BvjKyxapfeLM2in_Zhq236_GTYmTGC8gAo/w178-h200/Manoj%20Choudhary.png"
                        alt="Vice Chancellor Prof. Manoj Choudhary"
                        className="w-full h-full object-contain object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Vice Chancellor's Message
                      </h3>
                      <h4 className="text-lg sm:text-xl font-semibold text-purple-600 dark:text-purple-400 mb-1">
                        Prof. Manoj Choudhary
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4 lg:mb-6">
                        Gati Shakti Vishwavidyalaya
                      </p>
                      <div className="prose prose-slate max-w-none flex-1 text-sm sm:text-base">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3 lg:mb-4">
                          Gati Shakti Vishwavidyalaya (GSV), India's first University in Transportation and Logistics sector, was established through the Central Universities (Amendment) Act 2022, passed by the Parliament in August 2022. Working under the Ministry of Railways (Govt. of India), the University was operationalised on December 6, 2022.
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3 lg:mb-4">
                          The University stands by its unique value proposition to offer logistics and transportation-focused applied education, training, skilling and research through experiential learning, multi-disciplinary research, and academia-industry interface. The University follows a demand-driven curriculum, while aligning with industry priorities.
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          GSV shall lead the teaching, training and research in the entire transportation and logistics sector with a vision - "Innovation-led, Industry-driven University for creating, assimilating and imparting excellence of knowledge and actions accelerating development in the transport and logistics sectors".
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          To this objective and vision, the university has made very rapid strides and significant progress in the last two and half years, across all the dimensions of industry-driven curricula, executive training programs, research and industry partnerships, to set up a strong foundation to be India's and World's Best University in the transportation and logistics sectors.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'video-gallery':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <VideoGalleryPage />
            </div>
          </div>
        );
      case 'photo-gallery':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <PhotoGalleryPage />
            </div>
          </div>
        );
      case 'magazine':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <MagazinePage />
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="min-h-screen">
            <HomePage onNavigate={handleNavigate} currentPage={currentPage} />
          </div>
        );
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 transition-colors duration-300">
          {renderPage()}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

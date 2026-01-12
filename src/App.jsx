import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { EventsPage } from './pages/EventsPage';
import { JobsPage } from './pages/JobsPage';
import { StoriesPage } from './pages/StoriesPage';
import { StoryDetailPage } from './pages/StoryDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { VideoGalleryPage } from './pages/VideoGalleryPage';
import { PhotoGalleryPage } from './pages/PhotoGalleryPage';
import { MagazinePage } from './pages/MagazinePage';
import { MentorshipPage } from './pages/MentorshipPage';
import { TeamPage } from './pages/TeamPage';
import { UpdatePasswordPage } from './pages/UpdatePasswordPage';
import { VisionMissionPage } from './pages/VisionMissionPage';
import { LeadershipPage } from './pages/LeadershipPage';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    // Get initial page from URL hash or default to home
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  const handleNavigate = (page, params) => {
    const hash = params ? `${page}/${params}` : page;
    setCurrentPage(hash);
    // Update URL hash for browser back/forward support
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Set initial hash if not present
    if (!window.location.hash) {
      window.location.hash = 'home';
    }

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const renderPage = () => {
    const page = currentPage.split('/')[0];
    switch (page) {
      case 'home':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <HomePage onNavigate={handleNavigate} currentPage={currentPage} />
          </div>
        );
      case 'update-password':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <UpdatePasswordPage onNavigate={handleNavigate} />
          </div>
        );
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
              <DirectoryPage onNavigate={handleNavigate} />
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
      case 'mentorship':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <MentorshipPage onNavigate={handleNavigate} />
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
              <StoriesPage onNavigate={handleNavigate} />
            </div>
          </div>
        );
      case 'story-detail':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <StoryDetailPage onNavigate={handleNavigate} />
            </div>
          </div>
        );


      case 'vision-mission':
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <VisionMissionPage />
          </div>
        );
      case 'leadership':
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <LeadershipPage />
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
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <TeamPage />
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <DashboardPage onNavigate={handleNavigate} />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              {currentPage.includes('/') ? (
                <ProfilePage onNavigate={handleNavigate} userId={currentPage.split('/')[1]} />
              ) : (
                <ProfilePage onNavigate={handleNavigate} userId={currentPage.split('/')[1]} />
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <HomePage onNavigate={handleNavigate} currentPage={currentPage} />
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
          {renderPage()}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

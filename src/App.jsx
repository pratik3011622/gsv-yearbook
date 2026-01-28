import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { EventsPage } from './pages/EventsPage';
import { JobsPage } from './pages/JobsPage';
import { StoriesPage } from './pages/StoriesPage';
import { CreateStoryPage } from './pages/CreateStoryPage';
import { StoryDetailPage } from './pages/StoryDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { VideoGalleryPage } from './pages/VideoGalleryPage';
import { PhotoGalleryPage } from './pages/PhotoGalleryPage';
import { MagazinePage } from './pages/MagazinePage';
import { MentorshipPage } from './pages/MentorshipPage';
import { TeamPage } from './pages/TeamPage';
import { UpdatePasswordPage } from './pages/UpdatePasswordPage';
import { VisionMissionPage } from './pages/VisionMissionPage';
import { LeadershipPage } from './pages/LeadershipPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { VerificationSentPage } from './pages/VerificationSentPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// Main App Content that uses Auth Context
function AppContent() {
  const { user, loading } = useAuth();
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

  // FIX: Handle redirection via side effect, not during render
  useEffect(() => {
    if (user && (currentPage === 'login' || currentPage === 'register')) {
      handleNavigate('home');
    }
  }, [user, currentPage]);

  const renderPage = () => {
    // FIX: Show global loading spinner to prevent redirect flashes
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    const page = currentPage.split('/')[0];
    const pageId = currentPage.split('/')[1];

    // Public routes that anyone can see
    const publicPages = ['home', 'login', 'register', 'vision-mission', 'leadership', 'team', 'magazine', 'photo-gallery', 'video-gallery', 'forgot-password', 'verification-sent'];
    const isPublic = publicPages.includes(page);

    // 1. If not logged in and trying to access protected route -> Login
    if (!user && !isPublic) {
      return <LoginPage onNavigate={handleNavigate} />;
    }

    // 2. If logged in but domain is NOT @gsv.ac.in -> Block/Signout 
    // (This is redundant because AuthContext handles it, but good for safety)
    if (user && user.email && !user.email.endsWith('@gsv.ac.in')) {
      return <LoginPage onNavigate={handleNavigate} error="Unauthorized domain." />;
    }

    // 3. If logged in but email NOT verified -> Show VerifyEmailPage (except for home/sent/vision/leadership)
    if (user && !user.emailVerified) {
      const allowedForUnverified = ['home', 'verification-sent', 'vision-mission', 'leadership'];
      if (!allowedForUnverified.includes(page)) {
        return <VerifyEmailPage />;
      }
    }

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
        // Redirect handled by useEffect, show spinner
        if (user) {
          return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
              <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          );
        }
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        // Redirect handled by useEffect
        if (user) {
          return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
              <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          );
        }
        return (
          <div className="min-h-screen">
            <RegisterPage onNavigate={handleNavigate} />
          </div>
        );

      case 'verification-sent':
        return (
          <div className="min-h-screen">
            <VerificationSentPage onNavigate={handleNavigate} />
          </div>
        );
      case 'forgot-password':
        return (
          <div className="min-h-screen">
            <ForgotPasswordPage onNavigate={handleNavigate} />
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
              <StoryDetailPage onNavigate={handleNavigate} storyId={pageId} />
            </div>
          </div>
        );
      case 'create-story':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              {/* No ID means create mode */}
              <CreateStoryPage onNavigate={handleNavigate} />
            </div>
          </div>
        );
      case 'edit-story':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              {/* Pass ID for edit mode. The component uses useParams usually, 
                  but since we are manual routing, we might need to pass it as prop 
                  or the component needs to read hash. 
                  Let's pass it as prop to be safe/consistent with StoryDetailPage approach.
               */}
              <CreateStoryPage onNavigate={handleNavigate} storyId={pageId} />
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
      case 'profile':
        return (
          <div className="min-h-screen">
            <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-20">
              <ProfilePage onNavigate={handleNavigate} userId={currentPage.includes('/') ? currentPage.split('/')[1] : null} />
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
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

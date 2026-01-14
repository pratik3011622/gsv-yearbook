import { useState, useEffect } from 'react';
import { Mail, Lock, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export const LoginPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const { signIn, googleSignIn } = useAuth();

  // Load Google Sign-In script
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleSignIn();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        initializeGoogleSignIn();
      };
    };

    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        // Initialize OAuth 2.0 client for custom button
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: '859998354363-s2969bd9n10albsqevp5iu28ko9ft2aq.apps.googleusercontent.com',
          scope: 'openid email profile',
          callback: async (tokenResponse) => {
            if (tokenResponse.access_token) {
              // Get user info using the access token
              try {
                const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                  headers: {
                    'Authorization': `Bearer ${tokenResponse.access_token}`
                  }
                });
                const userInfo = await response.json();

                // Create a mock ID token-like object for our backend
                const mockIdToken = btoa(JSON.stringify({
                  sub: userInfo.id,
                  email: userInfo.email,
                  name: userInfo.name,
                  picture: userInfo.picture,
                  aud: '859998354363-s2969bd9n10albsqevp5iu28ko9ft2aq.apps.googleusercontent.com',
                  iss: 'https://accounts.google.com'
                }));

                await handleGoogleSignIn({ credential: mockIdToken });
              } catch (error) {
                console.error('Error getting user info:', error);
                setError('Failed to get user information from Google');
                setGoogleLoading(false);
              }
            } else {
              setError('Google authorization failed');
              setGoogleLoading(false);
            }
          },
        });

        // Store tokenClient for use in button click
        window.googleTokenClient = tokenClient;
        setGoogleReady(true);
      }
    };

    loadGoogleScript();
  }, []);

  const handleGoogleSignIn = async (response) => {
    setGoogleLoading(true);
    setError('');

    try {
      await googleSignIn(response.credential);
      onNavigate('home');
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      onNavigate('home');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email) => {
    // TODO: Implement password reset with new backend
    alert("Password reset functionality will be available soon!");
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl mb-4 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/d/d2/Gati_Shakti_Vishwavidyalaya_Logo.png"
              alt="Gati Shakti Vishwavidyalaya Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Sign in to continue your GSVConnect journey
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-xl p-10 border border-slate-200 dark:border-slate-700">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                if (googleReady && window.googleTokenClient) {
                  setGoogleLoading(true);
                  window.googleTokenClient.requestAccessToken();
                } else {
                  alert('Google Sign-In not ready yet. Please wait...');
                }
              }}
              disabled={googleLoading || loading || !googleReady}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {googleLoading ? 'Signing in...' : googleReady ? 'Continue with Google' : 'Loading Google...'}
              </span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">or</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Join GSVConnect
              </button>
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="mt-8 w-full py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

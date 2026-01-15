import { useState } from 'react';
import { Mail, Lock, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export const LoginPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

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

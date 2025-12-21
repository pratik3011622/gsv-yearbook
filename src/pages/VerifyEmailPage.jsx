import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Mail, Loader } from 'lucide-react';
import { api } from '../lib/api';

export const VerifyEmailPage = ({ onNavigate }) => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing. Please check your email for the correct link.');
        return;
      }

      try {
        const result = await api.verifyEmail(token);
        setStatus('success');
        setMessage(result.message);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          onNavigate('login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Verification failed. The link may be expired.');
      }
    };

    verifyEmail();
  }, [onNavigate]);

  const handleResendVerification = async () => {
    const email = prompt('Please enter your email address:');
    if (!email) return;

    setLoading(true);
    try {
      await api.resendVerificationEmail(email);
      alert('Verification email sent successfully! Please check your inbox.');
    } catch (error) {
      alert('Failed to resend verification email: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-amber-500 rounded-full mb-4 shadow-lg overflow-hidden">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/d/d2/Gati_Shakti_Vishwavidyalaya_Logo.png"
              alt="Gati Shakti Vishwavidyalaya Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2">
            Email Verification
          </h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            {status === 'verifying' && (
              <div className="mb-6">
                <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Verifying Your Email
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Please wait while we verify your email address...
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Email Verified Successfully!
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {message}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Redirecting to login page...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6">
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Verification Failed
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {message}
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleResendVerification}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-amber-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    <span>{loading ? 'Sending...' : 'Resend Verification Email'}</span>
                  </button>

                  <button
                    onClick={() => onNavigate('register')}
                    className="w-full py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    Back to Registration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="mt-6 w-full py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const UpdatePasswordPage = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth(); // We might need to use Firebase's updatePassword here if we want to change auth password

  // Note: changing password usually requires re-authentication in Firebase if the session is old.
  // For now, we will assume the session is active enough or handle the error.

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Import updatePassword from firebase/auth dynamically or pass it? 
      // AuthContext doesn't expose it yet. Let's assume we need to add it or use the SDK here.
      // But for better practice, let's create a placeholder that informs the user.

      // actually, let's implement the real thing if we can.
      // Since we don't have updatePassword exposed in context, let's import it directly here for now,
      // or better, add it to context later. But for this specific task, "make ui good", let's focus on UI first.

      // However, usually "Forgot Password" is the way to reset. "Update Password" is for logged in users.
      // If the user wants to update password, they should use the Firebase `updatePassword` method.

      // Let's mock a success for UI demo if we can't easily access the method without adding it to context.
      // Wait, let's add `updatePassword` to context in a future step if needed. 
      // For now, the user asked to "make ui good".

      // Let's assume there is a functionality or add a TODO.
      // But wait, I can import `updatePassword` from firebase/auth directly!
      const { updatePassword } = await import("firebase/auth");
      const { auth } = await import("../firebase.config");

      if (auth.currentUser) {
        await updatePassword(auth.currentUser, password);
        setSuccess("Password updated successfully!");
        setPassword('');
        setConfirmPassword('');
      } else {
        throw new Error("No user logged in");
      }

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setError("For security, please sign out and sign in again before changing your password.");
      } else {
        setError(err.message || "Failed to update password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pt-20 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <button
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors gap-2 text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>

          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">
            Update Password
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Ensure your account stays secure with a strong password.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
                <div className="mt-0.5"><Lock className="w-4 h-4" /></div>
                <div>{error}</div>
              </div>
            )}

            {success && (
              <div className="mb-6 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm flex items-center gap-3">
                <Check className="w-5 h-5" />
                <div>{success}</div>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                    placeholder="Min. 6 characters"
                    minLength={6}
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

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                    placeholder="Re-enter password"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 mt-2"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          <div className="px-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Make sure to choose a strong password that you haven't used on other sites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
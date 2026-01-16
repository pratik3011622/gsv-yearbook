import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ForgotPasswordPage = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            await resetPassword(email);
            setMessage('Check your inbox for password reset instructions.');
        } catch (err) {
            console.error(err);
            setError('Failed to reset password. Please check if the email is correct.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl mb-4 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                        Reset Password
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Enter your email to receive reset instructions
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                    {error && (
                        <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
                            {message}
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
                                    placeholder="you@gsv.ac.in"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                        >
                            {loading ? 'Sending Instructions...' : 'Reset Password'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => onNavigate('login')}
                            className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

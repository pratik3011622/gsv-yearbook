import { useState, useEffect } from 'react';
import { Mail, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const VerifyEmailPage = () => {
    const { user, signOut, checkEmailVerification, resendVerificationEmail } = useAuth();
    const [checking, setChecking] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendStatus, setResendStatus] = useState('');

    const handleCheckManual = async () => {
        setChecking(true);
        const isVerified = await checkEmailVerification();
        if (isVerified && user) {
            // Sync handled at registration, just refresh
            window.location.reload();
        } else if (!isVerified) {
            alert('Email not yet verified. Please check your inbox (and spam folder).');
        }
        setChecking(false);
    };

    const handleResend = async () => {
        setResending(true);
        setResendStatus('');
        try {
            await resendVerificationEmail();
            setResendStatus('Verification email sent! Check your inbox.');
            setTimeout(() => setResendStatus(''), 5000);
        } catch (error) {
            setResendStatus('Failed to resend. Please try again later.');
        } finally {
            setResending(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            const isVerified = await checkEmailVerification();
            if (isVerified && user) {
                // Sync handled at registration, interval clears
                clearInterval(interval);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 text-center">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Mail className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
                    </span>
                </div>

                <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                    Verify Your Email
                </h2>

                <p className="text-slate-600 dark:text-slate-300 mb-8">
                    We've sent a verification link to <span className="font-semibold text-slate-900 dark:text-white">{user?.email}</span>.
                    <br /><br />
                    Please click the link in that email to activate your account. This page will update automatically once verified.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={handleCheckManual}
                        disabled={checking}
                        className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                        <RefreshCw className={`w-5 h-5 ${checking ? 'animate-spin' : ''}`} />
                        <span>{checking ? 'Checking Status...' : 'I Have Verified It'}</span>
                    </button>

                    <button
                        onClick={handleResend}
                        disabled={resending}
                        className="w-full py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-full hover:bg-slate-50 dark:hover:bg-slate-600 transition-all flex items-center justify-center space-x-2"
                    >
                        <Mail className={`w-4 h-4 ${resending ? 'animate-pulse' : ''}`} />
                        <span>{resending ? 'Resending...' : 'Resend Verification Email'}</span>
                    </button>

                    {resendStatus && (
                        <p className={`text-sm mt-2 ${resendStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                            {resendStatus}
                        </p>
                    )}

                    <button
                        onClick={() => signOut()}
                        className="w-full py-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium flex items-center justify-center space-x-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

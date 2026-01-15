import { Mail } from 'lucide-react';

export const VerificationSentPage = ({ onNavigate }) => {
    return (
        <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center">
            <div className="max-w-md w-full px-4">
                <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-xl p-10 border border-slate-200 dark:border-slate-700 text-center animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        Verification Link Sent
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-8">
                        We've sent a verification email to your inbox.
                        <br /><br />
                        Please check your email and click the link to verify your account.
                    </p>
                    <button
                        onClick={() => onNavigate('login')}
                        className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        Okay, Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

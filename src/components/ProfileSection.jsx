import { useAuth } from '../contexts/AuthContext';
import { User, LogOut } from 'lucide-react';

export const ProfileSection = ({ onNavigate }) => {
  const { user, profile, signOut } = useAuth();

  if (!user || !profile) return null;

  return (
    <div className="flex items-center space-x-4">
      {/* Profile Button */}
      <button
        onClick={() => onNavigate('profile')}
        className="group relative flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-white/15 to-white/10 dark:from-slate-800/60 dark:to-slate-700/60 backdrop-blur-md rounded-xl border border-white/30 dark:border-slate-600/50 hover:border-white/50 dark:hover:border-slate-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 dark:hover:shadow-slate-900/20 hover:-translate-y-0.5"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base shadow-inner group-hover:scale-110 transition-transform duration-300">
            {profile.fullName?.charAt(0) || 'U'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
        </div>
        <div className="text-left">
          <span className="text-white font-semibold text-sm block group-hover:text-blue-100 transition-colors">
            {profile.fullName}
          </span>
          <span className="text-white/70 text-xs capitalize group-hover:text-white/90 transition-colors">
            {profile.role}
          </span>
        </div>
        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {/* Sign Out Button */}
      <button
        onClick={signOut}
        className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-100 hover:text-white rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 backdrop-blur-sm border border-red-400/30 hover:border-red-400/50 flex items-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};
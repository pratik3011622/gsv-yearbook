import { useState, useEffect } from 'react';
import {
  User, Users, Calendar, Briefcase, BookOpen, Newspaper,
  CheckCircle, Circle, Sparkles, TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export const DashboardPage = ({ onNavigate }) => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({
    eventsAttending: 0,
    connectionsCount: 0,
    storiesRead: 0,
    jobsPosted: 0,
    storiesSubmitted: 0,
  });
  const [userJobs, setUserJobs] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [onboardingChecklist, setOnboardingChecklist] = useState([
    { id: 1, task: 'Complete your profile', completed: false, action: 'profile' },
    { id: 2, task: 'Browse alumni directory', completed: false, action: 'directory' },
    { id: 3, task: 'RSVP to an event', completed: false, action: 'events' },
    { id: 4, task: 'Explore job opportunities', completed: false, action: 'jobs' },
    { id: 5, task: 'Read an alumni story', completed: false, action: 'stories' },
  ]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      checkOnboardingProgress();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Get user's mentorship sessions as a proxy for activity
      const sessions = await api.getMySessions();

      // Get all jobs and filter user's jobs
      const allJobs = await api.getJobs();
      const userJobsData = allJobs.filter(job => job.postedBy?._id === user?.id);

      // Get all stories and filter user's stories (this would need a backend endpoint for proper implementation)
      // For now, we'll show placeholder data
      const userStoriesData = []; // TODO: Add backend endpoint for user's stories

      setUserJobs(userJobsData);
      setUserStories(userStoriesData);

      setStats((prev) => ({
        ...prev,
        eventsAttending: sessions?.length || 0,
        jobsPosted: userJobsData.length,
        storiesSubmitted: userStoriesData.length,
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const checkOnboardingProgress = () => {
    const updatedChecklist = onboardingChecklist.map((item) => {
      let completed = false;

      if (item.id === 1) {
        completed = !!(profile?.fullName && profile?.department && profile?.batchYear);
      }

      return { ...item, completed };
    });

    setOnboardingChecklist(updatedChecklist);
  };

  const quickActions = [
    {
      icon: Users,
      title: 'Alumni Directory',
      description: 'Connect with fellow alumni',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      action: 'directory',
    },
    {
      icon: Calendar,
      title: 'Events',
      description: 'Browse upcoming reunions',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      action: 'events',
    },
    {
      icon: Briefcase,
      title: 'Jobs',
      description: 'Explore opportunities',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      action: 'jobs',
    },
  ];

  const completedTasks = onboardingChecklist.filter((item) => item.completed).length;
  const progressPercentage = (completedTasks / onboardingChecklist.length) * 100;

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Please login to view your dashboard
          </h2>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white">
              Welcome back, {profile?.fullName?.split(' ')[0] || 'Friend'}!
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Here's what's happening in your AlumniVerse
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-2">Your Progress</h2>
                  <p className="text-white/90">
                    {completedTasks} of {onboardingChecklist.length} tasks completed
                  </p>
                </div>
                <div className="text-4xl font-bold">
                  {Math.round(progressPercentage)}%
                </div>
              </div>

              <div className="w-full bg-white/20 rounded-full h-3 mb-6">
                <div
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="space-y-3">
                {onboardingChecklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.action)}
                    className="w-full flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all text-left"
                  >
                    {item.completed ? (
                      <CheckCircle className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-white/60 flex-shrink-0" />
                    )}
                    <span className={item.completed ? 'line-through text-white/70' : ''}>
                      {item.task}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => onNavigate(action.action)}
                      className="group p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:shadow-md transition-all duration-300 text-left border border-slate-200 dark:border-slate-700 hover:-translate-y-1"
                    >
                      <div className={`${action.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`} />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {action.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md">
                  {profile?.fullName?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {profile?.fullName}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {profile?.userType === 'alumni' ? 'Alumni' : 'Student'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {profile?.batchYear && (
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium mr-2">Batch:</span>
                    <span>{profile.batchYear}</span>
                  </div>
                )}
                {profile?.department && (
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium mr-2">Department:</span>
                    <span>{profile.department}</span>
                  </div>
                )}
                {profile?.currentCompany && (
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium mr-2">Company:</span>
                    <span>{profile.currentCompany}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                Your Activity
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600/50">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Events Attending
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {stats.eventsAttending}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600/50">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Connections
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {stats.connectionsCount}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600/50">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Jobs Posted
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {stats.jobsPosted}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600/50">
                  <div className="flex items-center space-x-3">
                    <Newspaper className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Stories Submitted
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {stats.storiesSubmitted}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

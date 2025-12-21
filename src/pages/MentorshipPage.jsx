import { useState, useEffect } from 'react';
import { Users, MessageCircle, Calendar, Star, UserPlus, CheckCircle, Clock, Award } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const MentorshipPage = () => {
  const [mentors, setMentors] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('find');
  const [requestForm, setRequestForm] = useState({
    mentorId: '',
    topic: '',
    message: '',
    preferredTime: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { profile } = useAuth();

  const isAlumni = profile?.role === 'alumni';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mentorsData, sessionsData] = await Promise.all([
        api.getAvailableMentors(),
        isAlumni ? api.getMySessions() : Promise.resolve([])
      ]);

      setMentors(mentorsData || []);
      setMySessions(sessionsData || []);
    } catch (error) {
      console.error('Error fetching mentorship data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async (e) => {
    e.preventDefault();
    if (!requestForm.mentorId || !requestForm.topic || !requestForm.message) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await api.requestMentorship(requestForm);
      alert('Mentorship request sent successfully!');
      setRequestForm({
        mentorId: '',
        topic: '',
        message: '',
        preferredTime: ''
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error requesting mentorship:', error);
      alert('Failed to send mentorship request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      'pending': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', label: 'Pending' },
      'accepted': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Accepted' },
      'completed': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Completed' },
      'cancelled': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', label: 'Cancelled' }
    };
    return statuses[status] || { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300', label: status };
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 opacity-10">
        {/* Subtle geometric patterns */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-blue-200 dark:border-blue-800 rounded-lg rotate-12"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-indigo-200 dark:border-indigo-800 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-slate-300 dark:border-slate-700 rounded-lg -rotate-6"></div>
        <div className="absolute top-1/3 right-10 w-28 h-28 border border-blue-300 dark:border-blue-700 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-36 h-36 border border-indigo-200 dark:border-indigo-800 rounded-lg rotate-45"></div>
        <div className="absolute top-60 left-1/3 w-20 h-20 border border-slate-400 dark:border-slate-600 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 border border-blue-300 dark:border-blue-700 rounded-lg"></div>
        <div className="absolute top-80 right-1/4 w-24 h-24 border border-indigo-300 dark:border-indigo-700 rounded-full"></div>

        {/* Professional grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center relative">
          {/* Decorative elements around title */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 relative">
            Mentorship Program
            <div className="absolute -top-2 -right-8 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full animate-bounce-subtle opacity-80"></div>
            <div className="absolute -bottom-2 -left-8 w-4 h-4 bg-gradient-to-br from-slate-400 to-blue-400 rounded-full animate-bounce-subtle opacity-80" style={{ animationDelay: '1s' }}></div>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto leading-relaxed">
            Connect with experienced alumni mentors to guide your career journey and personal growth
          </p>

          {isAlumni && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setActiveTab('find')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'find'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Find Mentors
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'sessions'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                My Sessions
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'find' && (
              <div className="space-y-8">
                {/* Available Mentors */}
                <div>
                  <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                    Available Mentors
                  </h2>

                  {mentors.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl shadow-lg">
                      <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        No mentors available
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Check back later for available mentors
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mentors.map((mentor) => (
                        <div
                          key={mentor._id}
                          className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-800"
                        >
                          <div className="h-32 bg-gradient-to-br from-blue-500 to-amber-500"></div>

                          <div className="relative px-6 pb-6">
                            <div className="absolute -top-16 left-6">
                              <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center text-4xl font-bold text-blue-600 dark:text-blue-400">
                                {mentor.fullName?.charAt(0) || '?'}
                              </div>
                            </div>

                            <div className="pt-20">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                {mentor.fullName}
                              </h3>

                              {mentor.currentCompany && (
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-2">
                                  <Award className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                                  <span>{mentor.currentCompany}</span>
                                </div>
                              )}

                              {mentor.jobTitle && (
                                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                                  {mentor.jobTitle}
                                </p>
                              )}

                              {mentor.expertise && mentor.expertise.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {mentor.expertise.slice(0, 3).map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {isAlumni && (
                                <button
                                  onClick={() => {
                                    setRequestForm(prev => ({ ...prev, mentorId: mentor._id }));
                                    setActiveTab('request');
                                  }}
                                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                  <UserPlus className="w-4 h-4" />
                                  <span>Request Mentorship</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'request' && isAlumni && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                    Request Mentorship
                  </h2>

                  <form onSubmit={handleRequestMentorship} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Topic/Area of Interest *
                      </label>
                      <input
                        type="text"
                        value={requestForm.topic}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, topic: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="e.g., Career guidance, Entrepreneurship, Technical skills"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        value={requestForm.message}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="Tell the mentor about your background, goals, and what you'd like to achieve from this mentorship..."
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Preferred Time (Optional)
                      </label>
                      <input
                        type="text"
                        value={requestForm.preferredTime}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="e.g., Weekends, Evenings, Any time"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setActiveTab('find')}
                        className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Sending Request...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Send Request
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && isAlumni && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                  My Mentorship Sessions
                </h2>

                {mySessions.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl shadow-lg">
                    <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      No sessions yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Start by requesting mentorship from available mentors
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mySessions.map((session) => (
                      <div
                        key={session._id}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                                {session.mentorId?.fullName?.charAt(0) || '?'}
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                  Session with {session.mentorId?.fullName}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {session.topic}
                                </p>
                              </div>
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 mb-3">
                              {session.message}
                            </p>

                            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-500">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>Requested {new Date(session.createdAt).toLocaleDateString()}</span>
                              </div>
                              {session.scheduledAt && (
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>Scheduled for {new Date(session.scheduledAt).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            {(() => {
                              const statusBadge = getStatusBadge(session.status);
                              return (
                                <span className={`px-3 py-1 ${statusBadge.bg} ${statusBadge.text} text-sm font-semibold rounded-full`}>
                                  {statusBadge.label}
                                </span>
                              );
                            })()}

                            {session.status === 'accepted' && (
                              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Join Session
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!isAlumni && (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl shadow-lg">
                <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Mentorship for Alumni Only
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Become an alumni member to access our mentorship program and connect with experienced mentors
                </p>
                <button
                  onClick={() => window.location.href = '/register'}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Join as Alumni
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
import { useState, useEffect } from 'react';
import { Users, MessageCircle, Calendar, Star, UserPlus, CheckCircle, Clock, Award } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const MentorshipPage = ({ onNavigate }) => {
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
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Mentorship Program
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Connect with experienced alumni mentors to guide your career journey and personal growth
          </p>

          {isAlumni && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setActiveTab('find')}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === 'find'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
              >
                Find Mentors
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === 'sessions'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
              >
                My Sessions
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'find' && (
              <div className="space-y-8">
                {/* Available Mentors */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary-600" />
                    Available Mentors
                  </h2>

                  {mentors.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                      <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        No mentors available yet
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Check back later or invite alumni to join as mentors
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mentors.map((mentor) => (
                        <div
                          key={mentor._id}
                          className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-600"></div>

                          <div className="relative px-6 pb-6">
                            <div className="absolute -top-12 left-6">
                              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm">
                                <div className="w-full h-full bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-3xl font-bold text-primary-600 dark:text-primary-400">
                                  {mentor.fullName?.charAt(0) || '?'}
                                </div>
                              </div>
                            </div>

                            <div className="pt-14">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                                {mentor.fullName}
                              </h3>

                              {mentor.currentCompany && (
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-2">
                                  <Award className="w-4 h-4 mr-2 text-primary-600" />
                                  <span>{mentor.currentCompany}</span>
                                  {mentor.jobTitle && <span className="mx-1">• {mentor.jobTitle}</span>}
                                </div>
                              )}

                              {mentor.expertise && mentor.expertise.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6 mt-3">
                                  {mentor.expertise.slice(0, 3).map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-md"
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
                                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all shadow-sm hover:shadow"
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
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
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
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
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
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
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
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                        placeholder="e.g., Weekends, Evenings, Any time"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setActiveTab('find')}
                        className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Sending...
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
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                  My Mentorship Sessions
                </h2>

                {mySessions.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
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
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                                {session.mentorId?.fullName?.charAt(0) || '?'}
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                  Session with {session.mentorId?.fullName}
                                </h3>
                                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                  {session.topic}
                                </p>
                              </div>
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm">
                              "{session.message}"
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1.5" />
                                <span>Requested {new Date(session.createdAt).toLocaleDateString()}</span>
                              </div>
                              {session.scheduledAt && (
                                <div className="flex items-center text-primary-600 dark:text-primary-400">
                                  <Calendar className="w-4 h-4 mr-1.5" />
                                  <span>Scheduled for {new Date(session.scheduledAt).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-start lg:items-end space-y-3 min-w-[140px]">
                            {(() => {
                              const statusBadge = getStatusBadge(session.status);
                              return (
                                <span className={`px-3 py-1 ${statusBadge.bg} ${statusBadge.text} text-xs font-semibold rounded-full uppercase tracking-wider`}>
                                  {statusBadge.label}
                                </span>
                              );
                            })()}

                            {session.status === 'accepted' && (
                              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center text-sm shadow-sm">
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
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 max-w-3xl mx-auto">
                <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Mentorship for Alumni Only
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
                  Become an alumni member to access our mentorship program and connect with experienced mentors
                </p>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
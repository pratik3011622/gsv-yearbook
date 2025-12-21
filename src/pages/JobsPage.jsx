import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Clock, Plus, Building2, Briefcase } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const JobsPage = () => {
     const [jobs, setJobs] = useState([]);
     const [loading, setLoading] = useState(true);
     const [showPostJobModal, setShowPostJobModal] = useState(false);
     const [filter, setFilter] = useState('all');
     const [jobForm, setJobForm] = useState({
       title: '',
       company: '',
       description: '',
       location: '',
       jobType: 'full-time',
       domain: '',
       skillsRequired: [],
       applyUrl: '',
       salaryRange: '',
     });
     const [posting, setPosting] = useState(false);
     const { user, profile } = useAuth();

    const isLoggedIn = !!user;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await api.getJobs();
      // Sort by newest first, featured jobs first
      const sortedData = (data || []).sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setJobs(sortedData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };


  const handlePostJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await api.createJob(jobForm);
      setShowPostJobModal(false);
      setJobForm({
        title: '',
        company: '',
        description: '',
        location: '',
        jobType: 'full-time',
        domain: '',
        skillsRequired: [],
        applyUrl: '',
        salaryRange: '',
      });
      fetchJobs(); // Refresh the jobs list
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const getJobTypeBadge = (jobType) => {
    const types = {
      'full-time': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Full-Time' },
      'part-time': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Part-Time' },
      'contract': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', label: 'Contract' },
      'internship': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', label: 'Internship' },
      'freelance': { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', label: 'Freelance' },
      'remote': { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', label: 'Remote' }
    };
    return types[jobType] || { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300', label: jobType };
  };

  const getDomainBadge = (domain) => {
    const domains = {
      'technology': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300' },
      'engineering': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
      'business': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
      'finance': { bg: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-700 dark:text-lime-300' },
      'marketing': { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300' },
      'design': { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300' },
      'healthcare': { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300' },
      'education': { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-300' }
    };
    return domains[domain.toLowerCase()] || { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' };
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-slate-700 rounded-lg rotate-12"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-slate-700 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-slate-700 rounded-lg -rotate-6"></div>
        <div className="absolute top-1/3 right-10 w-28 h-28 border border-slate-700 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-36 h-36 border border-slate-700 rounded-lg rotate-45"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Job Board
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Discover career opportunities shared by our alumni network
          </p>

          {isLoggedIn && (
            <div className="mt-8">
              <button
                onClick={() => setShowPostJobModal(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Post a Job
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isLoggedIn ? 'No jobs posted yet' : 'No jobs available'}
            </h3>
            <p className="text-slate-400">
              {isLoggedIn ? 'Be the first to post a job opportunity' : 'Check back later for new opportunities'}
            </p>
          </div>
        ) : (
          /* Job Cards */
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id || job.id}
                className={`bg-slate-900 rounded-2xl p-6 border transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 ${
                  job.isFeatured
                    ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Company Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-900 border border-slate-700">
                        {job.company?.charAt(0) || 'C'}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Job Title & Featured Badge */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-2xl font-bold text-white truncate">
                          {job.title}
                        </h3>
                        {job.isFeatured && (
                          <span className="ml-3 px-3 py-1 bg-yellow-500 text-slate-900 text-xs font-bold rounded-full border border-yellow-400">
                            FEATURED
                          </span>
                        )}
                      </div>

                      {/* Company Name */}
                      <p className="text-slate-300 text-lg font-medium mb-3">
                        {job.company}
                      </p>

                      {/* Job Meta Row */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{job.location || 'Remote'}</span>
                        </div>
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-1" />
                          <span className="capitalize">{job.jobType?.replace('-', ' ') || 'Full-time'}</span>
                        </div>
                        {job.salaryRange && (
                          <div className="flex items-center">
                            <span className="text-green-400 font-medium">{job.salaryRange}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer Row */}
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <div>
                          {job.postedBy && (
                            <span>
                              Posted by {job.postedBy.fullName} (Batch {job.postedBy.batchYear})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{getRelativeTime(job.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="ml-6 flex-shrink-0">
                    {job.applyUrl ? (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center px-6 py-3 bg-gray-600 text-gray-300 font-semibold rounded-lg cursor-not-allowed">
                        Link Unavailable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Post Job Modal */}
        {showPostJobModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Post a Job</h2>
                  <button
                    onClick={() => setShowPostJobModal(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handlePostJob} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={jobForm.title}
                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={jobForm.company}
                        onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Job Type
                      </label>
                      <select
                        value={jobForm.jobType}
                        onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Domain
                      </label>
                      <input
                        type="text"
                        value={jobForm.domain}
                        onChange={(e) => setJobForm({ ...jobForm, domain: e.target.value })}
                        placeholder="e.g., Technology, Engineering"
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        value={jobForm.salaryRange}
                        onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                        placeholder="e.g., ₹5-10 LPA, $50k-80k"
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Apply URL
                    </label>
                    <input
                      type="url"
                      value={jobForm.applyUrl}
                      onChange={(e) => setJobForm({ ...jobForm, applyUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Required Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={jobForm.skillsRequired.join(', ')}
                      onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value.split(',').map(s => s.trim()) })}
                      placeholder="e.g., JavaScript, React, Node.js"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPostJobModal(false)}
                      className="px-6 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={posting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {posting ? 'Posting...' : 'Post Job'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

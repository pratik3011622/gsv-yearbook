import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MapPin, ExternalLink, Clock, Plus, Building2, Briefcase,
  Search, Filter, X, Star, Bookmark, BookmarkCheck, Users,
  TrendingUp, DollarSign, Calendar, ChevronDown, ChevronUp, Trash2
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: 'all',
    domain: 'all',
    location: 'all',
    salaryRange: 'all'
  });
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
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
    isRemote: false,
    experienceLevel: 'entry'
  });
  const [posting, setPosting] = useState(false);
  const { user, profile } = useAuth();

  const isAlumni = profile?.role === 'alumni';
  const isLoggedIn = !!user;

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchTerm, filters]);

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

  const applyFilters = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Job type filter
    if (filters.jobType !== 'all') {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }

    // Domain filter
    if (filters.domain !== 'all') {
      filtered = filtered.filter(job => job.domain?.toLowerCase() === filters.domain);
    }

    // Location filter
    if (filters.location !== 'all') {
      if (filters.location === 'remote') {
        filtered = filtered.filter(job => job.isRemote || job.location?.toLowerCase().includes('remote'));
      } else {
        filtered = filtered.filter(job => job.location?.toLowerCase().includes(filters.location));
      }
    }

    setFilteredJobs(filtered);
  };

  const toggleBookmark = (jobId) => {
    setBookmarkedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
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

  const isPoster = (job) => {
    return user && user.id && job.postedBy === user.id;
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(jobId);
    try {
      await api.deleteJob(jobId);
      setJobs(prev => prev.filter(job => job._id !== jobId));
      setFilteredJobs(prev => prev.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
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
        isRemote: false,
        experienceLevel: 'entry'
      });
      fetchJobs(); // Refresh the jobs list
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      jobType: 'all',
      domain: 'all',
      location: 'all',
      salaryRange: 'all'
    });
    setSearchTerm('');
  };

  const getExperienceBadge = (level) => {
    return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300', label: level.charAt(0).toUpperCase() + level.slice(1) };
  };

  const getJobTypeBadge = (jobType) => {
    return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', label: jobType.replace('-', ' ') };
  };

  const getDomainBadge = (domain) => {
    return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' };
  };

  return (

    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-300 font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary-50 to-transparent dark:from-primary-900/10 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Hub</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Explore exclusive opportunities from our alumni network or share a role to help fellow graduates grow.
            </p>
          </div>

          {isAlumni && (
            <button
              onClick={() => setShowPostJobModal(true)}
              className="inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-slate-900/50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Share Opportunity
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Active Jobs', value: jobs.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Companies', value: new Set(jobs.map(j => j.company)).size, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { label: 'Alumni Posts', value: isAlumni ? jobs.filter(j => j.postedBy?.role === 'alumni').length : 'N/A', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'New This Week', value: jobs.filter(j => (new Date() - new Date(j.createdAt)) / (1000 * 60 * 60 * 24) < 7).length, icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="sticky top-4 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-2 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 mb-8">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by role, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-transparent rounded-2xl text-slate-900 dark:text-white placeholder-slate-500 focus:bg-slate-50 dark:focus:bg-slate-800 transition-all outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-semibold transition-all ${showFilters
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 mt-2 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
              {/* Filter Selects */}
              {['jobType', 'domain', 'location'].map((key) => (
                <div key={key}>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <select
                    value={filters[key]}
                    onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary-500/20 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <option value="all">All</option>
                    {key === 'jobType' && ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(o => <option key={o.toLowerCase().replace(' ', '-')} value={o.toLowerCase().replace(' ', '-')}>{o}</option>)}
                    {key === 'domain' && ['Technology', 'Engineering', 'Business', 'Finance', 'Marketing', 'Design'].map(o => <option key={o.toLowerCase()} value={o.toLowerCase()}>{o}</option>)}
                    {key === 'location' && ['Remote', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'].map(o => <option key={o.toLowerCase()} value={o.toLowerCase()}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Reset All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-500 font-medium animate-pulse">Curating opportunities...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 border-dashed">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No matches found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">We couldn't find any jobs matching your current filters. Try adjusting your search.</p>
            <button onClick={resetFilters} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:scale-105 transition-transform">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id || job.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
              >

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center text-xl font-bold text-slate-700 dark:text-white border border-slate-100 dark:border-slate-600 shadow-inner">
                      {job.company?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{job.company}</p>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    {isLoggedIn && (
                      <button
                        onClick={() => toggleBookmark(job._id)}
                        className={`p-2 rounded-xl transition-all ${bookmarkedJobs.has(job._id) ? 'bg-amber-50 text-amber-500' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400'}`}
                      >
                        {bookmarkedJobs.has(job._id) ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                    )}
                    {isPoster(job) && (
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      >
                        {deleteLoading === job._id ? <div className="w-5 h-5 border-2 border-red-500 rounded-full animate-spin border-t-transparent" /> : <Trash2 className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center">
                    <Clock className="w-3 h-3 mr-1.5" />
                    {job.jobType?.replace('-', ' ')}
                  </span>
                  {job.location && (
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center">
                      <MapPin className="w-3 h-3 mr-1.5" />
                      {job.location}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-8 h-15">
                  {job.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Posted By</span>
                    <div className="flex items-center space-x-2">
                      {job.poster?.avatarUrl ? (
                        <img src={job.poster.avatarUrl} alt={job.poster.fullName} className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-[10px] font-bold text-primary-600 dark:text-primary-400 border border-transparent">
                          {job.poster?.fullName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="flex flex-col leading-none">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {job.poster?.fullName || 'Alumni'}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {job.poster?.role ? job.poster.role.charAt(0).toUpperCase() + job.poster.role.slice(1) : ''}
                          {job.poster?.batchYear ? ` • '${job.poster.batchYear.toString().slice(-2)}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {job.applyUrl ? (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:bg-primary-600 dark:hover:bg-slate-200 transition-all shadow-lg hover:shadow-primary-600/30 dark:hover:shadow-white/20"
                    >
                      Apply
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  ) : (
                    <button disabled className="px-5 py-2.5 bg-slate-100 text-slate-400 text-sm font-bold rounded-xl cursor-not-allowed">
                      Closed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showPostJobModal && createPortal(
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-hidden">
            <div
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 rounded-t-3xl">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Opportunity</h2>
                  <p className="text-sm text-slate-500">Share a role with the network</p>
                </div>
                <button
                  onClick={() => setShowPostJobModal(false)}
                  className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <form id="jobForm" onSubmit={handlePostJob} className="space-y-6">
                  {/* Form Content - Same as before but cleaner structure */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Role Details</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Job Title *"
                          value={jobForm.title}
                          onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Company Name *"
                          value={jobForm.company}
                          onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                          required
                        />
                      </div>
                    </div>

                    <textarea
                      placeholder="Job Description *&#10;Describe the role, responsibilities, and key requirements..."
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium resize-none"
                      required
                    />

                    <div>
                      <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Location & Type</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Location (e.g. Mumbai) *"
                          value={jobForm.location}
                          onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                          required
                        />
                        <div className="relative">
                          <select
                            value={jobForm.jobType}
                            onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium appearance-none"
                          >
                            <option value="full-time">Full-Time</option>
                            <option value="part-time">Part-Time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                            <option value="freelance">Freelance</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Domain (e.g. Finance) *"
                        value={jobForm.domain}
                        onChange={(e) => setJobForm({ ...jobForm, domain: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Salary Range (Optional)"
                        value={jobForm.salaryRange}
                        onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                      />
                    </div>

                    <input
                      type="url"
                      placeholder="Application Link *"
                      value={jobForm.applyUrl}
                      onChange={(e) => setJobForm({ ...jobForm, applyUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Required Skills (comma separated)"
                      value={jobForm.skillsRequired.join(', ')}
                      onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                    />

                    <label className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={jobForm.isRemote}
                        onChange={(e) => setJobForm({ ...jobForm, isRemote: e.target.checked })}
                        className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 border-slate-300"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">This role allows remote work</span>
                    </label>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-3xl">
                <button
                  type="submit"
                  form="jobForm"
                  disabled={posting}
                  className="w-full py-4 bg-gradient-to-r from-slate-900 to-black dark:from-white dark:to-slate-200 text-white dark:text-slate-900 font-bold rounded-2xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
                >
                  {posting ? 'Publishing Opportunity...' : 'Post Opportunity'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

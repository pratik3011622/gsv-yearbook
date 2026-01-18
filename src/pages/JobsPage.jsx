import { useState, useEffect } from 'react';
import {
  MapPin, ExternalLink, Clock, Plus, Building2, Briefcase,
  Search, Filter, X, Star, Bookmark, BookmarkCheck, Users,
  TrendingUp, DollarSign, Calendar, ChevronDown, ChevronUp
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Career Hub
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover exclusive career opportunities shared by our distinguished alumni network
          </p>

          {isAlumni && (
            <div className="mt-8">
              <button
                onClick={() => setShowPostJobModal(true)}
                className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary-600/30 transform hover:-translate-y-1"
              >
                <Plus className="w-5 h-5 mr-2" />
                Share Opportunity
              </button>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-slate-900 dark:text-white">{jobs.length}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Active Jobs</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Building2 className="w-6 h-6 text-green-700 dark:text-green-400" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-slate-900 dark:text-white">{new Set(jobs.map(job => job.company)).size}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Companies</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-700 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-slate-900 dark:text-white">{isAlumni ? jobs.filter(job => job.postedBy?.role === 'alumni').length : 'N/A'}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Alumni Posts</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-slate-900 dark:text-white">{jobs.filter(job => job.isFeatured).length}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Featured</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:border-black dark:focus:border-white transition-all outline-none"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-all font-serif"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Domain</label>
                  <select
                    value={filters.domain}
                    onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Domains</option>
                    <option value="technology">Technology</option>
                    <option value="engineering">Engineering</option>
                    <option value="business">Business</option>
                    <option value="finance">Finance</option>
                    <option value="marketing">Marketing</option>
                    <option value="design">Design</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="chennai">Chennai</option>
                    <option value="vadodara">Vadodara</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">Loading career opportunities...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200 dark:border-slate-700">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {jobs.length === 0 ? 'No opportunities yet' : 'No jobs match your filters'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {jobs.length === 0
                ? 'Our alumni network is growing. Check back soon for exciting career opportunities.'
                : 'Try adjusting your search criteria or filters to find more opportunities.'
              }
            </p>
            {jobs.length > 0 && (
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          /* Job Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id || job.id}
                className={`group bg-white dark:bg-slate-800 rounded-lg border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden flex flex-col ${job.isFeatured
                  ? 'border-slate-300 dark:border-slate-600'
                  : 'border-slate-200 dark:border-slate-700'
                  }`}
              >
                {/* Featured Badge */}
                {job.isFeatured && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                      Featured
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-600">
                          {job.company?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm border-b border-transparent inline-block pb-0.5">{job.company}</p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="uppercase tracking-wide">{job.location || 'Remote'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bookmark Button */}
                    {isLoggedIn && (
                      <button
                        onClick={() => toggleBookmark(job._id)}
                        className="flex-shrink-0 p-3 text-slate-400 hover:text-amber-400 transition-colors rounded-xl hover:bg-slate-800/50"
                      >
                        {bookmarkedJobs.has(job._id) ? (
                          <BookmarkCheck className="w-5 h-5" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Job Details */}
                  <div className="space-y-3 mb-6">
                    {/* Key Info Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="flex items-center text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 rounded px-2.5 py-1.5 border border-slate-200 dark:border-slate-700">
                        <Briefcase className="w-3 h-3 mr-1.5" />
                        <span className="font-medium capitalize">{job.jobType?.replace('-', ' ') || 'Full-time'}</span>
                      </div>
                      {job.salaryRange && (
                        <div className="flex items-center text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 rounded px-2.5 py-1.5 border border-slate-200 dark:border-slate-700">
                          <DollarSign className="w-3 h-3 mr-1.5" />
                          <span className="font-medium">{job.salaryRange}</span>
                        </div>
                      )}
                      <div className="flex items-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/30 rounded px-2.5 py-1.5">
                        <Clock className="w-3 h-3 mr-1.5" />
                        <span className="font-medium">{getRelativeTime(job.createdAt)}</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {job.domain && (
                        <span className={`px-2.5 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700`}>
                          {job.domain}
                        </span>
                      )}
                      {job.experienceLevel && (
                        <span className={`px-2.5 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700`}>
                          {getExperienceBadge(job.experienceLevel).label}
                        </span>
                      )}
                    </div>

                    {/* Description Preview */}
                    {job.description && (
                      <div className="mt-2 text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {job.description}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700 mt-auto">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {job.poster && (
                        <span className="font-medium">Posted by {job.poster.fullName}</span>
                      )}
                    </div>

                    {/* Apply Button */}
                    <div className="flex-shrink-0">
                      {job.applyUrl ? (
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 font-semibold rounded-lg cursor-not-allowed border border-slate-200 dark:border-slate-600">
                          Link Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Post Job Modal */}
        {showPostJobModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                      <Plus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Share Career Opportunity</h2>
                  </div>
                  <button
                    onClick={() => setShowPostJobModal(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handlePostJob} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={jobForm.title}
                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="e.g., Senior Software Engineer"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Company *
                      </label>
                      <input
                        type="text"
                        value={jobForm.company}
                        onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="e.g., Google, Microsoft"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Job Description *
                    </label>
                    <textarea
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="e.g., Mumbai, Remote"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Job Type
                      </label>
                      <select
                        value={jobForm.jobType}
                        onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      >
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                        <option value="freelance">Freelance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Domain *
                      </label>
                      <input
                        type="text"
                        value={jobForm.domain}
                        onChange={(e) => setJobForm({ ...jobForm, domain: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="e.g., Technology, Engineering"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        value={jobForm.salaryRange}
                        onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="e.g., ₹5-10 LPA, $50k-80k"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Application URL *
                    </label>
                    <input
                      type="url"
                      value={jobForm.applyUrl}
                      onChange={(e) => setJobForm({ ...jobForm, applyUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="https://company.com/careers/job-id"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Required Skills
                    </label>
                    <input
                      type="text"
                      value={jobForm.skillsRequired.join(', ')}
                      onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="e.g., JavaScript, React, Node.js, Python"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isRemote"
                      checked={jobForm.isRemote}
                      onChange={(e) => setJobForm({ ...jobForm, isRemote: e.target.checked })}
                      className="w-4 h-4 text-primary-600 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <label htmlFor="isRemote" className="text-sm text-slate-700 dark:text-slate-300">
                      This is a remote work opportunity
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setShowPostJobModal(false)}
                      className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={posting}
                      className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {posting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Posting...</span>
                        </div>
                      ) : (
                        'Share Opportunity'
                      )}
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

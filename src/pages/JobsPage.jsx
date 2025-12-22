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
    const levels = {
      'entry': { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Entry Level' },
      'mid': { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Mid Level' },
      'senior': { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Senior Level' },
      'executive': { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Executive' }
    };
    return levels[level] || levels.entry;
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-slate-900" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Career Hub
            </h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover exclusive career opportunities shared by our distinguished alumni network
          </p>

          {isAlumni && (
            <div className="mt-8">
              <button
                onClick={() => setShowPostJobModal(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-1"
              >
                <Plus className="w-5 h-5 mr-2" />
                Share Opportunity
              </button>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{jobs.length}</p>
                <p className="text-slate-400 text-sm">Active Jobs</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{new Set(jobs.map(job => job.company)).size}</p>
                <p className="text-slate-400 text-sm">Companies</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{isAlumni ? jobs.filter(job => job.postedBy?.role === 'alumni').length : 'N/A'}</p>
                <p className="text-slate-400 text-sm">Alumni Posts</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{jobs.filter(job => job.isFeatured).length}</p>
                <p className="text-slate-400 text-sm">Featured</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:border-amber-500/50 transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Domain</label>
                  <select
                    value={filters.domain}
                    onChange={(e) => setFilters({...filters, domain: e.target.value})}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                    className="w-full p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors"
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
            <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">Loading career opportunities...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {jobs.length === 0 ? 'No opportunities yet' : 'No jobs match your filters'}
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              {jobs.length === 0
                ? 'Our alumni network is growing. Check back soon for exciting career opportunities.'
                : 'Try adjusting your search criteria or filters to find more opportunities.'
              }
            </p>
            {jobs.length > 0 && (
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          /* Job Cards Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredJobs.map((job) => (
              <div
                key={job._id || job.id}
                className={`group bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-3xl border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden ${
                  job.isFeatured
                    ? 'border-amber-400/50 shadow-xl shadow-amber-500/20 bg-gradient-to-br from-amber-500/10 to-yellow-500/10'
                    : 'border-slate-700/50 hover:border-amber-400/40 hover:shadow-amber-500/20'
                }`}
              >
                {/* Top accent bar */}
                <div className={`h-1 ${job.isFeatured ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : 'bg-gradient-to-r from-slate-600 to-slate-700'}`}></div>

                {/* Featured Badge */}
                {job.isFeatured && (
                  <div className="absolute -top-3 left-8 z-10">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      FEATURED
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-5 flex-1">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-900 shadow-xl group-hover:shadow-amber-500/30 transition-all duration-300">
                          {job.company?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors duration-300 line-clamp-2">
                          {job.title}
                        </h3>
                        <p className="text-slate-300 font-semibold text-lg">{job.company}</p>
                        <div className="flex items-center space-x-2 text-sm text-slate-400 mt-1">
                          <MapPin className="w-4 h-4 text-green-400" />
                          <span>{job.location || 'Remote'}</span>
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
                  <div className="space-y-4 mb-8">
                    {/* Key Info Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center text-slate-300 bg-slate-800/50 rounded-xl px-3 py-2 border border-slate-700/50">
                        <Briefcase className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="font-medium capitalize">{job.jobType?.replace('-', ' ') || 'Full-time'}</span>
                      </div>
                      {job.salaryRange && (
                        <div className="flex items-center text-green-300 bg-slate-800/50 rounded-xl px-3 py-2 border border-slate-700/50">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span className="font-semibold">{job.salaryRange}</span>
                        </div>
                      )}
                      <div className="flex items-center text-slate-300 bg-slate-800/50 rounded-xl px-3 py-2 border border-slate-700/50">
                        <Clock className="w-4 h-4 mr-2 text-purple-400" />
                        <span className="font-medium">{getRelativeTime(job.createdAt)}</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {job.domain && (
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getDomainBadge(job.domain).bg} ${getDomainBadge(job.domain).text} border border-opacity-30`}>
                          {job.domain}
                        </span>
                      )}
                      {job.experienceLevel && (
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getExperienceBadge(job.experienceLevel).bg} ${getExperienceBadge(job.experienceLevel).text} border border-opacity-30`}>
                          {getExperienceBadge(job.experienceLevel).label}
                        </span>
                      )}
                      {getJobTypeBadge(job.jobType).label && (
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getJobTypeBadge(job.jobType).bg} ${getJobTypeBadge(job.jobType).text} border border-opacity-30`}>
                          {getJobTypeBadge(job.jobType).label}
                        </span>
                      )}
                    </div>

                    {/* Description Preview */}
                    {job.description && (
                      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                          {job.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
                    <div className="text-sm text-slate-400">
                      {job.postedBy && (
                        <span className="font-medium text-slate-300">Posted by {job.postedBy.fullName}</span>
                      )}
                    </div>

                    {/* Apply Button */}
                    <div className="flex-shrink-0">
                      {job.applyUrl ? (
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/40 transform hover:-translate-y-1 hover:scale-105"
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center px-6 py-3 bg-slate-700/80 text-slate-400 font-semibold rounded-xl cursor-not-allowed border border-slate-600">
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
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                      <Plus className="w-5 h-5 text-slate-900" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Share Career Opportunity</h2>
                  </div>
                  <button
                    onClick={() => setShowPostJobModal(false)}
                    className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handlePostJob} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={jobForm.title}
                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="e.g., Senior Software Engineer"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Company *
                      </label>
                      <input
                        type="text"
                        value={jobForm.company}
                        onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                      placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="e.g., Mumbai, Remote"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Job Type
                      </label>
                      <select
                        value={jobForm.jobType}
                        onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Domain *
                      </label>
                      <input
                        type="text"
                        value={jobForm.domain}
                        onChange={(e) => setJobForm({ ...jobForm, domain: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="e.g., Technology, Engineering"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        value={jobForm.salaryRange}
                        onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="e.g., ₹5-10 LPA, $50k-80k"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Application URL *
                    </label>
                    <input
                      type="url"
                      value={jobForm.applyUrl}
                      onChange={(e) => setJobForm({ ...jobForm, applyUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="https://company.com/careers/job-id"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Required Skills
                    </label>
                    <input
                      type="text"
                      value={jobForm.skillsRequired.join(', ')}
                      onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="e.g., JavaScript, React, Node.js, Python"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isRemote"
                      checked={jobForm.isRemote}
                      onChange={(e) => setJobForm({ ...jobForm, isRemote: e.target.checked })}
                      className="w-4 h-4 text-amber-500 bg-slate-800 border-slate-700 rounded focus:ring-amber-500 focus:ring-2"
                    />
                    <label htmlFor="isRemote" className="text-sm text-slate-300">
                      This is a remote work opportunity
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
                    <button
                      type="button"
                      onClick={() => setShowPostJobModal(false)}
                      className="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={posting}
                      className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {posting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
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

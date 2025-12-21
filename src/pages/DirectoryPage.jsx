import { useState, useEffect } from 'react';
import { Search, MapPin, Linkedin, Briefcase, GraduationCap, Filter, X } from 'lucide-react';
import { api } from '../lib/api';

export const DirectoryPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [batchYearFilter, setBatchYearFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, batchYearFilter, departmentFilter, profiles]);

  const fetchProfiles = async () => {
    try {
      const data = await api.getProfiles();
      // Sort by batch year (latest first)
      const sortedData = (data || []).sort((a, b) => (b.batchYear || 0) - (a.batchYear || 0));
      setProfiles(sortedData);
      setFilteredProfiles(sortedData);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = profiles;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (profile) =>
          profile.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply batch year filter
    if (batchYearFilter) {
      filtered = filtered.filter((profile) => profile.batchYear === batchYearFilter);
    }

    // Apply department filter
    if (departmentFilter) {
      filtered = filtered.filter((profile) => profile.department === departmentFilter);
    }

    setFilteredProfiles(filtered);
  };

  // Get unique batch years and departments for filter options
  const batchYears = [...new Set(profiles.map(p => p.batchYear).filter(Boolean))].sort((a, b) => b - a);
  const departments = [...new Set(profiles.map(p => p.department).filter(Boolean))].sort();

  const clearFilters = () => {
    setSearchTerm('');
    setBatchYearFilter('');
    setDepartmentFilter('');
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
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Alumni Directory
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Connect with {filteredProfiles.length} alumni from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or company..."
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {/* Batch Year Filter */}
            <div className="relative">
              <select
                value={batchYearFilter}
                onChange={(e) => setBatchYearFilter(e.target.value)}
                className="appearance-none bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 pr-8 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Batch Years</option>
                {batchYears.map((year) => (
                  <option key={year} value={year}>
                    Batch {year}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="appearance-none bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 pr-8 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || batchYearFilter || departmentFilter) && (
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'No alumni found' : 'No alumni yet'}
            </h3>
            <p className="text-slate-400">
              {searchTerm ? 'Try adjusting your search' : 'Check back later'}
            </p>
          </div>
        ) : (
          /* Alumni Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <div
                key={profile._id || profile.id}
                className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-20 h-20 rounded-full object-cover border-2 border-slate-700"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl font-bold text-slate-900 border-2 border-slate-700">
                      {profile.fullName?.charAt(0) || '?'}
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-white text-center mb-2">
                  {profile.fullName}
                </h3>

                {/* Degree + Branch + Batch */}
                <div className="text-center mb-4">
                  <p className="text-slate-400 text-sm">
                    {profile.department} • {profile.batchYear}
                  </p>
                </div>

                {/* Company */}
                {profile.company && (
                  <div className="flex items-center justify-center mb-3">
                    <Briefcase className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-slate-300 text-sm font-medium">{profile.company}</span>
                  </div>
                )}

                {/* Location */}
                {profile.location && (
                  <div className="flex items-center justify-center mb-4">
                    <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-slate-400 text-sm">{profile.location}</span>
                  </div>
                )}

                {/* LinkedIn Profile Link */}
                {profile.linkedinUrl && (
                  <div className="flex items-center justify-center mb-4">
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn Profile
                    </a>
                  </div>
                )}

                {/* Connect Button */}
                {profile.linkedinUrl && (
                  <div className="text-center">
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      Connect on LinkedIn
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

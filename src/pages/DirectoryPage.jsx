import { useState, useEffect } from 'react';
import { Search, MapPin, Linkedin, Briefcase, GraduationCap, Filter, X, Users, Building2, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../lib/api';

export const DirectoryPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [batchYearFilter, setBatchYearFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, batchYearFilter, departmentFilter, locationFilter, profiles]);

  const fetchProfiles = async () => {
    try {
      const data = await api.getProfiles();
      // Filter to show only alumni profiles, then sort by batch year (latest first)
      const alumniOnly = (data || []).filter(profile => profile.role === 'alumni');
      const sortedData = alumniOnly.sort((a, b) => (b.batchYear || 0) - (a.batchYear || 0));
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

    // Apply location filter
    if (locationFilter) {
      if (locationFilter === 'remote') {
        filtered = filtered.filter(profile => profile.location?.toLowerCase().includes('remote'));
      } else {
        filtered = filtered.filter(profile => profile.location?.toLowerCase().includes(locationFilter));
      }
    }

    setFilteredProfiles(filtered);
  };

  // Get unique batch years, departments, and locations for filter options
  const batchYears = [...new Set(profiles.map(p => p.batchYear).filter(Boolean))].sort((a, b) => b - a);
  const departments = [...new Set(profiles.map(p => p.department).filter(Boolean))].sort();
  const locations = [...new Set(profiles.map(p => p.location).filter(Boolean))].sort();

  const clearFilters = () => {
    setSearchTerm('');
    setBatchYearFilter('');
    setDepartmentFilter('');
    setLocationFilter('');
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
              <Users className="w-6 h-6 text-slate-900" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Alumni Directory
            </h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect with {filteredProfiles.length} distinguished alumni from around the world
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{profiles.length}</p>
                <p className="text-slate-400 text-sm">Total Alumni</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{new Set(profiles.map(p => p.company).filter(Boolean)).size}</p>
                <p className="text-slate-400 text-sm">Companies</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{batchYears.length}</p>
                <p className="text-slate-400 text-sm">Batch Years</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{departments.length}</p>
                <p className="text-slate-400 text-sm">Departments</p>
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
                placeholder="Search by name, company, or skills..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Batch Year</label>
                  <select
                    value={batchYearFilter}
                    onChange={(e) => setBatchYearFilter(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">All Batch Years</option>
                    {batchYears.map((year) => (
                      <option key={year} value={year}>
                        Batch {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="chennai">Chennai</option>
                    <option value="vadodara">Vadodara</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="relative">
              <div className="inline-block w-20 h-20 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-6"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-amber-400/50 rounded-full animate-spin animation-delay-300"></div>
            </div>
            <p className="text-slate-400 text-lg font-medium">Connecting with distinguished alumni...</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse animation-delay-400"></div>
            </div>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative mx-auto mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center border border-slate-700/50 shadow-2xl">
                <GraduationCap className="w-12 h-12 text-slate-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                <Users className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              {profiles.length === 0 ? 'Building Our Community' : 'No Matches Found'}
            </h3>
            <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              {profiles.length === 0
                ? 'Our distinguished alumni network is growing. Be among the first to join and connect with fellow graduates from Gati Shakti Vishwavidyalaya.'
                : 'Try adjusting your search criteria or filters to discover more alumni in our network.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {profiles.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-1"
                >
                  Reset Filters
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-semibold transition-all duration-300 border border-slate-600 hover:border-slate-500 shadow-lg hover:shadow-slate-900/50"
              >
                Refresh Directory
              </button>
            </div>
          </div>
        ) : (
          /* Alumni Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProfiles.map((profile) => (
              <div
                key={profile._id || profile.id}
                className="group bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-700/50 hover:border-amber-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-2 overflow-hidden"
              >
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-amber-400 to-yellow-500"></div>

                <div className="p-8">
                  {/* Header with Avatar and Basic Info */}
                  <div className="flex items-start space-x-5 mb-6">
                    <div className="flex-shrink-0 relative">
                      {profile.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt={profile.fullName}
                          className="w-20 h-20 rounded-2xl object-cover border-3 border-slate-600 shadow-xl group-hover:border-amber-400/50 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-900 shadow-xl group-hover:shadow-amber-500/30 transition-all duration-300">
                          {profile.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                      {/* Online indicator */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-slate-900 rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors duration-300 line-clamp-1">
                        {profile.fullName}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-slate-300 mb-1">
                        <GraduationCap className="w-4 h-4 text-amber-400" />
                        <span className="font-medium">{profile.department}</span>
                      </div>
                      <div className="text-sm text-slate-400">
                        Batch of {profile.batchYear}
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="space-y-4 mb-8">
                    {profile.company && (
                      <div className="flex items-center text-slate-200 bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                        <Briefcase className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Company</div>
                          <div className="text-sm font-medium line-clamp-1">{profile.company}</div>
                        </div>
                      </div>
                    )}

                    {profile.location && (
                      <div className="flex items-center text-slate-200 bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                        <MapPin className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Location</div>
                          <div className="text-sm font-medium">{profile.location}</div>
                        </div>
                      </div>
                    )}

                    {/* Skills/Interests Preview */}
                    {profile.skills && profile.skills.length > 0 && (
                      <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
                        <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">Skills & Expertise</div>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 text-xs font-semibold rounded-full border border-amber-500/30 hover:bg-amber-500/30 transition-colors duration-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {profile.skills.length > 4 && (
                            <span className="px-3 py-1.5 bg-slate-700 text-slate-400 text-xs font-semibold rounded-full border border-slate-600">
                              +{profile.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/40 transform hover:-translate-y-1 hover:scale-105"
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        Connect
                      </a>
                    )}

                    <button className="flex-1 inline-flex items-center justify-center px-5 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-bold rounded-xl transition-all duration-300 border border-slate-600 hover:border-slate-500 shadow-lg hover:shadow-slate-900/50 transform hover:-translate-y-1 hover:scale-105">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

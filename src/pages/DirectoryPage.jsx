import { useState, useEffect } from 'react';
import { Search, MapPin, Linkedin, Briefcase, GraduationCap, Filter, X, Users, Building2, Award, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const DirectoryPage = ({ onNavigate }) => {
  const { user } = useAuth();
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
      const profilesArray = Array.isArray(data) ? data : [];
      // Filter to show only alumni profiles, then sort by batch year (latest first)
      const alumniOnly = profilesArray.filter(profile => profile.role === 'alumni');
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

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Please login to view the alumni directory
          </h2>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-slate-400 dark:border-slate-700 rounded-lg rotate-12"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-slate-400 dark:border-slate-700 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-slate-400 dark:border-slate-700 rounded-lg -rotate-6"></div>
        <div className="absolute top-1/3 right-10 w-28 h-28 border border-slate-400 dark:border-slate-700 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-36 h-36 border border-slate-400 dark:border-slate-700 rounded-lg rotate-45"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Alumni Directory
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect with <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredProfiles.length}</span> distinguished alumni from around the world
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{profiles.length}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">Total Alumni</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{new Set(profiles.map(p => p.company).filter(Boolean)).size}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">Companies</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{batchYears.length}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">Batch Years</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{departments.length}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">Departments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 mb-12 shadow-lg shadow-slate-200/50 dark:shadow-none">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-all shadow-inner"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-between space-x-3 px-8 py-4 border-2 rounded-2xl font-semibold transition-all duration-300 min-w-[160px] ${showFilters
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
            >
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </div>
              {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700/50 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 ml-1">Batch Year</label>
                  <div className="relative">
                    <select
                      value={batchYearFilter}
                      onChange={(e) => setBatchYearFilter(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="">All Batch Years</option>
                      {batchYears.map((year) => (
                        <option key={year} value={year}>
                          Batch {year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 ml-1">Department</label>
                  <div className="relative">
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 ml-1">Location</label>
                  <div className="relative">
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="">All Locations</option>
                      <option value="remote">Remote</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="chennai">Chennai</option>
                      <option value="vadodara">Vadodara</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 text-sm font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Premium Grid Layout */}
        {loading ? (
          <div className="text-center py-24">
            <div className="relative mb-8">
              <div className="inline-block w-20 h-20 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Connecting with distinguished alumni...</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm opacity-0 animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards">
            <div className="relative mx-auto mb-8">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-800">
                <Search className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No Matches Found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">We couldn't find any alumni matching your criteria. Try adjusting your filters or search terms.</p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-0.5"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <div
                key={profile._id || profile.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center">
                      {profile.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt={profile.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-slate-400">
                          {profile.fullName?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors line-clamp-1">
                        {profile.fullName}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {profile.company || 'Open to work'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {profile.batchYear && (
                    <span className="px-3 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center">
                      <GraduationCap className="w-3 h-3 mr-1.5" />
                      Class of {profile.batchYear}
                    </span>
                  )}
                  {profile.department && (
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center">
                      <Award className="w-3 h-3 mr-1.5" />
                      {profile.department}
                    </span>
                  )}
                  {profile.location && (
                    <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center">
                      <MapPin className="w-3 h-3 mr-1.5" />
                      {profile.location}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5 mt-auto">
                  <div className="flex items-center">
                    {profile.linkedinUrl ? (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-[#0077b5] hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    ) : (
                      <div className="p-2 text-slate-300 dark:text-slate-700">
                        <Linkedin className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigate('profile', profile._id)}
                    className="inline-flex items-center px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:bg-primary-600 dark:hover:bg-slate-200 transition-all shadow-lg hover:shadow-primary-600/30 dark:hover:shadow-white/20"
                  >
                    View Profile
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div >
  );
};

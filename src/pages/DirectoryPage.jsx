import { useState, useEffect } from 'react';
import { Search, MapPin, Linkedin, Briefcase, GraduationCap, Filter, X, Users, Building2, Award, ChevronDown, ChevronUp } from 'lucide-react';
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
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Alumni Directory
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect with <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredProfiles.length}</span> distinguished alumni from around the world
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8">
            {filteredProfiles.map((profile) => (
              <div key={profile._id || profile.id} className="group flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-800 hover:-translate-y-2 transition-all duration-300">
                {/* Card Header Background */}
                <div className="h-28 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-600 to-transparent"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-400/10 rounded-full blur-2xl"></div>
                </div>

                <div className="px-7 pb-7 pt-0 flex-1 flex flex-col relative">
                  <div className="w-24 h-24 mx-auto -mt-12 mb-5 relative group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl shadow-sm rotate-3 opacity-50"></div>
                    <div className="relative w-full h-full rounded-2xl p-1 bg-white dark:bg-slate-800 shadow-lg">
                      {profile.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt={profile.fullName}
                          className="w-full h-full object-cover rounded-xl bg-slate-50 dark:bg-slate-900"
                        />
                      ) : (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-3xl font-bold text-slate-300 dark:text-slate-500">
                          {profile.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    {/* Status Indicator */}
                    <span className="absolute bottom-[-4px] right-[-4px] w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 bg-green-500 shadow-sm z-10"></span>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-1 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {profile.fullName}
                    </h3>
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 mb-2">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                        {profile.department}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      Batch of {profile.batchYear}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {profile.company ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-slate-400">
                          <Briefcase size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{profile.company}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50 opacity-50">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-slate-400">
                          <Briefcase size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-400 italic">Open to opportunities</span>
                      </div>
                    )}

                    {profile.location && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-slate-400">
                          <MapPin size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{profile.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex gap-3">
                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-400 hover:bg-[#0077b5] hover:text-white transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:border-[#0077b5] hover:shadow-lg hover:shadow-[#0077b5]/30 group/linkedin"
                      >
                        <Linkedin size={20} className="transform group-hover/linkedin:scale-110 transition-transform" />
                      </a>
                    )}
                    <button
                      onClick={() => onNavigate('profile', profile._id)}
                      className="flex-1 h-12 rounded-xl bg-slate-900 dark:bg-white hover:bg-primary-600 dark:hover:bg-primary-400 text-white dark:text-slate-900 font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
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

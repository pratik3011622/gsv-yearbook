import { useState, useEffect } from 'react';
import {
  BookOpen, Eye, Clock, Quote, User, Edit3, Trash2, Plus, ChevronRight, Tag,
  Search, Filter, X, ChevronDown, ChevronUp, TrendingUp
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const StoriesPage = ({ onNavigate }) => {
  const [stories, setStories] = useState([]);
  const [featuredStory, setFeaturedStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { profile, user } = useAuth();

  const isAlumni = profile?.role === 'alumni';

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredStories, setFilteredStories] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: 'newest',
    readTime: 'all'
  });

  useEffect(() => {
    applyFilters();
  }, [stories, searchTerm, filters]);

  const applyFilters = () => {
    let filtered = [...stories];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.author?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Read Time filter
    if (filters.readTime !== 'all') {
      if (filters.readTime === 'short') { // < 5 mins
        filtered = filtered.filter(story => (story.readTime || 5) < 5);
      } else if (filters.readTime === 'medium') { // 5-10 mins
        filtered = filtered.filter(story => (story.readTime || 5) >= 5 && (story.readTime || 5) <= 10);
      } else if (filters.readTime === 'long') { // > 10 mins
        filtered = filtered.filter(story => (story.readTime || 5) > 10);
      }
    }

    // Sort
    if (filters.sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    }

    setFilteredStories(filtered);
  };

  const resetFilters = () => {
    setFilters({ sortBy: 'newest', readTime: 'all' });
    setSearchTerm('');
  };

  // Calculate stats
  const totalStories = stories.length;
  const totalViews = stories.reduce((sum, story) => sum + (story.viewsCount || 0), 0);
  const uniqueAuthors = new Set(stories.map(story => story.authorId).filter(Boolean)).size;
  const featuredCount = stories.filter(story => story.isFeatured).length;

  useEffect(() => {
    fetchStories();

    // Check if there's story data to edit from localStorage
    const editStoryData = localStorage.getItem('editStoryData');
    if (editStoryData) {
      const storyToEdit = JSON.parse(editStoryData);
      handleEditStory(storyToEdit);
      localStorage.removeItem('editStoryData');
    }
  }, []);

  const fetchStories = async () => {
    try {
      const [allStories, featured] = await Promise.all([
        api.getStories(),
        api.getFeaturedStories()
      ]);

      setStories(allStories || []);
      setFeaturedStory(featured && featured.length > 0 ? featured[0] : null);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleEditStory = (story) => {
    onNavigate('edit-story', story._id || story.id);
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteStory(storyId);
      setStories(prev => prev.filter(story => story._id !== storyId));

      // Remove from featured if it was featured
      if (featuredStory && featuredStory._id === storyId) {
        setFeaturedStory(null);
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story. Please try again.');
    }
  };

  const isAuthor = (story) => {
    return user && user.id && story.authorId && story.authorId === user.id;
  };



  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-300 font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary-50 to-transparent dark:from-primary-900/10 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Stories</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Inspiring journeys and success stories from our distinguished alumni community.
            </p>
          </div>

          {isAlumni && (
            <button
              onClick={() => onNavigate('create-story')}
              className="inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-slate-900/50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Share Your Story
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Success Stories', value: totalStories, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { label: 'Storytellers', value: uniqueAuthors, icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'Featured', value: featuredCount, icon: Tag, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' }
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
                placeholder="Search stories, authors, or topics..."
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
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary-500/20 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Read Time</label>
                <select
                  value={filters.readTime}
                  onChange={(e) => setFilters({ ...filters, readTime: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary-500/20 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <option value="all">Any Length</option>
                  <option value="short">Short (&lt; 5 min)</option>
                  <option value="medium">Medium (5-10 min)</option>
                  <option value="long">Long (&gt; 10 min)</option>
                </select>
              </div>
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

        {/* Stories Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading stories...</p>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 border-dashed">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No stories found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">We couldn't find any stories matching your current filters.</p>
            <button onClick={resetFilters} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:scale-105 transition-transform">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredStories.map((story) => (
              <div
                key={story._id || story.id}
                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col group h-full"
              >
                {/* Cover Image */}
                <div className="relative h-40 overflow-hidden">
                  {story.coverImageUrl ? (
                    <img
                      src={story.coverImageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                  {story.isFeatured && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold uppercase tracking-wide rounded-lg shadow-lg">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex space-x-1">
                    {isAuthor(story) && (
                      <div className="flex bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-1 shadow-sm">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditStory(story); }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteStory(story._id); }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center">
                      <Clock className="w-3 h-3 mr-1.5" />
                      {story.readTime || 5} min
                    </span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center">
                      <Eye className="w-3 h-3 mr-1.5" />
                      {story.viewsCount || 0}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight transition-colors line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-6 flex-1">
                    {story.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5 mt-auto">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
                        {/* Fallback avatar logic */}
                        <div className="w-full h-full flex items-center justify-center bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-bold text-sm">
                          {story.author?.fullName?.charAt(0) || 'A'}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">
                          {story.author?.fullName || 'Alumni'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {story.author?.batchYear ? `Batch '${story.author.batchYear.toString().slice(-2)}` : 'Writer'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        localStorage.setItem('selectedStoryId', story._id || story.id);
                        onNavigate('story-detail');
                      }}
                      className="inline-flex items-center px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:bg-primary-600 dark:hover:bg-slate-200 transition-all shadow-lg"
                    >
                      Read
                      <ChevronRight className="w-3 h-3 ml-1.5" />
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

import { useState, useEffect } from 'react';
import { BookOpen, Eye, Clock, Quote, User, Edit3, Trash2, Plus, ChevronRight, Tag } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const StoriesPage = ({ onNavigate }) => {
  const [stories, setStories] = useState([]);
  const [featuredStory, setFeaturedStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { profile, user } = useAuth();

  const isAlumni = profile?.role === 'alumni';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">Stories</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6">
            Success Stories
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Inspiring journeys and success stories from our distinguished alumni community
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalStories}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Success Stories</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalViews.toLocaleString()}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Views</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{uniqueAuthors}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Storytellers</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{featuredCount}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Featured</p>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURED STORY SECTION */}
        {featuredStory && (
          <div className="mb-16">
            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                {/* Left side: Cover Image */}
                <div className="relative h-64 lg:h-full">
                  {featuredStory.coverImageUrl ? (
                    <img
                      src={featuredStory.coverImageUrl}
                      alt={featuredStory.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <BookOpen className="w-24 h-24 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                  {/* Featured Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-bold rounded-full shadow-lg">
                      FEATURED
                    </span>
                  </div>
                </div>

                {/* Right side: Story Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 text-primary-600 dark:text-primary-400 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredStory.readTime || 5} min read</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{featuredStory.viewsCount || 0} views</span>
                    </div>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                    {featuredStory.title}
                  </h2>

                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {featuredStory.excerpt}
                  </p>

                  {featuredStory.highlightQuote && (
                    <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary-500 rounded-r-lg">
                      <Quote className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                      <p className="text-slate-700 dark:text-primary-100 italic">
                        "{featuredStory.highlightQuote}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-slate-600 dark:text-slate-300">
                      <p className="font-semibold text-slate-900 dark:text-white text-lg">{featuredStory.authorId?.fullName}</p>
                      {featuredStory.authorId?.batchYear && (
                        <p className="text-sm">Batch of {featuredStory.authorId.batchYear}</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        localStorage.setItem('selectedStoryId', featuredStory._id || featuredStory.id);
                        onNavigate('story-detail');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Read Story
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MORE STORIES SECTION */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            More Stories
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No stories yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {isAlumni
                  ? "Be the first to share your journey"
                  : "Check back later for inspiring stories from alumni"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {stories.filter(story => story._id !== featuredStory?._id).map((story) => (
                <article
                  key={story._id || story.id}
                  className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {story.coverImageUrl && (
                    <div className="relative h-40 overflow-hidden flex-shrink-0">
                      <img
                        src={story.coverImageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-grow">
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-medium">{story.readTime || 5} min</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{story.viewsCount || 0}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-tight">
                      {story.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                      {story.excerpt}
                    </p>

                    {/* Author Info and Actions */}
                    <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-700 mt-auto">
                      <div className="flex items-center space-x-3 min-w-0 flex-1 mr-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-800">
                          {story.author?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 dark:text-white text-sm truncate">
                            {story.author?.fullName}
                          </p>
                          {story.author?.batchYear && (
                            <p className="text-slate-500 dark:text-slate-400 text-xs truncate font-medium">
                              Batch {story.author.batchYear}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {isAuthor(story) && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEditStory(story); }}
                              className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                              title="Edit Story"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteStory(story._id); }}
                              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                              title="Delete Story"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => {
                            localStorage.setItem('selectedStoryId', story._id || story.id);
                            onNavigate('story-detail');
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-700 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 rounded-full transition-all duration-300 ml-1"
                          title="Read Story"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* SHARE A STORY SECTION */}
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="max-w-2xl mx-auto px-4">
            {isAlumni ? (
              <>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Share Your Story
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Inspire the next generation with your journey. Your story could be the motivation someone needs.
                </p>
                <button
                  onClick={() => onNavigate('create-story')}
                  className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-1"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Share Your Story
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Join Our Community
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Become an alumni to share your inspiring journey and connect with fellow graduates.
                </p>
                <button
                  onClick={() => onNavigate('register')}
                  className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-1"
                >
                  <User className="w-5 h-5 mr-2" />
                  Become Alumni
                </button>
              </>
            )}
          </div>
        </div>
      </div >


    </div >
  );
};

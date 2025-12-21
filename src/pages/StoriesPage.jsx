import { useState, useEffect } from 'react';
import { BookOpen, Eye, Calendar, Tag, ChevronRight, Plus, X, Upload, Save, Clock, Quote } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const StoriesPage = ({ onNavigate }) => {
     const [stories, setStories] = useState([]);
     const [featuredStory, setFeaturedStory] = useState(null);
     const [loading, setLoading] = useState(true);
     const [showCreateModal, setShowCreateModal] = useState(false);
     const [creating, setCreating] = useState(false);
     const [storyForm, setStoryForm] = useState({
         title: '',
         excerpt: '',
         content: '',
         highlightQuote: '',
         tags: [],
         coverImageUrl: ''
     });
     const { profile } = useAuth();

     const isAlumni = profile?.role === 'alumni';

   useEffect(() => {
     fetchStories();
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

  const handleCreateStory = async (e) => {
    e.preventDefault();
    if (!storyForm.title.trim() || !storyForm.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const readTime = calculateReadTime(storyForm.content);
      const newStory = await api.createStory({
        ...storyForm,
        readTime,
        tags: storyForm.tags.filter(tag => tag.trim() !== '')
      });

      setStories(prev => [newStory, ...prev]);
      setShowCreateModal(false);
      setStoryForm({
        title: '',
        excerpt: '',
        content: '',
        highlightQuote: '',
        tags: [],
        coverImageUrl: ''
      });
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!storyForm.tags.includes(newTag)) {
        setStoryForm(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setStoryForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'blockquote'],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 opacity-10">
        {/* Subtle geometric patterns */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-blue-200 dark:border-blue-800 rounded-lg rotate-12"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-indigo-200 dark:border-indigo-800 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-slate-300 dark:border-slate-700 rounded-lg -rotate-6"></div>
        <div className="absolute top-1/3 right-10 w-28 h-28 border border-blue-300 dark:border-blue-700 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-36 h-36 border border-indigo-200 dark:border-indigo-800 rounded-lg rotate-45"></div>
        <div className="absolute top-60 left-1/3 w-20 h-20 border border-slate-400 dark:border-slate-600 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 border border-blue-300 dark:border-blue-700 rounded-lg"></div>
        <div className="absolute top-80 right-1/4 w-24 h-24 border border-indigo-300 dark:border-indigo-700 rounded-full"></div>

        {/* Professional grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center relative">
          {/* Decorative elements around title */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 relative">
            Success Stories
            <div className="absolute -top-2 -right-8 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full animate-bounce-subtle opacity-80"></div>
            <div className="absolute -bottom-2 -left-8 w-4 h-4 bg-gradient-to-br from-slate-400 to-blue-400 rounded-full animate-bounce-subtle opacity-80" style={{ animationDelay: '1s' }}></div>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto leading-relaxed">
            Inspiring journeys and success stories from our alumni community
          </p>
        </div>

        {/* FEATURED STORY SECTION */}
        {featuredStory && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20">
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
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                      <BookOpen className="w-24 h-24 text-slate-400" />
                    </div>
                  )}
                  {/* Featured Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold rounded-full shadow-lg">
                      FEATURED
                    </span>
                  </div>
                </div>

                {/* Right side: Story Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 text-amber-400 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredStory.readTime || 5} min read</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{featuredStory.viewsCount || 0} views</span>
                    </div>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
                    {featuredStory.title}
                  </h2>

                  <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                    {featuredStory.excerpt}
                  </p>

                  {featuredStory.highlightQuote && (
                    <div className="mb-6 p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
                      <Quote className="w-6 h-6 text-amber-400 mb-2" />
                      <p className="text-amber-100 italic">
                        "{featuredStory.highlightQuote}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-slate-300">
                      <p className="font-semibold text-white text-lg">{featuredStory.authorId?.fullName}</p>
                      {featuredStory.authorId?.batchYear && (
                        <p className="text-sm">Batch of {featuredStory.authorId.batchYear}</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        localStorage.setItem('selectedStoryId', featuredStory._id || featuredStory.id);
                        onNavigate('story-detail');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
          <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-8 text-center">
            More Stories
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl shadow-lg">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.filter(story => story._id !== featuredStory?._id).map((story) => (
                <article
                  key={story._id || story.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-800 group cursor-pointer"
                >
                  {story.coverImageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={story.coverImageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{story.readTime || 5} min read</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>{story.viewsCount || 0} views</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {story.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                      {story.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-sm">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {story.authorId?.fullName}
                        </p>
                        {story.authorId?.batchYear && (
                          <p className="text-slate-600 dark:text-slate-400">
                            Batch of {story.authorId.batchYear}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          localStorage.setItem('selectedStoryId', story._id || story.id);
                          onNavigate('story-detail');
                        }}
                        className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-medium hover:translate-x-1 transition-transform"
                      >
                        <span className="text-sm">Read →</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* SHARE A STORY SECTION */}
        {isAlumni && (
          <div className="text-center py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl border border-blue-200 dark:border-slate-700">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                Share Your Story
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Inspire the next generation with your journey. Your story could be the motivation someone needs.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Plus className="w-5 h-5 mr-2" />
                Share Your Story
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                  Share Your Story
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateStory} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Story Title *
                </label>
                <input
                  type="text"
                  value={storyForm.title}
                  onChange={(e) => setStoryForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Enter an engaging title for your story"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Excerpt *
                </label>
                <textarea
                  value={storyForm.excerpt}
                  onChange={(e) => setStoryForm(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Write a brief summary of your story (2-3 sentences)"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Highlight Quote (Optional)
                </label>
                <textarea
                  value={storyForm.highlightQuote}
                  onChange={(e) => setStoryForm(prev => ({ ...prev, highlightQuote: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="A memorable quote from your story"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Story Content *
                </label>
                <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
                  <ReactQuill
                    value={storyForm.content}
                    onChange={(content) => setStoryForm(prev => ({ ...prev, content }))}
                    modules={quillModules}
                    theme="snow"
                    placeholder="Share your inspiring journey, challenges overcome, and lessons learned..."
                    className="bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  onKeyDown={handleTagInput}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Press Enter to add tags (e.g., career, entrepreneurship, overcoming-challenges)"
                />
                {storyForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {storyForm.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={storyForm.coverImageUrl}
                  onChange={(e) => setStoryForm(prev => ({ ...prev, coverImageUrl: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="https://example.com/your-image.jpg"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Publish Story
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

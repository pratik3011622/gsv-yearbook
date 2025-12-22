import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Calendar, Clock, Tag, Share2, User, Edit3, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const StoryDetailPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthor = story && user && user.id && story.authorId && story.authorId._id === user.id;

  useEffect(() => {
    const storyId = localStorage.getItem('selectedStoryId');
    if (storyId) {
      fetchStory(storyId);
    } else {
      setError('No story selected');
      setLoading(false);
    }
  }, []);

  const fetchStory = async (storyId) => {
    try {
      const storyData = await api.getStory(storyId);
      setStory(storyData);
    } catch (error) {
      console.error('Error fetching story:', error);
      setError('Story not found');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleEditStory = () => {
    // Store story data for editing and navigate to stories page with edit mode
    localStorage.setItem('editStoryData', JSON.stringify(story));
    onNavigate('stories');
  };

  const handleDeleteStory = async () => {
    if (!window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteStory(story._id);
      alert('Story deleted successfully!');
      onNavigate('stories');
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {error || 'Story not found'}
          </h2>
          <button
            onClick={() => onNavigate('stories')}
            className="px-6 py-3 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Back Button and Actions */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('stories')}
            className="flex items-center space-x-2 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Stories</span>
          </button>

          {isAuthor && (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEditStory}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all duration-300 border border-slate-600 hover:border-slate-500"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDeleteStory}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <article className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
          {/* Cover Image */}
          {story.coverImageUrl && (
            <div className="relative h-64 lg:h-96">
              <img
                src={story.coverImageUrl}
                alt={story.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          <div className="p-8 lg:p-12">
            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {story.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400 mb-8">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(story.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {story.readTime && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{story.readTime} min read</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>{story.viewsCount || 0} views</span>
              </div>
            </div>

            {/* Author Info */}
            {story.authorId && (
              <div className="flex items-center space-x-4 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {story.authorId.fullName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {story.authorId.fullName}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Batch {story.authorId.batchYear}
                  </p>
                  {story.authorId.company && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {story.authorId.company}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Highlight Quote */}
            {story.highlightQuote && (
              <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-8 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                <p className="text-lg italic text-slate-700 dark:text-slate-300 font-medium">
                  "{story.highlightQuote}"
                </p>
              </blockquote>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                {story.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-full"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Button */}
            <div className="flex justify-center mt-12 pt-8 border-t border-slate-700">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-1 font-bold"
              >
                <Share2 className="w-5 h-5" />
                <span>Share This Story</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
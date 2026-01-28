import { useState, useRef, useMemo, useEffect } from 'react';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeft, Image as ImageIcon, X, Save, Upload, Type, Eye } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

// Custom Image Handler for ReactQuill to upload to server instead of Base64
const imageHandler = function () {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
        const file = input.files[0];
        if (file) {
            try {
                // Safe access to quill instance
                const quill = this.quill;

                // Save current cursor state
                const range = quill.getSelection(true);

                // Insert temporary placeholder
                quill.insertText(range.index, 'Uploading image...', 'bold', true);

                // Upload to backend
                const result = await api.uploadImage(file);

                // Remove placeholder
                quill.deleteText(range.index, 16); // length of 'Uploading image...'

                // Insert image from URL
                quill.insertEmbed(range.index, 'image', result.url);

                // Move cursor to next position
                quill.setSelection(range.index + 1);

            } catch (error) {
                console.error('Image upload failed:', error);
                alert('Failed to upload image. Please try again.');
                // Remove placeholder if error
                const quill = this.quill;
                const range = quill.getSelection(true);
                quill.deleteText(range.index - 16, 16);
            }
        }
    };
};

export const CreateStoryPage = ({ onNavigate, storyId }) => {
    const navigate = onNavigate; // Use standard navigation prop
    const id = storyId; // Use prop instead of params
    const { user } = useAuth();
    const fileInputRef = useRef(null);
    const quillRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(!!id);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        tags: [],
        coverImageUrl: ''
    });
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (id) {
            fetchStory();
        }
    }, [id]);

    const fetchStory = async () => {
        try {
            const story = await api.getStory(id);
            setFormData({
                title: story.title,
                excerpt: story.excerpt,
                content: story.content,
                tags: story.tags || [],
                coverImageUrl: story.coverImageUrl || ''
            });
        } catch (error) {
            console.error('Error fetching story:', error);
            alert('Failed to load story for editing.');
            navigate('/stories');
        } finally {
            setInitialLoading(false);
        }
    };

    const calculateReadTime = (content) => {
        const wordsPerMinute = 200;
        const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    const handlePublish = async () => {
        // Validation
        if (!formData.title.trim()) {
            alert('Please enter a Title for your story.');
            return;
        }
        if (!formData.content.trim()) {
            alert('Please write some Content for your story.');
            return;
        }

        setLoading(true);
        try {
            let finalCoverUrl = formData.coverImageUrl;

            // Upload new cover image if selected
            if (coverImageFile) {
                const uploadResult = await api.uploadImage(coverImageFile);
                finalCoverUrl = uploadResult.url;
            }

            const readTime = calculateReadTime(formData.content);

            // Auto-generate excerpt if empty
            let finalExcerpt = formData.excerpt.trim();
            if (!finalExcerpt) {
                // Strip HTML tags
                const plainText = formData.content.replace(/<[^>]*>/g, '');
                finalExcerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
            }

            const storyData = {
                ...formData,
                excerpt: finalExcerpt,
                coverImageUrl: finalCoverUrl,
                readTime
            };

            if (id) {
                await api.updateStory(id, storyData);
            } else {
                await api.createStory(storyData);
            }

            onNavigate('/stories');
        } catch (error) {
            console.error('Error publishing story:', error);
            const message = error.response?.data?.message || 'Failed to publish story. Please check your inputs and try again.';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditorChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleCoverImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImageFile(file);
            // Create local preview
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, coverImageUrl: previewUrl }));
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagRemove) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagRemove) }));
    };

    // Configure Quill modules with useMemo to prevent re-rendering issues
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                [{ 'font': [] }],
                ['bold', 'italic', 'underline', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                'image': imageHandler
            }
        }
    }), []);

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white pb-20">

            {/* Top Navigation Bar */}
            <nav className="sticky top-16 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 sm:px-8 py-4 transition-all">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => onNavigate('stories')}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="hidden sm:block">
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
                                {id ? 'Editing Draft' : 'New Story'}
                            </span>
                            <p className="text-xs text-slate-400">
                                Saved just now
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handlePublish}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-green-500/20 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Publish</span>
                                    <Upload className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-12">

                {/* Cover Image Section */}
                <div className="mb-12 group relative">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`
              relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden cursor-pointer 
              transition-all duration-300 border-2 border-dashed
              ${formData.coverImageUrl
                                ? 'border-transparent'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750'
                            }
            `}
                    >
                        {formData.coverImageUrl ? (
                            <img
                                src={formData.coverImageUrl}
                                alt="Cover"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                                <p className="text-lg font-medium">Add a cover image</p>
                                <p className="text-sm opacity-70">High quality images work best</p>
                            </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <button className="opacity-0 group-hover:opacity-100 bg-white/90 dark:bg-black/80 backdrop-blur text-slate-900 dark:text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-xl transition-all transform translate-y-2 group-hover:translate-y-0">
                                {formData.coverImageUrl ? 'Change Cover Image' : 'Select Image'}
                            </button>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleCoverImageSelect}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                {/* Title Input */}
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                    placeholder="Title"
                    className="w-full text-5xl sm:text-6xl font-serif font-bold bg-transparent border-none outline-none placeholder-slate-300 dark:placeholder-slate-700 text-slate-900 dark:text-white mb-6 leading-tight resize-none"
                />

                {/* Excerpt Input */}
                <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(p => ({ ...p, excerpt: e.target.value }))}
                    placeholder="Write a short teaser..."
                    rows={2}
                    className="w-full text-2xl font-light bg-transparent border-none outline-none placeholder-slate-300 dark:placeholder-slate-700 text-slate-600 dark:text-slate-400 mb-12 resize-none"
                />

                {/* Editor Wrapper */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-20 relative">
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={formData.content}
                        onChange={handleEditorChange}
                        modules={modules}
                        placeholder="Tell your story..."
                        className="min-h-[500px] border-none text-lg leading-relaxed focus:outline-none story-editor"
                    />
                </div>

                {/* Tags Section */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-8 pb-12">
                    <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center">
                        <Type className="w-5 h-5 mr-2" />
                        Topics & Tags
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {formData.tags.map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 flex items-center">
                                #{tag}
                                <button onClick={() => removeTag(tag)} className="ml-2 hover:text-red-500">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Add a tag..."
                            className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                        />
                    </div>
                </div>

            </main>

            {/* Global Styles for clean editor */}
            <style>{`
        /* Global Editor Styles */
        .story-editor .ql-container {
          border: none !important;
          font-family: 'Merriweather', serif;
        }

        /* Toolbar Styles */
        .story-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid rgba(0,0,0,0.05) !important;
          position: sticky;
          top: 0;
          z-index: 30;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          margin-bottom: 2rem;
          border-radius: 8px;
        }

        /* Dark Mode Toolbar */
        .dark .story-editor .ql-toolbar {
          background: rgba(15, 23, 42, 0.95);
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        
        /* Toolbar Content Colors */
        .dark .story-editor .ql-toolbar .ql-stroke {
          stroke: #cbd5e1 !important; /* slate-300 */
        }
        .dark .story-editor .ql-toolbar .ql-fill {
          fill: #cbd5e1 !important;
        }
        .dark .story-editor .ql-toolbar .ql-picker {
          color: #cbd5e1 !important;
        }
        .dark .story-editor .ql-toolbar .ql-picker-options {
          background-color: #1e293b !important; /* slate-800 */
          border: 1px solid #334155 !important; /* slate-700 */
        }

        /* Editor Content Styles */
        .story-editor .ql-editor {
          min-height: 400px;
          padding: 0 !important;
          font-size: 1.125rem;
        }
        
        /* Text Color - Light Mode */
        .story-editor .ql-editor p,
        .story-editor .ql-editor h1,
        .story-editor .ql-editor h2,
        .story-editor .ql-editor h3,
        .story-editor .ql-editor ul,
        .story-editor .ql-editor ol {
          margin-bottom: 1.5em;
          line-height: 1.8;
          color: #1e293b; /* slate-800 */
        }

        /* Text Color - Dark Mode */
        .dark .story-editor .ql-editor p,
        .dark .story-editor .ql-editor h1,
        .dark .story-editor .ql-editor h2,
        .dark .story-editor .ql-editor h3,
        .dark .story-editor .ql-editor ul,
        .dark .story-editor .ql-editor ol {
          color: #f1f5f9; /* slate-100 */
        }

        /* Blank/Placeholder Text Color Helper */
        .story-editor .ql-editor.ql-blank::before {
          color: #94a3b8; /* slate-400 */
          font-style: italic;
        }

        /* Force input text colors */
        input, textarea {
          color: inherit;
        }
        .dark input, .dark textarea {
          color: #ffffff !important;
        }
        
        /* Specific override for editor text in dark mode to be absolutely white */
        .dark .story-editor .ql-editor p,
        .dark .story-editor .ql-editor h1,
        .dark .story-editor .ql-editor h2,
        .dark .story-editor .ql-editor h3,
        .dark .story-editor .ql-editor ul, 
        .dark .story-editor .ql-editor ol,
        .dark .story-editor .ql-editor li,
        .dark .story-editor .ql-editor span {
           color: #ffffff !important;
        }

        .story-editor .ql-editor img {
          border-radius: 8px;
          margin: 2rem 0;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
          width: 100%;
          max-height: 600px;
          object-fit: cover;
        }
      `}</style>
        </div>
    );
};

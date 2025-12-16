import { useState, useEffect } from 'react';
import { Play, Calendar, User, X, ChevronLeft, ChevronRight } from 'lucide-react';

const videoData = [
  {
    id: 1,
    title: '1st Convocation',
    description: 'Celebrating the first convocation ceremony of Gati Shakti Vishwavidyalaya.',
    thumbnail: 'https://img.youtube.com/vi/sa3XtUb9ogs/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/sa3XtUb9ogs',
    date: '2023-07-15',
    category: 'Events',
    duration: '3:00:00'
  },
  {
    id: 2,
    title: '2nd Convocation',
    description: 'Highlights from the second convocation ceremony.',
    thumbnail: 'https://img.youtube.com/vi/0zT0VrvoB4Y/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/0zT0VrvoB4Y',
    date: '2024-07-15',
    category: 'Events',
    duration: '3:00:00'
  },
  {
    id: 3,
    title: '3rd Convocation',
    description: 'Memorable moments from the third convocation.',
    thumbnail: 'https://img.youtube.com/vi/kmbj183-LSQ/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/kmbj183-LSQ',
    date: '2025-07-15',
    category: 'Events',
    duration: '3:00:00'
  },
  {
    id: 4,
    title: 'Annual Cultural Fest Agnee 2024',
    description: 'Highlights from the Annual Cultural Fest Agnee 2024.',
    thumbnail: 'https://img.youtube.com/vi/90y5nvQmPH4/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/90y5nvQmPH4',
    date: '2024-12-01',
    category: 'Events',
    duration: '3:00:00'
  },
  {
    id: 5,
    title: 'Epitome 2025',
    description: 'Showcasing innovations and achievements at Epitome 2025.',
    thumbnail: 'https://img.youtube.com/vi/RH6C10NUc-0/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/RH6C10NUc-0',
    date: '2025-01-01',
    category: 'Academic',
    duration: '3:00:00'
  },
  {
    id: 6,
    title: 'Campus Tour',
    description: 'A virtual tour of the Gati Shakti Vishwavidyalaya campus.',
    thumbnail: 'https://img.youtube.com/vi/O9JHRjcw1kE/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/O9JHRjcw1kE',
    date: '2024-08-20',
    category: 'Campus Life',
    duration: '3:00:00'
  },
  {
    id: 7,
    title: 'Annual Cultural Fest Agnee 2023',
    description: 'Highlights from the Annual Cultural Fest Agnee 2023.',
    thumbnail: 'https://img.youtube.com/vi/SJAm2a6KGOM/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/SJAm2a6KGOM',
    date: '2023-12-01',
    category: 'Events',
    duration: '3:00:00'
  }
];

const categories = ['All', 'Events', 'Campus Life', 'Interviews', 'Academic'];

export const VideoGalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % videoData.length);
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredVideos = selectedCategory === 'All'
    ? videoData
    : videoData.filter(video => video.category === selectedCategory);

  const openVideoModal = (video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % videoData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + videoData.length) % videoData.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-indigo-25 to-purple-25 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            Video Gallery
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Relive the moments that shaped our Gati Shakti Vishwavidyalaya community through our video archives
          </p>
        </div>
        {/* Video Slideshow */}
        <div className="mb-16 relative">
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            {videoData.map((video, index) => (
              <div
                key={video.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Play className="w-10 h-10 text-white ml-1" fill="white" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-2 drop-shadow-lg">{video.title}</h3>
                    <p className="text-lg text-white/90 drop-shadow-md max-w-md mx-auto">{video.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-all"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-all"
              aria-label="Next video"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {videoData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to video ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-neutral-700 dark:text-neutral-300 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-neutral-200 dark:border-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group relative card-3d-tilt cursor-pointer overflow-hidden gpu-accelerated"
              onClick={() => openVideoModal(video)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium">
                    {video.category}
                  </span>
                  <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(video.date).toLocaleDateString()}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-gray-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {video.title}
                </h3>

                <p className="text-neutral-600 dark:text-gray-300 leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-neutral-500 dark:text-neutral-400">
              No videos found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-gray-100">
                {selectedVideo.title}
              </h3>
              <button
                onClick={closeVideoModal}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
            <div className="relative aspect-video">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-6">
              <p className="text-neutral-600 dark:text-gray-300 leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
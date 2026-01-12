import { useState } from 'react';
import { X, Calendar, MapPin, Heart } from 'lucide-react';

const photoData = [
  {
    id: 1,
    title: 'Convocation Ceremony 2024',
    description: 'Graduates celebrating their achievement with pride and joy.',
    image: '/WhatsApp Image 2025-10-21 at 23.04.13_24f84d84.jpg',
    date: '2024-07-15',
    category: 'Events',
    location: 'Main Auditorium'
  },
  {
    id: 2,
    title: 'Campus Garden View',
    description: 'The beautiful campus gardens in full bloom during spring.',
    image: '/WhatsApp Image 2025-10-21 at 23.15.20_a3ba8370.jpg',
    date: '2024-03-20',
    category: 'Campus',
    location: 'Central Garden'
  },
  {
    id: 3,
    title: 'Alumni Reunion 2023',
    description: 'Former students reconnecting and sharing memories from their college days.',
    image: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-12-10',
    category: 'Alumni',
    location: 'Alumni Center'
  },
  {
    id: 4,
    title: 'Research Lab',
    description: 'Students working on innovative projects in our state-of-the-art research facilities.',
    image: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-09-15',
    category: 'Academic',
    location: 'Research Building'
  },
  {
    id: 5,
    title: 'Sports Day 2024',
    description: 'Athletes showcasing their skills and team spirit during the annual sports meet.',
    image: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-02-28',
    category: 'Events',
    location: 'Sports Complex'
  },
  {
    id: 6,
    title: 'Library Study Area',
    description: 'Students engaged in deep study and research in our modern library.',
    image: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-11-05',
    category: 'Campus',
    location: 'Central Library'
  },
  {
    id: 7,
    title: 'Cultural Fest 2024',
    description: 'Vibrant celebrations showcasing diverse cultures and talents.',
    image: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-01-18',
    category: 'Events',
    location: 'Open Air Theatre'
  },
  {
    id: 8,
    title: 'Graduation Hall',
    description: 'The iconic graduation hall where dreams are realized and futures begin.',
    image: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-06-30',
    category: 'Campus',
    location: 'Graduation Hall'
  }
];

const categories = ['All', 'Events', 'Campus', 'Alumni', 'Academic'];

export const PhotoGalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filteredPhotos = selectedCategory === 'All'
    ? photoData
    : photoData.filter(photo => photo.category === selectedCategory);

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            Photo Gallery
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Explore the visual memories that capture the essence of our Gati Shakti Vishwavidyalaya community
          </p>
        </div>
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 text-sm tracking-wide ${selectedCategory === category
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform -translate-y-0.5'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300"
              onClick={() => openPhotoModal(photo)}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                {/* Simple Category Tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/50 text-white rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-[2px]">
                    {photo.category}
                  </span>
                </div>
              </div>

              {/* Minimal Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                  {photo.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    {new Date(photo.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                    {photo.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <p className="text-xl text-slate-500 dark:text-slate-400">
              No photos found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative max-w-5xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate pr-4">
                {selectedPhoto.title}
              </h3>
              <button
                onClick={closePhotoModal}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            <div className="relative flex-1 bg-slate-100 dark:bg-black overflow-hidden flex items-center justify-center">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="max-w-full max-h-full object-contain p-4"
              />
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 shrink-0 border-t border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-300 mb-4 font-light text-lg">
                {selectedPhoto.description}
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                  {new Date(selectedPhoto.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                  {selectedPhoto.location}
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {selectedPhoto.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-25 via-teal-25 to-cyan-25 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            Photo Gallery
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Explore the visual memories that capture the essence of our Gati Shakti Vishwavidyalaya community
          </p>
        </div>
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-neutral-700 dark:text-neutral-300 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-neutral-200 dark:border-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative card-3d-tilt cursor-pointer overflow-hidden gpu-accelerated"
              onClick={() => openPhotoModal(photo)}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-md text-neutral-800 rounded-full text-xs font-medium">
                    {photo.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-gray-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {photo.title}
                </h3>

                <p className="text-neutral-600 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
                  {photo.description}
                </p>

                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(photo.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {photo.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-neutral-500 dark:text-neutral-400">
              No photos found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl max-h-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-slate-700">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-gray-100">
                  {selectedPhoto.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-gray-400 mt-1">
                  {selectedPhoto.description}
                </p>
              </div>
              <button
                onClick={closePhotoModal}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
            <div className="relative">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-slate-700">
              <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(selectedPhoto.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {selectedPhoto.location}
                </div>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full">
                  {selectedPhoto.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
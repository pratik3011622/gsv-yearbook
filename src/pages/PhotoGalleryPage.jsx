import { useState } from 'react';
import { X, Calendar, MapPin, Heart } from 'lucide-react';

const photoData = [
  {
    id: 1,
    title: 'Convocation Ceremony 2024',
    description: 'Graduates celebrating their achievement with pride and joy.',
    image: '',
    date: '2024-07-15',
    category: 'Events',
    location: 'Main Auditorium',
    span: 'md:col-span-2 md:row-span-2'
  },
  {
    id: 2,
    title: 'Campus Garden View',
    description: 'The beautiful campus gardens in full bloom during spring.',
    image: '/WhatsApp Image 2025-10-21 at 23.15.20_a3ba8370.jpg',
    date: '2024-03-20',
    category: 'Campus',
    location: 'Central Garden',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 3,
    title: 'Alumni Reunion 2023',
    description: 'Former students reconnecting and sharing memories from their college days.',
    image: 'C:\Users\prati\Documents\WhatsApp Image 2026-01-17 at 9.19.39 PM.jpeg',
    date: '2024-12-10',
    category: 'Alumni',
    location: 'Alumni Center',
    span: 'md:col-span-1 md:row-span-2'
  },
  {
    id: 4,
    title: 'Research Lab',
    description: 'Students working on innovative projects in our state-of-the-art research facilities.',
    image: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-09-15',
    category: 'Academic',
    location: 'Research Building',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 5,
    title: 'Sports Day 2024',
    description: 'Athletes showcasing their skills and team spirit during the annual sports meet.',
    image: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-02-28',
    category: 'Events',
    location: 'Sports Complex',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 6,
    title: 'Library Study Area',
    description: 'Students engaged in deep study and research in our modern library.',
    image: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-11-05',
    category: 'Campus',
    location: 'Central Library',
    span: 'md:col-span-2 md:row-span-1'
  },
  {
    id: 7,
    title: 'Recent Photo 10',
    description: 'Vibrant celebrations showcasing diverse cultures and talents.',
    image: '/C1004T01.JPG',
    date: '2024-01-18',
    category: 'Events',
    location: '',
    span: 'md:col-span-2 md:row-span-1'
  },
  {
    id: 8,
    title: 'Graduation Hall',
    description: 'The iconic graduation hall where dreams are realized and futures begin.',
    image: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-06-30',
    category: 'Campus',
    location: 'Graduation Hall',
    span: 'md:col-span-2 md:row-span-1'
  },
  {
    id: 9,
    title: 'Recent Event Photo 1',
    description: 'A memorable moment from recent activities.',
    image: '/WhatsApp Image 2026-01-17 at 8.50.56 PM.jpeg',
    date: '2026-01-17',
    category: 'Events',
    location: '',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 10,
    title: 'Recent Event Photo 2',
    description: 'A memorable moment from recent activities.',
    image: '/WhatsApp Image 2026-01-17 at 8.50.57 PM.jpeg',
    date: '2026-01-17',
    category: 'Events',
    location: '',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 11,
    title: 'Recent Event Photo 3',
    description: 'A memorable moment from recent activities.',
    image: '/WhatsApp Image 2026-01-17 at 8.50.58 PM.jpeg',
    date: '2026-01-17',
    category: 'Events',
    location: '',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 12,
    title: 'Recent Event Photo 4',
    description: 'A memorable moment from recent activities.',
    image: '/WhatsApp Image 2026-01-17 at 8.51.09 PM.jpeg',
    date: '2026-01-17',
    category: 'Events',
    location: '',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 13,
    title: 'Recent Event Photo 5',
    description: 'A memorable moment from recent activities.',
    image: '/WhatsApp Image 2026-01-17 at 8.51.10 PM.jpeg',
    date: '2026-01-17',
    category: 'Events',
    location: '',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 14,
    title: 'Recent Event Photo 6',
    description: 'A memorable moment from recent activities.',
    image: '/WhatsApp Image 2026-01-17 at 8.58.36 PM.jpeg',
    date: '2026-01-17',
    category: 'Events',
    location: '',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 15,
    title: 'Recent Event Photo 7',
    description: 'A memorable moment from recent activities.',
    image: '/WhatsApp Image 2026-01-17 at 9.04.29 PM.jpeg',
    date: '2026-01-17',
    category: 'Alumni',
    location: '',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 16,
    title: 'Recent Event Photo 8',
    description: 'A memorable moment from recent activities.',
    image: '/Copy of AGNEE 4.png',
    date: '2026-01-17',
    category: 'Events',
    location: '',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 17,
    title: 'Recent Event Photo 9',
    description: 'A memorable moment from recent activities.',
    image: '/WhatsApp Image 2026-01-17 at 8.51.11 PM.jpeg',
    date: '2026-01-17',
    category: 'Events',
    location: '',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 18,
    title: 'Alumni Reunion 2025',
    description: 'Former students reconnecting and sharing memories from their college days.',
    image: '/WhatsApp Image 2026-01-17 at 9.19.39 PM.jpeg',
    date: '2025-12-31',
    category: 'Alumni',
    location: '',
    span: 'md:col-span-1 md:row-span-2'
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

  const isBento = selectedCategory === 'All';

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
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ${selectedCategory === category
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-105'
                : 'bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md'
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
              className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-slate-100 dark:border-slate-700/50"
              onClick={() => openPhotoModal(photo)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {photo.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">
                    {new Date(photo.date).getFullYear()}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3 h-3 mr-1" />
                    {photo.location}
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {photo.title}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {photo.description}
                </p>
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
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="relative max-w-6xl w-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Image Section */}
            <div className="relative flex-1 bg-black flex items-center justify-center group overflow-hidden md:w-2/3">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                  {selectedPhoto.category}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col md:w-1/3 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-end p-4 border-b border-slate-100 dark:border-slate-800/50">
                <button
                  onClick={closePhotoModal}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group"
                >
                  <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                    {selectedPhoto.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                      <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                      {new Date(selectedPhoto.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                      <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                      {selectedPhoto.location}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Description</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-light">
                    {selectedPhoto.description}
                  </p>
                </div>
              </div>

              <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-2 text-slate-500 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">Like</span>
                  </button>
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                    Download / Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
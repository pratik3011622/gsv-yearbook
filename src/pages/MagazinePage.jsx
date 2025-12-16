import { useState } from 'react';
import { Download, Eye, Calendar, FileText, X } from 'lucide-react';

const magazineData = [
  {
    id: 1,
    title: 'GSV Connect - Winter 2024',
    description: 'Celebrating achievements, sharing stories, and looking forward to new beginnings.',
    coverImage: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=600',
    pdfUrl: '#',
    issue: 'Vol. 1, Issue 1',
    publishDate: '2024-12-15',
    pages: 24,
    featured: true
  },
  {
    id: 2,
    title: 'GSV Connect - Autumn 2024',
    description: 'Alumni spotlight, research breakthroughs, and campus updates from the past quarter.',
    coverImage: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=600',
    pdfUrl: '#',
    issue: 'Vol. 1, Issue 2',
    publishDate: '2024-09-20',
    pages: 28,
    featured: false
  },
  {
    id: 3,
    title: 'GSV Connect - Summer 2024',
    description: 'Summer achievements, internship success stories, and upcoming events preview.',
    coverImage: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=600',
    pdfUrl: '#',
    issue: 'Vol. 1, Issue 3',
    publishDate: '2024-06-10',
    pages: 22,
    featured: false
  },
  {
    id: 4,
    title: 'GSV Connect - Spring 2024',
    description: 'Spring semester highlights, alumni reunions, and academic excellence awards.',
    coverImage: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=600',
    pdfUrl: '#',
    issue: 'Vol. 1, Issue 4',
    publishDate: '2024-03-15',
    pages: 26,
    featured: false
  },
  {
    id: 5,
    title: 'GSV Connect - Special Edition 2023',
    description: 'Year-end recap, decade highlights, and vision for the future of GSV.',
    coverImage: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=600',
    pdfUrl: '#',
    issue: 'Special Edition',
    publishDate: '2023-12-31',
    pages: 32,
    featured: true
  },
  {
    id: 6,
    title: 'GSV Connect - Winter 2023',
    description: 'Holiday celebrations, research awards, and alumni success stories.',
    coverImage: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=600',
    pdfUrl: '#',
    issue: 'Vol. 1, Issue 1',
    publishDate: '2023-12-15',
    pages: 24,
    featured: false
  }
];

export const MagazinePage = () => {
  const [selectedMagazine, setSelectedMagazine] = useState(null);

  const featuredMagazines = magazineData.filter(mag => mag.featured);
  const regularMagazines = magazineData.filter(mag => !mag.featured);

  const openMagazineModal = (magazine) => {
    setSelectedMagazine(magazine);
  };

  const closeMagazineModal = () => {
    setSelectedMagazine(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-25 via-pink-25 to-purple-25 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            Alumni Magazine
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Stay connected through our quarterly magazine featuring stories, achievements, and updates from the Gati Shakti Vishwavidyalaya community
          </p>
        </div>
        {/* Featured Magazines */}
        {featuredMagazines.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-gray-100 mb-8 text-center">
              Featured Issues
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredMagazines.map((magazine) => (
                <div
                  key={magazine.id}
                  className="group relative card-3d-tilt overflow-hidden gpu-accelerated"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Cover Image */}
                    <div className="relative sm:w-48 h-64 sm:h-auto flex-shrink-0">
                      <img
                        src={magazine.coverImage}
                        alt={magazine.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-rose-500 text-white rounded-full text-xs font-medium">
                          Featured
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 dark:text-gray-100 mb-2">
                            {magazine.title}
                          </h3>
                          <p className="text-neutral-600 dark:text-gray-300 text-sm mb-2">
                            {magazine.issue}
                          </p>
                        </div>
                      </div>

                      <p className="text-neutral-600 dark:text-gray-300 leading-relaxed mb-4">
                        {magazine.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(magazine.publishDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {magazine.pages} pages
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => openMagazineModal(magazine)}
                          className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-rose-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Magazine
                        </button>
                        <button className="p-2 border border-neutral-200 dark:border-slate-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors">
                          <Download className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Magazines */}
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-gray-100 mb-8 text-center">
            Magazine Archive
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularMagazines.map((magazine) => (
              <div
                key={magazine.id}
                className="group relative card-3d-tilt cursor-pointer overflow-hidden gpu-accelerated"
                onClick={() => openMagazineModal(magazine)}
              >
                {/* Cover Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={magazine.coverImage}
                    alt={magazine.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-gray-100 mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {magazine.title}
                  </h3>

                  <p className="text-neutral-600 dark:text-gray-300 text-sm mb-2">
                    {magazine.issue}
                  </p>

                  <p className="text-neutral-600 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
                    {magazine.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(magazine.publishDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      {magazine.pages} pages
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Magazine Modal */}
      {selectedMagazine && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-slate-700">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-gray-100">
                  {selectedMagazine.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-gray-400">
                  {selectedMagazine.issue} • {selectedMagazine.pages} pages
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 border border-neutral-200 dark:border-slate-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors">
                  <Download className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </button>
                <button
                  onClick={closeMagazineModal}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>
            </div>
            <div className="relative bg-neutral-100 dark:bg-slate-700 p-8 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-neutral-900 dark:text-gray-100 mb-2">
                  Magazine Preview
                </h4>
                <p className="text-neutral-600 dark:text-gray-300 mb-4">
                  PDF viewer would be embedded here
                </p>
                <button className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-rose-700 hover:to-pink-700 transition-all">
                  Download PDF
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-neutral-600 dark:text-gray-300 leading-relaxed">
                {selectedMagazine.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
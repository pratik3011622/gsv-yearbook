import { useState } from 'react';
import { Eye, Calendar } from 'lucide-react';

const magazineData = [
  {
    id: 4,
    title: 'TechnoBytes',
    description: 'Exploring the latest in technology, innovation, and digital trends from the GSV community.',
    coverImage: '/Screenshot 2026-01-24 162408.png',

    pdfUrl: '/TechnoByte_Ed_2.pdf',
    issue: 'Edition 2',
    publishDate: '2026-01-19',
    pages: 5,
    featured: true
  },
  {
    id: 1,
    title: 'TechnoBytes',
    description: 'Exploring the latest in technology, innovation, and digital trends from the GSV community.',
    coverImage: '/Screenshot 2026-01-24 162439.png',
    pdfUrl: '/technobytes.pdf',
    issue: 'Edition 1',
    publishDate: '2025-08-06',
    pages: 5,
    featured: true
  }

];

export const MagazinePage = () => {
  const [selectedMagazine, setSelectedMagazine] = useState(null);

  const openMagazineModal = (magazine) => {
    setSelectedMagazine(magazine);
  };

  const closeMagazineModal = () => {
    setSelectedMagazine(null);
  };

  return (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Alumni Magazine
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Stay connected through our quarterly magazine featuring stories, achievements, and updates from the Gati Shakti Vishwavidyalaya community
          </p>
        </div>

        {/* Featured Magazines List */}
        <div className="max-w-6xl mx-auto">
          {/* <h2 className="text-3xl font-bold text-neutral-900 dark:text-gray-100 mb-12 text-center">
              Latest Issues
            </h2> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {magazineData.map((magazine) => (
              <div
                key={magazine.id}
                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Cover Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={magazine.coverImage}
                    alt={magazine.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    {/* <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                      
                    </span> */}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                        {magazine.issue}
                      </span>
                      <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(magazine.publishDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      {magazine.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
                      {magazine.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => { if (magazine.pdfUrl && magazine.pdfUrl !== '#') window.open(magazine.pdfUrl, '_blank'); }}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Read Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Magazine Modal */}
      {selectedMagazine && (
        <div className="fixed inset-0 bg-slate-900/60 z-[99999] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedMagazine.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {selectedMagazine.issue} • {selectedMagazine.pages} pages
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={closeMagazineModal}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
            </div>
            <div className="relative bg-slate-100 dark:bg-slate-900 p-12 flex items-center justify-center min-h-[400px]">
              <img
                src={selectedMagazine.coverImage}
                alt={selectedMagazine.title}
                className="max-w-full max-h-[600px] object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="p-8 bg-white dark:bg-slate-800">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">About this Issue</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedMagazine.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
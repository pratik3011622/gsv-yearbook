import { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';

const eventData = [
  {
    id: 1,
    title: 'AUJASYA - Annual Sports Fest',
    description: 'Experience the thrill of competition and showcase your athletic prowess in our annual sports festival featuring various games and tournaments.',
    imageUrl: '/slide4.jpg',
    eventDate: '2026-01-23',
    location: 'Sports Complex',
    event_type: 'Sports Fest'
  },
  {
    id: 2,
    title: 'EPITOME - Annual Techfest',
    description: 'Dive into the world of innovation and technology with workshops, competitions, and exhibitions showcasing cutting-edge advancements.',
    imageUrl: '/slide5.jpg',
    eventDate: '2026-03-13',
    location: 'Tech Auditorium',
    event_type: 'Techfest'
  },
  {
    id: 3,
    title: 'Alumni Reunion 2025',
    description: 'Reconnect with old friends and reminisce about the good old days at GSV.',
    imageUrl: '/cultural.jpg',
    eventDate: '2025-12-15',
    location: 'Main Auditorium',
    event_type: 'Reunion'
  },
  {
    id: 4,
    title: 'Tech Conference 2025',
    description: 'Latest trends in technology and networking opportunities.',
    imageUrl: '/slide4.jpg',
    eventDate: '2025-11-20',
    location: 'Conference Hall',
    event_type: 'Conference'
  },
  {
    id: 5,
    title: 'Cultural Fest 2024',
    description: 'Celebrate diversity through music, dance, and cultural performances.',
    imageUrl: '/cultural.jpg',
    eventDate: '2024-10-10',
    location: 'Open Air Theatre',
    event_type: 'Cultural'
  },
  {
    id: 6,
    title: 'AGNEE - Annual Cultural Fest',
    description: 'A celebration of art, music, and culture bringing together diverse talents in spectacular performances and competitions.',
    imageUrl: '/cultural.jpg',
    eventDate: '2025-11-27',
    location: 'Open Air Theatre',
    event_type: 'Cultural Fest'
  },
  {
    id: 7,
    title: 'Induction Ceremony 2024',
    description: 'Welcome new students to the GSV family.',
    imageUrl: '/induction-video.mov',
    eventDate: '2024-08-01',
    location: 'Main Hall',
    event_type: 'Ceremony'
  }
];

export const EventsPage = ({ onNavigate }) => {
  const [filter, setFilter] = useState('upcoming');

  const filteredEvents = eventData.filter((event) => {
    const isPast = new Date(event.eventDate) < new Date();
    return filter === 'upcoming' ? !isPast : isPast;
  });

  return (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Events & Reunions
          </h1>

          <p className="text-xl text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Stay connected through college events and alumni gatherings
          </p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${filter === 'upcoming'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${filter === 'past'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No {filter} events
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Check back later for new events and reunions
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event._id || event.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 flex flex-col"
              >
                {event.imageUrl && (
                  <div className="h-56 relative overflow-hidden group">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-2">
                        {event.event_type}
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      <span>{new Date(event.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</span>
                    </div>

                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

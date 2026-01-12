import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const EventsPage = ({ onNavigate }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await api.getEvents();
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    try {
      await api.rsvpToEvent(eventId, 'attending');
      fetchEvents(); // Refresh to show updated count
    } catch (error) {
      console.error('Error RSVPing:', error);
    }
  };

  const getTimeRemaining = (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diff = event - now;

    if (diff < 0) return 'Event passed';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} days`;
    return `${hours} hours`;
  };

  const filteredEvents = events.filter((event) => {
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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
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
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-sm flex items-center space-x-1.5 ring-1 ring-slate-900/5">
                      <Clock className="w-3.5 h-3.5 text-primary-600" />
                      <span>{getTimeRemaining(event.eventDate)}</span>
                    </div>
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

                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Users className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      <span>{event.rsvp_count || 0} attending</span>
                      {event.max_attendees && <span className="ml-1">/ {event.max_attendees} max</span>}
                    </div>
                  </div>

                  {filter === 'upcoming' && (
                    <button
                      onClick={() => handleRSVP(event._id || event.id)}
                      className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 group-hover:shadow-lg"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>RSVP Now</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

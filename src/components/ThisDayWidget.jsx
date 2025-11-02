import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const historicalEvents = [
  {
    year: 2025,
    month: 'March',
    day: 15,
    title: 'The Graduating Class of 2025',
    description: 'A proud day for the Graduates of Gati Shakti Vishwavidyalaya.',
    image: '/WhatsApp Image 2025-10-21 at 23.04.13_24f84d84.jpg',
  },
  {
    year: 2025,
    month: 'April',
    day: 26,
    title: 'Farewell Function',
    description: 'An evening of laughter, memories, and heartfelt goodbyes ',
    image: '/WhatsApp Image 2025-10-21 at 23.15.20_a3ba8370.jpg',
  },
  {
    year: 2025,
    month: 'July',
    day: 27,
    title: 'Convocation Ceremony',
    description: 'A proud moment of achievement and new beginnings , the Convocation Ceremony marked the culmination of dedication, learning, and perseverance, as graduates stepped forward to embrace their future with honor and pride',
    image: 'https://gsv.ac.in/wp-content/uploads/slider/cache/8bef1522bf9985ed15004d1a5d70af15/BOSS0373-scaled.jpg',
  },
];

export const ThisDayWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % historicalEvents.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextEvent = () => {
    setCurrentIndex((prev) => (prev + 1) % historicalEvents.length);
  };

  const prevEvent = () => {
    setCurrentIndex((prev) => (prev - 1 + historicalEvents.length) % historicalEvents.length);
  };

  const event = historicalEvents[currentIndex];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gray-100 dark:bg-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 dark:border-gray-700 mb-4 sm:mb-6 shadow-soft">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300">This Day in College History</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4">
            Walk Down Memory Lane
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-strong">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 sm:h-72 md:h-80 lg:h-auto">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover object-center"
                  style={{ maxHeight: '400px' }}
                />
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base">
                  {event.year}
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
                <div className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm mb-2 sm:mb-3">
                  {event.month} {event.day}
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {event.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={prevEvent}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/80 backdrop-blur-md rounded-lg sm:rounded-xl border border-gray-200 hover:bg-gray-50 transition-all group shadow-lg"
            aria-label="Previous event"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={nextEvent}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/80 backdrop-blur-md rounded-lg sm:rounded-xl border border-gray-200 hover:bg-gray-50 transition-all group shadow-lg"
            aria-label="Next event"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex justify-center space-x-1.5 sm:space-x-2 mt-4 sm:mt-6">
            {historicalEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-6 sm:w-8 bg-blue-600' : 'w-1.5 sm:w-2 bg-gray-300'
                }`}
                aria-label={`Go to event ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

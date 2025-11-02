import { useState, useEffect } from 'react';
import { Quote, User } from 'lucide-react';

const testimonials = [
  {
    name: 'Arjun Patel',
    batch: 'B.Tech 2019',
    role: 'Software Engineer at Infosys',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    quote: 'GSV gave me the foundation for my tech career. AlumniVerse helped me stay connected with my professors and batchmates. The coding workshops and placement guidance were game-changers!',
  },
  {
    name: 'Sneha Gupta',
    batch: 'B.Tech 2020',
    role: 'Civil Engineer at L&T',
    image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    quote: 'The infrastructure projects at GSV prepared me for real-world challenges. Through AlumniVerse, I mentor current civil engineering students and share industry insights from my work on metro rail projects.',
  },
  {
    name: 'Rohit Kumar',
    batch: 'B.Tech 2018',
    role: 'Data Scientist at TCS',
     image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    quote: 'GSV\'s mathematics and computer science curriculum built my analytical foundation. AlumniVerse connected me with alumni working in AI/ML, and now I contribute to the data science mentorship program.',
  },
  {
    name: 'Kavita Singh',
    batch: 'B.Tech 2017',
    role: 'Electrical Engineer at BHEL',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    quote: 'The hands-on electrical engineering labs at GSV were incredible. AlumniVerse helped me find my current role in renewable energy projects, and I regularly participate in technical webinars for current students.',
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-neutral-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4">
            Voices of Our Community
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-gray-300">
            Hear what Gati Shakti Vishwavidyalaya alumni have to say about their journey and GSVConnect experience
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  index === currentIndex
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 absolute inset-0 translate-x-full'
                }`}
              >
                <div className="card-elevated p-4 sm:p-6 md:p-8 lg:p-12 relative">
                  <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 text-primary-500/10">
                    <Quote className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 mb-4 sm:mb-6 md:mb-8">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 sm:border-4 border-slate-400 shadow-medium flex items-center justify-center">
                        <User className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 dark:text-gray-100">
                          {testimonial.name}
                        </h3>
                        <p className="text-primary-600 dark:text-primary-400 font-medium text-sm sm:text-base">
                          {testimonial.batch}
                        </p>
                        <p className="text-neutral-600 dark:text-gray-400 text-xs sm:text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    <p className="text-base sm:text-lg md:text-xl text-neutral-700 dark:text-gray-300 leading-relaxed italic">
                      "{testimonial.quote}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-2 sm:space-x-3 mt-6 sm:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 sm:w-12 bg-primary-600'
                    : 'w-2 sm:w-3 bg-neutral-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

import { useState, useEffect, useRef } from 'react';
import { Users, Globe, Calendar, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollReveal } from './ScrollReveal';

const useCountUp = (end, duration = 2000, startCounting) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return count;
};

export const StatsCounter = ({ stats }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const alumniCount = useCountUp(stats.total_alumni || 550, 2000, isVisible);
  const countriesCount = useCountUp(stats.total_countries || 10, 2000, isVisible);
  const eventsCount = useCountUp(stats.total_events || 95, 2000, isVisible);
  const jobsCount = useCountUp(stats.total_jobs || 280, 2000, isVisible);

  const statsData = [
    {
      icon: Users,
      count: alumniCount,
      label: 'Alumni Members',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-500/10',
      iconColor: 'text-primary-600',
    },
    {
      icon: Globe,
      count: countriesCount,
      label: 'Countries',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Calendar,
      count: eventsCount,
      label: 'Events Hosted',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
    },
    {
      icon: Briefcase,
      count: jobsCount,
      label: 'Job Opportunities',
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-500/10',
      iconColor: 'text-accent-600',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4">
            Growing Together
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-gray-300">
            Join thousands of alumni making an impact worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal
                key={index}
                direction="up"
                delay={index * 0.15}
                className="group relative card-elevated hover:-translate-y-2"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                <div className={`${stat.bgColor} w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${stat.iconColor}`} />
                </div>

                <div className="relative">
                  <div className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 sm:mb-2`}>
                    {stat.count.toLocaleString()}
                    {stat.count >= 100 && '+'}
                  </div>
                  <div className="text-neutral-600 dark:text-gray-300 font-medium text-sm sm:text-base md:text-lg">
                    {stat.label}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"></div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

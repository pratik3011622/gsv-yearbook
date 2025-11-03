import { Users, BookOpen, Calendar, Briefcase, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollReveal } from './ScrollReveal';
import { MagneticCard } from './MagneticCard';

export const FeatureHighlights = ({ onNavigate }) => {
  const features = [
    {
      icon: Users,
      title: 'Alumni Directory',
      description: 'Connect with fellow alumni across the globe. Search by batch, company, or location.',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-500/10',
      iconColor: 'text-primary-600',
      page: 'directory',
    },
    {
      icon: BookOpen,
      title: 'Yearbook Memories',
      description: 'Relive the golden days through photos, stories, and shared moments from college.',
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-500/10',
      iconColor: 'text-accent-600',
      page: 'memories',
    },
    {
      icon: Calendar,
      title: 'Events & Reunions',
      description: 'Stay updated on upcoming reunions, networking events, and college celebrations.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
      page: 'events',
    },
    {
      icon: Briefcase,
      title: 'Job Board',
      description: 'Discover career opportunities posted by alumni or share openings at your company.',
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-500/10',
      iconColor: 'text-rose-600',
      page: 'jobs',
    },
    {
      icon: Newspaper,
      title: 'Alumni Stories',
      description: 'Read inspiring success stories and share your own journey with the community.',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/10',
      iconColor: 'text-cyan-600',
      page: 'stories',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4">
            Everything You Need
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive platform designed to keep our alumni community connected, engaged, and thriving
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal
                key={index}
                direction={index % 2 === 0 ? 'left' : 'right'}
                delay={index * 0.1}
                className="group relative cursor-pointer overflow-hidden"
              >
                <MagneticCard
                  className="card-elevated card-smooth hover:-translate-y-2"
                  strength={0.4}
                  range={120}
                >
                  <motion.div
                    onClick={() => onNavigate(feature.page)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                <div className={`${feature.bgColor} w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-6 smooth-hover`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${feature.iconColor}`} />
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 dark:text-gray-100 mb-2 sm:mb-3 group-hover:text-primary-900 dark:group-hover:text-primary-400 smooth-hover">
                  {feature.title}
                </h3>

                <p className="text-sm sm:text-base text-neutral-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
                  {feature.description}
                </p>

                <div className="flex items-center text-sm font-medium text-primary-900 dark:text-primary-400 group-hover:translate-x-2 smooth-hover">
                  Explore
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>

                  </motion.div>
                </MagneticCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

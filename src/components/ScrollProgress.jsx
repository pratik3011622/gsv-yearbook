import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgress = ({ className = '' }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 z-50 origin-left ${className}`}
      style={{ scaleX }}
    />
  );
};
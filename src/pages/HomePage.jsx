import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Facebook, Linkedin, Instagram, Mail, Phone, MapPin, ExternalLink, Briefcase, Award, Search, Users, Calendar, Globe, Zap, Building2 } from 'lucide-react';
import { Footer } from '../components/Footer';

export const HomePage = ({ onNavigate }) => {
  const { isDark } = useTheme();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setParallaxY(window.scrollY * 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="overflow-x-hidden font-sans bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      {/* Video Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden bg-slate-900 text-white">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/cultural.jpg"
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${videoLoaded ? 'opacity-80' : 'opacity-0'} brightness-[1.35] contrast-115 saturate-[1.35]`}
          style={{ transform: `translateY(${parallaxY}px)`, filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.15))' }}
        >
          <source src="/final.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 z-10 bg-black/50"></div>
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%),linear-gradient(135deg,rgba(30,64,175,0.3),rgba(15,23,42,0.4))]"></div>

        <div className="relative z-30 max-w-7xl px-4 mt-0">
          <motion.h1
            className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight text-white tracking-tight"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {["Connect,", "Celebrate and Grow"].map((word, index) => (
              <motion.span
                key={index}
                className="inline-block md:whitespace-nowrap"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                {word}{" "}
              </motion.span>
            ))}
            <br />
            <motion.span
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } },
              }}
            >
              Together
            </motion.span>
          </motion.h1>
          <p className="text-xl text-white/95 mb-12 font-normal max-w-[700px] mx-auto animate-[slideUp_1s_ease-out_0.3s_forwards] opacity-0 translate-y-5">
            Join a vibrant community where memories are made, careers accelerate, and support never stops.
          </p>
          <div className="flex gap-6 justify-center animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.4s_forwards] opacity-0 translate-y-8">
            <a href="#directory" className="bg-white text-primary-600 px-10 py-4 rounded-full font-semibold tracking-wide transition-all duration-300 shadow-md border-2 border-white uppercase text-sm hover:bg-transparent hover:text-white hover:-translate-y-0.5 hover:shadow-lg inline-block text-center">
              Explore Directory
            </a>
            <a href="#register" className="bg-transparent text-white px-10 py-4 rounded-full font-semibold border-2 border-white/30 transition-all duration-300 uppercase text-sm hover:bg-white hover:text-primary-600 hover:border-white hover:-translate-y-0.5 inline-block text-center">
              Join Community
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section - Animated Impact */}
      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '5000+', label: 'Alumni Connected' },
              { num: '50+', label: 'Cities' },
              { num: '120+', label: 'Mentors' },
              { num: '500+', label: 'Opportunities Shared' }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <span className="text-4xl font-bold text-primary-600 dark:text-primary-400 font-serif leading-none mb-2">{stat.num}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-center">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything You Need Section */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-10">
            <h2 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-4 dark:text-white">Everything You Need</h2>
            <p className="font-sans text-slate-500 leading-relaxed text-lg mb-0 dark:text-slate-400">
              A comprehensive suite of tools and resources designed to supercharge your alumni experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20 max-w-5xl mx-auto">
            {[
              {
                title: 'Alumni Directory',
                desc: 'Reconnect with old friends and expand your professional network.',
                nav: 'directory'
              },
              {
                title: 'About GSV',
                desc: "Discover the vision behind India's first university dedicated to the transportation sectors.",
                nav: 'about'
              },
              {
                title: 'Events',
                desc: 'Join reunions, workshops, and gatherings.',
                nav: 'events'
              }
            ].map((card, idx) => (
              <a key={idx} href={`#${card.nav}`} className="group relative bg-slate-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 block border border-slate-700/50 hover:bg-slate-800/80">
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-slate-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
                <h3 className="font-sans text-xl font-bold text-white mb-3 mt-2">{card.title}</h3>
                <p className="text-slate-300 leading-relaxed text-sm mb-0">{card.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Walk Down Memory Lane Section */}
      <section className="py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-6 dark:text-white">A Walk Down Memory Lane</h2>
            <p className="font-sans text-slate-500 leading-relaxed text-lg dark:text-slate-400 mb-8">
              Relive the moments that defined us. From late-night study sessions to cultural fests, every picture tells a story of our shared journey.
            </p>
            <a href="#photo-gallery" className="inline-flex items-center gap-2 text-primary-600 font-bold text-lg transition-all duration-300 hover:gap-3 hover:text-primary-700">
              View Full Gallery <ExternalLink size={20} />
            </a>
          </div>

          <div className="relative max-w-3xl mx-auto h-[400px] rounded-[2rem] overflow-hidden shadow-2xl group border-4 border-white/10 bg-black">
            {/* Scroll Container */}
            <div
              id="memory-lane-scroll"
              className="flex overflow-x-auto h-full snap-x snap-mandatory scrollbar-hide scroll-smooth"
            >
              {[
                { title: 'Campus Highlights', img: 'https://gsv.ac.in/wp-content/uploads/slider/cache/8bef1522bf9985ed15004d1a5d70af15/BOSS0373-scaled.jpg', date: 'Dec 12, 2024', desc: 'Prastuti - Pratap Palace ' },
                { title: 'Campus Highlights', img: 'https://currentaffairs.adda247.com/wp-content/uploads/multisite/sites/5/2022/07/15073800/ntri.jpg', date: 'Oct 21, 2025', desc: 'The vibrant energy of student life at GSV.' },
                { title: 'Student Activities', img: 'https://cache.careers360.mobi/media/article_images/2022/7/13/nrti_gati_shakti_vishwavidyalaya.jpg', date: 'Oct 21, 2025', desc: 'Engaging workshops and collaborative learning sessions.' },
              ].map((item, idx) => (
                <div key={idx} className="min-w-full h-full relative snap-center flex items-center justify-center bg-black">
                  <div className="absolute inset-0 overflow-hidden">
                    <img src={item.img} alt="" className="w-full h-full object-cover blur-xl opacity-50 scale-110" />
                  </div>
                  <img
                    src={item.img}
                    alt={item.title}
                    className="relative w-full h-full object-contain z-10 shadow-xl"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/10">
                        {item.date}
                      </span>
                      <div className="h-px bg-white/20 flex-1"></div>
                    </div>
                    <h3 className="font-serif text-3xl font-bold mb-2 leading-tight drop-shadow-lg">{item.title}</h3>
                    <p className="text-sm text-white/80 max-w-xl font-light leading-relaxed line-clamp-2 mix-blend-lighten">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => {
                const container = document.getElementById('memory-lane-scroll');
                if (container) container.scrollLeft -= container.offsetWidth;
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => {
                const container = document.getElementById('memory-lane-scroll');
                if (container) container.scrollLeft += container.offsetWidth;
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="mt-8 text-center md:hidden">
            <a href="#photo-gallery" className="inline-flex items-center gap-2 text-primary-600 font-semibold text-lg transition-all duration-300 border-b-2 border-transparent hover:gap-3 hover:border-primary-600">
              View Full Gallery <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Features / Connect Section */}
      <section className="py-32 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-6 dark:text-white">Connect & Hub</h2>
            <p className="font-sans text-slate-500 leading-relaxed text-lg mb-8 dark:text-slate-400">
              Your gateway to the global GSV community. Stay connected, give back, and grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
            {[
              { title: 'Global Events', text: 'Join reunions, workshops, and networking meets.', icon: MapPin, img: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80', nav: 'events' },
              { title: 'Career Hub', text: 'Explore exclusive job opportunities and mentorship.', icon: Briefcase, img: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80', nav: 'jobs' },
              { title: 'Success Stories', text: 'Celebrate the achievements of our alumni.', icon: Award, img: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80', nav: 'stories' }
            ].map((feat, idx) => (
              <a key={idx} href={`#${feat.nav}`} className="group relative h-[240px] rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 border border-white/10 block">
                <img src={feat.img} alt={feat.title} className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className={`absolute inset-0 z-10 backdrop-blur-[0px] ${feat.title === 'Career Hub' ? 'bg-white/60' : 'bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.3)_100%)]'}`}></div>
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 text-white border border-white/20">
                    <feat.icon size={24} />
                  </div>
                  <h3 className={`font-sans text-xl font-bold mb-2 drop-shadow-md ${feat.title === 'Career Hub' ? 'text-black' : 'text-white'}`}>{feat.title}</h3>
                  <p className={`leading-relaxed text-sm max-w-[90%] opacity-90 ${feat.title === 'Career Hub' ? 'text-slate-900' : 'text-white/90'}`}>{feat.text}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-32 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-6 dark:text-white">Get in Touch</h2>
            <p className="font-sans text-slate-500 leading-relaxed text-lg mb-8 dark:text-slate-400">
              Have questions or want to reconnect? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Visit Us</h4>
                  <p className="text-slate-500 dark:text-slate-400">Gati Shakti Vishwavidyalaya<br />Lalbaug, Vadodara, Gujarat 390004</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Call Us</h4>
                  <p className="text-slate-500 dark:text-slate-400">+91 265 265 3131</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Email Us</h4>
                  <p className="text-slate-500 dark:text-slate-400">alumni@gsv.ac.in</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Website</h4>
                  <a href="https://gsv.ac.in" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    www.gsv.ac.in
                  </a>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://maps.google.com/maps?q=Gati+Shakti+Vishwavidyalaya,+Vadodara,+Gujarat,+India&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="GSV Location"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="pt-10 pb-24 bg-slate-50 dark:bg-slate-900 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-5xl font-bold mb-6 text-slate-900 dark:text-white">Ready to Reconnect?</h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-12">
            Join thousands of alumni who are already part of the GSV Connect network.
          </p>
          <a href="#register" className="bg-primary-600 text-white px-10 py-5 rounded-full font-bold tracking-wide transition-all duration-300 shadow-xl border-none uppercase text-sm hover:bg-primary-700 hover:-translate-y-1 hover:shadow-2xl inline-block text-center">
            Register Now
          </a>
        </div>
      </section>

      <Footer />
    </div >
  );
};

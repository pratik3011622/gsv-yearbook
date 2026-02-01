import { Facebook, Linkedin, Instagram, MapPin, Phone, Mail } from 'lucide-react';

// Custom X (Twitter) logo component
const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-4 relative">
      <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-6 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-start gap-4 mb-4">
              <img
                src="/gsv-logo.png"
                alt="GSV Logo"
                className="w-10 h-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-white leading-none">GSVConnect</span>
                <span className="text-sm text-slate-400 font-sans">गति शक्ति विश्वविद्यालय</span>
                <span className="text-[11px] font-brand font-semibold tracking-[0.15em] uppercase text-slate-500 mt-1">Gati Shakti Vishwavidyalaya</span>
              </div>
            </div>
            <p className="leading-relaxed text-slate-400 mb-6">
              The official platform of Gati Shakti Vishwavidyalaya. Building bridges between past, present, and future.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, link: "https://www.facebook.com/gsv.ac.in/" },
                { Icon: Linkedin, link: "https://www.linkedin.com/school/gatishaktivishwavidyalaya/" },
                { Icon: Instagram, link: "https://www.instagram.com/gsv.vadodara/" },
                { Icon: XIcon, link: "https://x.com/gsv_vadodara" }
              ].map(({ Icon, link }, idx) => (
                <a key={idx} href={link} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-primary-600 hover:-translate-y-0.5">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="font-sans text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul>
              {[
                { label: 'Alumni Events', nav: 'events' },
                { label: 'Alumni Directory', nav: 'directory' },
                { label: 'Career Opportunities', nav: 'jobs' },
                { label: 'Success Stories', nav: 'stories' }
              ].map((item, idx) => (
                <li key={idx}><a href={`#${item.nav}`} className="text-left text-slate-400 text-[0.95rem] mb-3 block bg-none border-none p-0 cursor-pointer transition-colors duration-200 hover:text-white">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="font-sans text-lg font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-blue-500" />
                <span>Gati Shakti Vishwavidyalaya, Lalbaug, Vadodara, Gujarat 390004</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone size={18} className="flex-shrink-0 text-blue-500" />
                <span>+91 265 265 3131</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={18} className="flex-shrink-0 text-blue-500" />
                <a href="mailto:technocrats@gsv.ac.in" className="hover:text-white transition-colors">technocrats@gsv.ac.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm text-slate-500 text-center">
            © {new Date().getFullYear()} Gati Shakti Vishwavidyalaya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

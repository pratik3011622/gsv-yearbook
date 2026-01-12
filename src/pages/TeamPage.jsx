import { Linkedin, Instagram, Github, Twitter } from 'lucide-react';

const teamMembers = [
  {
    name: 'Ravi Panchal',
    role: 'Team Leader & Developer',
    img: '/team-ravi.jpg',
    social: {
      linkedin: 'https://www.linkedin.com/in/ravixpanchal/',
      instagram: 'https://www.instagram.com/ravixpanchal/',
      github: 'https://github.com/ravixpanchal'
    }
  },
  {
    name: 'Pratik Ranjan',
    role: 'Developer & Contributor',
    img: '/team-pratik.jpg',
    social: {
      linkedin: 'https://www.linkedin.com/in/pratik-ranjan3011?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      instagram: 'https://www.instagram.com/pratik_ranjan_34?igsh=Z3R0aml4aWJlOHRs',
      github: 'https://github.com/pratik3011622'
    }
  }
];

export const TeamPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-6">
            Meet the Team
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light">
            The passionate minds behind GSVConnect, dedicated to building a stronger community.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 max-w-5xl mx-auto">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="group flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-48 h-48 rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 ring-4 ring-transparent group-hover:ring-primary-100 dark:group-hover:ring-primary-900/30">
                  {member.img ? (
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-4xl text-slate-400">
                      {member.name[0]}
                    </div>
                  )}
                </div>
                {/* Social Links - Visible on Hover */}
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} target="_blank" rel="noreferrer" className="text-white hover:text-blue-400 hover:scale-110 transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} target="_blank" rel="noreferrer" className="text-white hover:text-white hover:scale-110 transition-all">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.instagram && (
                    <a href={member.social.instagram} target="_blank" rel="noreferrer" className="text-white hover:text-pink-400 hover:scale-110 transition-all">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {member.name}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {member.role}
              </p>
            </div>
          ))}
        </div>



      </div>
    </div>
  );
};

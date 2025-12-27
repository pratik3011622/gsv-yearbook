import { Linkedin, Instagram, Github, Twitter } from 'lucide-react';

const teamMembers = [
  {
    name: 'Ravi Panchal',
    role: 'Team Member',
    bio: 'Experienced team leader overseeing the development and success of GSVConnect project.',
    photo: '/team-ravi.jpg',
    social: {
      linkedin: 'https://www.linkedin.com/in/ravixpanchal/',
      instagram: 'https://www.instagram.com/ravixpanchal/',
      github: 'https://github.com/ravixpanchal'
      
    }
  },
  // {
  //   name: 'Vinamra Tiwari',
  //   role: 'Team Member',
  //   bio: 'Valuable contributor to the GSVConnect project, bringing innovative ideas and technical skills.',
  //   photo: '/vinamra.png',
  //   social: {
  //     linkedin: 'https://www.linkedin.com/in/vinamra-tiwari-ba3653345?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  //     instagram: '',
  //     github: 'https://github.com/Vinamra-tech'
      
  //   }
  // },
  {
    name: 'Pratik Ranjan',
    role: 'Team Member',
    bio: 'Valuable contributor to the GSVConnect project, bringing innovative ideas and technical skills.',
    photo: '/team-pratik.jpg',
    social: {
      linkedin: 'https://www.linkedin.com/in/pratik-ranjan3011?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      instagram: 'https://www.instagram.com/pratik_ranjan_34?igsh=Z3R0aml4aWJlOHRs',
      github: 'https://github.com/pratik3011622'
      
    }
  }
];

export const TeamPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Team Members Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            Meet Our Team
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The passionate individuals working together to bring GSVConnect to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700"
            >
              {/* Profile Photo */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center relative overflow-hidden">
                {member.photo && member.photo !== '/team/ravi.jpg' && member.photo !== '/team/vinamra.jpg' && member.photo !== '/team/pratik.jpg' ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors duration-200 hover:scale-110"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.instagram && (
                    <a
                      href={member.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center text-white transition-colors duration-200 hover:scale-110"
                      aria-label={`${member.name}'s Instagram`}
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 hover:bg-gray-900 rounded-full flex items-center justify-center text-white transition-colors duration-200 hover:scale-110"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center text-white transition-colors duration-200 hover:scale-110"
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Join Our Team
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Interested in contributing to GSVConnect? We'd love to hear from you!
            </p>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
              Get In Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

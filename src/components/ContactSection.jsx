import { MapPin, Phone, Mail, Globe } from 'lucide-react';

export const ContactSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-gray-100 mb-4">
            Contact Us
          </h2>
          <p className="text-xl text-neutral-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get in touch with Gati Shakti Vishwavidyalaya. We're here to help and answer any questions you may have.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/d/d2/Gati_Shakti_Vishwavidyalaya_Logo.png"
                alt="Gati Shakti Vishwavidyalaya Logo"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-gray-100">
                  Gati Shakti Vishwavidyalaya
                </h3>
                <p className="text-neutral-600 dark:text-gray-300">
                  Where Memories Meet Futures
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 dark:text-gray-100 mb-2">
                    Address
                  </h4>
                  <p className="text-neutral-600 dark:text-gray-300 leading-relaxed">
                    76J2+P3P, Dr Venibhai Modi Marg,<br />
                    Lalbaug, Manjalpur,<br />
                    Vadodara, Gujarat 390004
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 dark:text-gray-100 mb-2">
                    Phone
                  </h4>
                  <p className="text-neutral-600 dark:text-gray-300">
                    +91 6202269313
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 dark:text-gray-100 mb-2">
                    Email
                  </h4>
                  <p className="text-neutral-600 dark:text-gray-300">
                    info@gsv.ac.in
                  </p>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 dark:text-gray-100 mb-2">
                    Website
                  </h4>
                  <a
                    href="https://gsv.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    www.gsv.ac.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="relative">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-neutral-200 dark:border-slate-700">
              <div className="relative h-96 lg:h-[500px]">
                <iframe
                  src="https://maps.google.com/maps?q=Gati+Shakti+Vishwavidyalaya,+Vadodara,+Gujarat,+India&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="Gati Shakti Vishwavidyalaya Location"
                ></iframe>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
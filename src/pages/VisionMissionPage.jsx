import React from 'react';
import { Footer } from '../components/Footer';

export const VisionMissionPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="flex-1 pb-8">
            {/* Hero Header */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 text-center">
                <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-xs mb-4">Our Purpose</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                    Vision & Mission
                </h1>
                <div className="w-20 h-px bg-slate-300 dark:bg-slate-700 mx-auto mb-8"></div>
                <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-3xl mx-auto">
                    Architecting the future of transportation and logistics through education, innovation, and unwavering excellence.
                </p>
            </div>

            <div className="flex flex-col gap-32 max-w-7xl mx-auto px-6 lg:px-8">
                {/* Vision Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                            <img
                                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                                alt="Futuristic Global Connection"
                                className="w-full h-[400px] object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Global Impact</p>
                                <p className="text-lg font-serif italic">"Leading the world in transportation education"</p>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 lg:pl-8">
                        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                            Our Vision
                        </h2>
                        <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-300">
                            <p className="text-xl leading-relaxed mb-6 font-light">
                                To be a <span className="font-semibold text-slate-900 dark:text-white">world-class university</span> in the field of transportation and logistics, recognized for excellence in teaching, research, and innovation.
                            </p>
                            <p className="leading-relaxed">
                                We aspire to create an ecosystem that fosters innovation, entrepreneurship, and sustainable development, contributing significantly to the modernization of India's transportation sector and addressing global challenges of the 21st century.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="lg:pr-8 pl-4">
                        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                            Our Mission
                        </h2>
                        <div className="space-y-6">
                            {[
                                { title: "Education", desc: "Provide high-quality education through innovative teaching & experiential learning." },
                                { title: "Research", desc: "Conduct cutting-edge research in transportation technologies & sustainable mobility." },
                                { title: "Collaboration", desc: "Foster industry-academia collaboration through strong partnerships." },
                                { title: "Development", desc: "Develop skilled professionals for India's transportation infrastructure." },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-slate-900 dark:bg-slate-400"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-light">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                                alt="Collaborative Learning"
                                className="w-full h-[400px] object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Community</p>
                                <p className="text-lg font-serif italic">"Fostering collaboration and growth"</p>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
            </div>
            <Footer />
        </div>
    );
};

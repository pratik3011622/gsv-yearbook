import React from 'react';

export const VisionMissionPage = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-white dark:bg-slate-900 transition-colors duration-300">
            {/* Hero Header */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24 text-center">
                <p className="text-primary-600 dark:text-primary-400 font-bold tracking-widest uppercase text-sm mb-4 animate-[fadeIn_0.5s_ease-out]">Our Purpose</p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-slate-900 dark:text-white mb-6 tracking-tight animate-[fadeIn_0.7s_ease-out]">
                    Vision & Mission
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mx-auto rounded-full mb-8"></div>
                <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-3xl mx-auto animate-[fadeIn_0.9s_ease-out]">
                    Architecting the future of transportation and logistics through education, innovation, and unwavering excellence.
                </p>
            </div>

            <div className="flex flex-col gap-32 max-w-7xl mx-auto px-6 lg:px-8">
                {/* Vision Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center group">
                    <div className="order-2 lg:order-1 relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                                alt="Futuristic Global Connection"
                                className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent mix-blend-multiply"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-1">Global Impact</p>
                                <p className="text-lg font-serif italic opacity-90">"Leading the world in transportation education"</p>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 lg:pl-8">
                        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-8 relative">
                            Our Vision
                            <span className="absolute -top-6 -left-6 text-9xl text-slate-100 dark:text-slate-800 -z-10 font-sans font-bold opacity-50 select-none">01</span>
                        </h2>
                        <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-300">
                            <p className="text-xl leading-relaxed mb-6 font-light">
                                To be a <span className="font-semibold text-primary-600 dark:text-primary-400">world-class university</span> in the field of transportation and logistics, recognized for excellence in teaching, research, and innovation.
                            </p>
                            <p className="leading-relaxed">
                                We aspire to create an ecosystem that fosters innovation, entrepreneurship, and sustainable development, contributing significantly to the modernization of India's transportation sector and addressing global challenges of the 21st century.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center group">
                    <div className="lg:pr-8 pl-4">
                        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-8 relative">
                            Our Mission
                            <span className="absolute -top-6 -right-6 lg:-left-6 text-9xl text-slate-100 dark:text-slate-800 -z-10 font-sans font-bold opacity-50 select-none">02</span>
                        </h2>
                        <div className="space-y-6">
                            {[
                                { title: "Education", desc: "Provide high-quality education through innovative teaching & experiential learning." },
                                { title: "Research", desc: "Conduct cutting-edge research in transportation technologies & sustainable mobility." },
                                { title: "Collaboration", desc: "Foster industry-academia collaboration through strong partnerships." },
                                { title: "Development", desc: "Develop skilled professionals for India's transportation infrastructure." },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start group/item">
                                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center border border-green-100 dark:border-green-800 group-hover/item:bg-green-100 dark:group-hover/item:bg-green-900/40 transition-colors">
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors">{item.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-light">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-bl from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                                alt="Collaborative Learning"
                                className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent mix-blend-multiply"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="text-sm font-bold uppercase tracking-widest text-green-200 mb-1">Community</p>
                                <p className="text-lg font-serif italic opacity-90">"Fostering collaboration and growth"</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Values Section */}
                <div className="py-20 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">Core Values</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">The fundamental beliefs that guide our actions and decisions</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Innovation', number: '01', color: 'text-blue-600 dark:text-blue-400' },
                            { title: 'Excellence', number: '02', color: 'text-purple-600 dark:text-purple-400' },
                            { title: 'Collaboration', number: '03', color: 'text-pink-600 dark:text-pink-400' },
                            { title: 'Sustainability', number: '04', color: 'text-orange-600 dark:text-orange-400' },
                        ].map((val, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center text-center">
                                <span className={`text-6xl font-sans font-bold opacity-20 mb-4 ${val.color}`}>
                                    {val.number}
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{val.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

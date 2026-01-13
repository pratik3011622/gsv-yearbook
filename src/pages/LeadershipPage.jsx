import React from 'react';

export const LeadershipPage = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-primary-600 dark:text-primary-400 font-bold tracking-widest uppercase text-sm mb-4">Leadership</p>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                        Guiding the Future
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-2xl mx-auto">
                        Inspiring words from our esteemed leadership, driving our community towards excellence and innovation.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-32">
                {/* Chancellor Section */}
                <section className="bg-slate-50 dark:bg-slate-800/50">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="relative h-[500px] w-full max-w-md mx-auto order-2 lg:order-1">
                                <img
                                    src="https://indiapressrelease.com/wp-content/uploads/2022/02/IT-Minister-Shri-Ashwini-Vaishnaw-to-release-National-Strategy-on-Additive-Manufacturing-tomorrow.jpg"
                                    alt="Shri Ashwini Vaishnaw"
                                    className="w-full h-full object-cover shadow-xl rounded-xl"
                                />
                                <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-5 shadow-lg max-w-xs rounded-lg hidden sm:block">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Shri Ashwini Vaishnaw</h3>
                                    <p className="text-primary-600 dark:text-primary-400 text-sm mt-1">Chancellor, GSV</p>
                                    <p className="text-slate-500 text-xs mt-2 italic">Hon'ble Minister for Railways, I&B, E&IT</p>
                                </div>
                            </div>
                            <div className="py-20 lg:py-0 order-1 lg:order-2">
                                <span className="text-6xl text-primary-200 dark:text-primary-900/30 font-serif leading-none block mb-[-2rem]">"</span>
                                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-8 relative z-10">
                                    Creating specialized human resources for India's transportation sector.
                                </h2>
                                <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                                    <p>
                                        Gati Shakti Vishwavidyalaya (GSV) has been set up to create specialized and talented human resources that will accelerate the development of India's entire transportation and logistics sector, enhancing efficiency across the country.
                                    </p>
                                </div>
                                <div className="mt-8 sm:hidden">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Shri Ashwini Vaishnaw</h3>
                                    <p className="text-slate-500 text-sm">Chancellor, GSV</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vice Chancellor Section */}
                <section className="bg-white dark:bg-slate-900 pb-20">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="order-1">
                                <span className="text-6xl text-primary-200 dark:text-primary-900/30 font-serif leading-none block mb-[-2rem]">"</span>
                                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-8 relative z-10">
                                    Innovation-led, Industry-driven University.
                                </h2>
                                <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                                    <p>
                                        We are building a strong foundation to be India's and World's Best University in the transportation and logistics sectors, creating, assimilating and imparting excellence of knowledge and actions through industry-driven curricula and research.
                                    </p>
                                </div>
                                <div className="mt-8 lg:text-right">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Prof. Manoj Choudhary</h3>
                                    <p className="text-slate-500 text-sm">Vice Chancellor, GSV</p>
                                    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiUG1QCmh58L_dw5Q9kEm7IfoyFTuSQgWF5M67lYp-bWbyE0WrT3MpT2N4sLdoChVTtDc7eaG-pz8sFqulZtVrHFl_g1U1_0UTUhkJUbczPc870VGGBHoq1cnGuHFchJ2HONauto0Xn2RM3dRtphDc880Jz1BvjKyxapfeLM2in_Zhq236_GTYmTGC8gAo/w178-h200/Manoj%20Choudhary.png" alt="Signature substitute" className="h-12 mt-4 opacity-50 hidden lg:inline-block grayscale" />
                                </div>
                            </div>
                            <div className="order-2">
                                <div className="relative h-[500px] w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-xl">
                                    <img
                                        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiUG1QCmh58L_dw5Q9kEm7IfoyFTuSQgWF5M67lYp-bWbyE0WrT3MpT2N4sLdoChVTtDc7eaG-pz8sFqulZtVrHFl_g1U1_0UTUhkJUbczPc870VGGBHoq1cnGuHFchJ2HONauto0Xn2RM3dRtphDc880Jz1BvjKyxapfeLM2in_Zhq236_GTYmTGC8gAo/w178-h200/Manoj%20Choudhary.png"
                                        alt="Prof. Manoj Choudhary"
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

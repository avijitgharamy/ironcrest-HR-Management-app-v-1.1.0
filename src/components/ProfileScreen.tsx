/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Eye, 
  MapPin, 
  ArrowRight,
  GraduationCap,
  Sliders,
  Sparkles,
  Award,
  Globe2,
  FileDown,
  Users2,
  X
} from 'lucide-react';

export default function ProfileScreen() {
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showClientsModal, setShowClientsModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-16 pb-12"
    >
      {/* Hero Story Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Our Story
          </div>
          
          <h2 className="font-display-lg text-3xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tight">
            Architecting Excellence in Human Resources
          </h2>
          
          <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed">
            Founded with a vision to redefine corporate stability and growth, Ironcrest Global Services Ltd. stands as a beacon of high-trust management. We believe that the heart of every successful enterprise is its people, and our mission is to provide the structured environments where both talent and business can thrive in unison.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => setShowPortfolioModal(true)}
              className="h-11 px-6 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-gold-dark transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-md shadow-primary/10"
            >
              <FileDown className="w-4 h-4" />
              Download Portfolio
            </button>
            <button 
              onClick={() => setShowClientsModal(true)}
              className="h-11 px-6 border border-secondary text-secondary font-semibold text-sm rounded-lg hover:bg-secondary/5 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Users2 className="w-4 h-4" />
              Our Clients
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden shadow-xl border border-surface-variant">
            <img 
              alt="Ironcrest Global Office" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3uyNUSkkIiBWp3EBZeXC_1ytcJD0hkMDe5cksyv9ShKPRr4Opj00u2_1vNNK2LMQ9u1NpDV7Uun0W0323XTF3jCrHmUwTRtZa8arhB4iO-Cfoy-eD-5UrHvxIEypazUeD2M9xaKgVDVYHU1KmhPzHA4kzrKzVcPGuHF6WaMri1SrHElvSpNj0PhJ7TmePA397Sn0Z3Cv8NU-cdNM7HLgxzLZV4iqkANcvkBnu21Tfd6E0_GXtenLddUtB__yaCuUNJAIP9b_tIQ"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white p-5 rounded-2xl border border-surface-variant shadow-lg max-w-[220px]">
            <span className="block font-display-lg text-4xl font-extrabold text-primary">15+</span>
            <span className="block text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide mt-1">
              Years of Corporate Excellence
            </span>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 md:p-10 rounded-2xl bg-white border border-surface-variant flex flex-col gap-5 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:w-36 group-hover:h-36 pointer-events-none" />
          <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center text-primary">
            <Rocket className="w-6 h-6" />
          </div>
          <h3 className="font-display-lg text-lg md:text-xl font-bold text-on-surface">Our Mission</h3>
          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            To empower organizations by delivering comprehensive, data-driven HR solutions that foster a culture of integrity, professional growth, and sustainable operational success.
          </p>
        </div>

        <div className="p-8 md:p-10 rounded-2xl bg-secondary text-on-secondary border border-secondary flex flex-col gap-5 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:w-36 group-hover:h-36 pointer-events-none" />
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-secondary-container">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-display-lg text-lg md:text-xl font-bold">Our Vision</h3>
          <p className="text-xs md:text-sm text-white/80 leading-relaxed">
            To be the global benchmark for professional services, recognized for our unwavering commitment to quality, ethical management, and the elevation of human capital.
          </p>
        </div>
      </section>

      {/* Core Expertise Section */}
      <section className="space-y-8">
        <div className="flex flex-col gap-2">
          <h4 className="font-display-lg text-lg md:text-2xl font-bold text-on-surface">Our Core Expertise</h4>
          <div className="h-1 w-16 bg-primary rounded-full animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recruitment */}
          <div className="md:col-span-2 p-6 md:p-8 rounded-2xl bg-white border border-surface-variant flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden shrink-0">
              <img 
                alt="Elite Recruitment Setting" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuASTn8oKyQS0mSsKLPNOwR67hZRaQTfPUamOK2UxZH4--ZYPQHIYYncQwIsnVNA6elk4fU_HzFwGo0_8Jv4rkYtko4G-JDCA5B6jdcYiMgI1NwvqSwXdkCNtHx4YlF_4Z9vCWVINaPhxk8GYSmpXrIcZCVw1VAQUHnWgnW1__oD-CWWXlbJtiubGvyI0hmYJgTlSpFB7pEBpkuBaTbOo-eC1A2ri-CkSssZeVfCkg3DSms7vjYnJnbXrRBO83P5aBuxDtLxfxv4Dg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <span className="px-2.5 py-1 bg-surface-container text-on-secondary-container rounded text-[10px] font-bold uppercase tracking-wider">
                Talent Acquisition
              </span>
              <h5 className="font-display-lg text-base md:text-lg font-bold text-on-surface">Elite Recruitment</h5>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                We source top-tier talent through rigorous vetting and psychometric evaluation, ensuring a perfect cultural and operational fit.
              </p>
            </div>
          </div>

          {/* Training */}
          <div className="p-6 md:p-8 rounded-2xl bg-white border border-surface-variant hover:border-primary transition-colors flex flex-col justify-between gap-6 hover:shadow-sm">
            <div className="w-11 h-11 rounded-lg bg-tertiary-container/30 flex items-center justify-center text-tertiary shrink-0">
              <GraduationCap className="w-5.5 h-5.5" />
            </div>
            <div className="space-y-1 pt-4">
              <h5 className="font-display-lg text-base font-bold text-on-surface">Staff Training</h5>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Tailored development programs designed to bridge skill gaps and foster leadership at every organizational level.
              </p>
            </div>
          </div>

          {/* Consultancy */}
          <div className="p-6 md:p-8 rounded-2xl bg-white border border-surface-variant hover:border-primary transition-colors flex flex-col justify-between gap-6 hover:shadow-sm">
            <div className="w-11 h-11 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
              <Sliders className="w-5.5 h-5.5" />
            </div>
            <div className="space-y-1 pt-4">
              <h5 className="font-display-lg text-base font-bold text-on-surface">HR Consultancy</h5>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Strategic advisory on policy formulation, automated compliance, and organizational restructuring for maximum efficiency.
              </p>
            </div>
          </div>

          {/* Global Reach */}
          <div className="md:col-span-2 p-6 md:p-8 rounded-2xl bg-surface-container-low border border-surface-variant flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4">
              <h5 className="font-display-lg text-base md:text-lg font-bold text-on-surface">Global Service Reach</h5>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed max-w-sm">
                Operating across 12 countries, providing localized HR management optimized for international standards.
              </p>
              <div className="flex -space-x-2 select-none">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">UK</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[10px] font-bold">US</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center text-[10px] font-bold">SG</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-on-primary flex items-center justify-center text-[10px] font-extrabold">+12</div>
              </div>
            </div>
            <div className="w-full md:w-64 h-36 bg-white rounded-xl border border-outline-variant/30 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <img 
                alt="Global map" 
                className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeiaf0Q4XFNtRmjeTaXzxwREdhQehcyEalIyXW7g2HUeD3D5JeH49twMLmYRh0f5yWd5TddcTF44vbk10YSYQTI3kUVivBryW8siY7mmjK-WrHpmRYf87nmAGX0RZ2qj6FPFgvL2nJLM4E1cQUC8H1ylSTEEMo61zjsYfnXtJFxopbZaUoaJ3eDohPyQvGLz1dSpNHime-VfJDnJJrhgbqhNUAuLT1eDT79IQsw6yrN_O5EJblfB9feJBjW-idHrh1Svf659bs-g"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Asset Quality Badge Footer */}
      <section className="p-8 md:p-12 rounded-2xl bg-white border border-surface-variant flex flex-col items-center text-center gap-6 md:gap-8 hover:shadow-sm transition-shadow">
        <div className="space-y-1">
          <h4 className="font-display-lg text-lg md:text-2xl font-extrabold text-primary">Ironcrest Global</h4>
          <p className="text-xs md:text-sm text-on-surface-variant max-w-md">The Professional Authority in Human Resource Management.</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-70 select-none pt-2 text-xs md:text-sm font-extrabold tracking-widest text-[#4C4636]">
          <span className="bg-surface-container-low px-4 py-2 rounded-xl">ISO 9001</span>
          <span className="bg-surface-container-low px-4 py-2 rounded-xl">CIPM PARTNER</span>
          <span className="bg-surface-container-low px-4 py-2 rounded-xl">SHRM ALLIANCE</span>
          <span className="bg-surface-container-low px-4 py-2 rounded-xl">GLOBAL HR EXCELLENCE</span>
        </div>
      </section>

      {/* Modals for actions */}
      <AnimatePresence>
        {showPortfolioModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full border border-surface-variant p-6 space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPortfolioModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>

              <div className="space-y-3 pt-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <FileDown className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-on-surface font-display-lg">Download Brand Portfolio</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  The compiled corporate credentials and annual compliance briefing documents will download instantly in PDF format.
                </p>
                <div className="bg-surface-ice p-3.5 rounded-xl border text-xs text-on-surface font-sans space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Document Size:</span>
                    <span className="font-semibold">4.8 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Verification format:</span>
                    <span className="font-semibold text-green-600">SHA-256 Secured Signed</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button 
                  onClick={() => setShowPortfolioModal(false)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold rounded-lg text-xs cursor-pointer"
                >
                  Close
                </button>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Simulating Brand Portfolio PDF Download: 'Ironcrest_Corporate_Portfolio_2026.pdf'");
                    setShowPortfolioModal(false);
                  }}
                  className="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg text-xs hover:bg-gold-dark cursor-pointer flex items-center gap-1.5"
                >
                  Download Profile PDF
                </a>
              </div>
            </motion.div>
          </div>
        )}

        {showClientsModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full border border-surface-variant p-6 space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowClientsModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>

              <div className="space-y-3 pt-2">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                  <Users2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-on-surface font-display-lg">Key Client Partners</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  We deploy human capital across leading international conglomerates and strategic government branches:
                </p>
                <ul className="text-xs font-sans text-on-surface space-y-2 list-disc pl-5">
                  <li><strong>Aethel Tech:</strong> Global cybersecurity developer</li>
                  <li><strong>Lumina Logistics:</strong> Multi-country supply networks</li>
                  <li><strong>Zephyr energy:</strong> Renewable offshore operations</li>
                  <li><strong>Regal Group:</strong> High-end property development</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button 
                  onClick={() => setShowClientsModal(false)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold rounded-lg text-xs cursor-pointer"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

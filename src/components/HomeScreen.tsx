/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Wrench, 
  TrendingUp, 
  ArrowRight, 
  Briefcase, 
  Building2, 
  Award,
  ChevronRight,
  Info,
  Calendar,
  X
} from 'lucide-react';
import { SOLUTIONS, NEWS } from '../data';
import { RegistrationData } from '../types';
import CompanyLogo from './CompanyLogo';
// @ts-ignore
import manpowerImg from '../assets/images/manpower_services_1779649439199.png';
// @ts-ignore
import strategyImg from '../assets/images/strategic_planning_1779649456797.png';
// @ts-ignore
import complianceImg from '../assets/images/compliance_trust_1779649473045.png';

interface HomeScreenProps {
  onRegisterClick: () => void;
  onViewNewsClick: (newsId: string) => void;
  registration: RegistrationData;
  applicantUser?: RegistrationData | null;
  onSignOut?: () => void;
  key?: string;
}

export default function HomeScreen({ onRegisterClick, onViewNewsClick, registration, applicantUser, onSignOut }: HomeScreenProps) {
  const [selectedSolution, setSelectedSolution] = useState<typeof SOLUTIONS[0] | null>(null);

  const isLoggedInUserCompleted = applicantUser ? applicantUser.isCompleted : registration.isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-bright to-surface-ice border border-surface-variant p-8 md:p-12 shadow-sm">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="w-40 h-40 md:w-48 md:h-48 mb-6 bg-surface-container-lowest rounded-full p-4 md:p-6 shadow-lg border border-surface-variant/70 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <CompanyLogo className="w-28 h-28" />
          </motion.div>

          {applicantUser ? (
            <>
              <h2 className="font-display-lg text-3xl md:text-3xl font-extrabold text-[#0B1C30] mb-3 tracking-tight">
                Welcome back, {applicantUser.personal?.fullName || "Valued Applicant"}!
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <span className="text-xs text-on-surface-variant">Your secure onboarding record is:</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-wider border border-primary/20">
                  {applicantUser.status || "Draft"}
                </span>
              </div>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant mb-8 max-w-lg leading-relaxed">
                {applicantUser.isCompleted 
                  ? "Your job application has been successfully locked and passed to the Executive HR Audit Node. Our administrative officers are inspecting your encrypted elements." 
                  : "You have a secure applicant account but have not yet submitted your onboarding file. Click the button below to update your profile and verify your details."}
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display-lg text-2xl md:text-3xl font-extrabold text-primary mb-3 tracking-tight">
                Excellence in Human Resources
              </h2>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant mb-8 max-w-lg leading-relaxed">
                Elevating global workforce standards through strategic manpower solutions and expert management. Register, log in, or click below to submit your credentials securely.
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRegisterClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/10 hover:bg-gold-dark transition-colors flex items-center justify-center gap-3 cursor-pointer text-xs uppercase tracking-wider"
            >
              <Briefcase className="w-4 h-4 text-on-primary" />
              <span>
                {applicantUser
                  ? (applicantUser.isCompleted ? "View Submission Status" : "Resume My Onboarding Form")
                  : "Enter Onboarding Gateway"}
              </span>
              <ArrowRight className="w-4 h-4 text-on-primary" />
            </motion.button>

            {applicantUser && onSignOut && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSignOut}
                className="w-full sm:w-auto px-6 py-3.5 bg-white border border-outline-variant hover:bg-red-50 text-red-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
              >
                Sign Out Gateway
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="font-display-lg text-xl md:text-2xl font-bold text-on-surface">Our Solutions</h3>
            <p className="text-xs md:text-sm text-on-surface-variant">Industry leading workforce and consulting methodologies.</p>
          </div>
          <button 
            onClick={() => setSelectedSolution(SOLUTIONS[0])}
            className="text-primary text-xs font-semibold tracking-wider hover:underline cursor-pointer flex items-center gap-1"
          >
            VIEW ALL <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 is wide and features detailed info */}
          <div 
            onClick={() => setSelectedSolution(SOLUTIONS[0])}
            className="md:col-span-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer bg-surface-container-lowest border border-surface-variant rounded-xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="flex items-start md:items-center gap-4">
              <div className="w-14 h-14 bg-primary-container rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-7 h-7 text-on-primary-container" />
              </div>
              <div>
                <h4 className="font-display-lg text-lg font-bold text-on-surface">HR Management</h4>
                <p className="text-sm text-on-surface-variant mt-1.5 max-w-2xl leading-relaxed">
                  Comprehensive lifecycle management from onboarding to performance tracking with professional integrity.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-primary/80 bg-primary/5 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
              Active Module <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </span>
          </div>

          {/* Card 2 aspect-square with generated image */}
          <div 
            onClick={() => setSelectedSolution(SOLUTIONS[1])}
            className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer bg-surface-container-lowest border border-surface-variant rounded-xl overflow-hidden flex flex-col aspect-[4/3] md:aspect-square group"
          >
            <div className="h-28 md:h-36 bg-surface-container-low relative overflow-hidden shrink-0">
              <img 
                src={manpowerImg}
                alt="Manpower Services"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm shadow-sm p-2 rounded-lg text-secondary">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <div className="p-4 md:p-5 flex-1 flex flex-col justify-center">
              <h4 className="font-display-lg text-base font-bold text-on-surface leading-tight">Manpower Services</h4>
              <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">Vetted recruitment pipeline in high-demand positions.</p>
            </div>
          </div>

          {/* Card 3 aspect-square with generated image */}
          <div 
            onClick={() => setSelectedSolution(SOLUTIONS[2])}
            className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer bg-surface-container-lowest border border-surface-variant rounded-xl overflow-hidden flex flex-col aspect-[4/3] md:aspect-square group"
          >
            <div className="h-28 md:h-36 bg-surface-container-low relative overflow-hidden shrink-0">
              <img 
                src={strategyImg}
                alt="Strategic Planning"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm shadow-sm p-2 rounded-lg text-tertiary">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="p-4 md:p-5 flex-1 flex flex-col justify-center">
              <h4 className="font-display-lg text-base font-bold text-on-surface leading-tight">Strategic Planning</h4>
              <p className="text-xs text-on-surface-variant mt-2 line-clamp-2 font-sans">Aligning workforce capacity with high-growth future horizons.</p>
            </div>
          </div>

          {/* Card 4 showing ISO certified highlight with generated image */}
          <div 
            onClick={() => setSelectedSolution(SOLUTIONS[3])}
            className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer bg-surface-container-lowest border border-surface-variant rounded-xl overflow-hidden flex flex-col aspect-[4/3] md:aspect-square group"
          >
            <div className="h-28 md:h-36 bg-surface-container-low relative overflow-hidden shrink-0">
              <img 
                src={complianceImg}
                alt="Compliance & Trust"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm shadow-sm p-2 rounded-lg text-primary">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="p-4 md:p-5 flex-1 flex flex-col justify-center">
              <h4 className="font-display-lg text-base font-bold text-on-surface leading-tight">Compliance & Trust</h4>
              <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">Ensuring global operations meet physical and regulatory high-trust standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Updates Section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="font-display-lg text-xl md:text-2xl font-bold text-on-surface">Company News</h3>
          <p className="text-xs md:text-sm text-on-surface-variant">Stay up to date with major announcements from our international offices.</p>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {NEWS.map((item) => (
            <div 
              key={item.id}
              onClick={() => onViewNewsClick(item.id)}
              className="min-w-[280px] sm:min-w-[320px] max-w-[365px] flex-shrink-0 bg-surface-container-lowest border border-surface-variant rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between group"
            >
              <div className="h-44 bg-surface-container-low relative overflow-hidden">
                <img 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={item.image}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm shadow-sm px-2.5 py-1 rounded text-[11px] font-bold text-primary uppercase tracking-wider">
                  {item.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-display-lg text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <span className="text-xs font-semibold text-secondary flex items-center gap-1.5 uppercase tracking-wide">
                  Read Announcement <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Alert Banner */}
      <section className="bg-surface-container border border-surface-variant p-5 rounded-xl flex items-start gap-4">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-on-surface">Interactive Sandbox Demo Mode</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Filling the staff registration form dynamically changes onboarding profiles. Your registration details will load into the status dashboard in real-time.
          </p>
        </div>
      </section>

      {/* Solution Detail Modal */}
      <AnimatePresence>
        {selectedSolution && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full border border-surface-variant p-6 space-y-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedSolution(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>

              <div className="space-y-4">
                <span className="text-xs bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                  Solution Highlight
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    {selectedSolution.icon === 'groups' && <Users className="w-6 h-6" />}
                    {selectedSolution.icon === 'engineering' && <Wrench className="w-6 h-6" />}
                    {selectedSolution.icon === 'insights' && <TrendingUp className="w-6 h-6" />}
                    {selectedSolution.icon === 'verified' && <Award className="w-6 h-6" />}
                    {selectedSolution.icon === 'favorite' && <Users className="w-6 h-6" />}
                    {selectedSolution.icon === 'payments' && <TrendingUp className="w-6 h-6" />}
                  </div>
                  <h3 className="text-xl font-bold text-on-surface font-display-lg">{selectedSolution.title}</h3>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {selectedSolution.description}
                </p>
              </div>

              <div className="bg-surface-ice rounded-lg p-4 border border-outline-variant/30 space-y-2">
                <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Next Compliance Review: June 2026
                </span>
                <p className="text-xs text-on-surface-variant">
                  We formulate customized policy frameworks adhering directly to global organizational compliance standards.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setSelectedSolution(null)}
                  className="px-5 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold rounded-lg text-sm cursor-pointer"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => {
                    setSelectedSolution(null);
                    onRegisterClick();
                  }}
                  className="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:bg-gold-dark cursor-pointer flex items-center gap-1.5"
                >
                  Register Staff <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

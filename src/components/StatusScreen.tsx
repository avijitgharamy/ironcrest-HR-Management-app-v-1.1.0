/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  Hourglass, 
  ShieldCheck, 
  Info,
  Mail,
  HelpCircle,
  Calendar,
  FileText,
  AlertTriangle,
  User,
  X,
  Send,
  Trash2,
  Lock
} from 'lucide-react';
import { RegistrationData, CompanyNotice } from '../types';
import { NOTICES } from '../data';

interface StatusScreenProps {
  registration: RegistrationData;
  onUpdateProfileClick: () => void;
  onClearRegistration: () => void;
  key?: string;
}

export default function StatusScreen({ registration, onUpdateProfileClick, onClearRegistration }: StatusScreenProps) {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [supportMsg, setSupportMsg] = useState('');
  const [supportHistory, setSupportHistory] = useState<string[]>([]);
  const [activeNotice, setActiveNotice] = useState<CompanyNotice | null>(null);

  const handleSendSupportMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;
    setSupportHistory(prev => [...prev, supportMsg]);
    setSupportMsg('');
    setTimeout(() => {
      setSupportHistory(prev => [
        ...prev, 
        "Assistant Automated Response: Thank you for contacting Ironcrest Support. An HR specialist will evaluate your message shortly."
      ]);
    }, 1200);
  };

  const displayName = registration.isCompleted ? registration.personal.fullName : "Alex Thompson";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-10 pb-12"
    >
      {/* Welcome Header */}
      <section className="space-y-2">
        <h3 className="font-display-lg text-2xl md:text-3xl font-extrabold text-on-surface">
          Welcome back, {displayName}.
        </h3>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          Your employment onboarding is currently in progress. Please review your status below.
        </p>
      </section>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Registration Tracker Column */}
        <div className="lg:col-span-8 bg-white border border-surface-variant rounded-xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between space-y-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h4 className="font-display-lg text-lg font-bold text-primary flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Registration Status
            </h4>
            <span className={`px-3 py-1 font-bold text-[10px] md:text-xs tracking-wider rounded-full ${
              !registration.isCompleted ? 'bg-slate-100 text-on-surface-variant' :
              registration.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
              registration.status === 'Rejected' ? 'bg-rose-100 text-rose-700 font-extrabold animate-pulse' :
              'bg-primary-container text-on-primary-container'
            }`}>
              {registration.isCompleted ? registration.status.toUpperCase() : "DRAFT (NOT SUBMITTED)"}
            </span>
          </div>

          {/* Stepper progress representation */}
          <div className="relative pt-4 overflow-x-auto no-scrollbar">
            {/* Step sequence */}
            <div className="flex justify-between items-start min-w-[450px] relative">
              {/* Connector strip background */}
              <div className="absolute top-[18px] left-[20px] right-[20px] h-0.5 bg-slate-200 -z-10" />
              {/* Connector progress active indicator */}
              <div 
                className={`absolute top-[18px] left-[20px] h-0.5 -z-10 transition-all duration-1000 ${
                  registration.status === 'Rejected' ? 'bg-rose-500' :
                  registration.status === 'Approved' ? 'bg-emerald-600' : 'bg-primary'
                }`} 
                style={{ 
                  width: !registration.isCompleted ? '10%' 
                    : (registration.status === 'Approved' || registration.status === 'Rejected') ? '100%' 
                    : '50%' 
                }}
              />

              {/* Step 1: Submission */}
              <div className="flex flex-col items-center gap-3 text-center shrink-0 w-24">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                  registration.isCompleted ? 'bg-primary text-on-primary' : 'bg-primary-container text-on-primary-container'
                }`}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-on-surface">Submission</p>
                  <p className="text-[10px] text-on-surface-variant font-mono">
                    {registration.isCompleted ? (registration.submittedAt || "Oct 12, 2023") : "Pending"}
                  </p>
                </div>
              </div>

              {/* Step 2: HR Review */}
              <div className="flex flex-col items-center gap-3 text-center shrink-0 w-24">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all duration-500 ${
                  !registration.isCompleted 
                    ? 'bg-slate-100 text-on-surface-variant'
                    : (registration.status === 'Approved' || registration.status === 'Rejected')
                      ? 'bg-emerald-600 text-white'
                      : 'bg-primary text-on-primary border-4 border-white ring-2 ring-primary'
                }`}>
                  {(registration.status === 'Approved' || registration.status === 'Rejected') ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Hourglass className={`w-5 h-5 ${registration.isCompleted ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-on-surface">HR Review</p>
                  <p className="text-[10px] text-on-surface-variant">
                    {!registration.isCompleted ? "Awaiting"
                      : (registration.status === 'Approved' || registration.status === 'Rejected') ? "Completed"
                      : "In Progress"
                    }
                  </p>
                </div>
              </div>

              {/* Step 3: Approval / Decision */}
              <div className="flex flex-col items-center gap-3 text-center shrink-0 w-24">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all duration-500 ${
                  !registration.isCompleted 
                    ? 'bg-slate-100 text-slate-400'
                    : registration.status === 'Approved'
                      ? 'bg-emerald-600 text-white border-2 border-white ring-2 ring-emerald-500 shadow-md shadow-emerald-200'
                      : registration.status === 'Rejected'
                        ? 'bg-rose-600 text-white border-2 border-white ring-2 ring-rose-500 shadow-md shadow-rose-200'
                        : 'bg-slate-100 text-slate-400'
                }`}>
                  {registration.status === 'Rejected' ? (
                    <AlertTriangle className="w-5 h-5 text-white" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-on-surface">
                    {registration.status === 'Approved' ? "Onboarded"
                      : registration.status === 'Rejected' ? "Revision Req."
                      : "Approval"
                    }
                  </p>
                  <p className="text-[10px] text-on-surface-variant">
                    {!registration.isCompleted ? "Upcoming"
                      : registration.status === 'Approved' ? "Approved!"
                      : registration.status === 'Rejected' ? "Action Required"
                      : "Upcoming"
                    }
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Secure Administrative HR Notes Segment */}
          {registration.isCompleted && registration.hrNotes && (
            <div className={`rounded-xl p-4 border text-xs gap-3 flex items-start transition-all ${
              registration.status === 'Rejected' 
                ? 'bg-rose-50/80 border-rose-200/50 text-rose-950' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${registration.status === 'Rejected' ? 'text-rose-600' : 'text-primary'}`} />
              <div className="space-y-1">
                <div className="font-bold uppercase tracking-wider text-[10px] opacity-75">
                  HR Onboarding Review Note
                </div>
                <blockquote className="italic font-medium font-sans leading-relaxed text-current">
                  "{registration.hrNotes}"
                </blockquote>
              </div>
            </div>
          )}

          <div className={`rounded-xl p-5 border transition-colors duration-500 flex items-start gap-4 ${
            !registration.isCompleted
              ? 'bg-surface-ice border-primary-container/30 text-slate-700'
              : registration.status === 'Approved'
                ? 'bg-emerald-50 border-emerald-200/60 text-emerald-950'
                : registration.status === 'Rejected'
                  ? 'bg-rose-50 border-rose-200/60 text-rose-950'
                  : 'bg-surface-ice border-primary-container/30 text-slate-700'
          }`}>
            {!registration.isCompleted ? (
              <>
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm leading-relaxed text-on-surface-variant">
                  You have not completed your onboarding profile. Please complete the registration steps to kickstart the credential verification processes.
                </p>
              </>
            ) : registration.status === 'Approved' ? (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="font-bold text-xs md:text-sm text-emerald-950 leading-none">Onboarding Verification Approved & Complete!</h5>
                  <p className="text-xs leading-relaxed text-emerald-900/95 pt-0.5">
                    Welcome to the global team! The HR admin team has fully verified your references, educational credentials, and compliance documents. Your secure employee record is now active in the central portal database.
                  </p>
                </div>
              </>
            ) : registration.status === 'Rejected' ? (
              <>
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
                <div className="space-y-1">
                  <h5 className="font-bold text-xs md:text-sm text-rose-950 leading-none">Application Modification Required</h5>
                  <p className="text-xs leading-relaxed text-rose-900/95 pt-0.5 font-medium">
                    Please modify and re-submit your profile information using the button below. Review the HR feedback comments above to guide your corrections.
                  </p>
                </div>
              </>
            ) : (
              <>
                <Hourglass className="w-5 h-5 text-primary shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <h5 className="font-bold text-xs md:text-sm text-slate-900 leading-none">Application Under Official Review</h5>
                  <p className="text-xs leading-relaxed text-on-surface-variant pt-0.5">
                    Your documents are currently being secure-audited by the compliance team. Standard background and credential check routines typically take 3-5 business days. Real-time updates will display here as they are registered.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Assistance Column */}
        <div className="lg:col-span-4 bg-ink text-white rounded-xl p-6 md:p-8 flex flex-col justify-between h-full space-y-6 shadow-sm">
          <div className="space-y-2">
            <h4 className="font-display-lg text-lg font-bold">Need Assistance?</h4>
            <p className="text-xs text-white/75 leading-relaxed">
              Contact our HR support team for any queries regarding your onboarding process.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setShowSupportModal(true)}
              className="w-full h-11 bg-primary text-on-primary font-bold text-xs rounded-lg flex items-center justify-center gap-2 hover:bg-gold-dark transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 text-on-primary" />
              Message Support
            </button>
            <button 
              onClick={() => setShowHelpModal(true)}
              className="w-full h-11 border border-white/25 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-white" />
              View Help Center
            </button>
          </div>
        </div>
      </div>

      {/* Submitted Info Audit card */}
      {registration.isCompleted && (
        <section className="bg-white border border-surface-variant rounded-xl p-6 md:p-8 space-y-6 shadow-sm transition-all">
          <div className="flex justify-between items-center pb-3 border-b">
            <h4 className="font-display-lg text-sm font-bold text-on-surface uppercase tracking-wide">
              Registered Profile Snapshot
            </h4>
            <button 
              onClick={onClearRegistration}
              className="text-red-500 hover:text-red-700 text-xs font-bold font-sans flex items-center gap-1 cursor-pointer"
              title="Delete Sandbox Profile Progress"
            >
              <Trash2 className="w-4 h-4" /> Reset Portal Data
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs md:text-sm">
            <div className="space-y-1">
              <span className="text-on-surface-variant font-medium block">Full Legal Name:</span>
              <strong className="text-on-surface block font-semibold">{registration.personal.fullName}</strong>
            </div>
            <div className="space-y-1">
              <span className="text-on-surface-variant font-medium block">Date of Birth:</span>
              <span className="text-on-surface block font-semibold">{registration.personal.dob}</span>
            </div>
            <div className="space-y-1">
              <span className="text-on-surface-variant font-medium block">Gender Option:</span>
              <span className="text-on-surface block font-semibold">{registration.personal.gender}</span>
            </div>
            <div className="space-y-1">
              <span className="text-on-surface-variant font-medium block">Nationality / Citizenships:</span>
              <span className="text-on-surface block font-semibold">{registration.personal.nationality}</span>
            </div>
            <div className="space-y-1">
              <span className="text-on-surface-variant font-medium block">Highest Education:</span>
              <span className="text-on-surface block font-semibold">{registration.professional.highestEducation}</span>
            </div>
            <div className="space-y-1">
              <span className="text-on-surface-variant font-medium block">Corporate Contact Email:</span>
              <span className="text-on-surface block font-semibold">{registration.contact.email}</span>
            </div>
          </div>
        </section>
      )}

      {/* Notices alerts list */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2">
          <Info className="w-5 h-5 text-primary" />
          <h4 className="font-display-lg text-base md:text-lg font-bold text-on-surface">Important Notices</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NOTICES.map((notice) => (
            <div 
              key={notice.id}
              onClick={() => setActiveNotice(notice)}
              className="bg-white border border-surface-variant rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg ${
                  notice.category === 'Event' ? 'bg-secondary-container/20 text-secondary' :
                  notice.category === 'Policy' ? 'bg-tertiary-container/30 text-tertiary' : 'bg-error-container text-on-error-container'
                }`}>
                  {notice.icon === 'event' && <Calendar className="w-5 h-5" />}
                  {notice.icon === 'description' && <FileText className="w-5 h-5" />}
                  {notice.icon === 'priority_high' && <AlertTriangle className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                  notice.actionRequired ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-on-surface-variant'
                }`}>
                  {notice.date}
                </span>
              </div>
              <div className="space-y-1">
                <h5 className="font-display-lg text-sm font-bold text-on-surface group-hover:text-primary">
                  {notice.title}
                </h5>
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                  {notice.description}
                </p>
              </div>
              <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 pt-1.5 uppercase tracking-wide">
                View Detail &rarr;
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Profile redirection footer */}
      <section className="bg-white border border-surface-variant rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
            <User className="w-6 h-6 " />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm md:text-base font-bold text-on-surface leading-tight">Keep your information current</h4>
            <p className="text-xs text-on-surface-variant">Update your residential address, contact details, or emergency contacts.</p>
          </div>
        </div>
        <button 
          onClick={onUpdateProfileClick}
          className="whitespace-nowrap px-6 py-2.5 border border-secondary text-secondary font-bold rounded-lg text-xs md:text-sm hover:bg-secondary/5 transition-all active:scale-95 cursor-pointer"
        >
          {registration.isCompleted ? "Modify Registered Profile" : "Register Onboarding Record"}
        </button>
      </section>

      {/* Support Message Dialog Component */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full border border-surface-variant p-6 space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => {
                  setShowSupportModal(false);
                  setSupportHistory([]);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-container-low transition-colors"
                type="button"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>

              <div className="space-y-2 pt-2">
                <h3 className="text-lg font-bold text-on-surface font-display-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" /> Onboarding Helpdesk
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Send a fast encrypted question directly to the designated HR administration team node.
                </p>
              </div>

              {/* Simulated chat timeline */}
              <div className="h-44 bg-surface-ice border rounded-xl p-3.5 overflow-y-auto space-y-3 font-sans text-xs">
                <div className="bg-slate-200 text-on-surface p-2.5 rounded-lg max-w-[85%] self-start leading-relaxed shadow-sm">
                  Hello! How can we assist you with your onboarding forms today?
                </div>

                {supportHistory.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed shadow-sm ${
                      msg.startsWith("Assistant") 
                        ? 'bg-slate-200 text-on-surface self-start border border-primary/20' 
                        : 'bg-primary text-on-primary ml-auto text-right'
                    }`}
                  >
                    {msg}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendSupportMsg} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Type questions..."
                  className="flex-1 h-10 px-3 bg-white border border-outline-variant rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-sans"
                  value={supportMsg}
                  onChange={(e) => setSupportMsg(e.target.value)}
                />
                <button 
                  type="submit"
                  className="w-10 h-10 bg-primary hover:bg-gold-dark text-on-primary rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4 text-on-primary" />
                </button>
              </form>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => {
                    setShowSupportModal(false);
                    setSupportHistory([]);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-on-surface font-bold rounded-lg text-xs cursor-pointer"
                  type="button"
                >
                  Close Chat
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* View Help Center Modal */}
        {showHelpModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full border border-surface-variant p-6 space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowHelpModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>

              <div className="space-y-3 pt-2">
                <h3 className="text-lg font-bold text-on-surface font-display-lg flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" /> Help Center
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Fast walkthrough guides mapping typical developer onboarding errors:
                </p>

                <div className="space-y-3 text-xs leading-relaxed font-sans">
                  <div className="p-3 bg-surface-ice rounded-lg border">
                    <strong className="block text-on-surface mb-1">Q: How long does the credential audit take?</strong>
                    <span className="text-on-surface-variant">Normally 3-5 business days. You will be alerted automatically on status updates.</span>
                  </div>

                  <div className="p-3 bg-surface-ice rounded-lg border">
                    <strong className="block text-on-surface mb-1">Q: Can I modify my submissions?</strong>
                    <span className="text-on-surface-variant">Yes! Select "Modify Registered Profile" from the bottom of Dashboard section.</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg text-xs hover:bg-gold-dark cursor-pointer"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Notice Details Modal */}
        {activeNotice && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full border border-surface-variant p-6 space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setActiveNotice(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>

              <div className="space-y-3 pt-2">
                <span className="text-[10px] bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Important Update Announcement
                </span>
                <h3 className="text-lg font-bold text-on-surface font-display-lg flex items-center gap-2">
                  {activeNotice.title}
                </h3>
                <span className="text-[11px] font-semibold text-secondary block">
                  Publish Time: {activeNotice.date}
                </span>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed font-sans">
                  {activeNotice.description}
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border space-y-2 text-xs font-sans">
                  <p><strong>Impact Audience:</strong> All newly onboarded global business team members.</p>
                  <p><strong>Compliance Action:</strong> Strongly recommended to acknowledge within 48 hours for HR tracking.</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setActiveNotice(null)}
                  className="px-5 py-2 bg-primary text-on-primary font-bold rounded-lg text-xs hover:bg-gold-dark cursor-pointer shadow-md"
                >
                  Acknowledge Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

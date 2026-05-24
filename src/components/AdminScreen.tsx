/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Search,
  Filter,
  FileCheck,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  UserX,
  UserCheck,
  RefreshCw,
  FolderOpen,
  ClipboardList,
  Flame,
  FileText,
  LogOut
} from 'lucide-react';
import { RegistrationData } from '../types';

interface AdminScreenProps {
  registrations: RegistrationData[];
  onUpdateStatus: (id: string, status: RegistrationData['status'], hrNotes: string) => Promise<void>;
  onDeleteRecord?: (id: string) => Promise<void>;
  onRefresh: () => void;
  key?: string;
  onSignOut?: () => void;
}

export default function AdminScreen({ registrations, onUpdateStatus, onDeleteRecord, onRefresh, onSignOut }: AdminScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending Approval' | 'Approved' | 'Rejected'>('All');
  const [selectedApplicant, setSelectedApplicant] = useState<RegistrationData | null>(null);
  const [hrNotesInput, setHrNotesInput] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'List' | 'Analytics'>('List');

  // Filter registrations
  const filteredApplicants = registrations.filter(app => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      app.personal.fullName.toLowerCase().includes(query) ||
      app.contact.email.toLowerCase().includes(query) ||
      app.professional.primarySkillset.toLowerCase().includes(query) ||
      app.personal.nationality.toLowerCase().includes(query);
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && app.status === statusFilter;
  });

  // Calculate metrics
  const totalSubmissions = registrations.filter(r => r.isCompleted).length;
  const pendingSubmissions = registrations.filter(r => r.status === 'Pending Approval').length;
  const approvedSubmissions = registrations.filter(r => r.status === 'Approved').length;
  const rejectedSubmissions = registrations.filter(r => r.status === 'Rejected').length;

  // Handle status update submission
  const handleStatusChange = async (id: string, newStatus: RegistrationData['status']) => {
    setIsUpdatingStatus(newStatus);
    try {
      await onUpdateStatus(id, newStatus, hrNotesInput);
      // Update local detailed view if open
      if (selectedApplicant && selectedApplicant.id === id) {
        setSelectedApplicant({
          ...selectedApplicant,
          status: newStatus,
          hrNotes: hrNotesInput
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleSelectApplicant = (applicant: RegistrationData) => {
    setSelectedApplicant(applicant);
    setHrNotesInput(applicant.hrNotes || '');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* Title Header with Synchronize action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Operations Node
          </div>
          <h2 className="font-display-lg text-2xl md:text-3xl font-extrabold text-ink">Administrative Dashboard</h2>
          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            Verify submitted credentials, edit corporate onboarding statuses, and log organizational audit tracking details live.
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <button 
            onClick={onRefresh}
            className="px-4.5 py-2.5 bg-white border border-outline-variant hover:bg-surface-container-low text-on-surface font-semibold rounded-lg text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer select-none"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            Sync Database
          </button>

          {onSignOut && (
            <button 
              onClick={onSignOut}
              className="px-4.5 py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100/80 text-rose-700 font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer select-none"
            >
              <LogOut className="w-3.5 h-3.5" />
              Exit Admin Console
            </button>
          )}
        </div>
      </div>

      {/* Analytics Dashboard Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        <div className="bg-white border border-surface-variant p-5 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Total Submissions</span>
            <strong className="block text-2xl font-extrabold text-[#0B1C30] mt-0.5">{totalSubmissions}</strong>
          </div>
        </div>

        <div className="bg-white border border-surface-variant p-5 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Awaiting Review</span>
            <strong className="block text-2xl font-extrabold text-amber-600 mt-0.5">{pendingSubmissions}</strong>
          </div>
        </div>

        <div className="bg-white border border-surface-variant p-5 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center shrink-0 border border-green-100">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Approved Active</span>
            <strong className="block text-2xl font-extrabold text-green-600 mt-0.5">{approvedSubmissions}</strong>
          </div>
        </div>

        <div className="bg-white border border-surface-variant p-5 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0 border border-rose-100">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Onboarding Rejected</span>
            <strong className="block text-2xl font-extrabold text-rose-600 mt-0.5">{rejectedSubmissions}</strong>
          </div>
        </div>
      </section>

      {/* Tabs navigation */}
      <div className="flex border-b border-surface-variant">
        <button 
          onClick={() => setActiveTab('List')}
          className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === 'List' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Staff Applicants ({filteredApplicants.length})
        </button>
        <button 
          onClick={() => setActiveTab('Analytics')}
          className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === 'Analytics' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Workforce Diagnostics
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* LIST TAB VIEW */}
        {activeTab === 'List' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Search and Filters panel */}
            <div className="bg-white border border-surface-variant rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  placeholder="Search applicants by name, domain, email, nationality..."
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-outline-variant/65 rounded-xl text-xs font-sans outline-none focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0 text-xs text-on-surface">
                <span className="font-semibold text-on-surface-variant flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Refined State:
                </span>
                
                {(['All', 'Pending Approval', 'Approved', 'Rejected'] as const).map((filter) => (
                  <button 
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                      statusFilter === filter 
                        ? 'bg-primary border-primary text-on-primary' 
                        : 'bg-white border-outline-variant/80 hover:bg-slate-50 text-on-surface-variant'
                    }`}
                  >
                    {filter === 'All' ? 'ALL DATA' : filter.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Application Table Grid */}
            <div className="bg-white border border-surface-variant rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-surface-variant font-bold text-on-surface-variant uppercase select-none text-[10px] tracking-wider">
                      <th className="p-4 pl-6">Applicant Node</th>
                      <th className="p-4">Primary Skill Domain</th>
                      <th className="p-4">Nation</th>
                      <th className="p-4">Submission Date</th>
                      <th className="p-4">Review Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant/70 font-sans">
                    {filteredApplicants.length > 0 ? (
                      filteredApplicants.map((applicant) => (
                        <tr 
                          key={applicant.id} 
                          className="hover:bg-slate-50/70 transition-colors group"
                        >
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold font-display-lg text-primary">
                                {applicant.personal.fullName.charAt(0)}
                              </div>
                              <div className="space-y-0.5">
                                <strong className="font-bold text-on-surface block text-xs md:text-sm">{applicant.personal.fullName}</strong>
                                <span className="text-[10px] text-on-surface-variant font-medium block">{applicant.contact.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-on-surface font-sans capitalize">{applicant.professional.primarySkillset || 'Not Stated'}</span>
                            <span className="text-[10px] text-on-surface-variant block mt-0.5">{applicant.professional.highestEducation}</span>
                          </td>
                          <td className="p-4 font-medium text-on-surface">
                            {applicant.personal.nationality}
                          </td>
                          <td className="p-4 font-mono text-[11px] text-on-surface-variant font-semibold">
                            {applicant.submittedAt || "DRAFT"}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                              applicant.status === 'Approved' ? 'bg-green-100 text-green-700' :
                              applicant.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-600 animate-pulse'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                applicant.status === 'Approved' ? 'bg-green-600' :
                                applicant.status === 'Rejected' ? 'bg-red-600' : 'bg-amber-500'
                              }`} />
                              {applicant.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button 
                              onClick={() => handleSelectApplicant(applicant)}
                              className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 hover:bg-primary-container hover:border-primary-container hover:text-on-primary-container text-on-surface font-bold text-[10px] md:text-xs rounded-lg transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                            >
                              Evaluate File
                              <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-on-surface-variant font-medium">
                          <div className="flex flex-col items-center gap-3">
                            <FolderOpen className="w-10 h-10 text-primary opacity-50" />
                            <p className="text-sm font-semibold">No registrations logged in current selection query.</p>
                            <p className="text-xs">Use the submission forms in onboarding screen to populate records.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ANALYTICS TAB VIEW */}
        {activeTab === 'Analytics' && (
          <motion.div 
            key="analytics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Skillset clustering statistics card */}
            <div className="bg-white border border-surface-variant rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="space-y-1">
                <h4 className="font-display-lg text-base font-bold text-on-surface">Primary Skillset Clustering</h4>
                <p className="text-xs text-on-surface-variant">Review the dynamic distribution of applicants professional competencies.</p>
              </div>

              <div className="space-y-4">
                {registrations.length > 0 ? (
                  Array.from(new Set(registrations.filter(r => r.isCompleted).map(r => r.professional.primarySkillset || 'General HR'))).map((skill, index) => {
                    const count = registrations.filter(r => r.professional.primarySkillset === skill).length;
                    const percent = registrations.length > 0 ? Math.round((count / registrations.length) * 100) : 0;
                    return (
                      <div key={index} className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-on-surface">
                          <span className="font-semibold">{skill}</span>
                          <span className="font-mono text-on-surface-variant">{count} ({percent}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-1000" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-on-surface-variant">No submission metrics mapped yet.</p>
                )}
              </div>
            </div>

            {/* Demographics / Nationality analysis card */}
            <div className="bg-white border border-surface-variant rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="space-y-1">
                <h4 className="font-display-lg text-base font-bold text-on-surface">Nationality Diagnostics</h4>
                <p className="text-xs text-on-surface-variant">Detailed look into the cultural diversity of submitted onboard applicants.</p>
              </div>

              <div className="space-y-4">
                {registrations.length > 0 ? (
                  Array.from(new Set(registrations.filter(r => r.isCompleted).map(r => r.personal.nationality))).map((nat, index) => {
                    if (!nat) return null;
                    const count = registrations.filter(r => r.personal.nationality === nat).length;
                    const percent = Math.round((count / registrations.length) * 100);
                    return (
                      <div key={index} className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-on-surface">
                          <span className="font-semibold">{nat}</span>
                          <span className="font-mono text-on-surface-variant">{count} logged</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-secondary transition-all duration-1000" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-on-surface-variant">No demographic indices parsed.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* APPLICANT EXPANDED EVALUATION MODAL COMPONENT */}
      <AnimatePresence>
        {selectedApplicant && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full border border-surface-variant overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-slate-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {selectedApplicant.personal.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display-lg text-base md:text-lg font-bold text-on-surface leading-tight">
                      {selectedApplicant.personal.fullName}
                    </h3>
                    <p className="text-xs text-on-surface-variant">Reviewing File Ref: {selectedApplicant.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                    selectedApplicant.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    selectedApplicant.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {selectedApplicant.status}
                  </span>
                  
                  <button 
                    onClick={() => setSelectedApplicant(null)}
                    className="p-1.5 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5 text-on-surface-variant" />
                  </button>
                </div>
              </div>

              {/* Scrollable File Body Content */}
              <div className="p-6 overflow-y-auto space-y-8 font-sans text-xs md:text-sm">
                
                {/* 1. Personal & Location Snap */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wide border-b pb-1.5">1. Identification & Locations</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-on-surface-variant block text-[11px] font-medium">Date of Birth:</span>
                      <strong className="text-on-surface block font-semibold mt-0.5">{selectedApplicant.personal.dob}</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[11px] font-medium">Gender Option:</span>
                      <strong className="text-on-surface block font-semibold mt-0.5">{selectedApplicant.personal.gender}</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[11px] font-medium">Nationality / Citizenship:</span>
                      <strong className="text-on-surface block font-semibold mt-0.5">{selectedApplicant.personal.nationality}</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[11px] font-medium">Mobile Contact:</span>
                      <strong className="text-on-surface block font-semibold mt-0.5">{selectedApplicant.contact.mobile}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-on-surface-variant block text-[11px] font-medium">Street Residential Address:</span>
                      <strong className="text-on-surface block font-semibold mt-0.5">
                        {selectedApplicant.contact.addressStreet}, {selectedApplicant.contact.addressCity}, {selectedApplicant.contact.addressPostalCode}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 2. Career & Skill sets map */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wide border-b pb-1.5">2. Career Experience Details</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-on-surface-variant block text-[11px] font-medium">Highest level education:</span>
                        <strong className="text-on-surface block font-semibold mt-0.5">{selectedApplicant.professional.highestEducation}</strong>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[11px] font-medium">Years Active Corporate:</span>
                        <strong className="text-on-surface block font-semibold mt-0.5">{selectedApplicant.professional.yearsOfExperience} Years</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-on-surface-variant block text-[11px] font-medium">Core Primary Skillset Domain:</span>
                        <strong className="text-on-surface block font-semibold mt-0.5 uppercase tracking-wide text-primary">
                          {selectedApplicant.professional.primarySkillset}
                        </strong>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-lg text-xs leading-relaxed text-on-surface-variant italic">
                      " {selectedApplicant.professional.professionalSummary} "
                    </div>
                  </div>
                </div>

                {/* 3. Document Audit nodes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wide border-b pb-1.5">3. Verifiable Onboarding Documentation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-dotted">
                      <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs text-on-surface block truncate">{selectedApplicant.documents.nidPassportName || 'No Passport submitted'}</span>
                        <span className="text-[10px] text-green-600 font-bold tracking-wide uppercase mt-0.5">SHA-256 CHECKED</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-dotted">
                      <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs text-on-surface block truncate">{selectedApplicant.documents.academicCertificateName || 'No Degree Certificate submitted'}</span>
                        <span className="text-[10px] text-green-600 font-bold tracking-wide uppercase mt-0.5">VERIFIED CIPM</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 4. Verification Action Controller */}
                <div className="space-y-3 bg-primary-container/20 p-5 rounded-2xl border border-primary-container/40">
                  <h4 className="text-xs font-bold text-on-primary-container uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-4 h-4" /> 4. Evaluation Decisions & Audit Notes
                  </h4>
                  
                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-on-primary-container ml-1">Administrative Notes & Assessment Report</label>
                      <textarea 
                        className="w-full px-4 py-3 bg-white border border-outline-variant/65 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-sans"
                        placeholder="Log review details, security status clearance codes, or compliance remarks..."
                        rows={3}
                        value={hrNotesInput}
                        onChange={(e) => setHrNotesInput(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button 
                        type="button"
                        onClick={() => handleStatusChange(selectedApplicant.id!, 'Approved')}
                        disabled={isUpdatingStatus !== null}
                        className="flex-1 min-w-[130px] h-10 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        Clear & Approve Staff
                      </button>

                      <button 
                        type="button"
                        onClick={() => handleStatusChange(selectedApplicant.id!, 'Rejected')}
                        disabled={isUpdatingStatus !== null}
                        className="flex-1 min-w-[130px] h-10 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <UserX className="w-4 h-4" />
                        Reject Application
                      </button>
                      
                      <button 
                        type="button"
                        onClick={() => handleStatusChange(selectedApplicant.id!, 'Pending Approval')}
                        disabled={isUpdatingStatus !== null}
                        className="h-10 px-4 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-on-surface font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        Reset to Pending
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t bg-slate-50 flex justify-between gap-3 shrink-0">
                {onDeleteRecord && selectedApplicant.id && !selectedApplicant.id.startsWith('reg_mock_') ? (
                  <button 
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove ${selectedApplicant.personal.fullName} onboarding record permanently?`)) {
                        onDeleteRecord(selectedApplicant.id!);
                        setSelectedApplicant(null);
                      }
                    }}
                    className="px-4 py-2 text-rose-600 hover:text-rose-800 font-bold text-xs hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Delete Applicant Records
                  </button>
                ) : (
                  <div />
                )}

                <button 
                  onClick={() => setSelectedApplicant(null)}
                  className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-lg text-xs hover:bg-gold-dark cursor-pointer shadow-sm"
                >
                  Dismiss
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

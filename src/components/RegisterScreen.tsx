/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Briefcase, 
  Phone, 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Upload, 
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { RegistrationData } from '../types';

function resizeImageBase64(base64Str: string, maxWidth: number = 160, maxHeight: number = 160): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => {
      resolve(base64Str);
    };
    img.src = base64Str;
  });
}

interface RegisterScreenProps {
  registration: RegistrationData;
  setRegistration: (data: RegistrationData) => void;
  onSuccess: () => void;
  key?: string;
}

export default function RegisterScreen({ registration, setRegistration, onSuccess }: RegisterScreenProps) {
  const [step, setStep] = useState(1);
  const fileInputNid = useRef<HTMLInputElement>(null);
  const fileInputDegree = useRef<HTMLInputElement>(null);
  const fileInputAvatar = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Field validation and change handlers
  const handlePersonalChange = (fields: Partial<RegistrationData['personal']>) => {
    setRegistration({
      ...registration,
      personal: { ...registration.personal, ...fields }
    });
    setErrorMsg(null);
  };

  const handleProfessionalChange = (fields: Partial<RegistrationData['professional']>) => {
    setRegistration({
      ...registration,
      professional: { ...registration.professional, ...fields }
    });
    setErrorMsg(null);
  };

  const handleContactChange = (fields: Partial<RegistrationData['contact']>) => {
    setRegistration({
      ...registration,
      contact: { ...registration.contact, ...fields }
    });
    setErrorMsg(null);
  };

  const handleDocumentChange = (fields: Partial<RegistrationData['documents']>) => {
    setRegistration({
      ...registration,
      documents: { ...registration.documents, ...fields }
    });
    setErrorMsg(null);
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!registration.personal.fullName.trim()) return "Full Legal Name is required.";
      if (!registration.personal.dob) return "Date of Birth is required.";
      if (!registration.personal.gender || registration.personal.gender === "Select Gender") return "Please select a Gender option.";
      if (!registration.personal.nationality.trim()) return "Nationality is required.";
    } else if (currentStep === 2) {
      if (!registration.professional.highestEducation.trim()) return "Highest Educational Qualification is required.";
      if (!registration.professional.yearsOfExperience) return "Please state your years of professional experience.";
      if (!registration.professional.primarySkillset.trim()) return "Primary skillset domain is required.";
      if (!registration.professional.professionalSummary.trim()) return "Professional competencies summary is required.";
    } else if (currentStep === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!registration.contact.email.trim()) return "Corporate Email Address is required.";
      if (!emailRegex.test(registration.contact.email)) return "Please enter a valid Corporate Email Address.";
      if (!registration.contact.mobile.trim()) return "Mobile Contact is required.";
      if (!registration.contact.addressStreet.trim()) return "Residential Street Address is required.";
      if (!registration.contact.addressCity.trim()) return "Residential City is required.";
      if (!registration.contact.addressPostalCode.trim()) return "Residential Postal Code is required.";
    } else if (currentStep === 4) {
      if (!registration.documents.nidPassportName) return "NID or Passport copy identification upload is required.";
      if (!registration.documents.academicCertificateName) return "Academic Degree certificate copy upload is required.";
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(step);
    if (error) {
      setErrorMsg(error);
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateStep(4);
    if (error) {
      setErrorMsg(error);
      return;
    }

    // Save registration as completed and update local state parameters
    const submissionDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    setRegistration({
      ...registration,
      isCompleted: true,
      status: 'Pending Approval',
      submittedAt: submissionDate
    });

    onSuccess();
  };

  // Simulating drag & drop upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, type: 'nid' | 'degree') => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const name = e.dataTransfer.files[0].name;
      if (type === 'nid') {
        handleDocumentChange({ nidPassportName: name });
      } else {
        handleDocumentChange({ academicCertificateName: name });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'nid' | 'degree') => {
    if (e.target.files && e.target.files.length > 0) {
      const name = e.target.files[0].name;
      if (type === 'nid') {
        handleDocumentChange({ nidPassportName: name });
      } else {
        handleDocumentChange({ academicCertificateName: name });
      }
    }
  };

  // Preset file simulated browse
  const triggerPrefillMockFile = (type: 'nid' | 'degree') => {
    if (type === 'nid') {
      handleDocumentChange({ nidPassportName: `Passport_${registration.personal.fullName.replace(/\s+/g, '_')}_Verified.pdf` });
    } else {
      handleDocumentChange({ academicCertificateName: `Diploma_${registration.professional.highestEducation.replace(/\s+/g, '_')}.pdf` });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Registration Header */}
      <div className="space-y-2">
        <h2 className="font-display-lg text-2xl md:text-3xl font-bold text-ink">Staff Onboarding Registration</h2>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          Onboard new personnel by completing the tiered authentication and professional mapping process.
        </p>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white/70 border border-surface-variant rounded-2xl shadow-sm text-xs select-none">
        <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all ${
          step === 1 ? 'bg-primary-container text-on-primary-container font-semibold' : 'bg-surface-container text-on-surface-variant'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            step > 1 ? 'bg-green-500 text-white' : step === 1 ? 'bg-primary text-on-primary' : 'bg-outline-variant text-white'
          }`}>
            {step > 1 ? "✓" : "1"}
          </span>
          <span>Personal Info</span>
        </div>

        <div className="hidden sm:block h-px bg-outline-variant flex-1" />

        <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all ${
          step === 2 ? 'bg-primary-container text-on-primary-container font-semibold' : 'bg-surface-container text-on-surface-variant'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            step > 2 ? 'bg-green-500 text-white' : step === 2 ? 'bg-primary text-on-primary' : 'bg-outline-variant text-white'
          }`}>
            {step > 2 ? "✓" : "2"}
          </span>
          <span>Professional</span>
        </div>

        <div className="hidden sm:block h-px bg-outline-variant flex-1" />

        <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all ${
          step === 3 ? 'bg-primary-container text-on-primary-container font-semibold' : 'bg-surface-container text-on-surface-variant'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            step > 3 ? 'bg-green-500 text-white' : step === 3 ? 'bg-primary text-on-primary' : 'bg-outline-variant text-white'
          }`}>
            {step > 3 ? "✓" : "3"}
          </span>
          <span>Contact</span>
        </div>

        <div className="hidden sm:block h-px bg-outline-variant flex-1" />

        <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all ${
          step === 4 ? 'bg-primary-container text-on-primary-container font-semibold' : 'bg-surface-container text-on-surface-variant'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            step === 4 ? 'bg-primary text-on-primary' : 'bg-outline-variant text-white'
          }`}>
            4
          </span>
          <span>Documents</span>
        </div>
      </div>

      {/* Error Bar */}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3 border border-error/20"
        >
          <AlertCircle className="w-5 h-5 text-error shrink-0" />
          <span className="text-sm font-medium">{errorMsg}</span>
        </motion.div>
      )}

      {/* Form Card Content */}
      <div className="bg-white border border-surface-variant rounded-2xl shadow-sm p-6 md:p-8 relative">
        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Personal info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-surface-variant">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="font-display-lg text-lg font-bold text-on-surface">Primary Identification</h3>
                </div>

                {/* Profile Picture Upload Section inside Step 1 */}
                <div className="bg-surface-bright border border-outline-variant rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6">
                  <div className="relative shrink-0 group">
                    <input 
                      type="file" 
                      ref={fileInputAvatar}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const raw = reader.result as string;
                            const compressed = await resizeImageBase64(raw);
                            handlePersonalChange({ avatarUrl: compressed });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden" 
                      accept="image/*"
                    />
                    
                    <div 
                      onClick={() => fileInputAvatar.current?.click()}
                      className="w-24 h-24 rounded-full border-2 border-dashed border-outline-variant overflow-hidden flex items-center justify-center bg-white hover:border-primary transition-all cursor-pointer relative"
                    >
                      {registration.personal.avatarUrl ? (
                        <img 
                          src={registration.personal.avatarUrl} 
                          alt="Profile Avatar" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <Upload className="w-6 h-6 text-primary mx-auto mb-1 opacity-75 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-on-surface-variant">Upload File</span>
                        </div>
                      )}
                      
                      {/* Highlight Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-bold transition-opacity">
                        Choose Photo
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 text-center md:text-left">
                    <div>
                      <h4 className="text-xs font-bold text-ink">User Profile Picture</h4>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">
                        Upload a premium headshot or passport-style image (PNG, JPG, or GIF up to 2MB). This is used in staff directories and top navigation headers.
                      </p>
                    </div>

                    {/* Presets Grid */}
                    <div className="space-y-1.5 text-left">
                      <span className="text-[10px] font-semibold text-outline tracking-wide uppercase">Or choose from professional presets:</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { name: 'Priscilla', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
                          { name: 'Marcus', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
                          { name: 'Elena', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
                          { name: 'Alex', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' }
                        ].map((preset) => (
                          <button
                            type="button"
                            key={preset.name}
                            onClick={() => handlePersonalChange({ avatarUrl: preset.url })}
                            className={`flex items-center gap-1.5 px-2.5 py-1 border transition-all rounded-full cursor-pointer text-[10px] ${
                              registration.personal.avatarUrl === preset.url
                                ? 'bg-primary-container text-on-primary-container border-primary font-bold'
                                : 'bg-white border-outline-variant hover:bg-surface-container text-on-surface'
                            }`}
                          >
                            <img src={preset.url} alt={preset.name} className="w-4 h-4 rounded-full object-cover" referrerPolicy="no-referrer" />
                            <span>{preset.name}</span>
                          </button>
                        ))}
                        {registration.personal.avatarUrl && (
                          <button
                            type="button"
                            onClick={() => handlePersonalChange({ avatarUrl: '' })}
                            className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer ml-1"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Full Legal Name</label>
                    <input 
                      className="w-full h-11 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans" 
                      placeholder="e.g. Alex Thompson"
                      type="text"
                      value={registration.personal.fullName}
                      onChange={(e) => handlePersonalChange({ fullName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Date of Birth</label>
                    <input 
                      className="w-full h-11 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans" 
                      type="date"
                      value={registration.personal.dob}
                      onChange={(e) => handlePersonalChange({ dob: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Gender Identification</label>
                    <select 
                      className="w-full h-11 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans cursor-pointer"
                      value={registration.personal.gender}
                      onChange={(e) => handlePersonalChange({ gender: e.target.value })}
                    >
                      <option value="Select Gender">Select Gender Option</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Nationality</label>
                    <input 
                      className="w-full h-11 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans" 
                      placeholder="e.g. British"
                      type="text"
                      value={registration.personal.nationality}
                      onChange={(e) => handlePersonalChange({ nationality: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Professional */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-surface-variant">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <h3 className="font-display-lg text-lg font-bold text-on-surface">Career Mapping</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Highest Educational Level</label>
                    <input 
                      className="w-full h-11 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans" 
                      placeholder="e.g. MSc International HR Relations" 
                      type="text"
                      value={registration.professional.highestEducation}
                      onChange={(e) => handleProfessionalChange({ highestEducation: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Years of Corporate Experience</label>
                    <input 
                      className="w-full h-11 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans" 
                      placeholder="0" 
                      type="number"
                      min="0"
                      max="50"
                      value={registration.professional.yearsOfExperience}
                      onChange={(e) => handleProfessionalChange({ yearsOfExperience: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Primary Skillset Domain</label>
                    <input 
                      className="w-full h-11 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans" 
                      placeholder="e.g. Risk Management, Compliance" 
                      type="text"
                      value={registration.professional.primarySkillset}
                      onChange={(e) => handleProfessionalChange({ primarySkillset: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Brief Professional Summary</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans" 
                      placeholder="Describe high-trust competencies and general backgrounds..." 
                      rows={4}
                      value={registration.professional.professionalSummary}
                      onChange={(e) => handleProfessionalChange({ professionalSummary: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Contact Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-surface-variant">
                  <Phone className="w-5 h-5 text-primary" />
                  <h3 className="font-display-lg text-lg font-bold text-on-surface">Connectivity & Location</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Corporate Email Address</label>
                    <input 
                      className="w-full h-11 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans" 
                      placeholder="alex.thompson@ironcrest.com" 
                      type="email"
                      value={registration.contact.email}
                      onChange={(e) => handleContactChange({ email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Mobile Contact Phone</label>
                    <input 
                      className="w-full h-11 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans" 
                      placeholder="e.g. +44 7000 000000" 
                      type="tel"
                      value={registration.contact.mobile}
                      onChange={(e) => handleContactChange({ mobile: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Residential Street Address</label>
                    <input 
                      className="w-full h-11 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans" 
                      placeholder="e.g. Street building address No 12" 
                      type="text"
                      value={registration.contact.addressStreet}
                      onChange={(e) => handleContactChange({ addressStreet: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">City</label>
                    <input 
                      className="w-full h-11 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans" 
                      placeholder="e.g. London" 
                      type="text"
                      value={registration.contact.addressCity}
                      onChange={(e) => handleContactChange({ addressCity: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Postal Code</label>
                    <input 
                      className="w-full h-11 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-sans" 
                      placeholder="e.g. EC1A 1BB" 
                      type="text"
                      value={registration.contact.addressPostalCode}
                      onChange={(e) => handleContactChange({ addressPostalCode: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Document Uploads */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-surface-variant">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-display-lg text-lg font-bold text-on-surface">Verification Documents</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Upload NID/Passport */}
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'nid')}
                    className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-surface-bright hover:bg-surface-container transition-colors cursor-pointer group"
                  >
                    <input 
                      type="file" 
                      ref={fileInputNid}
                      onChange={(e) => handleFileSelect(e, 'nid')}
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    
                    {registration.documents.nidPassportName ? (
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-on-surface truncate max-w-[220px] mx-auto">
                            {registration.documents.nidPassportName}
                          </p>
                          <p className="text-[10px] text-green-600 font-semibold uppercase">Ready</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleDocumentChange({ nidPassportName: '' })}
                          className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="text-xs font-bold text-ink">NID / Passport Copy</h4>
                        <p className="text-[10px] text-on-surface-variant mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                        <div className="flex gap-2 mt-4">
                          <button 
                            type="button"
                            onClick={() => fileInputNid.current?.click()}
                            className="bg-secondary text-on-secondary px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Browse
                          </button>
                          <button 
                            type="button"
                            onClick={() => triggerPrefillMockFile('nid')}
                            className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer decoration-transparent hover:bg-gold-light"
                          >
                            Mock Autofill
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Upload Degree certificate */}
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'degree')}
                    className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-surface-bright hover:bg-surface-container transition-colors cursor-pointer group"
                  >
                    <input 
                      type="file" 
                      ref={fileInputDegree}
                      onChange={(e) => handleFileSelect(e, 'degree')}
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png"
                    />

                    {registration.documents.academicCertificateName ? (
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-on-surface truncate max-w-[220px] mx-auto">
                            {registration.documents.academicCertificateName}
                          </p>
                          <p className="text-[10px] text-green-600 font-semibold uppercase">Ready</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleDocumentChange({ academicCertificateName: '' })}
                          className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="text-xs font-bold text-ink">Academic Certificate</h4>
                        <p className="text-[10px] text-on-surface-variant mt-1">Upload graduation credentials</p>
                        <div className="flex gap-2 mt-4">
                          <button 
                            type="button"
                            onClick={() => fileInputDegree.current?.click()}
                            className="bg-secondary text-on-secondary px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Browse
                          </button>
                          <button 
                            type="button"
                            onClick={() => triggerPrefillMockFile('degree')}
                            className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer decoration-transparent hover:bg-gold-light"
                          >
                            Mock Autofill
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-primary-container/20 p-4 rounded-xl flex gap-3 border border-primary-container/40">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-on-primary-container leading-relaxed">
                    <strong>High Security Node Encrypted:</strong> All uploaded documents are processed via end-to-end sandbox storage nodes and encrypted under international GDPR compliance guidelines.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Stepper Navigation Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-surface-variant">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-2.5 bg-white border border-outline-variant hover:bg-surface-container-low text-on-surface font-semibold rounded-lg text-xs md:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Step
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-xs md:text-sm hover:bg-gold-dark transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Next Stage
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg text-xs md:text-sm hover:bg-gold-dark transition-colors flex items-center gap-1.5 cursor-pointer animate-pulse"
              >
                Submit & Complete Registration
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>
      </div>
    </motion.div>
  );
}

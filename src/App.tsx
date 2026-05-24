/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  UserPlus, 
  Building2, 
  Lock, 
  Menu, 
  Bell, 
  ChevronRight, 
  X,
  CreditCard,
  UserCheck,
  Building,
  Info,
  ShieldCheck
} from 'lucide-react';

import { RegistrationData } from './types';
import HomeScreen from './components/HomeScreen';
import RegisterScreen from './components/RegisterScreen';
import ProfileScreen from './components/ProfileScreen';
import StatusScreen from './components/StatusScreen';
import AdminScreen from './components/AdminScreen';
import CompanyLogo from './components/CompanyLogo';
import ApplicantAuthScreen from './components/ApplicantAuthScreen';

const STORAGE_KEY = 'ironcrest_registration_v1';

const DEFAULT_REGISTRATION: RegistrationData = {
  personal: {
    fullName: '',
    dob: '',
    gender: 'Select Gender',
    nationality: '',
    avatarUrl: ''
  },
  professional: {
    highestEducation: '',
    yearsOfExperience: '',
    primarySkillset: '',
    professionalSummary: ''
  },
  contact: {
    email: '',
    mobile: '',
    addressStreet: '',
    addressCity: '',
    addressPostalCode: ''
  },
  documents: {
    nidPassportName: '',
    academicCertificateName: ''
  },
  isCompleted: false,
  status: 'Draft'
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'Home' | 'Register' | 'Profile' | 'Status' | 'Admin'>('Home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const [registration, setRegistration] = useState<RegistrationData>(DEFAULT_REGISTRATION);
  const [allRegistrations, setAllRegistrations] = useState<RegistrationData[]>([]);

  // Applicant sign-in/sign-up state
  const [applicantUser, setApplicantUser] = useState<RegistrationData | null>(() => {
    try {
      const stored = localStorage.getItem('ironcrest_applicant_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Secure administrative states
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('ironcrest_admin_token'));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(!!localStorage.getItem('ironcrest_admin_token'));
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  // Local fetch helper
  const fetchRegistrations = async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsedStored = stored ? JSON.parse(stored) : null;
      const currentEmail = parsedStored ? parsedStored.contact?.email : registration.contact?.email;
      const currentId = parsedStored ? parsedStored.id : registration.id;
      
      // 1. Fetch user's own details with decrypted pipeline
      if (currentId || currentEmail) {
        const queryParams = currentId ? `id=${encodeURIComponent(currentId)}` : `email=${encodeURIComponent(currentEmail)}`;
        const response = await fetch(`/api/registrations?${queryParams}`);
        const json = await response.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const fetchedReg = json.data[0];
          setRegistration(fetchedReg);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedReg));
          if (localStorage.getItem('ironcrest_applicant_user')) {
            setApplicantUser(fetchedReg);
            localStorage.setItem('ironcrest_applicant_user', JSON.stringify(fetchedReg));
          }
        }
      }

      // 2. Fetch admin master records list if administrative authorization exists
      const activeToken = localStorage.getItem('ironcrest_admin_token') || adminToken;
      if (activeToken) {
        const adminResponse = await fetch('/api/admin/registrations', {
          headers: { 'X-Admin-Token': activeToken }
        });
        const json = await adminResponse.json();
        if (json.success && Array.isArray(json.data)) {
          setAllRegistrations(json.data);
        }
      } else {
        // Fallback: fetch status overview with masked details from server to keep charts loaded
        const response = await fetch('/api/registrations');
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          setAllRegistrations(json.data);
        }
      }
    } catch (e) {
      console.warn("Backend database synchronization error:", e);
    }
  };

  // Load state and sync backend on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRegistration(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not reload local storage settings.", e);
    }
    
    fetchRegistrations();
    
    // Poll for status updates every 10 seconds to make the real-time simulation feel incredibly responsive!
    const interval = setInterval(fetchRegistrations, 10000);
    return () => clearInterval(interval);
  }, [adminToken]);

  // Sync back state changes to localStorage and backend API
  const handleUpdateRegistration = async (data: RegistrationData) => {
    // Keep password if it wasn't specified in data but is in current registration
    const updatedData = {
      ...data,
      password: data.password || registration.password || applicantUser?.password
    };

    setRegistration(updatedData);
    if (applicantUser) {
      const updatedUser = { ...applicantUser, ...updatedData };
      setApplicantUser(updatedUser);
      localStorage.setItem('ironcrest_applicant_user', JSON.stringify(updatedUser));
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (e) {
      console.warn("Could not commit local storage updates.", e);
    }

    // Always update database for logged in applicant so they don't lose progress, or if completed!
    if (updatedData.personal?.fullName && (updatedData.isCompleted || applicantUser)) {
      try {
        const response = await fetch('/api/registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });
        const json = await response.json();
        if (json.success && json.data) {
          const finalData = json.data;
          setRegistration(finalData);
          if (applicantUser) {
            setApplicantUser(finalData);
            localStorage.setItem('ironcrest_applicant_user', JSON.stringify(finalData));
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
        } else {
          fetchRegistrations();
        }
      } catch (e) {
        console.warn("Failed to synchronize with backend server:", e);
      }
    }
  };

  const handleApplicantSuccessAuth = (user: RegistrationData) => {
    setApplicantUser(user);
    setRegistration(user);
    localStorage.setItem('ironcrest_applicant_user', JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setCurrentTab('Home');
    fetchRegistrations();
  };

  const handleApplicantSignOut = () => {
    setApplicantUser(null);
    setRegistration(DEFAULT_REGISTRATION);
    localStorage.removeItem('ironcrest_applicant_user');
    localStorage.removeItem(STORAGE_KEY);
    setCurrentTab('Home');
  };

  // Administrative actions
  const handleUpdateStatus = async (id: string, status: RegistrationData['status'], hrNotes: string) => {
    try {
      const activeToken = localStorage.getItem('ironcrest_admin_token') || adminToken;
      if (!activeToken) return;
      const response = await fetch('/api/registrations/status', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Token': activeToken
        },
        body: JSON.stringify({ id, status, hrNotes })
      });
      const json = await response.json();
      if (json.success) {
        await fetchRegistrations();
      }
    } catch (e) {
      console.error("Status update error:", e);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      const activeToken = localStorage.getItem('ironcrest_admin_token') || adminToken;
      if (!activeToken) return;
      const response = await fetch(`/api/registrations/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Token': activeToken
        }
      });
      const json = await response.json();
      if (json.success) {
        await fetchRegistrations();
      }
    } catch (e) {
      console.error("Delete record error:", e);
    }
  };

  const handleClearRegistration = () => {
    if (confirm("Are you sure you want to clear your current onboarding profile? This resets all steps to draft mode.")) {
      handleUpdateRegistration(DEFAULT_REGISTRATION);
      setCurrentTab('Home');
    }
  };

  const handleRegistrationSuccess = () => {
    // Navigate straight to dashboard status screen
    setCurrentTab('Status');
    // Scroll window smoothly to the top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPasscode === 'ironcrest-secure-2026') {
      localStorage.setItem('ironcrest_admin_token', 'ironcrest-secure-2026');
      setAdminToken('ironcrest-secure-2026');
      setIsAdminAuthenticated(true);
      setShowAdminLoginModal(false);
      setAdminUsername('');
      setAdminPasscode('');
      setAdminLoginError('');
      // Route directly inside control screen
      setCurrentTab('Admin');
    } else {
      setAdminLoginError('Invalid Administrator ID or Security Passcode. Access Denied.');
    }
  };

  const handleAdminSignOut = () => {
    localStorage.removeItem('ironcrest_admin_token');
    setAdminToken(null);
    setIsAdminAuthenticated(false);
    setCurrentTab('Home');
  };

  const displayName = applicantUser 
    ? (registration.personal?.fullName || "Applicant (Draft Profile)") 
    : "Portal Guest";
  const userAvatarUrl = (applicantUser && registration.personal?.avatarUrl) 
    ? registration.personal.avatarUrl 
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuCK0Ia8rum8UyTeFnns4SQnxqzLppdRUy75rGlhrw0f-Mh4gfRlx_2N4LY8qGRZ1qxqC6S0lZu6WNXNF90WZ41czEOSA6HkhtibMopvipTl0S3745Rf7j-okLooCbXEtR_eib4Nb2bs0YP6KpXAKcU5JqqPuo7j0Fw1Y_jV39egZu1_wJejqVg-cYNL3xvRfluWgDgUA2uadMwynv0deWGz5s6l8lECT1oqa3vyzWRHm1r5ZLhhGAqvjz1izjnexP3wIT2lymyhag";

  return (
    <div className="min-h-screen bg-surface-ice flex flex-col font-sans select-none antialiased text-on-surface">
      
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-surface-variant flex items-center justify-between px-4 md:px-8 py-3.5 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5 text-primary" />
          </button>
          
          <div className="flex items-center gap-2">
            {/* Minimal aesthetic brand token logo icon container with newly added I&C Gold logo */}
            <CompanyLogo className="w-9 h-9" />
            <h1 className="font-display-lg text-base md:text-xl font-extrabold text-primary tracking-tight">
              Ironcrest Global Services
            </h1>
          </div>
        </div>

        {/* Action icons right side */}
        <div className="flex items-center gap-2 md:gap-4 flex-nowrap">
          <button 
            onClick={() => setNotificationsOpen(true)}
            className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant relative transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full animate-ping" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full" />
          </button>

          {/* User Profile Avatar Popover toggle */}
          <button 
            onClick={() => setProfilePopoverOpen(!profilePopoverOpen)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container active:scale-95 transition-transform shrink-0 cursor-pointer"
          >
            <img 
              alt="Staff Profile Avatar" 
              className="w-full h-full object-cover" 
              src={userAvatarUrl}
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </header>

      <div className="flex flex-1 w-full max-w-7xl mx-auto relative pb-16 md:pb-0">
        
        {/* DESKTOP SIDEBAR DRAWER (Sticky Left aside) */}
        <aside className="hidden md:flex flex-col h-[calc(100vh-70px)] w-72 bg-white border-r border-surface-variant p-6 space-y-8 sticky top-[70px] self-start shrink-0">
          <div className="space-y-3 pb-3 border-b border-surface-variant/40">
            <div className="flex items-center gap-3 bg-primary-container/25 p-2 rounded-2xl border border-primary-container/15">
              <CompanyLogo className="w-10 h-10" />
              <div className="space-y-0.5">
                <h2 className="font-display-lg text-base font-extrabold text-primary leading-none">Ironcrest Global</h2>
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider leading-none">
                  HR Portal Node
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 flex flex-col gap-1.5">
            <button 
              onClick={() => setCurrentTab('Home')}
              className={`w-full px-4 py-3 flex items-center gap-3.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                currentTab === 'Home' 
                  ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <HomeIcon className="w-4.5 h-4.5 shrink-0" />
              <span>Home Dashboard</span>
            </button>

            <button 
              onClick={() => setCurrentTab('Register')}
              className={`w-full px-4 py-3 flex items-center gap-3.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                currentTab === 'Register' 
                  ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <UserPlus className="w-4.5 h-4.5 shrink-0" />
              <span>Staff Onboarding</span>
            </button>

            <button 
              onClick={() => setCurrentTab('Profile')}
              className={`w-full px-4 py-3 flex items-center gap-3.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                currentTab === 'Profile' 
                  ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <Building2 className="w-4.5 h-4.5 shrink-0" />
              <span>Company Profile</span>
            </button>

            <button 
              onClick={() => setCurrentTab('Status')}
              className={`w-full px-4 py-3 flex items-center gap-3.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                currentTab === 'Status' 
                  ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <Lock className="w-4.5 h-4.5 shrink-0" />
              <span>Onboarding Status</span>
            </button>

            {isAdminAuthenticated && (
              <button 
                onClick={() => setCurrentTab('Admin')}
                className={`w-full px-4 py-3 flex items-center gap-3.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  currentTab === 'Admin' 
                    ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold' 
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <ShieldCheck className="w-4.5 h-4.5 shrink-0 text-amber-600 animate-pulse" />
                <span className="font-semibold text-amber-800">Admin Console</span>
              </button>
            )}
          </nav>

          <div className="border-t border-surface-variant pt-4 flex flex-col gap-1.5 select-none">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">System Security</span>
            <span className="text-xs font-mono font-semibold text-on-surface-variant/80">Active Sandbox Node v1.1.0</span>
            <div className="pt-1.5">
              {!isAdminAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(true)}
                  className="w-full text-left px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-primary-gold hover:text-gold-dark text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-primary" />
                    <span>Admin Unlock Node</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-primary/60" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAdminSignOut}
                  className="w-full text-left px-3.5 py-2 bg-red-50 hover:bg-red-100/85 text-rose-700 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>Lock Credentials</span>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* MAIN BODY SCROLL VIEW PORT */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden min-w-0">
          <AnimatePresence mode="wait">
            
            {currentTab === 'Home' && (
              <HomeScreen 
                key="home" 
                onRegisterClick={() => setCurrentTab('Register')} 
                onViewNewsClick={() => setCurrentTab('Status')}
                registration={registration}
                applicantUser={applicantUser}
                onSignOut={handleApplicantSignOut}
              />
            )}

            {currentTab === 'Register' && (
              applicantUser ? (
                <RegisterScreen 
                  key="register" 
                  registration={registration} 
                  setRegistration={handleUpdateRegistration} 
                  onSuccess={handleRegistrationSuccess}
                />
              ) : (
                <ApplicantAuthScreen onAuthSuccess={handleApplicantSuccessAuth} />
              )
            )}

            {currentTab === 'Profile' && (
              <ProfileScreen key="profile" />
            )}

            {currentTab === 'Status' && (
              applicantUser ? (
                <StatusScreen 
                  key="status" 
                  registration={registration} 
                  onUpdateProfileClick={() => setCurrentTab('Register')}
                  onClearRegistration={handleClearRegistration}
                />
              ) : (
                <ApplicantAuthScreen onAuthSuccess={handleApplicantSuccessAuth} />
              )
            )}

            {currentTab === 'Admin' && isAdminAuthenticated && (
              <AdminScreen 
                key="admin" 
                registrations={allRegistrations} 
                onUpdateStatus={handleUpdateStatus}
                onDeleteRecord={handleDeleteRecord}
                onRefresh={fetchRegistrations}
                onSignOut={handleAdminSignOut}
              />
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className={`md:hidden fixed bottom-0 w-full bg-white border-t border-surface-variant px-2 py-1.5 grid ${isAdminAuthenticated ? 'grid-cols-5' : 'grid-cols-4'} items-center justify-center z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] select-none`}>
        
        <button 
          onClick={() => setCurrentTab('Home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'Home' ? 'text-primary font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <HomeIcon className={`w-5 h-5 ${currentTab === 'Home' ? 'fill-primary/10 text-primary' : ''}`} />
          <span className="text-[10px] font-semibold mt-1">Home</span>
        </button>

        <button 
          onClick={() => setCurrentTab('Register')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'Register' ? 'text-primary font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <UserPlus className={`w-5 h-5 ${currentTab === 'Register' ? 'fill-primary/10 text-primary' : ''}`} />
          <span className="text-[10px] font-semibold mt-1">Register</span>
        </button>

        <button 
          onClick={() => setCurrentTab('Profile')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'Profile' ? 'text-primary font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <Building2 className={`w-5 h-5 ${currentTab === 'Profile' ? 'fill-primary/10 text-primary' : ''}`} />
          <span className="text-[10px] font-semibold mt-1">Profile</span>
        </button>

        <button 
          onClick={() => setCurrentTab('Status')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'Status' ? 'text-primary font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <Lock className={`w-5 h-5 ${currentTab === 'Status' ? 'fill-primary/10 text-primary' : ''}`} />
          <span className="text-[10px] font-semibold mt-1">Status</span>
        </button>

        {isAdminAuthenticated && (
          <button 
            onClick={() => setCurrentTab('Admin')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentTab === 'Admin' ? 'text-amber-800 font-bold' : 'text-on-surface-variant'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 ${currentTab === 'Admin' ? 'fill-amber-500/10 text-amber-600' : ''}`} />
            <span className="text-[10px] font-bold mt-1">Admin</span>
          </button>
        )}

      </nav>

      {/* MOBILE SIDEPANEL NAVIGATION DRAWER */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop slide blur click blocker */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-xs cursor-pointer"
            />
            
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="absolute top-0 left-0 bottom-0 w-64 bg-white border-r border-surface-variant p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div className="flex items-center gap-2.5">
                    <CompanyLogo className="w-8 h-8" />
                    <div className="space-y-0.5">
                      <h2 className="font-display-lg text-base font-extrabold text-primary leading-none">Ironcrest</h2>
                      <p className="text-[9px] font-bold text-on-surface-variant tracking-wider uppercase leading-none font-sans">HR Portal Node</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="p-1.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-on-surface-variant" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 text-sm font-medium">
                  <button 
                    onClick={() => { setCurrentTab('Home'); setSidebarOpen(false); }}
                    className={`w-full px-4 py-3 flex items-center gap-3.5 rounded-xl transition-all cursor-pointer ${
                      currentTab === 'Home' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant'
                    }`}
                  >
                    <HomeIcon className="w-4.5 h-4.5" />
                    <span>Home</span>
                  </button>
                  <button 
                    onClick={() => { setCurrentTab('Register'); setSidebarOpen(false); }}
                    className={`w-full px-4 py-3 flex items-center gap-3.5 rounded-xl transition-all cursor-pointer ${
                      currentTab === 'Register' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant'
                    }`}
                  >
                    <UserPlus className="w-4.5 h-4.5" />
                    <span>Onboarding</span>
                  </button>
                  <button 
                    onClick={() => { setCurrentTab('Profile'); setSidebarOpen(false); }}
                    className={`w-full px-4 py-3 flex items-center gap-3.5 rounded-xl transition-all cursor-pointer ${
                      currentTab === 'Profile' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant'
                    }`}
                  >
                    <Building2 className="w-4.5 h-4.5" />
                    <span>Company Profile</span>
                  </button>
                  <button 
                    onClick={() => { setCurrentTab('Status'); setSidebarOpen(false); }}
                    className={`w-full px-4 py-3 flex items-center gap-3.5 rounded-xl transition-all cursor-pointer ${
                      currentTab === 'Status' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant'
                    }`}
                  >
                    <Lock className="w-4.5 h-4.5" />
                    <span>Onboarding Status</span>
                  </button>
                  {isAdminAuthenticated && (
                    <button 
                      onClick={() => { setCurrentTab('Admin'); setSidebarOpen(false); }}
                      className={`w-full px-4 py-3 flex items-center gap-3.5 rounded-xl transition-all cursor-pointer ${
                        currentTab === 'Admin' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant'
                      }`}
                    >
                      <ShieldCheck className="w-4.5 h-4.5 text-amber-600 animate-pulse" />
                      <span className="font-bold text-amber-800">Admin Console</span>
                    </button>
                  )}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2 text-[11px] font-mono text-on-surface-variant select-none">
                <span>Build: Sandbox Node v1.1.0</span>
                {!isAdminAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => { setShowAdminLoginModal(true); setSidebarOpen(false); }}
                    className="w-full text-left px-3 py-2 bg-slate-100 hover:bg-slate-200 text-primary uppercase text-[9px] font-extrabold tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Admin Decrypt Node</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { handleAdminSignOut(); setSidebarOpen(false); }}
                    className="w-full text-left px-3 py-2 bg-red-50 hover:bg-red-100 text-rose-700 uppercase text-[9px] font-extrabold tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-500" />
                    <span>Lock Admin Console</span>
                  </button>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* NOTIFICATIONS TICKET POPOVER */}
      <AnimatePresence>
        {notificationsOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full border border-surface-variant p-6 space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setNotificationsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-container transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>

              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest leading-none">
                  Alert Updates
                </span>
                <h3 className="text-base font-bold text-on-surface font-display-lg pt-1">Onboarding Notifications</h3>
                <p className="text-xs text-on-surface-variant">Review notices and regulatory steps needing your signature.</p>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar font-sans text-xs">
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-200/50 space-y-1">
                  <strong className="text-red-700 block">Action Required: ID Photo Upload</strong>
                  <p className="text-on-surface-variant leading-relaxed">Please submit a professional high-resolution headshot for your physical smart ID card.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                  <strong className="text-on-surface block">Mandatory Web Orientation</strong>
                  <p className="text-on-surface-variant leading-relaxed">Orientation is scheduled for October 24th, 2023 on Microsoft Teams.</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setNotificationsOpen(false)}
                  className="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg text-xs hover:bg-gold-dark cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* PROFILE HEADER USER DETAILS CARD POPOVER */}
        {profilePopoverOpen && (
          <div className="fixed inset-0 bg-none flex items-start justify-end p-4 pt-16 z-50 pointer-events-none">
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="bg-white rounded-2xl w-72 max-w-sm border border-surface-variant/80 p-5 shadow-2xl relative pointer-events-auto mr-0 md:mr-12"
            >
              <button 
                onClick={() => setProfilePopoverOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-on-surface-variant" />
              </button>

              <div className="flex flex-col items-center text-center space-y-3.5 pt-2">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-container p-0.5 shadow-sm">
                  <img 
                    alt="Staff Profile Avatar Details" 
                    className="w-full h-full object-cover rounded-full" 
                    src={userAvatarUrl}
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-on-surface font-display-lg">{displayName}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    applicantUser 
                      ? "bg-primary-container text-on-primary-container" 
                      : "bg-secondary-container/30 text-on-secondary-container"
                  }`}>
                    {applicantUser 
                      ? (registration.isCompleted ? "Active Applicant" : "Applicant Draft") 
                      : "Portal Guest"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-xs text-on-surface-variant font-sans">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary shrink-0" />
                  <span>Status: <strong>{applicantUser ? (registration.status || "Draft") : "Offline"}</strong></span>
                </div>
                
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>Profile: <strong>{applicantUser ? (registration.isCompleted ? "Completed" : "Draft") : "None"}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary shrink-0" />
                  <span>Sector: <strong>Global Onshore Strategy</strong></span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t mt-4 select-none">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setProfilePopoverOpen(false);
                      setCurrentTab('Register');
                    }}
                    className="flex-1 h-9 bg-primary text-on-primary font-bold rounded-lg text-[10px] uppercase tracking-wider hover:bg-gold-dark cursor-pointer flex items-center justify-center transition-colors font-sans"
                  >
                    Setup Record
                  </button>
                  <button 
                    onClick={() => {
                      setProfilePopoverOpen(false);
                      alert(`ID Pass Simulator: 'IG_PASS_${displayName.replace(/\s+/g, '_').toUpperCase()}.smartpass'`);
                    }}
                    className="flex-1 h-9 border border-secondary text-secondary font-bold rounded-lg text-[10px] uppercase tracking-wider hover:bg-secondary/5 cursor-pointer flex items-center justify-center transition-colors font-sans"
                  >
                    Generate ID
                  </button>
                </div>

                {applicantUser && (
                  <button
                    onClick={() => {
                      setProfilePopoverOpen(false);
                      handleApplicantSignOut();
                    }}
                    className="w-full h-8.5 bg-red-100 hover:bg-red-200 text-rose-700 font-extrabold rounded-lg text-[9px] uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-colors font-sans"
                  >
                    Sign Out Gateway
                  </button>
                )}

                {!isAdminAuthenticated ? (
                  <button
                    onClick={() => {
                      setProfilePopoverOpen(false);
                      setShowAdminLoginModal(true);
                    }}
                    className="w-full h-8.5 bg-slate-900 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider hover:bg-black/95 cursor-pointer flex items-center justify-center gap-1.5 transition-colors font-sans"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Unlock Portal</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setProfilePopoverOpen(false);
                      handleAdminSignOut();
                    }}
                    className="w-full h-8.5 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-colors font-sans"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Lock Decryption Mode</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURE ADMIN LOGIN PASSWORD GATED DIALOG */}
      <AnimatePresence>
        {showAdminLoginModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full border border-surface-variant p-6 space-y-6 shadow-2xl relative pointer-events-auto"
            >
              <button 
                type="button"
                onClick={() => {
                  setShowAdminLoginModal(false);
                  setAdminLoginError('');
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>

              <div className="space-y-2 text-center pointer-events-none select-none">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto border border-primary/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display-lg text-primary">Enterprise Security Node</h3>
                <p className="text-xs text-on-surface-variant">
                  Access requires verifying administrative decryption keys. Sensitive employee fields will be decrypted securely on-the-fly.
                </p>
              </div>

              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface">Security Officer ID</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter 'admin'"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-outline-variant/70 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface">Decryption Security Passcode</label>
                  <input 
                    type="password" 
                    required
                    placeholder="Enter 'ironcrest-secure-2026'"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-outline-variant/70 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-sans"
                  />
                </div>

                {adminLoginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[11px] font-semibold">
                    {adminLoginError}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAdminLoginModal(false);
                      setAdminLoginError('');
                    }}
                    className="flex-1 h-10 border border-outline-variant rounded-xl text-xs font-bold text-on-surface-variant hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 h-10 bg-primary hover:bg-gold-dark text-on-primary rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-colors"
                  >
                    Verify Passcode
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="w-full select-none text-center py-4 bg-white/40 text-[10px] font-medium text-on-surface-variant/60 border-t border-surface-variant/50 relative z-30 pb-20 md:pb-4">
        &copy; {new Date().getFullYear()} Ironcrest Global Services Ltd. All Rights Reserved.
      </footer>

    </div>
  );
}

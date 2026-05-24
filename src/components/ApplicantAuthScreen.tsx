/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Building2,
  LockKeyhole,
  Sparkles
} from 'lucide-react';
import { RegistrationData } from '../types';
import CompanyLogo from './CompanyLogo';

interface ApplicantAuthScreenProps {
  onAuthSuccess: (user: RegistrationData) => void;
}

export default function ApplicantAuthScreen({ onAuthSuccess }: ApplicantAuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up inputs
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  
  // State indicators
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (!signInEmail || !signInPassword) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/registrations/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail, password: signInPassword })
      });
      
      const json = await response.json();
      if (json.success && json.data) {
        setSuccessMsg(`Welcome back, ${json.data.personal.fullName}! Authentication successful.`);
        setTimeout(() => {
          onAuthSuccess(json.data);
        }, 1200);
      } else {
        setErrorMsg(json.error || 'Invalid email address or passcode. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg('A network error occurred while connecting to the authorization server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signUpFullName.trim()) {
      setErrorMsg('Full Legal Name is required to register.');
      return;
    }
    if (!signUpEmail.trim()) {
      setErrorMsg('A valid email address is required.');
      return;
    }
    if (signUpPassword.length < 5) {
      setErrorMsg('Password must be at least 5 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/registrations/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: signUpFullName,
          email: signUpEmail,
          password: signUpPassword
        })
      });

      const json = await response.json();
      if (json.success && json.data) {
        setSuccessMsg('Your security profile has been initialized successfully! Redirecting...');
        setTimeout(() => {
          onAuthSuccess(json.data);
        }, 1200);
      } else {
        setErrorMsg(json.error || 'Failed to complete registration profile. Email may already exist.');
      }
    } catch (err) {
      setErrorMsg('Failed to establish contact with the gateway server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const prefillDemoAccount = () => {
    setActiveTab('signin');
    setSignInEmail('priscilla.vance@ironcrest.com');
    setSignInPassword('ironcrest2026');
    setErrorMsg(null);
  };

  return (
    <div id="applicant-auth-container" className="max-w-md mx-auto my-6 md:my-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-surface-variant rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden"
      >
        {/* Decorative backdrop mesh */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-44 h-44 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-44 h-44 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b border-surface-variant/40 select-none">
          <CompanyLogo className="w-14 h-14" />
          <div className="space-y-1">
            <h3 className="font-display-lg text-lg md:text-xl font-extrabold text-[#0B1C30] tracking-tight">
              Onboarding Gateway
            </h3>
            <p className="text-xs text-on-surface-variant max-w-xs">
              Access your secure applicant profile, edit personal details, and monitor background verification state.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 rounded-xl p-1.5 my-6 select-none">
          <button
            id="tab-signin-toggle"
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'signin' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            id="tab-signup-toggle"
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'signup' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Create Profile
          </button>
        </div>

        {/* Feedback Alert banners */}
        {errorMsg && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3.5 mb-5 bg-red-50 border border-red-200/60 rounded-xl text-red-700 text-xs font-medium flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-650 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3.5 mb-5 bg-emerald-50 border border-emerald-200/60 rounded-xl text-emerald-800 text-xs font-medium flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {/* Sign In form */}
        {activeTab === 'signin' && (
          <form id="signin-form" onSubmit={handleSignInSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant" />
                <input
                  id="signin-email-input"
                  type="email"
                  required
                  placeholder="e.g. priscilla.vance@ironcrest.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-outline-variant/60 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-sans text-on-surface"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Security Passcode
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant" />
                <input
                  id="signin-password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-outline-variant/60 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-sans text-on-surface"
                />
              </div>
            </div>

            <button
              id="signin-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-gold-dark text-on-primary rounded-xl text-xs font-bold shadow-md transition-colors font-sans flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating Credentials...' : 'Access My Gateway'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <form id="signup-form" onSubmit={handleSignUpSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant" />
                <input
                  id="signup-fullname-input"
                  type="text"
                  required
                  placeholder="e.g. Alex Thompson"
                  value={signUpFullName}
                  onChange={(e) => setSignUpFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-outline-variant/60 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-sans text-on-surface"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant" />
                <input
                  id="signup-email-input"
                  type="email"
                  required
                  placeholder="e.g. alex.t@ironcrest.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-outline-variant/60 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-sans text-on-surface"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Establish Passcode
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant" />
                <input
                  id="signup-password-input"
                  type="password"
                  required
                  placeholder="Minimum 5 characters"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-outline-variant/60 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-sans text-on-surface"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Confirm Passcode
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant" />
                <input
                  id="signup-confirmpassword-input"
                  type="password"
                  required
                  placeholder="Re-enter established passcode"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-outline-variant/60 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-sans text-on-surface"
                />
              </div>
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-gold-dark text-on-primary rounded-xl text-xs font-bold shadow-md transition-colors font-sans flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Initializing Secure Node...' : 'Register & Log In'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {/* Demo Fast Sandbox Login tool */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center">
          <p className="text-[10px] text-on-surface-variant/80 font-medium mb-2.5">
            Testing Sandbox Mode? Fast track authenticated reviews:
          </p>
          <button
            id="auth-prefill-btn"
            type="button"
            onClick={prefillDemoAccount}
            className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-outline-variant/70 text-primary hover:text-gold-dark rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer select-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Prefill Sandbox Applicant</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

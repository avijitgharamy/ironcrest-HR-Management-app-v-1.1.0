/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PersonalInfo {
  fullName: string;
  dob: string;
  gender: string;
  nationality: string;
  avatarUrl?: string;
}

export interface ProfessionalInfo {
  highestEducation: string;
  yearsOfExperience: string;
  primarySkillset: string;
  professionalSummary: string;
}

export interface ContactInfo {
  email: string;
  mobile: string;
  addressStreet: string;
  addressCity: string;
  addressPostalCode: string;
}

export interface VerificationDocuments {
  nidPassportName: string;
  academicCertificateName: string;
}

export interface RegistrationData {
  id?: string;
  password?: string;
  personal: PersonalInfo;
  professional: ProfessionalInfo;
  contact: ContactInfo;
  documents: VerificationDocuments;
  isCompleted: boolean;
  submittedAt?: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected';
  hrNotes?: string;
}

export interface CompanyNotice {
  id: string;
  title: string;
  date: string;
  category: 'Event' | 'Policy' | 'Upload' | 'General';
  description: string;
  icon: string;
  actionRequired?: boolean;
}

export interface SolutionItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
}

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
}

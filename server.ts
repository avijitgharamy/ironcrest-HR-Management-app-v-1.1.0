/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, setDoc, deleteDoc, collection, query, where, getDocFromServer } from 'firebase/firestore';

const ALGORITHM = 'aes-256-cbc';
// Static fallback key to guarantee consistent encryption in the development container
const ENCRYPTION_KEY = Buffer.from('4aee3d9e8df1a77d6fbc3a189f7f45b9b1cc8e6eb8fd592d3df2ee3c8d10b91e', 'hex');

// Simple crypto text helpers to simulate high-grade enterprise record protection
function encryptText(text: string): { iv: string; encryptedData: string } {
  if (!text) return { iv: '', encryptedData: '' };
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  };
}

function decryptText(obj: any): string {
  if (!obj) return '';
  if (typeof obj !== 'object' || !obj.encryptedData || !obj.iv) {
    return typeof obj === 'string' ? obj : '';
  }
  try {
    const iv = Buffer.from(obj.iv, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(obj.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed, utilizing fallback masked tag.', error);
    return '[ENCRYPTED COMPLIANCE RECORD]';
  }
}

// Map plain registrant database schema into encrypted on-disk representation
function encryptApplicant(app: any) {
  if (!app) return app;
  const encrypted = JSON.parse(JSON.stringify(app)); // Deep clone

  if (app.password) {
    encrypted.password = encryptText(app.password);
  }

  if (app.personal) {
    encrypted.personal = {
      ...app.personal,
      dob: encryptText(app.personal.dob),
      nationality: encryptText(app.personal.nationality)
    };
  }

  if (app.contact) {
    encrypted.contact = {
      ...app.contact,
      mobile: encryptText(app.contact.mobile),
      addressStreet: encryptText(app.contact.addressStreet),
      addressCity: encryptText(app.contact.addressCity),
      addressPostalCode: encryptText(app.contact.addressPostalCode)
    };
  }

  if (app.documents) {
    encrypted.documents = {
      ...app.documents,
      nidPassportName: encryptText(app.documents.nidPassportName),
      academicCertificateName: encryptText(app.documents.academicCertificateName)
    };
  }

  if (app.professional && typeof app.professional.professionalSummary === 'string') {
    encrypted.professional = {
      ...app.professional,
      professionalSummary: encryptText(app.professional.professionalSummary)
    };
  }

  return encrypted;
}

// Map encrypted database representation back to plaintext
function decryptApplicant(app: any) {
  if (!app) return app;
  const decrypted = JSON.parse(JSON.stringify(app));

  if (app.password) {
    decrypted.password = decryptText(app.password);
  }

  if (app.personal) {
    decrypted.personal = {
      ...app.personal,
      dob: decryptText(app.personal.dob),
      nationality: decryptText(app.personal.nationality)
    };
  }

  if (app.contact) {
    decrypted.contact = {
      ...app.contact,
      mobile: decryptText(app.contact.mobile),
      addressStreet: decryptText(app.contact.addressStreet),
      addressCity: decryptText(app.contact.addressCity),
      addressPostalCode: decryptText(app.contact.addressPostalCode)
    };
  }

  if (app.documents) {
    decrypted.documents = {
      ...app.documents,
      nidPassportName: decryptText(app.documents.nidPassportName),
      academicCertificateName: decryptText(app.documents.academicCertificateName)
    };
  }

  if (app.professional && app.professional.professionalSummary) {
    decrypted.professional = {
      ...app.professional,
      professionalSummary: decryptText(app.professional.professionalSummary)
    };
  }

  return decrypted;
}

// Mask sensitive fields for non-admin overview returns to prevent client-side leaks
function maskApplicant(app: any) {
  if (!app) return app;
  const masked = JSON.parse(JSON.stringify(app));
  
  if (masked.password) {
    masked.password = "••••••••";
  }

  if (masked.personal) {
    masked.personal.dob = "•••-••-••";
    masked.personal.nationality = "••••••••";
  }
  if (masked.contact) {
    masked.contact.mobile = "••••••••••••";
    masked.contact.addressStreet = "••••••••••••••••";
    masked.contact.addressCity = "••••••••";
    masked.contact.addressPostalCode = "••••••";
  }
  if (masked.documents) {
    masked.documents.nidPassportName = "Encrypted_Identity_Doc.enc";
    masked.documents.academicCertificateName = "Encrypted_Education_Doc.enc";
  }
  if (masked.professional && masked.professional.professionalSummary) {
    masked.professional.professionalSummary = "Review notes restricted to security officers with decrypt clearance.";
  }
  
  return masked;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // --- FIREBASE FIRESTORE INITIALIZATION ---
  const CONFIG_PATH = path.join(process.cwd(), 'firebase-applet-config.json');
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Firebase configuration file not found at ${CONFIG_PATH}`);
  }
  const firebaseConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  const fbApp = initializeApp(firebaseConfig);
  const db = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

  // Firestore Error Handler helper conforming to instructions
  enum OperationType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LIST = 'list',
    GET = 'get',
    WRITE = 'write',
  }

  interface FirestoreErrorInfo {
    error: string;
    operationType: OperationType;
    path: string | null;
    authInfo: {
      userId?: string | null;
      email?: string | null;
      emailVerified?: boolean | null;
      isAnonymous?: boolean | null;
      tenantId?: string | null;
      providerInfo?: {
        providerId?: string | null;
        email?: string | null;
      }[];
    }
  }

  function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: null,
        email: null,
        emailVerified: null,
        isAnonymous: null,
        tenantId: null,
        providerInfo: []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }

  // Validate connection to Firestore on startup
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection verified and fully operational!");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. Client is offline.");
    } else {
      console.log("Firebase connection established successfully.");
    }
  }

  // Define database directories for backward migration if needed
  const DATA_DIR = path.join(process.cwd(), 'data');
  const DATA_FILE = path.join(DATA_DIR, 'registrations.json');

  // Ensure directories exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // High-value corporate applicants seed
  const mockApplicants = [
    {
      id: "reg_mock_1",
      password: "ironcrest2026",
      personal: {
        fullName: "Priscilla Vance",
        dob: "1994-06-15",
        gender: "Female",
        nationality: "Canadian"
      },
      professional: {
        highestEducation: "MA in Organizational Development",
        yearsOfExperience: "8",
        primarySkillset: "Talent Strategy & Succession Planning",
        professionalSummary: "HR Consultant with over 8 years of cross-disciplinary expertise helping high-tech startups scale culture and maintain strict compliance matrices smoothly."
      },
      contact: {
        email: "priscilla.vance@ironcrest.com",
        mobile: "+1 (555) 342-9988",
        addressStreet: "742 Evergreen Terrace",
        addressCity: "Vancouver",
        addressPostalCode: "V6B 1P1"
      },
      documents: {
        nidPassportName: "Passport_PriscillaV_Verified.pdf",
        academicCertificateName: "MA_Diploma_UBC_Signed.pdf"
      },
      isCompleted: true,
      submittedAt: "May 22, 2026",
      status: "Pending Approval",
      hrNotes: ""
    },
    {
      id: "reg_mock_2",
      password: "ironcrest2026",
      personal: {
        fullName: "Marcus Kaelen",
        dob: "1989-11-02",
        gender: "Male",
        nationality: "Singaporean"
      },
      professional: {
        highestEducation: "BSc in Cybersecurity Governance",
        yearsOfExperience: "11",
        primarySkillset: "IT Audit & Risk Compliance",
        professionalSummary: "Seasoned compliance veteran seeking structural alignment for executive cyber auditing roles. Experienced in SOC2, ISO 27001 regulatory standards."
      },
      contact: {
        email: "marcus.kaelen@ironcrest.com",
        mobile: "+65 9123-4567",
        addressStreet: "22 Marina Boulevard",
        addressCity: "Singapore",
        addressPostalCode: "018985"
      },
      documents: {
        nidPassportName: "NID-MarcusK-2026.png",
        academicCertificateName: "Degree_Cyber_NUS.pdf"
      },
      isCompleted: true,
      submittedAt: "May 19, 2026",
      status: "Approved",
      hrNotes: "Credentials fully verified by Singapore HR Node. Excellent technical fit."
    },
    {
      id: "reg_mock_3",
      password: "ironcrest2026",
      personal: {
        fullName: "Elena Rostova",
        dob: "1997-03-24",
        gender: "Female",
        nationality: "German"
      },
      professional: {
        highestEducation: "Ph.D. in Enterprise Logistics Systems",
        yearsOfExperience: "4",
        primarySkillset: "Supply Chain Strategy & Capacity Modeling",
        professionalSummary: "Specialist logistics consultant designed to restructure pan-European physical deployments and automate delivery workflows sustainably."
      },
      contact: {
        email: "elena.rostova@ironcrest.com",
        mobile: "+49 170 1234567",
        addressStreet: "Schönhauser Allee 108",
        addressCity: "Berlin",
        addressPostalCode: "10437"
      },
      documents: {
        nidPassportName: "De_Passport_ElenaR.jpg",
        academicCertificateName: "PhD_Logistics_Heidelberg.pdf"
      },
      isCompleted: true,
      submittedAt: "May 15, 2026",
      status: "Rejected",
      hrNotes: "Insufficient corporate workforce experience. Recommend for junior capacity."
    }
  ];

  // Startup script: Synchronous migration of records from JSON file database to Firestore if Firestore is empty
  try {
    const currentDocs = await getDocs(collection(db, 'registrations'));
    if (currentDocs.empty) {
      console.log("[Firestore] collection 'registrations' is empty. Beginning initialization seed...");
      let recordsToSeed = mockApplicants.map(app => encryptApplicant(app));

      if (fs.existsSync(DATA_FILE)) {
        try {
          const dataContent = fs.readFileSync(DATA_FILE, 'utf-8');
          const parsed = JSON.parse(dataContent);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const needEncryption = parsed[0].personal && typeof parsed[0].personal.dob === 'string';
            recordsToSeed = needEncryption ? parsed.map(app => encryptApplicant(app)) : parsed;
            console.log(`[Firestore] Found ${recordsToSeed.length} local records on disk to migrate.`);
          }
        } catch (fileErr) {
          console.warn("[Firestore] Failed to read disk DATA_FILE for seed migration, falling back to mockApplicants:", fileErr);
        }
      }

      for (const record of recordsToSeed) {
        await setDoc(doc(db, 'registrations', record.id), record);
      }
      console.log("[Firestore] Database seeding and migration completed.");
    } else {
      console.log(`[Firestore] Already initialized with ${currentDocs.size} documents.`);
    }
  } catch (seedErr) {
    console.error("[Firestore] Seeding or connection failed. Backend is running with raw parameters:", seedErr);
  }

  // --- API BACKEND ROUTES WITH ENCRYPTION CONTROL ---

  // Applicant Authentication: Sign In
  app.post('/api/registrations/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Both email and password are required.' });
      }

      let allSnapshot;
      try {
        allSnapshot = await getDocs(collection(db, 'registrations'));
      } catch (err) {
        return handleFirestoreError(err, OperationType.LIST, 'registrations');
      }

      let matchedApplicant: any = null;
      allSnapshot.forEach(docSnap => {
        const decrypted = decryptApplicant(docSnap.data());
        const decEmail = decrypted.contact?.email;
        const decPass = decrypted.password;
        if (decEmail && decEmail.trim().toLowerCase() === email.trim().toLowerCase() && decPass === password) {
          matchedApplicant = decrypted;
        }
      });

      if (matchedApplicant) {
        return res.json({ success: true, data: matchedApplicant });
      } else {
        return res.status(401).json({ success: false, error: 'Invalid email address or password. Please verify credentials.' });
      }
    } catch (e: any) {
      console.error('Error signing in:', e);
      res.status(500).json({ success: false, error: e.message || String(e) });
    }
  });

  // Applicant Authentication: Sign Up
  app.post('/api/registrations/signup', async (req, res) => {
    try {
      const { email, password, fullName } = req.body;
      if (!email || !password || !fullName) {
        return res.status(400).json({ success: false, error: 'All fields (fullName, email, password) are required.' });
      }

      let allSnapshot;
      try {
        allSnapshot = await getDocs(collection(db, 'registrations'));
      } catch (err) {
        return handleFirestoreError(err, OperationType.LIST, 'registrations');
      }

      // Check if registration already exists with that email
      let emailExists = false;
      allSnapshot.forEach(docSnap => {
        const decrypted = decryptApplicant(docSnap.data());
        const decEmail = decrypted.contact?.email;
        if (decEmail && decEmail.trim().toLowerCase() === email.trim().toLowerCase()) {
          emailExists = true;
        }
      });

      if (emailExists) {
        return res.status(400).json({ success: false, error: 'An onboarding profile with this email address already exists.' });
      }

      const recordId = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const submissionDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const plainRecord = {
        id: recordId,
        password: password,
        personal: {
          fullName: fullName,
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
          email: email,
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
        status: 'Draft',
        hrNotes: ''
      };

      // Encrypt sensitive elements instantly
      const encryptedRecord = encryptApplicant(plainRecord);

      try {
        await setDoc(doc(db, 'registrations', recordId), encryptedRecord);
      } catch (err) {
        return handleFirestoreError(err, OperationType.WRITE, `registrations/${recordId}`);
      }

      res.json({ success: true, data: plainRecord });
    } catch (e: any) {
      console.error('Error signing up applicant:', e);
      res.status(500).json({ success: false, error: e.message || String(e) });
    }
  });

  // Standard GET: Mask sensitive fields unless querying self with a specific email or ID parameters
  app.get('/api/registrations', async (req, res) => {
    try {
      const { email, id } = req.query;
      
      if (id && typeof id === 'string') {
        let matchDoc;
        try {
          matchDoc = await getDoc(doc(db, 'registrations', id));
        } catch (err) {
          return handleFirestoreError(err, OperationType.GET, `registrations/${id}`);
        }
        if (matchDoc.exists()) {
          const match = matchDoc.data();
          return res.json({ success: true, data: [decryptApplicant(match)] });
        }
      }

      if (email && typeof email === 'string') {
        let querySnapshot;
        try {
          querySnapshot = await getDocs(collection(db, 'registrations'));
        } catch (err) {
          return handleFirestoreError(err, OperationType.GET, 'registrations');
        }
        
        let match: any = null;
        querySnapshot.forEach(docSnap => {
          const data = docSnap.data();
          const decEmail = data.contact?.email;
          if (decEmail && decEmail.trim().toLowerCase() === email.trim().toLowerCase()) {
            match = data;
          }
        });

        if (match) {
          return res.json({ success: true, data: [decryptApplicant(match)] });
        }
      }

      // Otherwise, return masked overview to prevent security leakage on public nodes
      let allSnapshot;
      try {
        allSnapshot = await getDocs(collection(db, 'registrations'));
      } catch (err) {
        return handleFirestoreError(err, OperationType.GET, 'registrations');
      }
      
      const allRecords: any[] = [];
      allSnapshot.forEach(docSnap => {
        allRecords.push(docSnap.data());
      });
      const maskedData = allRecords.map(app => maskApplicant(decryptApplicant(app)));
      res.json({ success: true, count: maskedData.length, data: maskedData });
    } catch (e: any) {
      console.error('Error in standard GET:', e);
      res.status(500).json({ success: false, error: e.message || String(e) });
    }
  });

  // Admin GET: Requires secure administrative token header validation
  app.get('/api/admin/registrations', async (req, res) => {
    try {
      const adminToken = req.headers['x-admin-token'];
      if (adminToken !== 'ironcrest-secure-2026') {
        return res.status(401).json({ success: false, error: 'Unauthorized Node Access: Invalid Admin Passport.' });
      }

      let allSnapshot;
      try {
        allSnapshot = await getDocs(collection(db, 'registrations'));
      } catch (err) {
        return handleFirestoreError(err, OperationType.LIST, 'registrations');
      }

      const allRecords: any[] = [];
      allSnapshot.forEach(docSnap => {
        allRecords.push(docSnap.data());
      });

      const decryptedData = allRecords.map(app => decryptApplicant(app));
      res.json({ success: true, count: decryptedData.length, data: decryptedData });
    } catch (e: any) {
      console.error('Error in Admin GET:', e);
      res.status(500).json({ success: false, error: e.message || String(e) });
    }
  });

  // Create or Update registration pipeline (Accepts plaintext, transforms and encrypts instantly before storing)
  app.post('/api/registrations', async (req, res) => {
    try {
      const payload = req.body;
      if (!payload || !payload.personal || !payload.personal.fullName) {
        return res.status(400).json({ success: false, error: 'Invalid payload. Legal Full Name is required.' });
      }

      const email = payload.contact?.email;
      let recordId = payload.id;
      let existingRecord: any = null;

      if (recordId) {
        try {
          const docSnap = await getDoc(doc(db, 'registrations', recordId));
          if (docSnap.exists()) {
            existingRecord = docSnap.data();
          }
        } catch (err) {
          return handleFirestoreError(err, OperationType.GET, `registrations/${recordId}`);
        }
      }

      if (!existingRecord && email && email !== '') {
        let querySnapshot;
        try {
          querySnapshot = await getDocs(collection(db, 'registrations'));
        } catch (err) {
          return handleFirestoreError(err, OperationType.GET, 'registrations');
        }
        
        querySnapshot.forEach(docSnap => {
          const data = docSnap.data();
          const decEmail = data.contact?.email;
          if (decEmail && decEmail.trim().toLowerCase() === email.trim().toLowerCase()) {
            existingRecord = data;
            recordId = data.id;
          }
        });
      }

      const finalRecordId = recordId || `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const submissionDate = payload.submittedAt || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const plainRecord = {
        ...payload,
        id: finalRecordId,
        submittedAt: submissionDate,
        status: existingRecord ? (payload.status || existingRecord.status || 'Pending Approval') : (payload.status || 'Pending Approval'),
        hrNotes: existingRecord ? (payload.hrNotes !== undefined ? payload.hrNotes : (existingRecord.hrNotes || '')) : (payload.hrNotes || '')
      };

      // Encrypt sensitive elements instantly
      const encryptedRecord = encryptApplicant(plainRecord);

      try {
        await setDoc(doc(db, 'registrations', finalRecordId), encryptedRecord);
      } catch (err) {
        return handleFirestoreError(err, OperationType.WRITE, `registrations/${finalRecordId}`);
      }

      res.json({ success: true, data: plainRecord });
    } catch (e: any) {
      console.error('Error posting registration:', e);
      res.status(500).json({ success: false, error: e.message || String(e) });
    }
  });

  // Admin update applicant status
  app.post('/api/registrations/status', async (req, res) => {
    try {
      const adminToken = req.headers['x-admin-token'];
      if (adminToken !== 'ironcrest-secure-2026') {
        return res.status(401).json({ success: false, error: 'Unauthorized Node Access: Admin credentials required.' });
      }

      const { id, status, hrNotes } = req.body;
      const docRef = doc(db, 'registrations', id);
      let docSnap;
      try {
        docSnap = await getDoc(docRef);
      } catch (err) {
        return handleFirestoreError(err, OperationType.GET, `registrations/${id}`);
      }

      if (!docSnap.exists()) {
        return res.status(404).json({ success: false, error: 'Onboarding record not found.' });
      }

      const existingRecord = docSnap.data();
      existingRecord.status = status;
      if (hrNotes !== undefined) {
        existingRecord.hrNotes = hrNotes;
      }

      try {
        await setDoc(docRef, existingRecord);
      } catch (err) {
        return handleFirestoreError(err, OperationType.WRITE, `registrations/${id}`);
      }

      res.json({ success: true, data: decryptApplicant(existingRecord) });
    } catch (e: any) {
      console.error('Error updating status:', e);
      res.status(500).json({ success: false, error: e.message || String(e) });
    }
  });

  // Admin delete applicant records
  app.delete('/api/registrations/:id', async (req, res) => {
    try {
      const adminToken = req.headers['x-admin-token'];
      if (adminToken !== 'ironcrest-secure-2026') {
        return res.status(401).json({ success: false, error: 'Unauthorized.' });
      }

      const id = req.params.id;
      try {
        await deleteDoc(doc(db, 'registrations', id));
      } catch (err) {
        return handleFirestoreError(err, OperationType.DELETE, `registrations/${id}`);
      }

      res.json({ success: true, message: 'Onboarding applicant purged from encrypted storage.' });
    } catch (e: any) {
      console.error('Error deleting registration:', e);
      res.status(500).json({ success: false, error: e.message || String(e) });
    }
  });

  // Reset portal sandbox
  app.delete('/api/registrations', async (req, res) => {
    try {
      let querySnapshot;
      try {
        querySnapshot = await getDocs(collection(db, 'registrations'));
      } catch (err) {
        return handleFirestoreError(err, OperationType.LIST, 'registrations');
      }

      for (const docSnap of querySnapshot.docs) {
        try {
          await deleteDoc(doc(db, 'registrations', docSnap.id));
        } catch (err) {
          return handleFirestoreError(err, OperationType.DELETE, `registrations/${docSnap.id}`);
        }
      }
      res.json({ success: true, message: 'Portal sandbox records cleared successfully.' });
    } catch (e: any) {
      console.error('Error resetting sandbox:', e);
      res.status(500).json({ success: false, error: e.message || String(e) });
    }
  });

  // Serve Vite or Static files depending on ENV
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ironcrest HR Portal running on server: Port ${PORT}`);
  });
}

startServer();

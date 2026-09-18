/**
 * Google Drive Integration Service
 * Manages Google Identity Services (GIS) token acquisition and
 * direct Google Drive REST API v3 operations (upload, list, backup, download).
 */

import { GoogleDriveFile, GoogleDriveUser } from '../types';

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: any }) => void;
            error_callback?: (err: any) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
          revoke?: (token: string, done: () => void) => void;
        };
      };
    };
    __GOOGLE_CLIENT_ID__?: string;
  }
}

export const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
export const KROU_FOLDER_NAME = 'KrouDigital 4.0 - បណ្ណាល័យសាលា';

let tokenClientInstance: any = null;
let currentAccessToken: string | null = localStorage.getItem('krou_drive_token') || null;
let registeredOnToken: ((token: string) => void) | null = null;
let registeredOnError: ((err: any) => void) | null = null;

export const getStoredDriveToken = (): string | null => {
  return currentAccessToken || localStorage.getItem('krou_drive_token');
};

export const setStoredDriveToken = (token: string | null) => {
  currentAccessToken = token;
  if (token) {
    localStorage.setItem('krou_drive_token', token);
  } else {
    localStorage.removeItem('krou_drive_token');
  }
};

/**
 * Activate Simulated Google Drive for offline or external hosts (GitHub Pages)
 */
export const activateSimulatedGoogleDrive = (): { token: string; user: GoogleDriveUser } => {
  const simToken = 'krou_simulated_drive_' + Date.now();
  setStoredDriveToken(simToken);
  const user: GoogleDriveUser = {
    displayName: 'Google Drive (Offline & GitHub Pages Mode)',
    emailAddress: 'wellgetmoneytechno@gmail.com',
    photoLink: '',
    storageQuota: {
      limit: '15 GB',
      usage: '1.2 GB',
      usageInDrive: '85 MB'
    }
  };
  localStorage.setItem('krou_drive_user', JSON.stringify(user));
  localStorage.setItem('krou_drive_folder_id', 'simulated_folder_krou4');
  return { token: simToken, user };
};

/**
 * Fetch client ID from server config if not in env
 */
export const fetchGoogleClientId = async (): Promise<string> => {
  // 1. Try server endpoint which directly reads oAuthClientId from firebase-applet-config.json
  try {
    const res = await fetch('/api/drive/config');
    if (res.ok) {
      const data = await res.json();
      if (data.clientId && data.clientId.includes('.apps.googleusercontent.com')) {
        return data.clientId;
      }
    }
  } catch (err) {
    console.warn('Could not fetch Google Client ID from backend:', err);
  }

  // 2. Check env variable if it contains a valid google client ID
  const envId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
  if (envId && envId.includes('.apps.googleusercontent.com')) return envId;

  // 3. Check local storage override
  const localId = localStorage.getItem('krou_google_client_id');
  if (localId && localId.includes('.apps.googleusercontent.com')) return localId;

  // 4. Fallback to the provisioned Google OAuth Client ID for this project
  return '470039681099-npvjd9nguvogu7qrokofro5ujp5b920m.apps.googleusercontent.com';
};

/**
 * Initialize Google Identity Services token client
 */
export const initGoogleDriveAuth = async (
  onToken: (token: string) => void,
  onError?: (err: any) => void
): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  registeredOnToken = onToken;
  registeredOnError = onError || null;

  const clientId = await fetchGoogleClientId();
  if (!clientId) {
    console.warn('Google Client ID not yet configured.');
    return false;
  }

  if (!window.google?.accounts?.oauth2) {
    console.warn('Google Identity Services script not yet loaded.');
    return false;
  }

  try {
    tokenClientInstance = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: `${GOOGLE_DRIVE_SCOPE} https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`,
      callback: (resp) => {
        if (resp.error) {
          console.error('GIS token error:', resp.error);
          registeredOnError?.(resp.error);
          return;
        }
        if (resp.access_token) {
          setStoredDriveToken(resp.access_token);
          registeredOnToken?.(resp.access_token);
        }
      },
      error_callback: (err) => {
        console.error('GIS error callback:', err);
        registeredOnError?.(err);
      }
    });
    return true;
  } catch (error) {
    console.error('Error initializing Google Auth Token Client:', error);
    onError?.(error);
    return false;
  }
};

/**
 * Request Access Token via GIS popup
 */
export const requestGoogleDriveToken = async (
  onSuccess?: (token: string) => void,
  onError?: (err: any) => void
): Promise<void> => {
  if (onSuccess) registeredOnToken = onSuccess;
  if (onError) registeredOnError = onError;

  if (!tokenClientInstance) {
    const success = await initGoogleDriveAuth(registeredOnToken || (() => {}), registeredOnError || undefined);
    if (!success || !tokenClientInstance) {
      throw new Error('Google Auth Token Client មិនទាន់ត្រូវបានកំណត់ទេ។ សូមពិនិត្យមើល Google Client ID');
    }
  }
  tokenClientInstance.requestAccessToken({ prompt: 'consent' });
};

/**
 * Disconnect Google Drive
 */
export const disconnectGoogleDrive = (token?: string) => {
  const t = token || currentAccessToken;
  if (t && window.google?.accounts?.oauth2?.revoke) {
    try {
      window.google.accounts.oauth2.revoke(t, () => {});
    } catch (e) {
      console.warn('Failed to revoke Google token:', e);
    }
  }
  setStoredDriveToken(null);
  localStorage.removeItem('krou_drive_user');
  localStorage.removeItem('krou_drive_folder_id');
};

/**
 * Get Google Drive About / User Profile & Storage info
 */
export const fetchGoogleDriveAbout = async (token: string): Promise<GoogleDriveUser | null> => {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return null;
  }
  if (token.startsWith('krou_simulated_')) {
    const cached = localStorage.getItem('krou_drive_user');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return {
      displayName: 'Google Drive (GitHub Pages Mode)',
      emailAddress: 'wellgetmoneytechno@gmail.com',
      photoLink: '',
      storageQuota: { limit: '15 GB', usage: '1.2 GB', usageInDrive: '85 MB' }
    };
  }
  try {
    const res = await fetch('https://www.googleapis.com/drive/v3/about?fields=user,storageQuota', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        setStoredDriveToken(null);
        localStorage.removeItem('krou_drive_user');
      }
      console.warn(`Drive About returned ${res.status}: ${res.statusText || 'Unauthorized or expired token'}`);
      return null;
    }
    const data = await res.json();
    return {
      displayName: data.user?.displayName || 'Google Drive User',
      emailAddress: data.user?.emailAddress || '',
      photoLink: data.user?.photoLink || '',
      storageQuota: {
        limit: data.storageQuota?.limit ? formatBytes(Number(data.storageQuota.limit)) : '15 GB',
        usage: data.storageQuota?.usage ? formatBytes(Number(data.storageQuota.usage)) : '0 MB',
        usageInDrive: data.storageQuota?.usageInDrive ? formatBytes(Number(data.storageQuota.usageInDrive)) : '0 MB'
      }
    };
  } catch (err) {
    console.warn('Could not fetch Google Drive user info (handled gracefully):', err);
    return null;
  }
};

/**
 * Get or create app dedicated folder in Google Drive
 */
export const getOrCreateDriveFolder = async (token: string, folderName = KROU_FOLDER_NAME): Promise<string> => {
  if (token.startsWith('krou_simulated_')) {
    return 'simulated_krou_folder_id';
  }
  const cachedFolderId = localStorage.getItem('krou_drive_folder_id');
  if (cachedFolderId) {
    // verify it still exists
    try {
      const checkRes = await fetch(`https://www.googleapis.com/drive/v3/files/${cachedFolderId}?fields=id,trashed`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (!checkData.trashed) return cachedFolderId;
      }
    } catch {
      // ignore and search below
    }
  }

  // Search if folder already exists
  const query = encodeURIComponent(`name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      const folderId = searchData.files[0].id;
      localStorage.setItem('krou_drive_folder_id', folderId);
      return folderId;
    }
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'ឯកសារ និងទិន្នន័យបម្រុងទុកសាលារៀន KrouDigital 4.0'
    })
  });

  if (!createRes.ok) {
    throw new Error('មិនអាចបង្កើតថតឯកសារ (Folder) ក្នុង Google Drive បានទេ');
  }

  const newFolder = await createRes.json();
  localStorage.setItem('krou_drive_folder_id', newFolder.id);
  return newFolder.id;
};

/**
 * List files stored in the app folder or user drive
 */
export const listGoogleDriveFiles = async (token: string, folderId?: string): Promise<GoogleDriveFile[]> => {
  if (token.startsWith('krou_simulated_')) {
    const raw = localStorage.getItem('krou_simulated_files');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      {
        id: 'sim-doc-01',
        name: 'សៀវភៅគោលគណិតវិទ្យា_ថ្នាក់ទី១២_ក្រសួង.pdf',
        mimeType: 'application/pdf',
        size: '14.8 MB',
        modifiedTime: new Date().toLocaleDateString('km-KH'),
        webViewLink: 'https://moeys.gov.kh'
      },
      {
        id: 'sim-doc-02',
        name: 'ទិន្នន័យសិស្សទាំង១៦វាល_បម្រុងទុក_ស្វ័យប្រវត្តិ.json',
        mimeType: 'application/json',
        size: '240 KB',
        modifiedTime: new Date().toLocaleDateString('km-KH'),
        webViewLink: '#'
      }
    ];
  }
  let query = "trashed = false and mimeType != 'application/vnd.google-apps.folder'";
  if (folderId) {
    query += ` and '${folderId}' in parents`;
  }

  const encodedQuery = encodeURIComponent(query);
  const fields = encodeURIComponent('files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,iconLink,thumbnailLink,parents)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&fields=${fields}&pageSize=50&orderBy=modifiedTime desc`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error(`Failed to list Drive files: ${res.statusText}`);
  }

  const data = await res.json();
  return (data.files || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    size: f.size ? formatBytes(Number(f.size)) : '0 KB',
    modifiedTime: f.modifiedTime ? new Date(f.modifiedTime).toLocaleDateString('km-KH') : '',
    webViewLink: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`,
    webContentLink: f.webContentLink,
    iconLink: f.iconLink,
    thumbnailLink: f.thumbnailLink,
    parents: f.parents
  }));
};

/**
 * Upload file to Google Drive (Multipart upload)
 */
export const uploadFileToGoogleDrive = async (
  token: string,
  file: File | Blob,
  fileName: string,
  mimeType: string,
  folderId?: string
): Promise<GoogleDriveFile> => {
  if (token.startsWith('krou_simulated_')) {
    const newFile: GoogleDriveFile = {
      id: 'sim-file-' + Date.now(),
      name: fileName,
      mimeType: mimeType || 'application/octet-stream',
      size: formatBytes(file.size),
      modifiedTime: new Date().toLocaleDateString('km-KH'),
      webViewLink: '#'
    };
    try {
      const raw = localStorage.getItem('krou_simulated_files');
      const current = raw ? JSON.parse(raw) : [];
      localStorage.setItem('krou_simulated_files', JSON.stringify([newFile, ...current]));
    } catch {}
    return newFile;
  }
  const metadata = {
    name: fileName,
    mimeType: mimeType || 'application/octet-stream',
    parents: folderId ? [folderId] : undefined
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataPart = delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata);

  const fileData = await file.arrayBuffer();

  const preHeader = metadataPart + delimiter +
    `Content-Type: ${mimeType || 'application/octet-stream'}\r\n` +
    'Content-Transfer-Encoding: binary\r\n\r\n';

  const encoder = new TextEncoder();
  const preHeaderBytes = encoder.encode(preHeader);
  const closeDelimiterBytes = encoder.encode(closeDelimiter);

  // Combine into single Uint8Array
  const totalLength = preHeaderBytes.byteLength + fileData.byteLength + closeDelimiterBytes.byteLength;
  const combined = new Uint8Array(totalLength);
  combined.set(preHeaderBytes, 0);
  combined.set(new Uint8Array(fileData), preHeaderBytes.byteLength);
  combined.set(closeDelimiterBytes, preHeaderBytes.byteLength + fileData.byteLength);

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,webContentLink,iconLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: combined
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`បរាជ័យក្នុងការផ្ទុកឯកសារឡើង Google Drive: ${res.status} ${errText}`);
  }

  const uploaded = await res.json();
  return {
    id: uploaded.id,
    name: uploaded.name,
    mimeType: uploaded.mimeType,
    size: uploaded.size ? formatBytes(Number(uploaded.size)) : formatBytes(file.size),
    webViewLink: uploaded.webViewLink || `https://drive.google.com/file/d/${uploaded.id}/view`,
    webContentLink: uploaded.webContentLink,
    iconLink: uploaded.iconLink
  };
};

/**
 * Delete a file from Google Drive
 */
export const deleteFileFromGoogleDrive = async (token: string, fileId: string): Promise<boolean> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.ok || res.status === 204 || res.status === 404;
};

/**
 * Helper to format byte counts into readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

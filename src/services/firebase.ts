import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import { StudyMaterial, PostComment, ActivitySubmission, EmailNotification } from '../types';
import { INITIAL_MATERIALS, INITIAL_COMMENTS, INITIAL_NOTIFICATIONS, INITIAL_SUBMISSIONS } from '../data/initialData';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId) 
  : getFirestore(app);

// Collection references
export const MATERIALS_COLLECTION = 'materials';
export const COMMENTS_COLLECTION = 'comments';
export const NOTIFICATIONS_COLLECTION = 'notifications';
export const SUBMISSIONS_COLLECTION = 'submissions';

// Helper to strip undefined fields because Firestore rejects documents with undefined values
export function sanitizeForFirestore<T extends Record<string, any>>(data: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Real-time listener for Materials.
 * Automatically seeds INITIAL_MATERIALS if the cloud collection is empty.
 */
export function subscribeToMaterials(
  onData: (materials: StudyMaterial[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, MATERIALS_COLLECTION);
  const q = query(colRef);

  return onSnapshot(
    q,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial materials so the blog is pre-populated
        try {
          const batch = writeBatch(db);
          for (const item of INITIAL_MATERIALS) {
            const itemDoc = doc(db, MATERIALS_COLLECTION, item.id);
            batch.set(itemDoc, sanitizeForFirestore(item));
          }
          await batch.commit();
        } catch (e) {
          console.warn('Initial seeding failed or already done', e);
        }
        onData(INITIAL_MATERIALS);
      } else {
        const items: StudyMaterial[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as StudyMaterial);
        });
        // Sort with most recent first or by dateAdded
        items.sort((a, b) => (b.dateAdded || '').localeCompare(a.dateAdded || ''));
        onData(items);
      }
    },
    (err) => {
      console.error('Firestore materials subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time listener for Comments.
 */
export function subscribeToComments(
  onData: (comments: PostComment[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, COMMENTS_COLLECTION);
  const q = query(colRef);

  return onSnapshot(
    q,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial comments
        try {
          const batch = writeBatch(db);
          for (const item of INITIAL_COMMENTS) {
            const itemDoc = doc(db, COMMENTS_COLLECTION, item.id);
            batch.set(itemDoc, sanitizeForFirestore(item));
          }
          await batch.commit();
        } catch (e) {
          console.warn('Comments seeding note', e);
        }
        onData(INITIAL_COMMENTS);
      } else {
        const items: PostComment[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as PostComment);
        });
        // Sort newest first
        items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        onData(items);
      }
    },
    (err) => {
      console.error('Firestore comments subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time listener for Notifications.
 */
export function subscribeToNotifications(
  onData: (notifs: EmailNotification[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, NOTIFICATIONS_COLLECTION);
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          for (const item of INITIAL_NOTIFICATIONS) {
            const itemDoc = doc(db, NOTIFICATIONS_COLLECTION, item.id);
            batch.set(itemDoc, sanitizeForFirestore(item));
          }
          await batch.commit();
        } catch (e) {
          console.warn('Notifications seeding note', e);
        }
        onData(INITIAL_NOTIFICATIONS);
      } else {
        const items: EmailNotification[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as EmailNotification);
        });
        items.sort((a, b) => (b.sentAt || '').localeCompare(a.sentAt || ''));
        onData(items);
      }
    },
    (err) => {
      console.error('Firestore notifications subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time listener for Submissions (Quiz results).
 */
export function subscribeToSubmissions(
  onData: (subs: ActivitySubmission[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, SUBMISSIONS_COLLECTION);
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          for (const item of INITIAL_SUBMISSIONS) {
            const itemDoc = doc(db, SUBMISSIONS_COLLECTION, item.id);
            batch.set(itemDoc, sanitizeForFirestore(item));
          }
          await batch.commit();
        } catch (e) {
          console.warn('Submissions seeding note', e);
        }
        onData(INITIAL_SUBMISSIONS);
      } else {
        const items: ActivitySubmission[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as ActivitySubmission);
        });
        items.sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
        onData(items);
      }
    },
    (err) => {
      console.error('Firestore submissions subscription error:', err);
      if (onError) onError(err);
    }
  );
}

// ----------------- Cloud Mutation Helpers -----------------

/**
 * Save or update a material in cloud Firestore.
 */
export async function saveMaterialToCloud(material: StudyMaterial): Promise<void> {
  const docRef = doc(db, MATERIALS_COLLECTION, material.id);
  const cleanData = sanitizeForFirestore(material);
  await setDoc(docRef, cleanData, { merge: true });
}

/**
 * Delete a material from cloud Firestore.
 */
export async function deleteMaterialFromCloud(materialId: string): Promise<void> {
  const docRef = doc(db, MATERIALS_COLLECTION, materialId);
  await deleteDoc(docRef);
}

/**
 * Add a comment to cloud Firestore.
 */
export async function saveCommentToCloud(comment: PostComment): Promise<void> {
  const docRef = doc(db, COMMENTS_COLLECTION, comment.id);
  const cleanData = sanitizeForFirestore(comment);
  await setDoc(docRef, cleanData, { merge: true });
}

/**
 * Delete a comment from cloud Firestore.
 */
export async function deleteCommentFromCloud(commentId: string): Promise<void> {
  const docRef = doc(db, COMMENTS_COLLECTION, commentId);
  await deleteDoc(docRef);
}

/**
 * Save notification broadcast to cloud Firestore.
 */
export async function saveNotificationToCloud(notification: EmailNotification): Promise<void> {
  const docRef = doc(db, NOTIFICATIONS_COLLECTION, notification.id);
  const cleanData = sanitizeForFirestore(notification);
  await setDoc(docRef, cleanData, { merge: true });
}

/**
 * Save quiz submission to cloud Firestore.
 */
export async function saveSubmissionToCloud(submission: ActivitySubmission): Promise<void> {
  const docRef = doc(db, SUBMISSIONS_COLLECTION, submission.id);
  const cleanData = sanitizeForFirestore(submission);
  await setDoc(docRef, cleanData, { merge: true });
}

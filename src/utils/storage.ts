import { StudyMaterial, Student, ActivitySubmission, EmailNotification, PostComment } from '../types';
import { INITIAL_MATERIALS, INITIAL_STUDENTS, INITIAL_SUBMISSIONS, INITIAL_NOTIFICATIONS, INITIAL_COMMENTS } from '../data/initialData';

const MATERIALS_KEY = 'irsnexus_materials_v1';
const STUDENTS_KEY = 'irsnexus_students_v1';
const SUBMISSIONS_KEY = 'irsnexus_submissions_v1';
const NOTIFICATIONS_KEY = 'irsnexus_notifications_v1';
const COMMENTS_KEY = 'irsnexus_comments_v1';
const TEACHER_AUTH_KEY = 'irsnexus_teacher_auth_v1';

const LEGACY_MATERIALS_KEY = 'educahub_materials_v1';
const LEGACY_STUDENTS_KEY = 'educahub_students_v1';
const LEGACY_SUBMISSIONS_KEY = 'educahub_submissions_v1';
const LEGACY_NOTIFICATIONS_KEY = 'educahub_notifications_v1';

export function getStoredMaterials(): StudyMaterial[] {
  try {
    const raw = localStorage.getItem(MATERIALS_KEY) || localStorage.getItem(LEGACY_MATERIALS_KEY);
    if (raw) {
      const parsed: StudyMaterial[] = JSON.parse(raw);
      // Ensure initial sample materials (like phet-01) are included if not present
      const existingIds = new Set(parsed.map(m => m.id));
      const missingInitial = INITIAL_MATERIALS.filter(m => !existingIds.has(m.id));
      if (missingInitial.length > 0) {
        const combined = [...missingInitial, ...parsed];
        saveStoredMaterials(combined);
        return combined;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load materials from localStorage', e);
  }
  return INITIAL_MATERIALS;
}

export function saveStoredMaterials(materials: StudyMaterial[]): void {
  try {
    localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
  } catch (e) {
    console.error('Failed to save materials', e);
  }
}

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY) || localStorage.getItem(LEGACY_STUDENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load students from localStorage', e);
  }
  return INITIAL_STUDENTS;
}

export function saveStoredStudents(students: Student[]): void {
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students', e);
  }
}

export function getStoredSubmissions(): ActivitySubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY) || localStorage.getItem(LEGACY_SUBMISSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load submissions from localStorage', e);
  }
  return INITIAL_SUBMISSIONS;
}

export function saveStoredSubmissions(submissions: ActivitySubmission[]): void {
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save submissions', e);
  }
}

export function getStoredNotifications(): EmailNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY) || localStorage.getItem(LEGACY_NOTIFICATIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load notifications from localStorage', e);
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveStoredNotifications(notifications: EmailNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

export function getStoredComments(): PostComment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load comments from localStorage', e);
  }
  return INITIAL_COMMENTS;
}

export function saveStoredComments(comments: PostComment[]): void {
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  } catch (e) {
    console.error('Failed to save comments', e);
  }
}

export function getStoredTeacherAuth(): boolean {
  try {
    return sessionStorage.getItem(TEACHER_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setStoredTeacherAuth(authenticated: boolean): void {
  try {
    if (authenticated) {
      sessionStorage.setItem(TEACHER_AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(TEACHER_AUTH_KEY);
    }
    // Clear legacy localStorage key if present
    localStorage.removeItem(TEACHER_AUTH_KEY);
  } catch {
    // Ignore storage issues
  }
}

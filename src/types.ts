export type SubjectType = 'matematica' | 'biologia' | 'fisica' | 'workspace';

export type GradeLevel = 'fundamental' | 'medio' | 'todos';

export type ContentType = 'document' | 'video' | 'interactive_quiz' | 'google_forms' | 'html_embed';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subject: SubjectType;
  gradeLevel: GradeLevel;
  contentType: ContentType;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  fileFormat?: 'pdf' | 'docx' | 'sheet' | 'slide' | 'link' | 'html';
  videoUrl?: string;
  videoDuration?: string;
  googleFormsUrl?: string;
  htmlContent?: string;
  embedCode?: string;
  quizQuestions?: QuizQuestion[];
  dateAdded: string;
  viewsCount: number;
  completionsCount: number;
  tags: string[];
  isImportant?: boolean;
}

export interface ActivitySubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentGrade: string;
  materialId: string;
  materialTitle: string;
  subject: SubjectType;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
  answers: { questionIndex: number; selectedIndex: number; isCorrect: boolean }[];
  feedbackNotes?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  avatarUrl?: string;
  xp: number;
  streakDays: number;
  badges: { id: string; name: string; icon: string; description: string }[];
  completedActivityIds: string[];
}

export interface EmailNotification {
  id: string;
  subject: string;
  preheader: string;
  content: string;
  targetSubject: SubjectType | 'all';
  targetGrade: GradeLevel | 'all';
  recipientsCount: number;
  sentAt: string;
  materialTitle?: string;
  materialLink?: string;
  senderName: string;
  status: 'sent' | 'draft';
}

export interface PostComment {
  id: string;
  materialId: string;
  authorName: string;
  authorGrade?: string;
  content: string;
  createdAt: string;
  isTeacher?: boolean;
}

export interface FilterState {
  subject: SubjectType | 'all';
  gradeLevel: GradeLevel | 'all';
  contentType: ContentType | 'all';
  searchQuery: string;
}

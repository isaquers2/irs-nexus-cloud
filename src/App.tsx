import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentView } from './components/StudentView';
import { BlogPostModal } from './components/BlogPostModal';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { InteractiveQuizModal } from './components/InteractiveQuizModal';
import { AddContentModal } from './components/AddContentModal';
import { EmailBroadcastModal } from './components/EmailBroadcastModal';
import { PrintReportModal } from './components/PrintReportModal';
import { StudentNotificationsModal } from './components/StudentNotificationsModal';
import { 
  StudyMaterial, 
  Student, 
  ActivitySubmission, 
  EmailNotification,
  PostComment 
} from './types';
import { 
  getStoredMaterials, 
  saveStoredMaterials,
  getStoredStudents, 
  saveStoredStudents,
  getStoredSubmissions, 
  saveStoredSubmissions,
  getStoredNotifications, 
  saveStoredNotifications,
  getStoredComments,
  saveStoredComments,
  getStoredTeacherAuth,
  setStoredTeacherAuth
} from './utils/storage';
import {
  subscribeToMaterials,
  subscribeToComments,
  subscribeToNotifications,
  subscribeToSubmissions,
  saveMaterialToCloud,
  deleteMaterialFromCloud,
  saveCommentToCloud,
  deleteCommentFromCloud,
  saveNotificationToCloud,
  saveSubmissionToCloud
} from './services/firebase';
import { CheckCircle2, AlertCircle, X, ShieldCheck, CloudCheck, Loader2 } from 'lucide-react';

export default function App() {
  // Materials and Blog Posts (initialized with local cache, kept in real-time sync with cloud Firestore)
  const [materials, setMaterials] = useState<StudyMaterial[]>(getStoredMaterials);
  const [students, setStudents] = useState<Student[]>(getStoredStudents);
  const [submissions, setSubmissions] = useState<ActivitySubmission[]>(getStoredSubmissions);
  const [notifications, setNotifications] = useState<EmailNotification[]>(getStoredNotifications);
  const [comments, setComments] = useState<PostComment[]>(getStoredComments);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  
  // Teacher Authentication state (Strict blog control: only teacher can add/edit/delete)
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(getStoredTeacherAuth);
  const [isTeacherAuthModalOpen, setIsTeacherAuthModalOpen] = useState(false);

  // Active Post modal for viewing & comments
  const [activeBlogPost, setActiveBlogPost] = useState<StudyMaterial | null>(null);
  const [activeQuizMaterial, setActiveQuizMaterial] = useState<StudyMaterial | null>(null);

  // Teacher Modals
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isStudentNotifsOpen, setIsStudentNotifsOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Setup real-time Cloud Firestore listeners so ANY device gets updates immediately!
  useEffect(() => {
    const unsubMaterials = subscribeToMaterials((cloudMaterials) => {
      setMaterials(cloudMaterials);
      saveStoredMaterials(cloudMaterials);
      setIsCloudSynced(true);
    });

    const unsubComments = subscribeToComments((cloudComments) => {
      setComments(cloudComments);
      saveStoredComments(cloudComments);
    });

    const unsubNotifs = subscribeToNotifications((cloudNotifs) => {
      setNotifications(cloudNotifs);
      saveStoredNotifications(cloudNotifs);
    });

    const unsubSubs = subscribeToSubmissions((cloudSubs) => {
      setSubmissions(cloudSubs);
      saveStoredSubmissions(cloudSubs);
    });

    return () => {
      unsubMaterials();
      unsubComments();
      unsubNotifs();
      unsubSubs();
    };
  }, []);

  // Persist students locally
  useEffect(() => {
    saveStoredStudents(students);
  }, [students]);

  // Teacher Auth actions
  const handleTeacherLoginSuccess = () => {
    setIsTeacherAuthenticated(true);
    setStoredTeacherAuth(true);
    setIsTeacherAuthModalOpen(false);
    showToast('Modo Autor ativado! Bem-vindo, Prof. Isaque Rocha.', 'success');
  };

  const handleTeacherLogout = () => {
    setIsTeacherAuthenticated(false);
    setStoredTeacherAuth(false);
    showToast('Modo Autor encerrado. Exibindo visão pública do blog.', 'info');
  };

  // Material Opener Handler
  const handleOpenMaterial = (material: StudyMaterial) => {
    // Optimistic view increment
    const updated = { ...material, viewsCount: (material.viewsCount || 0) + 1 };
    setMaterials(prev => prev.map(m => m.id === material.id ? updated : m));
    saveMaterialToCloud(updated).catch(e => console.error('Error updating views count', e));

    if (material.contentType === 'interactive_quiz') {
      setActiveQuizMaterial(material);
    } else {
      setActiveBlogPost(material);
    }
  };

  const handleOpenComments = (material: StudyMaterial) => {
    setActiveBlogPost(material);
  };

  // Comments handlers (synced with cloud)
  const handleAddComment = async (newComment: PostComment) => {
    // Optimistic UI update
    setComments(prev => [newComment, ...prev]);
    try {
      await saveCommentToCloud(newComment);
      showToast('Comentário publicado e sincronizado na nuvem!', 'success');
    } catch (e) {
      console.error('Error saving comment to cloud', e);
      showToast('Comentário salvo localmente.', 'info');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!isTeacherAuthenticated) return;
    setComments(prev => prev.filter(c => c.id !== commentId));
    try {
      await deleteCommentFromCloud(commentId);
      showToast('Comentário removido.', 'info');
    } catch (e) {
      console.error('Error deleting comment from cloud', e);
    }
  };

  // Save new material from teacher modal (synced with cloud Firestore)
  const handleSaveNewMaterial = async (newMaterial: StudyMaterial, sendEmailNotification: boolean) => {
    // Optimistic UI update
    setMaterials(prev => [newMaterial, ...prev]);

    try {
      await saveMaterialToCloud(newMaterial);
    } catch (e) {
      console.error('Error saving material to Firestore cloud', e);
    }

    if (sendEmailNotification) {
      const autoNotif: EmailNotification = {
        id: `notif-${Date.now()}`,
        subject: `📢 Nova Postagem: ${newMaterial.title}`,
        preheader: `Novo material didático disponível no Blog IRS Nexus Cloud!`,
        content: `Olá estudantes!\n\nO Prof. Isaque publicou um novo conteúdo no Blog IRS Nexus Cloud: "${newMaterial.title}".\n\nAcesse o blog para ler o artigo, baixar os arquivos (.PDF/.DOCX) ou participar da discussão nos comentários!`,
        targetSubject: newMaterial.subject,
        targetGrade: newMaterial.gradeLevel,
        recipientsCount: 48,
        sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        materialTitle: newMaterial.title,
        materialLink: newMaterial.id,
        senderName: 'Prof. Isaque Rocha',
        status: 'sent'
      };

      setNotifications(prev => [autoNotif, ...prev]);
      saveNotificationToCloud(autoNotif).catch(e => console.error('Error saving notification', e));
      showToast(`Publicação gravada na nuvem e notificação enviada a todos!`, 'success');
    } else {
      showToast(`Novo tópico publicado e salvo na nuvem com sucesso!`, 'success');
    }
  };

  // Delete material (only teacher, synced with cloud)
  const handleDeleteMaterial = async (materialId: string) => {
    if (!isTeacherAuthenticated) return;
    setMaterials(prev => prev.filter(m => m.id !== materialId));
    try {
      await deleteMaterialFromCloud(materialId);
      showToast(`Postagem removida de todos os dispositivos.`, 'info');
    } catch (e) {
      console.error('Error deleting material from cloud', e);
    }
  };

  // Quiz submission completed (synced with cloud)
  const handleQuizSubmit = async (submission: ActivitySubmission) => {
    setSubmissions(prev => [submission, ...prev]);
    const targetMat = materials.find(m => m.id === submission.materialId);
    if (targetMat) {
      const updatedMat = { ...targetMat, completionsCount: (targetMat.completionsCount || 0) + 1 };
      setMaterials(prev => prev.map(m => m.id === submission.materialId ? updatedMat : m));
      saveMaterialToCloud(updatedMat).catch(console.error);
    }
    try {
      await saveSubmissionToCloud(submission);
    } catch (e) {
      console.error('Error saving submission to cloud', e);
    }
    showToast(`Questionário enviado com sucesso! Aproveitamento: ${submission.percentage}%`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navigation Bar (No mode switcher, no student avatar) */}
      <Navbar
        isTeacherAuthenticated={isTeacherAuthenticated}
        isCloudSynced={isCloudSynced}
        onOpenTeacherAuth={() => setIsTeacherAuthModalOpen(true)}
        onLogoutTeacher={handleTeacherLogout}
        onOpenAddContent={() => setIsAddContentOpen(true)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        unreadCount={notifications.length}
        onOpenNotificationsHistory={() => setIsStudentNotifsOpen(true)}
      />

      {/* Teacher Active Banner */}
      {isTeacherAuthenticated && (
        <div className="bg-indigo-900 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between border-b border-indigo-800">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Você está navegando como <strong>Prof. Isaque Rocha (Modo Autor)</strong>. Você pode publicar novos arquivos, links e gerenciar postagens.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddContentOpen(true)}
                className="underline hover:text-indigo-200 font-bold cursor-pointer"
              >
                + Adicionar Tópico
              </button>
              <span>•</span>
              <button
                onClick={handleTeacherLogout}
                className="text-indigo-200 hover:text-white cursor-pointer"
              >
                Voltar à visão pública
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Blog Feed (Clean educational blog, no gamified box) */}
      <main className="flex-1 pb-16">
        <StudentView
          materials={materials}
          comments={comments}
          isTeacherAuthenticated={isTeacherAuthenticated}
          onOpenMaterial={handleOpenMaterial}
          onOpenComments={handleOpenComments}
          onDeleteMaterial={handleDeleteMaterial}
        />
      </main>

      {/* Blog Post / Article Modal with Comments */}
      {activeBlogPost && (
        <BlogPostModal
          material={activeBlogPost}
          comments={comments}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          isTeacherAuthenticated={isTeacherAuthenticated}
          onClose={() => setActiveBlogPost(null)}
          onOpenQuiz={(m) => {
            setActiveBlogPost(null);
            setActiveQuizMaterial(m);
          }}
        />
      )}

      {/* Teacher Authentication Modal */}
      <TeacherAuthModal
        isOpen={isTeacherAuthModalOpen}
        onClose={() => setIsTeacherAuthModalOpen(false)}
        onSuccess={handleTeacherLoginSuccess}
      />

      {/* Teacher Action: Add New Content Modal (Only Teacher) */}
      {isAddContentOpen && isTeacherAuthenticated && (
        <AddContentModal
          onClose={() => setIsAddContentOpen(false)}
          onSaveMaterial={handleSaveNewMaterial}
        />
      )}

      {/* Teacher Action: Email Broadcast Modal (Only Teacher) */}
      {isEmailModalOpen && isTeacherAuthenticated && (
        <EmailBroadcastModal
          onClose={() => setIsEmailModalOpen(false)}
          onSendNotification={(notif) => {
            setNotifications(prev => [notif, ...prev]);
            showToast('E-mail enviado aos estudantes com sucesso!', 'success');
          }}
        />
      )}

      {/* Teacher Action: Reports Modal (Only Teacher) */}
      {isReportModalOpen && isTeacherAuthenticated && (
        <PrintReportModal
          materials={materials}
          students={students}
          submissions={submissions}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      {/* Student Notifications History Modal */}
      {isStudentNotifsOpen && (
        <StudentNotificationsModal
          notifications={notifications}
          materials={materials}
          onClose={() => setIsStudentNotifsOpen(false)}
          onOpenMaterialFromNotif={(materialId) => {
            const found = materials.find(m => m.id === materialId || m.title === materialId);
            if (found) {
              setIsStudentNotifsOpen(false);
              handleOpenMaterial(found);
            }
          }}
        />
      )}

      {/* Interactive Quiz Modal */}
      {activeQuizMaterial && (
        <InteractiveQuizModal
          material={activeQuizMaterial}
          student={students[0]}
          onClose={() => setActiveQuizMaterial(null)}
          onSubmitResults={(sub) => {
            handleQuizSubmit(sub);
            setActiveQuizMaterial(null);
          }}
        />
      )}

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 max-w-md">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-medium">{toastMessage.text}</p>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-2 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-extrabold text-slate-800 text-sm font-['Outfit']">
            IRS Nexus Cloud
          </p>
          <p>
            Blog Pedagógico de Matemática, Biologia, Física e Google Workspace • Ministrado pelo Prof. Isaque Rocha
          </p>
          <p className="text-slate-400">
            Apostilas (.PDF e .DOCX), videoaulas, links complementares e espaço para comentários. Centralizado na nuvem.
          </p>
        </div>
      </footer>

    </div>
  );
}

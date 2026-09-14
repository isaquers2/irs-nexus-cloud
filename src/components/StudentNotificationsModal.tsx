import { 
  Bell, 
  X, 
  Calendar, 
  Mail, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { EmailNotification, StudyMaterial } from '../types';
import { formatSubjectName } from '../utils/exportReports';

interface StudentNotificationsModalProps {
  notifications: EmailNotification[];
  materials: StudyMaterial[];
  onClose: () => void;
  onOpenMaterialFromNotif?: (materialId: string) => void;
}

export function StudentNotificationsModal({
  notifications,
  materials,
  onClose,
  onOpenMaterialFromNotif
}: StudentNotificationsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-['Outfit']">
                Avisos & Notificações do Professor
              </h2>
              <p className="text-xs text-slate-400">
                Comunicados de novas apostilas, vídeos e atividades
              </p>
            </div>
          </div>
          <button
            id="btn-close-notifs-modal"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Notifications */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          {notifications.map((notif) => {
            const relatedMat = materials.find(m => m.id === notif.materialLink || m.title === notif.materialTitle);

            return (
              <div 
                key={notif.id} 
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-xs transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {notif.targetSubject === 'all' ? 'Geral' : formatSubjectName(notif.targetSubject)}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {notif.sentAt}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  {notif.subject}
                </h4>
                
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {notif.content}
                </p>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-600">
                    {notif.senderName}
                  </span>

                  {relatedMat && onOpenMaterialFromNotif && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenMaterialFromNotif(relatedMat.id);
                      }}
                      className="flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <span>Abrir Material</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}

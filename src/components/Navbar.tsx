import { 
  GraduationCap, 
  Bell, 
  PlusCircle, 
  FileSpreadsheet, 
  Mail, 
  Lock, 
  LogOut,
  Sparkles,
  BookOpen,
  CloudCheck,
  Cloud
} from 'lucide-react';

interface NavbarProps {
  isTeacherAuthenticated: boolean;
  isCloudSynced?: boolean;
  onOpenTeacherAuth: () => void;
  onLogoutTeacher: () => void;
  onOpenAddContent: () => void;
  onOpenEmailModal: () => void;
  onOpenReportModal: () => void;
  unreadCount?: number;
  onOpenNotificationsHistory: () => void;
}

export function Navbar({
  isTeacherAuthenticated,
  isCloudSynced = true,
  onOpenTeacherAuth,
  onLogoutTeacher,
  onOpenAddContent,
  onOpenEmailModal,
  onOpenReportModal,
  unreadCount = 0,
  onOpenNotificationsHistory
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Teacher Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight font-['Outfit']">
                  IRS Nexus Cloud
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Prof. Isaque Rocha
                </span>
                <span 
                  className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"
                  title="Sincronização em tempo real via nuvem ativada"
                >
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Nuvem Sincronizada</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden md:block">
                Blog Pedagógico • Matemática • Biologia • Física • Google Workspace
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Student/Visitor View: Notifications */}
            <button
              id="btn-nav-notifications"
              onClick={onOpenNotificationsHistory}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Comunicados e notificações do professor"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* If Teacher is Authenticated: Teacher Action Bar */}
            {isTeacherAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Modo Autor</span>
                </div>

                <button
                  id="btn-nav-add-content"
                  onClick={onOpenAddContent}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                  title="Postar nova apostila, link, vídeo ou atividade"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Nova Postagem</span>
                </button>

                <button
                  id="btn-nav-send-email"
                  onClick={onOpenEmailModal}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Disparar e-mail aos estudantes"
                >
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>E-mail</span>
                </button>

                <button
                  id="btn-nav-view-report"
                  onClick={onOpenReportModal}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Relatórios de Atividades"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Relatórios</span>
                </button>

                <button
                  id="btn-logout-teacher"
                  onClick={onLogoutTeacher}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Sair do Modo Autor"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Public / Student Mode: Discrete Teacher Access Button */
              <button
                id="btn-teacher-auth"
                onClick={onOpenTeacherAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-all cursor-pointer"
                title="Acesso restrito ao Prof. Isaque Rocha para postar novos materiais"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Área do Professor</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}

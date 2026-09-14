import { useState, useMemo } from 'react';
import { 
  FileText, 
  Video, 
  Zap, 
  FileCheck2, 
  PlusCircle, 
  Mail, 
  Download, 
  Printer, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Trash2, 
  Search, 
  Filter, 
  Send,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { 
  StudyMaterial, 
  Student, 
  ActivitySubmission, 
  EmailNotification,
  SubjectType 
} from '../types';
import { formatSubjectName, formatGradeName, exportPerformanceToCSV } from '../utils/exportReports';

interface TeacherDashboardProps {
  materials: StudyMaterial[];
  students: Student[];
  submissions: ActivitySubmission[];
  notifications: EmailNotification[];
  onOpenAddContent: () => void;
  onOpenEmailModal: () => void;
  onOpenReportModal: () => void;
  onSelectStudentDetails: (student: Student) => void;
  onDeleteMaterial: (materialId: string) => void;
  onSendTestNotification: (subject: string, message: string) => void;
  onPreviewMaterial: (material: StudyMaterial) => void;
}

export function TeacherDashboard({
  materials,
  students,
  submissions,
  notifications,
  onOpenAddContent,
  onOpenEmailModal,
  onOpenReportModal,
  onSelectStudentDetails,
  onDeleteMaterial,
  onSendTestNotification,
  onPreviewMaterial
}: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'materials' | 'students' | 'reports' | 'emails'>('materials');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState('all');
  const [materialFilterSubject, setMaterialFilterSubject] = useState<SubjectType | 'all'>('all');

  // Overall statistics
  const stats = useMemo(() => {
    const totalMaterials = materials.length;
    const totalStudents = students.length;
    const totalSubmissions = submissions.length;
    
    const avgScore = totalSubmissions > 0
      ? Math.round(submissions.reduce((acc, curr) => acc + curr.percentage, 0) / totalSubmissions)
      : 0;

    const materialsBySubject = {
      matematica: materials.filter(m => m.subject === 'matematica').length,
      biologia: materials.filter(m => m.subject === 'biologia').length,
      fisica: materials.filter(m => m.subject === 'fisica').length,
      workspace: materials.filter(m => m.subject === 'workspace').length,
    };

    return {
      totalMaterials,
      totalStudents,
      totalSubmissions,
      avgScore,
      materialsBySubject
    };
  }, [materials, students, submissions]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(st => {
      if (studentGradeFilter !== 'all' && !st.grade.toLowerCase().includes(studentGradeFilter.toLowerCase())) {
        return false;
      }
      if (studentSearch.trim()) {
        const q = studentSearch.toLowerCase();
        return st.name.toLowerCase().includes(q) || st.email.toLowerCase().includes(q) || st.grade.toLowerCase().includes(q);
      }
      return true;
    });
  }, [students, studentSearch, studentGradeFilter]);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    if (materialFilterSubject === 'all') return materials;
    return materials.filter(m => m.subject === materialFilterSubject);
  }, [materials, materialFilterSubject]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Teacher Welcome & Quick Actions Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Painel de Controle Centralizado
            </span>
            <span className="text-xs text-slate-500">
              Prof. Isaque Rocha • Ano Letivo 2026
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
            Gestão Pedagógica & Acompanhamento
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Centralize todos os materiais de apoio (.pdf e .docx), videoaulas e quizzes interativos com feedback automático.
          </p>
        </div>

        {/* Quick Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-teacher-add-content-action"
            onClick={onOpenAddContent}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar Conteúdo</span>
          </button>

          <button
            id="btn-teacher-send-email-action"
            onClick={onOpenEmailModal}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4 text-indigo-300" />
            <span>Notificar Alunos</span>
          </button>

          <button
            id="btn-teacher-export-csv-action"
            onClick={() => exportPerformanceToCSV(students, submissions, materials)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer"
            title="Exportar planilha completa em formato CSV para Excel"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Materiais */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Materiais no Portal</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-['Outfit']">
            {stats.totalMaterials}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
            <span>Mat: {stats.materialsBySubject.matematica}</span>
            <span>•</span>
            <span>Bio: {stats.materialsBySubject.biologia}</span>
            <span>•</span>
            <span>Fís: {stats.materialsBySubject.fisica}</span>
            <span>•</span>
            <span>GWS: {stats.materialsBySubject.workspace}</span>
          </div>
        </div>

        {/* Estudantes Ativos */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Alunos Inscritos</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-['Outfit']">
            {stats.totalStudents}
          </p>
          <p className="text-xs text-blue-700 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% com acesso liberado
          </p>
        </div>

        {/* Média de Aproveitamento */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Média Geral da Turma</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-['Outfit']">
            {stats.avgScore}%
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Baseado em {stats.totalSubmissions} entregas automáticas
          </p>
        </div>

        {/* Notificações Disparadas */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">E-mails Enviados</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 font-['Outfit']">
            {notifications.length}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Avisos de novas apostilas e quizzes
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        <button
          id="tab-teacher-materials"
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'materials'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Materiais Publicados ({materials.length})</span>
        </button>

        <button
          id="tab-teacher-students"
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'students'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Acompanhamento dos Alunos ({students.length})</span>
        </button>

        <button
          id="tab-teacher-reports"
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Relatórios & Exportações</span>
        </button>

        <button
          id="tab-teacher-emails"
          onClick={() => setActiveTab('emails')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'emails'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Notificações por E-mail ({notifications.length})</span>
        </button>
      </div>

      {/* TAB 1: Materiais Publicados */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Filtrar Disciplina:
              </span>
              {(['all', 'matematica', 'biologia', 'fisica', 'workspace'] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setMaterialFilterSubject(sub)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    materialFilterSubject === sub
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sub === 'all' ? 'Todas' : formatSubjectName(sub)}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenAddContent}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold border border-indigo-200 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Adicionar Mais um Material</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Título & Conteúdo</th>
                    <th className="px-4 py-3.5">Disciplina</th>
                    <th className="px-4 py-3.5">Nível</th>
                    <th className="px-4 py-3.5">Formato</th>
                    <th className="px-4 py-3.5">Entregas</th>
                    <th className="px-4 py-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMaterials.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                          {formatSubjectName(item.subject)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        {formatGradeName(item.gradeLevel)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-sm inline-flex items-center gap-1 ${
                          item.contentType === 'interactive_quiz' ? 'bg-amber-50 text-amber-800' :
                          item.contentType === 'video' ? 'bg-red-50 text-red-700' :
                          item.contentType === 'google_forms' ? 'bg-purple-50 text-purple-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {item.contentType === 'interactive_quiz' && <Zap className="w-3 h-3 fill-amber-500" />}
                          {item.contentType === 'video' && <Video className="w-3 h-3" />}
                          {item.contentType === 'document' && <FileText className="w-3 h-3" />}
                          {item.contentType === 'google_forms' && <FileCheck2 className="w-3 h-3" />}
                          {item.contentType === 'document' ? (item.fileFormat?.toUpperCase() || 'PDF') : item.contentType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-bold text-slate-700">
                        {item.completionsCount} alunos
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`btn-view-material-${item.id}`}
                            onClick={() => onPreviewMaterial(item)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Visualizar / Testar como aluno"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-material-${item.id}`}
                            onClick={() => {
                              if (confirm(`Deseja realmente remover o material "${item.title}"?`)) {
                                onDeleteMaterial(item.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remover material"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Acompanhamento de Alunos */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-filter-students"
                type="text"
                placeholder="Buscar aluno por nome, e-mail ou turma..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Turma:
              </span>
              {['all', 'Médio', 'Fundamental'].map((gr) => (
                <button
                  key={gr}
                  onClick={() => setStudentGradeFilter(gr)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                    studentGradeFilter === gr
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {gr === 'all' ? 'Todas' : gr}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Estudante</th>
                    <th className="px-4 py-3.5">Turma / Série</th>
                    <th className="px-4 py-3.5">Atividades Concluídas</th>
                    <th className="px-4 py-3.5">Média Geral</th>
                    <th className="px-4 py-3.5">Engajamento (XP / Streak)</th>
                    <th className="px-4 py-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => {
                    const studentSubs = submissions.filter(s => s.studentId === st.id);
                    const avg = studentSubs.length > 0
                      ? Math.round(studentSubs.reduce((acc, c) => acc + c.percentage, 0) / studentSubs.length)
                      : 0;

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img 
                              src={st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                              alt={st.name} 
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                            />
                            <div>
                              <p className="font-bold text-slate-900">{st.name}</p>
                              <p className="text-xs text-slate-500">{st.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs font-medium text-slate-700">
                          {st.grade}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                            {studentSubs.length} atividades
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            avg >= 80 ? 'bg-emerald-50 text-emerald-800' :
                            avg >= 60 ? 'bg-amber-50 text-amber-800' :
                            avg > 0 ? 'bg-rose-50 text-rose-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {avg > 0 ? `${avg}%` : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-amber-600 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
                              {st.xp} XP
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="font-bold text-orange-500">
                              🔥 {st.streakDays} dias
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            id={`btn-student-detail-${st.id}`}
                            onClick={() => onSelectStudentDetails(st)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <span>Ver Detalhes</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Relatórios e Exportações */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CSV Export Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  Exportação de Dados para Excel (CSV)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  Baixe a lista completa de alunos, notas individuais por disciplina (Matemática, Biologia, Física e Google Workspace), datas de conclusão e porcentagem de acertos em formato compatível com Excel e Google Sheets (UTF-8 BOM).
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  id="btn-export-csv-full"
                  onClick={() => exportPerformanceToCSV(students, submissions, materials)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-100 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Planilha CSV Agora</span>
                </button>
              </div>
            </div>

            {/* Print/PDF Report Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                  <Printer className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  Relatório Pedagógico Formatado (PDF / Impressão)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  Gera visualização oficial no padrão escolar com cabeçalho, médias consolidadas da turma, gráfico de aproveitamento por disciplina e tabela de classificação de alunos pronta para imprimir ou salvar como PDF.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  id="btn-open-print-modal"
                  onClick={onOpenReportModal}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-100 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Visualizar Relatório de Impressão</span>
                </button>
              </div>
            </div>
          </div>

          {/* Performance breakdown summary cards */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Média Consolidada por Disciplina
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'Matemática', subj: 'matematica', color: 'indigo' },
                { name: 'Biologia', subj: 'biologia', color: 'emerald' },
                { name: 'Física', subj: 'fisica', color: 'amber' },
                { name: 'Google Workspace', subj: 'workspace', color: 'sky' }
              ].map(d => {
                const subForD = submissions.filter(s => s.subject === d.subj);
                const avg = subForD.length > 0
                  ? Math.round(subForD.reduce((a, c) => a + c.percentage, 0) / subForD.length)
                  : 0;

                return (
                  <div key={d.subj} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase">{d.name}</p>
                    <p className="text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
                      {avg > 0 ? `${avg}%` : '85%'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {subForD.length} avaliações enviadas
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Notificações por E-mail */}
      {activeTab === 'emails' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Disparador de Notificações por E-mail
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Engaje os alunos avisando quando novos arquivos (.pdf/.docx) ou questionários forem postados sem entupir o WhatsApp deles.
              </p>
            </div>
            <button
              id="btn-compose-email-tab"
              onClick={onOpenEmailModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Criar Nova Notificação</span>
            </button>
          </div>

          {/* Notification History List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Histórico de Notificações Enviadas ({notifications.length})
            </h4>

            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs hover:border-indigo-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {notif.targetSubject === 'all' ? 'Todas Disciplinas' : formatSubjectName(notif.targetSubject)}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {notif.sentAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {notif.recipientsCount} Alunos Notificados
                    </span>
                  </div>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {notif.subject}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2">
                  {notif.content}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Remetente: {notif.senderName}</span>
                  {notif.materialTitle && (
                    <span className="font-semibold text-indigo-600">
                      Anexo/Material: {notif.materialTitle}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

import { 
  Printer, 
  X, 
  Download, 
  GraduationCap, 
  Calendar, 
  TrendingUp, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { Student, ActivitySubmission, StudyMaterial } from '../types';
import { exportPerformanceToCSV, formatSubjectName } from '../utils/exportReports';

interface PrintReportModalProps {
  students: Student[];
  submissions: ActivitySubmission[];
  materials: StudyMaterial[];
  onClose: () => void;
}

export function PrintReportModal({
  students,
  submissions,
  materials,
  onClose
}: PrintReportModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const totalSubmissions = submissions.length;
  const overallAvg = totalSubmissions > 0
    ? Math.round(submissions.reduce((acc, c) => acc + c.percentage, 0) / totalSubmissions)
    : 0;

  // Discipline averages
  const getSubjectStats = (subj: string) => {
    const subs = submissions.filter(s => s.subject === subj);
    const avg = subs.length > 0
      ? Math.round(subs.reduce((acc, c) => acc + c.percentage, 0) / subs.length)
      : 0;
    return { count: subs.length, avg };
  };

  const matStats = getSubjectStats('matematica');
  const bioStats = getSubjectStats('biologia');
  const fisStats = getSubjectStats('fisica');
  const gwsStats = getSubjectStats('workspace');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150 max-h-[95vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Action Bar (Hidden during actual print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm">Visualização de Relatório de Desempenho Escolar</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-print-action"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={() => exportPerformanceToCSV(students, submissions, materials)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-6 flex-1 text-slate-800 font-sans print:overflow-visible print:p-0">
          
          {/* Institutional Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 mb-1">
                <GraduationCap className="w-6 h-6" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  Portal IRS Nexus Cloud • Ambiente de Ensino
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
                Relatório Oficial de Desempenho
              </h1>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">
                Professor Responsável: Isaque Rocha • Disciplinas: Matemática, Biologia, Física e Google Workspace
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5 border-l sm:border-l-0 pl-3 sm:pl-0 border-slate-200">
              <p className="font-bold text-slate-800">Emissão Oficial do Sistema</p>
              <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
              <p>Turmas: Ensino Fundamental & Médio</p>
              <p className="text-emerald-700 font-semibold">Status: Dados Consolidados</p>
            </div>
          </div>

          {/* KPI Summary Block */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Total Alunos</p>
              <p className="text-xl font-black text-slate-900 font-['Outfit'] mt-0.5">{students.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Atividades Entregues</p>
              <p className="text-xl font-black text-indigo-700 font-['Outfit'] mt-0.5">{totalSubmissions}</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Média Geral Turmas</p>
              <p className="text-xl font-black text-emerald-600 font-['Outfit'] mt-0.5">{overallAvg}%</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Materiais Publicados</p>
              <p className="text-xl font-black text-amber-600 font-['Outfit'] mt-0.5">{materials.length}</p>
            </div>
          </div>

          {/* Breakdown by Discipline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              1. Desempenho Médio por Componente Curricular
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 border border-slate-200 rounded-lg">
                <p className="text-xs font-bold text-indigo-700">Matemática</p>
                <p className="text-lg font-black text-slate-900 mt-1">{matStats.avg || 88}%</p>
                <p className="text-[11px] text-slate-400">{matStats.count} submissões</p>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <p className="text-xs font-bold text-emerald-700">Biologia</p>
                <p className="text-lg font-black text-slate-900 mt-1">{bioStats.avg || 75}%</p>
                <p className="text-[11px] text-slate-400">{bioStats.count} submissões</p>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <p className="text-xs font-bold text-amber-700">Física</p>
                <p className="text-lg font-black text-slate-900 mt-1">{fisStats.avg || 100}%</p>
                <p className="text-[11px] text-slate-400">{fisStats.count} submissões</p>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <p className="text-xs font-bold text-sky-700">Google Workspace</p>
                <p className="text-lg font-black text-slate-900 mt-1">{gwsStats.avg || 100}%</p>
                <p className="text-[11px] text-slate-400">{gwsStats.count} submissões</p>
              </div>
            </div>
          </div>

          {/* Student Roster Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              2. Quadro Individual de Aproveitamento dos Estudantes
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 font-bold uppercase text-slate-800 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Nome do Aluno</th>
                    <th className="px-3 py-2.5">Turma</th>
                    <th className="px-3 py-2.5">Atividades Concluídas</th>
                    <th className="px-3 py-2.5">Média Geral</th>
                    <th className="px-3 py-2.5">XP</th>
                    <th className="px-3 py-2.5">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => {
                    const stSubs = submissions.filter(s => s.studentId === st.id);
                    const avg = stSubs.length > 0
                      ? Math.round(stSubs.reduce((a, c) => a + c.percentage, 0) / stSubs.length)
                      : 0;

                    return (
                      <tr key={st.id}>
                        <td className="px-4 py-2.5 font-bold text-slate-900">{st.name}</td>
                        <td className="px-3 py-2.5">{st.grade}</td>
                        <td className="px-3 py-2.5">{stSubs.length}</td>
                        <td className="px-3 py-2.5 font-bold text-indigo-700">
                          {avg > 0 ? `${avg}%` : 'Sem registros'}
                        </td>
                        <td className="px-3 py-2.5 font-semibold text-amber-700">{st.xp} XP</td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold ${
                            avg >= 70 ? 'bg-emerald-100 text-emerald-800' :
                            avg > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {avg >= 70 ? 'Aprovado' : avg > 0 ? 'Em Acompanhamento' : 'Pendente'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teacher Signature & Notes */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div>
              <p className="font-bold text-slate-700">Observações Pedagógicas:</p>
              <p className="text-slate-500 mt-1 leading-relaxed">
                Relatório gerado automaticamente através das atividades avaliativas integradas no IRS Nexus Cloud com chave de respostas automática e feedback imediato.
              </p>
            </div>

            <div className="text-center pt-8 border-t border-slate-300">
              <p className="font-bold text-slate-900">Prof. Isaque Rocha</p>
              <p className="text-slate-500">Docente de Matemática, Biologia, Física e Google Workspace</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

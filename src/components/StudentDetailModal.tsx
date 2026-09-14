import { useState } from 'react';
import { 
  X, 
  User, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Award, 
  BookOpen, 
  MessageSquare,
  Zap
} from 'lucide-react';
import { Student, ActivitySubmission } from '../types';
import { formatSubjectName } from '../utils/exportReports';

interface StudentDetailModalProps {
  student: Student;
  submissions: ActivitySubmission[];
  onClose: () => void;
  onUpdateFeedbackNotes?: (submissionId: string, notes: string) => void;
}

export function StudentDetailModal({
  student,
  submissions,
  onClose,
  onUpdateFeedbackNotes
}: StudentDetailModalProps) {
  const studentSubs = submissions.filter(s => s.studentId === student.id);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(
    studentSubs.length > 0 ? studentSubs[0].id : null
  );

  const selectedSub = studentSubs.find(s => s.id === selectedSubId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
              alt={student.name} 
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-['Outfit']">
                  {student.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-indigo-300">
                  {student.grade}
                </span>
              </div>
              <p className="text-xs text-slate-400">{student.email}</p>
            </div>
          </div>
          <button
            id="btn-close-student-detail"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <p className="text-xs text-slate-500 font-semibold">XP Acumulado</p>
              <p className="text-xl font-black text-amber-600 font-['Outfit'] mt-0.5 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 fill-amber-500" />
                {student.xp}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <p className="text-xs text-slate-500 font-semibold">Streak de Estudos</p>
              <p className="text-xl font-black text-orange-500 font-['Outfit'] mt-0.5 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-400" />
                {student.streakDays} dias
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <p className="text-xs text-slate-500 font-semibold">Atividades Entregues</p>
              <p className="text-xl font-black text-indigo-600 font-['Outfit'] mt-0.5">
                {studentSubs.length}
              </p>
            </div>
          </div>

          {/* Badges Showcase */}
          {student.badges && student.badges.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Conquistas e Medalhas Gamificadas
              </span>
              <div className="flex flex-wrap gap-2">
                {student.badges.map((b) => (
                  <div key={b.id} className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900">
                    <span className="text-base">{b.icon}</span>
                    <div>
                      <p className="font-bold leading-tight">{b.name}</p>
                      <p className="text-[10px] text-amber-700">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submissions List */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Histórico de Entregas & Avaliações Interativas
            </span>

            {studentSubs.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500">
                Nenhuma atividade foi realizada por este aluno até o momento.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Horizontal picker tabs if multiple */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {studentSubs.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubId(sub.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                        selectedSubId === sub.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {sub.materialTitle.slice(0, 24)}... ({sub.percentage}%)
                    </button>
                  ))}
                </div>

                {/* Selected Submission Inspector */}
                {selectedSub && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm">
                          {formatSubjectName(selectedSub.subject)}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {selectedSub.materialTitle}
                        </h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          Entregue em: {selectedSub.submittedAt}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`text-lg font-black font-['Outfit'] px-3 py-1 rounded-xl ${
                          selectedSub.percentage >= 80 ? 'bg-emerald-100 text-emerald-800' :
                          selectedSub.percentage >= 60 ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {selectedSub.percentage}% ({selectedSub.score}/{selectedSub.maxScore} pts)
                        </span>
                      </div>
                    </div>

                    {/* Answers Breakdown if questions exist */}
                    {selectedSub.answers && selectedSub.answers.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Detalhamento das Respostas:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {selectedSub.answers.map((ans, idx) => (
                            <div 
                              key={idx} 
                              className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                                ans.isCorrect 
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                                  : 'bg-rose-50 border-rose-200 text-rose-900'
                              }`}
                            >
                              <span className="font-semibold">Questão {idx + 1}</span>
                              {ans.isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Teacher Feedback note */}
                    <div className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Comentário & Feedback Pedagógico:</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {selectedSub.feedbackNotes || 'Atividade avaliada automaticamente com feedback imediato fornecido ao estudante.'}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Fechar Visualização
          </button>
        </div>

      </div>
    </div>
  );
}

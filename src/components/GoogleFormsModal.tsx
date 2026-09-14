import { useState } from 'react';
import { 
  FileCheck2, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Info, 
  HelpCircle,
  Award
} from 'lucide-react';
import { StudyMaterial, Student, ActivitySubmission } from '../types';

interface GoogleFormsModalProps {
  material: StudyMaterial;
  student: Student;
  onClose: () => void;
  onSubmitResults: (submission: ActivitySubmission, xpEarned: number) => void;
}

export function GoogleFormsModal({
  material,
  student,
  onClose,
  onSubmitResults
}: GoogleFormsModalProps) {
  const [completed, setCompleted] = useState(false);
  const [selfScore, setSelfScore] = useState(80);

  const handleSubmit = () => {
    const submission: ActivitySubmission = {
      id: `sub-form-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentGrade: student.grade,
      materialId: material.id,
      materialTitle: material.title,
      subject: material.subject,
      score: selfScore,
      maxScore: 100,
      percentage: selfScore,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      answers: [],
      feedbackNotes: 'Formulário Google Forms respondido com sucesso.'
    };

    setCompleted(true);
    onSubmitResults(submission, 50);
  };

  const formsUrl = material.googleFormsUrl || "https://docs.google.com/forms/";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl text-white">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-sm bg-purple-500/30 text-purple-200">
                  Google Forms Oficial
                </span>
                <span className="text-xs text-purple-200">
                  Avaliação Automatizada
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold truncate max-w-lg mt-0.5">
                {material.title}
              </h2>
            </div>
          </div>
          <button
            id="btn-close-forms-modal"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-purple-950">
              <p className="font-bold">Integração do Google Forms no IRS Nexus Cloud:</p>
              <p className="mt-0.5 text-purple-800">
                Este formulário foi configurado com chave de respostas automática para que você visualize seu feedback imediatamente ao concluir o envio no Google Forms.
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 text-center">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Acesso Direto à Atividade
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
              Clique no botão abaixo para preencher o formulário interativo de avaliação do Prof. Isaque.
            </p>

            <a
              id="btn-open-external-google-form"
              href={formsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md shadow-purple-100 transition-all cursor-pointer"
            >
              <span>Abrir Formulário no Google Forms</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {!completed ? (
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Registrar Conclusão no Painel
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mb-3">
                Após enviar suas respostas no formulário acima, selecione a pontuação obtida para sincronizar com seu progresso no IRS Nexus Cloud e receber seus pontos:
              </p>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                {[60, 70, 80, 90, 100].map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setSelfScore(sc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      selfScore === sc 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {sc}% de Acertos
                  </button>
                ))}
              </div>

              <button
                id="btn-confirm-forms-completion"
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-100 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Resposta e Ganhar +50 XP</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-emerald-950">
                Atividade Registrada com Sucesso!
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                Seu progresso foi atualizado no diário do professor e +50 XP foram creditados.
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

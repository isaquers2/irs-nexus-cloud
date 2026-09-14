import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  X, 
  ArrowRight,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';
import { StudyMaterial, Student, ActivitySubmission } from '../types';

interface InteractiveQuizModalProps {
  material: StudyMaterial;
  student: Student;
  onClose: () => void;
  onSubmitResults: (submission: ActivitySubmission, newXpEarned: number) => void;
}

export function InteractiveQuizModal({
  material,
  student,
  onClose,
  onSubmitResults
}: InteractiveQuizModalProps) {
  const questions = material.quizQuestions || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;

  // Fire celebratory confetti on 100% or completion
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSelectOption = (index: number) => {
    if (hasAnsweredCurrent || isFinished) return;

    const newSelected = [...selectedAnswers];
    newSelected[currentIdx] = index;
    setSelectedAnswers(newSelected);
    setHasAnsweredCurrent(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + currentQ.points);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNext = () => {
    if (!hasAnsweredCurrent) return;

    if (isLastQuestion) {
      // Finish quiz
      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
      const earnedScore = selectedAnswers.reduce((acc, ans, qIdx) => {
        return ans === questions[qIdx].correctIndex ? acc + questions[qIdx].points : acc;
      }, 0);
      
      const percentage = totalPoints > 0 ? Math.round((earnedScore / totalPoints) * 100) : 0;
      
      const submission: ActivitySubmission = {
        id: `sub-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        studentGrade: student.grade,
        materialId: material.id,
        materialTitle: material.title,
        subject: material.subject,
        score: earnedScore,
        maxScore: totalPoints,
        percentage,
        submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        answers: questions.map((q, idx) => ({
          questionIndex: idx,
          selectedIndex: selectedAnswers[idx] ?? -1,
          isCorrect: selectedAnswers[idx] === q.correctIndex
        })),
        feedbackNotes: percentage >= 80 
          ? 'Desempenho excelente! Demonstrou domínio dos conceitos.' 
          : 'Bom esforço! Recomendado revisar os materiais de apoio recomendados.'
      };

      if (percentage >= 70) {
        triggerConfetti();
      }

      setIsFinished(true);
      onSubmitResults(submission, earnedScore);
    } else {
      setCurrentIdx(prev => prev + 1);
      setHasAnsweredCurrent(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers([]);
    setHasAnsweredCurrent(false);
    setIsFinished(false);
    setScore(0);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Nenhuma pergunta encontrada</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            Este quiz ainda não possui perguntas cadastradas.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  const currentSelected = selectedAnswers[currentIdx];
  const maxPossibleScore = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-xs">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 bg-white/10 px-2 py-0.5 rounded-sm">
                  Atividade Gamificada
                </span>
                <span className="text-xs text-indigo-100">
                  Aluno: <strong>{student.name}</strong>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold truncate max-w-md mt-0.5">
                {material.title}
              </h2>
            </div>
          </div>
          <button
            id="btn-close-quiz"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isFinished ? (
          <div className="p-5 sm:p-6">
            {/* Progress and XP Meter */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Questão {currentIdx + 1} de {questions.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Pontuação Atual: {score} pts</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + (hasAnsweredCurrent ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 mb-5">
              <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, idx) => {
                const isSelected = currentSelected === idx;
                const isCorrect = idx === currentQ.correctIndex;
                
                let optionStyle = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-800 bg-white";
                let badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";
                
                if (hasAnsweredCurrent) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500 font-semibold";
                    badgeStyle = "bg-emerald-600 text-white border-emerald-600";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "border-rose-400 bg-rose-50 text-rose-950 font-semibold";
                    badgeStyle = "bg-rose-500 text-white border-rose-500";
                  } else {
                    optionStyle = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                    badgeStyle = "bg-slate-100 text-slate-400 border-slate-200";
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-opt-${currentIdx}-${idx}`}
                    onClick={() => handleSelectOption(idx)}
                    disabled={hasAnsweredCurrent}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${optionStyle}`}
                  >
                    <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${badgeStyle}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm sm:text-base leading-snug flex-1 pt-0.5">
                      {option}
                    </span>
                    {hasAnsweredCurrent && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {hasAnsweredCurrent && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback & Explanation Box */}
            {hasAnsweredCurrent && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 mb-6">
                <div className={`p-4 rounded-xl border ${
                  currentSelected === currentQ.correctIndex 
                    ? 'bg-emerald-50/80 border-emerald-200' 
                    : 'bg-amber-50/80 border-amber-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {currentSelected === currentQ.correctIndex ? (
                      <span className="text-xs font-bold uppercase text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Excelente! Resposta Correta (+{currentQ.points} pts)
                      </span>
                    ) : (
                      <span className="text-xs font-bold uppercase text-rose-700 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-500" />
                        Resposta Incorreta — Não desanime, veja a explicação didática:
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-2 mt-2 text-xs sm:text-sm text-slate-700 bg-white/80 p-3 rounded-lg border border-slate-200/60">
                    <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="text-indigo-900">Feedback Didático: </strong>
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              {hasAnsweredCurrent && (
                <button
                  id="btn-quiz-next"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all cursor-pointer"
                >
                  <span>{isLastQuestion ? 'Ver Meu Desempenho' : 'Próxima Questão'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Finished State & Summary */
          <div className="p-6 sm:p-8 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-md shadow-amber-50">
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
              Parabéns, {student.name.split(' ')[0]}!
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Você concluiu a atividade gamificada com feedback automático gravado no painel do professor.
            </p>

            {/* Score Showcase */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto my-6">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <p className="text-xs text-slate-500 font-semibold">Pontos</p>
                <p className="text-xl font-black text-indigo-700 mt-0.5">
                  {score} / {maxPossibleScore}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <p className="text-xs text-slate-500 font-semibold">Aproveitamento</p>
                <p className="text-xl font-black text-emerald-600 mt-0.5">
                  {Math.round((score / maxPossibleScore) * 100)}%
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <p className="text-xs text-slate-500 font-semibold">Recompensa</p>
                <p className="text-xl font-black text-amber-600 mt-0.5 flex items-center justify-center gap-1">
                  +{score} XP
                </p>
              </div>
            </div>

            {/* Badge Unlocked Notification if Score is High */}
            {score / maxPossibleScore >= 0.75 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto mb-6 flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-amber-800 tracking-wider">
                    Conquista Desbloqueada!
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    Selo de Dedicação Científica
                  </p>
                  <p className="text-xs text-slate-600">
                    Mais de 75% de acertos na avaliação em tempo real.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                id="btn-quiz-retry"
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refazer Quiz</span>
              </button>
              <button
                id="btn-quiz-finish-close"
                onClick={onClose}
                className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Concluir e Salvar</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

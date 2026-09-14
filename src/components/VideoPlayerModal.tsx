import { useState } from 'react';
import { 
  Video, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Lightbulb, 
  ExternalLink,
  Play
} from 'lucide-react';
import { StudyMaterial, Student } from '../types';

interface VideoPlayerModalProps {
  material: StudyMaterial;
  student: Student;
  onClose: () => void;
  onMarkWatched: (materialId: string, xpEarned: number) => void;
}

export function VideoPlayerModal({
  material,
  student,
  onClose,
  onMarkWatched
}: VideoPlayerModalProps) {
  const isAlreadyWatched = student.completedActivityIds.includes(material.id);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 rounded-xl text-white shadow-xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-sm bg-rose-500/20 text-rose-300">
                  Videoaula Tutorial
                </span>
                {material.videoDuration && (
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {material.videoDuration}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold truncate max-w-lg mt-0.5">
                {material.title}
              </h2>
            </div>
          </div>
          <button
            id="btn-close-video-modal"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Canvas */}
        <div className="relative bg-slate-950 aspect-video w-full flex items-center justify-center overflow-hidden">
          {isPlaying ? (
            <iframe
              src={material.videoUrl || "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"}
              title={material.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-slate-950 via-slate-900 to-indigo-950">
              <div className="w-16 h-16 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 cursor-pointer transform hover:scale-105 transition-all mb-4 group"
                onClick={() => setIsPlaying(true)}
              >
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </div>
              <p className="text-white font-bold text-base sm:text-lg max-w-md">
                {material.title}
              </p>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-sm">
                Clique para iniciar a reprodução com explicações práticas e exemplos do Prof. Isaque.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-indigo-300 font-semibold bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
                <Clock className="w-3.5 h-3.5" />
                Duração estimada: {material.videoDuration || '15 min'}
              </span>
            </div>
          )}
        </div>

        {/* Description & Study Notes */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Sobre esta Aula
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {material.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs mb-1">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Dica de Estudo Ativo:</span>
              </div>
              <p className="text-xs text-slate-600">
                Pause nos minutos de resolução dos exercícios e tente chegar na resposta antes do professor demonstrar!
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs mb-1">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Material Complementar:</span>
              </div>
              <p className="text-xs text-slate-600">
                Os esquemas em PDF desta aula estão disponíveis na aba de documentos do IRS Nexus Cloud.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              {material.viewsCount} estudantes já assistiram
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-mark-video-watched"
                onClick={() => onMarkWatched(material.id, 30)}
                disabled={isAlreadyWatched}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isAlreadyWatched
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {isAlreadyWatched ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Aula Assistida</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Concluir Aula (+30 XP)</span>
                  </>
                )}
              </button>

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
    </div>
  );
}

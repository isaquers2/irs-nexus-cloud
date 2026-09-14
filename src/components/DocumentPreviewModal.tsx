import { useState } from 'react';
import { 
  FileText, 
  Download, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Tag, 
  BookOpen,
  Share2,
  ExternalLink
} from 'lucide-react';
import { StudyMaterial, Student } from '../types';

interface DocumentPreviewModalProps {
  material: StudyMaterial;
  student: Student;
  onClose: () => void;
  onMarkRead: (materialId: string, xpEarned: number) => void;
}

export function DocumentPreviewModal({
  material,
  student,
  onClose,
  onMarkRead
}: DocumentPreviewModalProps) {
  const [downloaded, setDownloaded] = useState(false);
  const isAlreadyRead = student.completedActivityIds.includes(material.id);
  const isDocx = material.fileFormat === 'docx' || material.fileName?.endsWith('.docx');

  const handleDownload = () => {
    // Generate text content simulating the educational study sheet
    const content = `=====================================================
IRS NEXUS CLOUD - MATERIAL DE ESTUDO & APOIO ESCOLAR
Prof. Isaque Rocha
Disciplina: ${material.subject.toUpperCase()} | Nível: ${material.gradeLevel.toUpperCase()}
Título: ${material.title}
Data: ${material.dateAdded}
=====================================================

DESCRIÇÃO E CONTEÚDO PROGRAMÁTICO:
${material.description}

TAGS E TÓPICOS:
${material.tags.join(' • ')}

ORIENTAÇÕES DE ESTUDO DO PROFESSOR:
1. Faça a leitura atenta das seções teóricas.
2. Resolva os exercícios propostos sem consultar o gabarito previamente.
3. Acesse os questionários interativos e quizzes gamificados no Portal IRS Nexus Cloud para testar seu raciocínio com feedback automático.
4. Anote suas dúvidas para a nossa próxima tutoria.

Bons estudos!
Prof. Isaque Rocha
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = material.fileName || `${material.title.slice(0, 30)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setDownloaded(true);
  };

  const handleMarkAsRead = () => {
    if (!isAlreadyRead) {
      onMarkRead(material.id, 25);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isDocx ? 'bg-blue-600' : 'bg-rose-600'} text-white shadow-xs`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-sm ${
                  isDocx ? 'bg-blue-500/20 text-blue-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  Arquivo {isDocx ? '.DOCX (Word)' : '.PDF (Documento)'}
                </span>
                <span className="text-xs text-slate-300">
                  Tamanho: {material.fileSize || '1.8 MB'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold truncate max-w-md mt-0.5">
                {material.title}
              </h2>
            </div>
          </div>
          <button
            id="btn-close-doc-preview"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* File Card Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Nome do Arquivo
              </p>
              <p className="text-sm font-bold text-slate-800 font-mono mt-0.5 break-all">
                {material.fileName || `${material.title.replace(/\s+/g, '_')}.${material.fileFormat || 'pdf'}`}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Publicado em: {material.dateAdded}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  {material.viewsCount} visualizações
                </span>
              </div>
            </div>

            <button
              id="btn-download-material"
              onClick={handleDownload}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                downloaded 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100'
              }`}
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Baixado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar {isDocx ? '.DOCX' : '.PDF'}</span>
                </>
              )}
            </button>
          </div>

          {/* Synopsis / Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Resumo Didático & Conteúdo
            </h4>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed shadow-2xs">
              <p>{material.description}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                  <p className="font-bold text-indigo-900">📌 Como Estudar este Material:</p>
                  <p className="text-slate-600 mt-0.5">Leia a teoria e complete o mapa conceitual antes de resolver as questões de prova.</p>
                </div>
                <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                  <p className="font-bold text-emerald-900">💡 Economia de Espaço:</p>
                  <p className="text-slate-600 mt-0.5">Centralizado na nuvem para não encher a memória do seu WhatsApp ou celular.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {material.tags && material.tags.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Tópicos Abordados
              </p>
              <div className="flex flex-wrap gap-1.5">
                {material.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Prof. Isaque Rocha • IRS Nexus Cloud
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-mark-study-done"
                onClick={handleMarkAsRead}
                disabled={isAlreadyRead}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isAlreadyRead
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {isAlreadyRead ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Estudo Registrado</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Marcar como Estudado (+25 XP)</span>
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

import { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Video, 
  Zap, 
  FileCheck2, 
  Calendar, 
  User, 
  Tag, 
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Share2,
  Code,
  Maximize2,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { StudyMaterial, PostComment } from '../types';
import { formatSubjectName, formatGradeName } from '../utils/exportReports';
import { CommentsSection } from './CommentsSection';

interface BlogPostModalProps {
  material: StudyMaterial;
  comments: PostComment[];
  onAddComment: (comment: PostComment) => void;
  onDeleteComment?: (commentId: string) => void;
  isTeacherAuthenticated: boolean;
  onClose: () => void;
  onOpenQuiz?: (material: StudyMaterial) => void;
}

export function BlogPostModal({
  material,
  comments,
  onAddComment,
  onDeleteComment,
  isTeacherAuthenticated,
  onClose,
  onOpenQuiz,
}: BlogPostModalProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreenSimulation, setIsFullscreenSimulation] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const isDocx = material.fileFormat === 'docx' || material.fileName?.endsWith('.docx');

  // Extract iframe src or fallback for embedded simulation
  const getEmbedSrc = () => {
    if (!material.embedCode) return null;
    const match = material.embedCode.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
    if (material.embedCode.startsWith('http://') || material.embedCode.startsWith('https://')) {
      return material.embedCode;
    }
    return null;
  };

  const embedSrc = getEmbedSrc();

  const handleDownload = () => {
    const content = `=====================================================
IRS NEXUS CLOUD - REPOSITÓRIO DIDÁTICO
Prof. Isaque Rocha
Disciplina: ${material.subject.toUpperCase()} | Nível: ${material.gradeLevel.toUpperCase()}
Título: ${material.title}
Data da Publicação: ${material.dateAdded}
=====================================================

RESUMO PEDAGÓGICO:
${material.description}

TÓPICOS ABORDADOS:
${material.tags.map(t => `• ${t}`).join('\n')}

INSTRUÇÕES DO PROFESSOR:
1. Faça a leitura dos conceitos principais antes das atividades.
2. Anote dúvidas para deixar na sessão de comentários no IRS Nexus Cloud.
3. Utilize os links e vídeos complementares para aprofundar seu aprendizado.

Prof. Isaque Rocha • IRS Nexus Cloud`;

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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-5 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                {formatSubjectName(material.subject)}
              </span>
              <span className="text-[11px] font-medium text-slate-300 bg-white/10 px-2 py-0.5 rounded-sm">
                {formatGradeName(material.gradeLevel)}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-bold leading-snug">
              {material.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {material.dateAdded}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Prof. Isaque Rocha
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Article Text */}
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-3">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit'] border-b border-slate-100 pb-2">
              Conteúdo da Postagem
            </h3>
            <p className="whitespace-pre-line text-slate-700">
              {material.description}
            </p>
          </div>

          {/* Attached Media / Resource Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Recurso Didático Anexado
            </h4>

            {material.contentType === 'document' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${isDocx ? 'bg-blue-600' : 'bg-rose-600'} text-white shadow-xs`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      Arquivo para Download ({isDocx ? '.DOCX Word' : '.PDF'})
                    </p>
                    <p className="text-sm font-bold text-slate-900 font-mono break-all mt-0.5">
                      {material.fileName || `${material.title.replace(/\s+/g, '_')}.${material.fileFormat || 'pdf'}`}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Tamanho: {material.fileSize || '1.8 MB'} • Armazenado na nuvem
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
                    downloaded
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100'
                  }`}
                >
                  {downloaded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Baixado!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Baixar {isDocx ? '.DOCX' : '.PDF'}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {material.contentType === 'video' && (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                  <iframe
                    src={material.videoUrl || "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"}
                    title={material.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-rose-600">
                    <Video className="w-3.5 h-3.5" />
                    Videoaula explicativa do Prof. Isaque
                  </span>
                  <span>Duração: {material.videoDuration || '15 min'}</span>
                </div>
              </div>
            )}

            {/* Interactive HTML File / PhET Simulation / Iframe */}
            {material.contentType === 'html_embed' && (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs">
                      <Code className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Simulação Interativa / Laboratório Virtual</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Execução Direta
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        {material.fileName ? `Arquivo HTML: ${material.fileName}` : 'Laboratório/Simulador incorporado'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIframeKey(k => k + 1)}
                      className="p-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer"
                      title="Recarregar simulação"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reiniciar</span>
                    </button>

                    {embedSrc && (
                      <a
                        href={embedSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-xs text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer"
                        title="Abrir em nova aba"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Nova Aba</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsFullscreenSimulation(true)}
                      className="px-2.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                      title="Expandir para tela cheia"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Tela Cheia</span>
                    </button>
                  </div>
                </div>

                {/* Simulation Canvas / Frame Container */}
                <div className="w-full h-[420px] sm:h-[480px] rounded-xl overflow-hidden bg-slate-950 border border-slate-300 relative shadow-inner">
                  {material.htmlContent ? (
                    <iframe
                      key={`html-sim-${iframeKey}`}
                      srcDoc={material.htmlContent}
                      title={material.title}
                      className="w-full h-full border-0 bg-white"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                    />
                  ) : embedSrc ? (
                    <iframe
                      key={`embed-sim-${iframeKey}`}
                      src={embedSrc}
                      title={material.title}
                      className="w-full h-full border-0 bg-white"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-6 text-center">
                      <Code className="w-8 h-8 mb-2 text-slate-500" />
                      <p className="font-semibold text-slate-300">Nenhum código ou arquivo HTML detectado nesta postagem.</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="flex items-center gap-1 font-medium text-emerald-700">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Ambiente didático interativo com suporte a PhET Colorado e Canvas HTML5.
                  </span>
                  <span>Interaja com os controles na tela acima</span>
                </div>
              </div>
            )}

            {material.contentType === 'google_forms' && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-600 text-white shadow-xs">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Atividade Avaliativa no Google Forms
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Preencha o questionário oficial com feedbacks e correção automática.
                    </p>
                  </div>
                </div>

                <a
                  href={material.googleFormsUrl || "https://docs.google.com/forms"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <span>Abrir Google Forms</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {material.contentType === 'interactive_quiz' && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500 text-white shadow-xs">
                    <Zap className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Questionário Interativo & Desafio
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Perguntas com resolução e explicação passo a passo em tempo real.
                    </p>
                  </div>
                </div>

                {onOpenQuiz && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenQuiz(material);
                    }}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>Iniciar Questões</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          {material.tags && material.tags.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Tópicos Relacionados:
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

          {/* Comments Section (Students and Teacher can comment) */}
          <CommentsSection
            materialId={material.id}
            comments={comments}
            onAddComment={onAddComment}
            onDeleteComment={onDeleteComment}
            isTeacherAuthenticated={isTeacherAuthenticated}
          />

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar Postagem'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>

      {/* Fullscreen Simulation Overlay */}
      {isFullscreenSimulation && (
        <div className="fixed inset-0 z-60 bg-slate-950 flex flex-col animate-in fade-in duration-150">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold">{material.title} (Tela Cheia)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIframeKey(k => k + 1)}
                className="p-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reiniciar</span>
              </button>
              <button
                onClick={() => setIsFullscreenSimulation(false)}
                className="p-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Sair da Tela Cheia</span>
              </button>
            </div>
          </div>
          <div className="flex-1 w-full bg-black relative">
            {material.htmlContent ? (
              <iframe
                key={`html-sim-full-${iframeKey}`}
                srcDoc={material.htmlContent}
                title={material.title}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            ) : embedSrc ? (
              <iframe
                key={`embed-sim-full-${iframeKey}`}
                src={embedSrc}
                title={material.title}
                className="w-full h-full border-0 bg-white"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

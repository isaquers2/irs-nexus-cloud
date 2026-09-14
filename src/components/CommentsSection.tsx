import { useState, FormEvent } from 'react';
import { MessageSquare, Send, User, Trash2, CheckCircle2 } from 'lucide-react';
import { PostComment } from '../types';

interface CommentsSectionProps {
  materialId: string;
  comments: PostComment[];
  onAddComment: (comment: PostComment) => void;
  onDeleteComment?: (commentId: string) => void;
  isTeacherAuthenticated?: boolean;
}

export function CommentsSection({
  materialId,
  comments,
  onAddComment,
  onDeleteComment,
  isTeacherAuthenticated = false,
}: CommentsSectionProps) {
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  // Filter comments for this material
  const materialComments = comments.filter((c) => c.materialId === materialId);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const finalAuthor = isTeacherAuthenticated
      ? 'Prof. Isaque Rocha'
      : authorName.trim() || 'Estudante';

    const newComment: PostComment = {
      id: `comm-${Date.now()}`,
      materialId,
      authorName: finalAuthor,
      content: content.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isTeacher: isTeacherAuthenticated,
    };

    onAddComment(newComment);
    setContent('');
    if (!isTeacherAuthenticated) {
      // Keep name for convenience
    }
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 3000);
  };

  return (
    <div className="border-t border-slate-200 pt-6 mt-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-['Outfit']">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span>Comentários & Dúvidas</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {materialComments.length}
          </span>
        </h4>
        <span className="text-xs text-slate-400">
          Espaço aberto para dúvidas e reflexões
        </span>
      </div>

      {/* Comment Submission Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Seu Nome ou Turma:
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={isTeacherAuthenticated ? 'Prof. Isaque Rocha' : 'Ex: Lucas Silva (1º Ano B)'}
              disabled={isTeacherAuthenticated}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-indigo-900 font-medium"
            />
          </div>
          {isTeacherAuthenticated && (
            <span className="self-end sm:self-center text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              Modo Autor / Professor
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Comentário ou Dúvida sobre o Conteúdo:
          </label>
          <textarea
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva sua pergunta para o professor ou observação sobre este material..."
            required
            className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-slate-400">
            Os comentários ficam visíveis para todos os estudantes do blog.
          </p>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publicar Comentário</span>
          </button>
        </div>

        {justSubmitted && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Seu comentário foi publicado com sucesso no tópico!</span>
          </div>
        )}
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {materialComments.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-3 text-center">
            Nenhum comentário neste tópico ainda. Seja o primeiro a perguntar ou comentar!
          </p>
        ) : (
          materialComments.map((comm) => (
            <div
              key={comm.id}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                comm.isTeacher
                  ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-200/50'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      comm.isTeacher
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {comm.isTeacher ? 'IR' : comm.authorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                      {comm.authorName}
                      {comm.isTeacher && (
                        <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded-sm">
                          Professor / Autor
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {comm.createdAt}
                    </span>
                  </div>
                </div>

                {isTeacherAuthenticated && onDeleteComment && (
                  <button
                    onClick={() => onDeleteComment(comm.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Excluir comentário (Apenas professor)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 pl-9 leading-relaxed whitespace-pre-line">
                {comm.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

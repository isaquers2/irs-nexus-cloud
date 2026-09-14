import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Video, 
  Zap, 
  FileCheck2, 
  Plus, 
  Trash2, 
  Mail, 
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Code,
  Globe,
  Maximize2,
  FileCode
} from 'lucide-react';
import { StudyMaterial, SubjectType, GradeLevel, ContentType, QuizQuestion } from '../types';

interface AddContentModalProps {
  onClose: () => void;
  onSaveMaterial: (material: StudyMaterial, sendEmailNotification: boolean) => void;
}

export function AddContentModal({ onClose, onSaveMaterial }: AddContentModalProps) {
  const [subject, setSubject] = useState<SubjectType>('matematica');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('medio');
  const [contentType, setContentType] = useState<ContentType>('document');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  // Document state
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileFormat, setFileFormat] = useState<'pdf' | 'docx'>('pdf');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video state
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('');

  // Google Forms state
  const [googleFormsUrl, setGoogleFormsUrl] = useState('');

  // HTML / Iframe Simulation state
  const [htmlMode, setHtmlMode] = useState<'iframe' | 'file' | 'code'>('iframe');
  const [embedCode, setEmbedCode] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [htmlFileName, setHtmlFileName] = useState('');
  const [htmlFileSize, setHtmlFileSize] = useState('');
  const htmlFileInputRef = useRef<HTMLInputElement>(null);

  // Quiz questions state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q1',
      question: 'Exemplo: Qual é o resultado desta operação ou conceito?',
      options: ['Alternativa A', 'Alternativa B (Correta)', 'Alternativa C', 'Alternativa D'],
      correctIndex: 1,
      explanation: 'Explicação detalhada: Aqui o aluno vê por que a resposta é a correta em tempo real!',
      points: 25
    }
  ]);

  // Email notify toggle
  const [notifyStudents, setNotifyStudents] = useState(true);

  // File selection handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      const isDoc = file.name.endsWith('.docx') || file.name.endsWith('.doc');
      setFileFormat(isDoc ? 'docx' : 'pdf');
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
    }
  };

  // HTML file selection handler (reads the HTML file directly as text)
  const handleHtmlFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHtmlFileName(file.name);
      setHtmlFileSize(`${(file.size / 1024).toFixed(1)} KB`);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        if (text) {
          setHtmlContent(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      points: 25
    };
    setQuizQuestions([...quizQuestions, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (quizQuestions.length <= 1) return;
    setQuizQuestions(quizQuestions.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    const updated = [...quizQuestions];
    updated[idx].question = text;
    setQuizQuestions(updated);
  };

  const handleOptionTextChange = (qIdx: number, optIdx: number, text: string) => {
    const updated = [...quizQuestions];
    updated[qIdx].options[optIdx] = text;
    setQuizQuestions(updated);
  };

  const handleCorrectIndexChange = (qIdx: number, optIdx: number) => {
    const updated = [...quizQuestions];
    updated[qIdx].correctIndex = optIdx;
    setQuizQuestions(updated);
  };

  const handleExplanationChange = (qIdx: number, explanation: string) => {
    const updated = [...quizQuestions];
    updated[qIdx].explanation = explanation;
    setQuizQuestions(updated);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const newMaterial: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Material de apoio didático preparado pelo Prof. Isaque Rocha.',
      subject,
      gradeLevel,
      contentType,
      fileName: contentType === 'document' 
        ? (fileName || `${title.replace(/\s+/g, '_')}.${fileFormat}`) 
        : contentType === 'html_embed' && htmlFileName ? htmlFileName : undefined,
      fileSize: contentType === 'document' ? (fileSize || '1.5 MB') : contentType === 'html_embed' && htmlFileSize ? htmlFileSize : undefined,
      fileFormat: contentType === 'document' ? fileFormat : contentType === 'html_embed' ? 'html' : undefined,
      videoUrl: contentType === 'video' ? (videoUrl || 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ') : undefined,
      videoDuration: contentType === 'video' ? (videoDuration || '15:00 min') : undefined,
      googleFormsUrl: contentType === 'google_forms' ? (googleFormsUrl || 'https://docs.google.com/forms/') : undefined,
      htmlContent: contentType === 'html_embed' ? htmlContent : undefined,
      embedCode: contentType === 'html_embed' ? embedCode.trim() : undefined,
      quizQuestions: contentType === 'interactive_quiz' ? quizQuestions : undefined,
      dateAdded: new Date().toISOString().slice(0, 10),
      viewsCount: 1,
      completionsCount: 0,
      tags: tags.length > 0 ? tags : ['Conteúdo Novo', subject],
      isImportant: true
    };

    onSaveMaterial(newMaterial, notifyStudents);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              IRS Nexus Cloud • Modo Autor do Professor
            </span>
            <h2 className="text-lg font-bold font-['Outfit']">
              Publicar Novo Tópico, Arquivo ou Link no Blog
            </h2>
          </div>
          <button
            id="btn-close-add-modal"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Format / Content Type Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Tipo de Conteúdo / Publicação
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { id: 'document', label: 'Apostila (.PDF/.DOCX)', icon: FileText, color: 'indigo' },
                { id: 'video', label: 'Videoaula / Link', icon: Video, color: 'rose' },
                { id: 'html_embed', label: 'Simulação HTML / Iframe', icon: Code, color: 'emerald' },
                { id: 'interactive_quiz', label: 'Quiz / Desafio', icon: Zap, color: 'amber' },
                { id: 'google_forms', label: 'Google Forms', icon: FileCheck2, color: 'purple' },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = contentType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setContentType(t.id as ContentType)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-xs leading-tight">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discipline & Grade Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Disciplina
              </label>
              <select
                id="select-material-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectType)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="matematica">Matemática</option>
                <option value="biologia">Biologia</option>
                <option value="fisica">Física</option>
                <option value="workspace">Google Workspace (Docs, Sheets, Forms)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Nível Escolar
              </label>
              <select
                id="select-material-grade"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="fundamental">Ensino Fundamental</option>
                <option value="medio">Ensino Médio</option>
                <option value="todos">Todos os Níveis / Geral</option>
              </select>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Título do Material ou Atividade *
            </label>
            <input
              id="input-material-title"
              type="text"
              required
              placeholder="Ex: Apostila de Teorema de Pitágoras com Exercícios Resolvidos"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Instruções & Orientações Didáticas
            </label>
            <textarea
              id="textarea-material-desc"
              rows={3}
              placeholder="Descreva o conteúdo abordado, dicas de estudo e o que o estudante deve fazer..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* DYNAMIC FIELDS PER CONTENT TYPE */}

          {/* 1. DOCUMENT TYPE (.pdf / .docx) */}
          {contentType === 'document' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Upload de Arquivo (.PDF ou .DOCX)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFileFormat('pdf')}
                    className={`px-2 py-0.5 text-xs font-bold rounded-sm border ${
                      fileFormat === 'pdf' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-600'
                    }`}
                  >
                    .PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setFileFormat('docx')}
                    className={`px-2 py-0.5 text-xs font-bold rounded-sm border ${
                      fileFormat === 'docx' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600'
                    }`}
                  >
                    .DOCX
                  </button>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-white rounded-xl p-6 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">
                  {fileName ? fileName : 'Clique para selecionar o arquivo do seu computador'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Formatos aceitos: PDF ou Word (.docx). Tamanho configurado: {fileSize || 'Até 50 MB'}
                </p>
              </div>
            </div>
          )}

          {/* 2. VIDEO TYPE */}
          {contentType === 'video' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-rose-600" />
                Configuração da Videoaula
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Link do Vídeo (YouTube Embed ou URL)
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/embed/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Duração Estimada
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 14:30 min"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. HTML FILE / IFRAME SIMULATION TYPE */}
          {contentType === 'html_embed' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-emerald-700 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-emerald-600" />
                  Simulação Interativa / Código HTML & Iframe
                </span>
                <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setHtmlMode('iframe')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                      htmlMode === 'iframe' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Embutir &lt;iframe&gt; / Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setHtmlMode('file')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                      htmlMode === 'file' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Upload Arquivo .HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setHtmlMode('code')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                      htmlMode === 'code' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Código HTML Direto
                  </button>
                </div>
              </div>

              {/* Sub-mode 1: Iframe embed / PhET link */}
              {htmlMode === 'iframe' && (
                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Código &lt;iframe&gt; ou URL de Simulação (ex: PhET Colorado):
                    </label>
                    <textarea
                      rows={3}
                      placeholder='Ex: <iframe src="https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_all.html" width="800" height="600" allowfullscreen></iframe>'
                      value={embedCode}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEmbedCode(val);
                        // Auto-fill title if empty and PhET is detected
                        if (!title && val.includes('phet.colorado.edu')) {
                          setTitle('Simulação Interativa PhET');
                        }
                      }}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* PhET quick helper buttons */}
                  <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-3 text-xs text-emerald-900 space-y-1.5">
                    <p className="font-semibold flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      Dica para simulações PhET Colorado:
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      Você pode colar o código HTML completo fornecido pelo botão "Incorporar/Embed" do site PhET ou colar diretamente o link que termina em <code>.html</code>.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-emerald-700 font-bold self-center">Exemplos rápidos:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEmbedCode('<iframe src="https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_all.html" width="800" height="600" allowfullscreen></iframe>');
                          if (!title) setTitle('Simulação PhET: Movimento de Projétil');
                          setSubject('fisica');
                        }}
                        className="px-2 py-0.5 text-[11px] bg-white text-emerald-800 border border-emerald-300 rounded-md hover:bg-emerald-100 font-medium cursor-pointer"
                      >
                        PhET: Movimento de Projétil (Física)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmbedCode('<iframe src="https://phet.colorado.edu/sims/html/natural-selection/latest/natural-selection_all.html" width="800" height="600" allowfullscreen></iframe>');
                          if (!title) setTitle('Simulação PhET: Seleção Natural');
                          setSubject('biologia');
                        }}
                        className="px-2 py-0.5 text-[11px] bg-white text-emerald-800 border border-emerald-300 rounded-md hover:bg-emerald-100 font-medium cursor-pointer"
                      >
                        PhET: Seleção Natural (Biologia)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmbedCode('<iframe src="https://phet.colorado.edu/sims/html/graphing-lines/latest/graphing-lines_all.html" width="800" height="600" allowfullscreen></iframe>');
                          if (!title) setTitle('Simulação PhET: Gráficos de Funções Lineares');
                          setSubject('matematica');
                        }}
                        className="px-2 py-0.5 text-[11px] bg-white text-emerald-800 border border-emerald-300 rounded-md hover:bg-emerald-100 font-medium cursor-pointer"
                      >
                        PhET: Gráficos Lineares (Matemática)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-mode 2: HTML File upload */}
              {htmlMode === 'file' && (
                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                  <input
                    type="file"
                    ref={htmlFileInputRef}
                    accept=".html,.htm"
                    onChange={handleHtmlFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => htmlFileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/20 rounded-xl p-6 text-center cursor-pointer transition-colors"
                  >
                    <FileCode className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800">
                      {htmlFileName ? htmlFileName : 'Clique para selecionar o arquivo .HTML do seu computador'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      O arquivo .HTML será carregado e executado diretamente na página do blog para os estudantes interagirem!
                    </p>
                    {htmlFileSize && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
                        Tamanho: {htmlFileSize}
                      </span>
                    )}
                  </div>
                  {htmlContent && (
                    <div className="text-xs text-slate-500">
                      <span className="text-emerald-700 font-bold">✓ Arquivo carregado com sucesso</span> ({htmlContent.length} caracteres prontos para execução em iframe seguro).
                    </div>
                  )}
                </div>
              )}

              {/* Sub-mode 3: Raw HTML Code */}
              {htmlMode === 'code' && (
                <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700">
                    Cole o Código HTML Completo (com tags &lt;html&gt;, &lt;script&gt;, &lt;canvas&gt;, etc.):
                  </label>
                  <textarea
                    rows={6}
                    placeholder="<!DOCTYPE html><html><head>...</head><body>...</body></html>"
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    O código será isolado em um contêiner interativo (sandbox), permitindo animações, gráficos, simulações em canvas ou scripts didáticos.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 4. GOOGLE FORMS TYPE */}
          {contentType === 'google_forms' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold uppercase text-purple-700 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                Link do Google Forms
              </span>
              <p className="text-xs text-slate-500">
                Cole o link de visualização ou incorporação do formulário Google Forms:
              </p>
              <input
                type="text"
                placeholder="https://docs.google.com/forms/d/e/.../viewform"
                value={googleFormsUrl}
                onChange={(e) => setGoogleFormsUrl(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* 4. INTERACTIVE QUIZ BUILDER */}
          {contentType === 'interactive_quiz' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-amber-700 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-amber-500" />
                    Perguntas com Feedback Automático Didático
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Os alunos receberão a explicação em tempo real imediatamente após responder.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Questão</span>
                </button>
              </div>

              {quizQuestions.map((q, qIdx) => (
                <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700">
                      Questão {qIdx + 1} ({q.points} pts)
                    </span>
                    {quizQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-xs text-rose-500 hover:text-rose-700"
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Enunciado da pergunta..."
                    value={q.question}
                    onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />

                  {/* Options */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Alternativas (Marque o círculo da resposta correta):
                    </label>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctIndex === oIdx}
                          onChange={() => handleCorrectIndexChange(qIdx, oIdx)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-500 w-4">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <input
                          type="text"
                          placeholder={`Opção ${String.fromCharCode(65 + oIdx)}...`}
                          value={opt}
                          onChange={(e) => handleOptionTextChange(qIdx, oIdx, e.target.value)}
                          className={`flex-1 px-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                            q.correctIndex === oIdx 
                              ? 'border-emerald-400 ring-1 ring-emerald-300 bg-emerald-50/20' 
                              : 'border-slate-200'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Feedback Explanation */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      💡 Explicação Didática (Feedback Automático após a resposta):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Explique o passo a passo da resolução ou por que esta alternativa é a correta..."
                      value={q.explanation}
                      onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Tags / Palavras-chave (separadas por vírgula)
            </label>
            <input
              type="text"
              placeholder="Ex: Álgebra, Triângulos, Pitágoras, Exercícios"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email Notification Toggle */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-950">
                  Notificar estudantes por e-mail automaticamente
                </p>
                <p className="text-xs text-indigo-700">
                  Dispara um comunicado convidando os alunos a acessarem o portal sem precisar enviar pelo WhatsApp.
                </p>
              </div>
            </div>
            <input
              id="checkbox-notify-students"
              type="checkbox"
              checked={notifyStudents}
              onChange={(e) => setNotifyStudents(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              id="btn-submit-new-material"
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar e Publicar</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

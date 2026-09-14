import { useState, useMemo, MouseEvent } from 'react';
import { 
  Search, 
  FileText, 
  Video, 
  Zap, 
  FileCheck2, 
  Clock, 
  Download, 
  ExternalLink, 
  BookOpen, 
  Dna, 
  Calculator, 
  LayoutGrid, 
  MessageSquare, 
  Trash2, 
  Calendar, 
  User, 
  GraduationCap,
  Code
} from 'lucide-react';
import { StudyMaterial, SubjectType, GradeLevel, ContentType, PostComment } from '../types';
import { formatSubjectName, formatGradeName } from '../utils/exportReports';

interface StudentViewProps {
  materials: StudyMaterial[];
  comments: PostComment[];
  isTeacherAuthenticated: boolean;
  onOpenMaterial: (material: StudyMaterial) => void;
  onOpenComments: (material: StudyMaterial) => void;
  onDeleteMaterial?: (materialId: string) => void;
}

export function StudentView({
  materials,
  comments,
  isTeacherAuthenticated,
  onOpenMaterial,
  onOpenComments,
  onDeleteMaterial,
}: StudentViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'all'>('all');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      // Subject filter
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) return false;
      // Grade filter
      if (selectedGrade !== 'all' && item.gradeLevel !== selectedGrade && item.gradeLevel !== 'todos') return false;
      // Type filter
      if (selectedType !== 'all' && item.contentType !== selectedType) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }
      return true;
    });
  }, [materials, selectedSubject, selectedGrade, selectedType, searchQuery]);

  // Subject counters
  const subjectCounts = useMemo(() => {
    return {
      matematica: materials.filter(m => m.subject === 'matematica').length,
      biologia: materials.filter(m => m.subject === 'biologia').length,
      fisica: materials.filter(m => m.subject === 'fisica').length,
      workspace: materials.filter(m => m.subject === 'workspace').length,
    };
  }, [materials]);

  const getSubjectColor = (subject: SubjectType) => {
    switch (subject) {
      case 'matematica':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
          chip: 'hover:border-indigo-400',
        };
      case 'biologia':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
          chip: 'hover:border-emerald-400',
        };
      case 'fisica':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-200',
          badge: 'bg-amber-50 text-amber-800 border border-amber-200',
          chip: 'hover:border-amber-400',
        };
      case 'workspace':
        return {
          bg: 'bg-sky-50',
          text: 'text-sky-700',
          border: 'border-sky-200',
          badge: 'bg-sky-50 text-sky-700 border border-sky-200',
          chip: 'hover:border-sky-400',
        };
    }
  };

  const getTypeIcon = (type: ContentType, isDocx?: boolean) => {
    switch (type) {
      case 'document':
        return <FileText className={`w-3.5 h-3.5 ${isDocx ? 'text-blue-600' : 'text-rose-600'}`} />;
      case 'video':
        return <Video className="w-3.5 h-3.5 text-red-500" />;
      case 'interactive_quiz':
        return <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />;
      case 'google_forms':
        return <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />;
      case 'html_embed':
        return <Code className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  const getTypeName = (type: ContentType, isDocx?: boolean) => {
    switch (type) {
      case 'document':
        return isDocx ? 'Apostila Word (.docx)' : 'Apostila (.pdf)';
      case 'video':
        return 'Videoaula';
      case 'interactive_quiz':
        return 'Questionário / Quiz';
      case 'google_forms':
        return 'Google Forms';
      case 'html_embed':
        return 'Simulação / Iframe';
    }
  };

  const handleDirectDownload = (material: StudyMaterial, e: MouseEvent) => {
    e.stopPropagation();
    const content = `=====================================================
IRS NEXUS CLOUD - MATERIAL DE ESTUDO & APOIO ESCOLAR
Prof. Isaque Rocha
Disciplina: ${material.subject.toUpperCase()} | Nível: ${material.gradeLevel.toUpperCase()}
Título: ${material.title}
Data da Publicação: ${material.dateAdded}
=====================================================

RESUMO PEDAGÓGICO:
${material.description}

TÓPICOS TRABALHADOS:
${material.tags.map(t => `• ${t}`).join('\n')}

ORIENTAÇÕES DE ESTUDO DO PROFESSOR:
1. Faça a leitura atenta das seções teóricas.
2. Resolva os exercícios propostos sem consultar o gabarito previamente.
3. Acesse os questionários interativos no Blog IRS Nexus Cloud para tirar dúvidas nos comentários.
4. Bons estudos!

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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Editorial Blog Header (No gamified box) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Blog Pedagógico
              </span>
              <span className="text-xs text-slate-400">
                • Atualizado com novos conteúdos e materiais didáticos
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-['Outfit'] tracking-tight">
              IRS Nexus Cloud
            </h1>
            
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Bem-vindo ao espaço didático do <strong>Prof. Isaque Rocha</strong>. Aqui você encontra apostilas em <strong>.PDF</strong> e <strong>.DOCX</strong> para baixar direto sem lotar a memória do seu celular, videoaulas explicativas, links úteis e atividades. Deixe suas perguntas e comentários nas postagens para tirar dúvidas!
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Autor: <strong>Prof. Isaque Rocha</strong></span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Matemática • Biologia • Física • Google Workspace</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span>Acesso público e gratuito para consulta e comentários</span>
              </div>
            </div>
          </div>

          {/* Quick Category Stats */}
          <div className="hidden lg:flex flex-col gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200/80 shrink-0 w-60">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Categorias do Blog:
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Matemática:</span>
                <span className="font-bold text-indigo-700">{subjectCounts.matematica} posts</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biologia:</span>
                <span className="font-bold text-emerald-700">{subjectCounts.biologia} posts</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Física:</span>
                <span className="font-bold text-amber-700">{subjectCounts.fisica} posts</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Google Workspace:</span>
                <span className="font-bold text-sky-700">{subjectCounts.workspace} posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills (Blog Navigation) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Matemática */}
        <button
          id="btn-filter-subject-matematica"
          onClick={() => setSelectedSubject(selectedSubject === 'matematica' ? 'all' : 'matematica')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedSubject === 'matematica'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
              : 'bg-white hover:border-indigo-300 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${selectedSubject === 'matematica' ? 'bg-white/20' : 'bg-indigo-50 text-indigo-700'}`}>
              <Calculator className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              selectedSubject === 'matematica' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
            }`}>
              {subjectCounts.matematica} posts
            </span>
          </div>
          <p className="font-extrabold text-sm sm:text-base font-['Outfit']">Matemática</p>
          <p className={`text-xs mt-0.5 ${selectedSubject === 'matematica' ? 'text-indigo-100' : 'text-slate-500'}`}>
            Fundamental & Médio
          </p>
        </button>

        {/* Biologia */}
        <button
          id="btn-filter-subject-biologia"
          onClick={() => setSelectedSubject(selectedSubject === 'biologia' ? 'all' : 'biologia')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedSubject === 'biologia'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
              : 'bg-white hover:border-emerald-300 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${selectedSubject === 'biologia' ? 'bg-white/20' : 'bg-emerald-50 text-emerald-700'}`}>
              <Dna className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              selectedSubject === 'biologia' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {subjectCounts.biologia} posts
            </span>
          </div>
          <p className="font-extrabold text-sm sm:text-base font-['Outfit']">Biologia</p>
          <p className={`text-xs mt-0.5 ${selectedSubject === 'biologia' ? 'text-emerald-100' : 'text-slate-500'}`}>
            Genética & Citologia
          </p>
        </button>

        {/* Física */}
        <button
          id="btn-filter-subject-fisica"
          onClick={() => setSelectedSubject(selectedSubject === 'fisica' ? 'all' : 'fisica')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedSubject === 'fisica'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
              : 'bg-white hover:border-amber-300 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${selectedSubject === 'fisica' ? 'bg-white/20' : 'bg-amber-50 text-amber-700'}`}>
              <Zap className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              selectedSubject === 'fisica' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              {subjectCounts.fisica} posts
            </span>
          </div>
          <p className="font-extrabold text-sm sm:text-base font-['Outfit']">Física</p>
          <p className={`text-xs mt-0.5 ${selectedSubject === 'fisica' ? 'text-amber-100' : 'text-slate-500'}`}>
            Mecânica & Ondas
          </p>
        </button>

        {/* Google Workspace */}
        <button
          id="btn-filter-subject-workspace"
          onClick={() => setSelectedSubject(selectedSubject === 'workspace' ? 'all' : 'workspace')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedSubject === 'workspace'
              ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300'
              : 'bg-white hover:border-sky-300 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${selectedSubject === 'workspace' ? 'bg-white/20' : 'bg-sky-50 text-sky-700'}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              selectedSubject === 'workspace' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-800'
            }`}>
              {subjectCounts.workspace} posts
            </span>
          </div>
          <p className="font-extrabold text-sm sm:text-base font-['Outfit']">Workspace</p>
          <p className={`text-xs mt-0.5 ${selectedSubject === 'workspace' ? 'text-sky-100' : 'text-slate-500'}`}>
            Docs, Sheets & Forms
          </p>
        </button>
      </div>

      {/* Filter Bar (Search + Grade + Content Type) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-materials"
              type="text"
              placeholder="Buscar por tópico, palavra-chave ou apostila (ex: Pitágoras, Genética, Sheets)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Nível:
            </span>
            {(['all', 'fundamental', 'medio'] as const).map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {grade === 'all' ? 'Todos os Níveis' : grade === 'fundamental' ? 'Ensino Fundamental' : 'Ensino Médio'}
              </button>
            ))}
          </div>

        </div>

        {/* Content Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Formato:
          </span>
          {[
            { id: 'all', label: 'Todos os Formatos', icon: LayoutGrid },
            { id: 'html_embed', label: 'Simulações / Iframe', icon: Code },
            { id: 'document', label: 'Apostilas (.PDF / .DOCX)', icon: FileText },
            { id: 'video', label: 'Videoaulas', icon: Video },
            { id: 'interactive_quiz', label: 'Quizzes / Desafios', icon: Zap },
            { id: 'google_forms', label: 'Google Forms', icon: FileCheck2 },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedType(item.id as ContentType | 'all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Blog Articles Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
            <span>Postagens do Blog</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {filteredMaterials.length} publicações
            </span>
          </h2>
          {selectedSubject !== 'all' && (
            <button
              onClick={() => setSelectedSubject('all')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
            >
              Mostrar todas as disciplinas
            </button>
          )}
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Nenhuma publicação encontrada</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Tente redefinir os filtros ou buscar por outro termo.
            </p>
            <button
              onClick={() => {
                setSelectedSubject('all');
                setSelectedGrade('all');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl cursor-pointer"
            >
              Redefinir Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((item) => {
              const colors = getSubjectColor(item.subject);
              const isDocx = item.fileFormat === 'docx' || item.fileName?.endsWith('.docx');
              const itemCommentsCount = comments.filter((c) => c.materialId === item.id).length;

              return (
                <article
                  key={item.id}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group hover:border-indigo-200"
                >
                  <div className="p-5 sm:p-6">
                    
                    {/* Editorial Meta Bar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${colors.badge}`}>
                        {formatSubjectName(item.subject)}
                      </span>

                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                        {formatGradeName(item.gradeLevel)}
                      </span>
                    </div>

                    {/* Date and Author */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.dateAdded}
                      </span>
                      <span>•</span>
                      <span>Por Prof. Isaque Rocha</span>
                    </div>

                    {/* Content Type Marker */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
                      {getTypeIcon(item.contentType, isDocx)}
                      <span>{getTypeName(item.contentType, isDocx)}</span>
                      {item.fileSize && <span className="text-slate-400">• {item.fileSize}</span>}
                      {item.videoDuration && <span className="text-slate-400">• {item.videoDuration}</span>}
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => onOpenMaterial(item)}
                      className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-sm border border-slate-200/60">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    
                    {/* Comments Button (Student & Teacher can see/add) */}
                    <button
                      id={`btn-comments-${item.id}`}
                      onClick={() => onOpenComments(item)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-2 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="Ver e fazer comentários nesta postagem"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{itemCommentsCount} comentários</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Direct Download Button for Documents */}
                      {item.contentType === 'document' && (
                        <button
                          id={`btn-download-card-${item.id}`}
                          onClick={(e) => handleDirectDownload(item, e)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-700 bg-white hover:bg-indigo-50 border border-slate-200 transition-all cursor-pointer"
                          title="Baixar arquivo (.pdf ou .docx) diretamente para o seu aparelho"
                        >
                          <Download className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="hidden sm:inline">Baixar</span>
                        </button>
                      )}

                      {/* Main Action Button */}
                      <button
                        id={`btn-open-material-${item.id}`}
                        onClick={() => onOpenMaterial(item)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                          item.contentType === 'interactive_quiz'
                            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-xs'
                            : item.contentType === 'video'
                            ? 'bg-rose-600 hover:bg-rose-700 shadow-xs'
                            : item.contentType === 'google_forms'
                            ? 'bg-purple-600 hover:bg-purple-700 shadow-xs'
                            : item.contentType === 'html_embed'
                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-xs'
                            : 'bg-slate-900 hover:bg-slate-800 shadow-xs'
                        }`}
                      >
                        {item.contentType === 'interactive_quiz' && (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                            <span>Acessar</span>
                          </>
                        )}
                        {item.contentType === 'video' && (
                          <>
                            <Video className="w-3.5 h-3.5" />
                            <span>Assistir</span>
                          </>
                        )}
                        {item.contentType === 'document' && (
                          <>
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Ler Artigo</span>
                          </>
                        )}
                        {item.contentType === 'google_forms' && (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Forms</span>
                          </>
                        )}
                        {item.contentType === 'html_embed' && (
                          <>
                            <Code className="w-3.5 h-3.5" />
                            <span>Simulação</span>
                          </>
                        )}
                      </button>

                      {/* Delete post button (ONLY visible when Teacher is Authenticated) */}
                      {isTeacherAuthenticated && onDeleteMaterial && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza de que deseja remover a postagem "${item.title}"?`)) {
                              onDeleteMaterial(item.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir postagem (Apenas no Modo Autor do Professor)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>

                </article>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

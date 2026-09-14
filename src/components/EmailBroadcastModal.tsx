import { useState, FormEvent } from 'react';
import { 
  X, 
  Send, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  FileText, 
  ExternalLink,
  Eye,
  Info
} from 'lucide-react';
import { EmailNotification, SubjectType, GradeLevel } from '../types';
import { formatSubjectName } from '../utils/exportReports';

interface EmailBroadcastModalProps {
  onClose: () => void;
  onSendNotification: (notification: EmailNotification, isTestOnly?: boolean) => void;
  teacherEmail?: string;
}

export function EmailBroadcastModal({
  onClose,
  onSendNotification,
  teacherEmail = 'isaque.rocha.irs@gmail.com'
}: EmailBroadcastModalProps) {
  const [subject, setSubject] = useState('📚 Novo Material Disponível: Exercícios & Guia Prático no IRS Nexus Cloud');
  const [preheader, setPreheader] = useState('Confira o novo material de estudo sem sobrecarregar seu dispositivo!');
  const [content, setContent] = useState(
    'Olá, estudante!\n\nDisponibilizei um novo material didático em formato .PDF e .DOCX no nosso portal IRS Nexus Cloud. Todos os arquivos e exercícios estão centralizados na plataforma para que você acesse quando quiser, economizando memória no seu celular e sem acumular mensagens no WhatsApp.\n\nAcessem também as atividades gamificadas para testar o aprendizado com feedback em tempo real!'
  );
  const [targetSubject, setTargetSubject] = useState<SubjectType | 'all'>('all');
  const [targetGrade, setTargetGrade] = useState<GradeLevel | 'all'>('all');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [testSentSuccess, setTestSentSuccess] = useState(false);

  // Quick template loader
  const handleApplyTemplate = (type: 'new_material' | 'quiz_alert' | 'workspace_tips' | 'weekly_digest') => {
    switch (type) {
      case 'new_material':
        setSubject('📚 Nova Apostila Disponível (.pdf/.docx) no IRS Nexus Cloud');
        setPreheader('Baixe o material de apoio sem ocupar a memória do seu WhatsApp!');
        setContent(
          'Olá, estudante!\n\nApostila nova postada no portal IRS Nexus Cloud! Inclui resumo teórico, esquemas visuais e exercícios resolvidos passo a passo. Acesse o portal para estudar e registrar sua presença nas atividades.'
        );
        break;
      case 'quiz_alert':
        setSubject('⚡ Desafio Gamificado Aberto: Teste com Feedback Automático');
        setPreheader('Receba respostas imediatas com dicas do Prof. Isaque a cada questão!');
        setContent(
          'Olá!\n\nO quiz interativo já está ativo na plataforma. Cada resposta certa concede XP e você visualiza a explicação didática imediatamente caso cometa algum equívoco. Venha garantir seus pontos na classificação geral!'
        );
        break;
      case 'workspace_tips':
        setSubject('💻 Dicas Práticas de Google Workspace: Docs, Sheets & Forms');
        setPreheader('Novos tutoriais e atalhos rápidos para produtividade acadêmica.');
        setContent(
          'Caros estudantes!\n\nAcabei de publicar os novos modelos de documentos ABNT e planilhas com fórmulas científicas no Google Workspace. Confiram os atalhos e apliquem diretamente nos seus trabalhos escolares!'
        );
        break;
      case 'weekly_digest':
        setSubject('🎯 Resumo Semanal de Estudos: Mantenha seu Ritmo!');
        setPreheader('Acompanhe suas atividades concluídas e não perca os prazos.');
        setContent(
          'Olá!\n\nPassando para lembrar que todos os materiais de apoio e videoaulas desta semana já estão organizados no IRS Nexus Cloud. Dedique 20 minutos hoje para revisar os conteúdos e responder aos questionários!'
        );
        break;
    }
  };

  const handleSendBroadcast = (e: FormEvent) => {
    e.preventDefault();
    const newNotif: EmailNotification = {
      id: `notif-${Date.now()}`,
      subject,
      preheader,
      content,
      targetSubject,
      targetGrade,
      recipientsCount: targetGrade === 'all' ? 48 : 24,
      sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      senderName: 'Prof. Isaque Rocha',
      status: 'sent'
    };

    onSendNotification(newNotif, false);
    setSentSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleSendTestToTeacher = () => {
    const testNotif: EmailNotification = {
      id: `test-${Date.now()}`,
      subject: `[TESTE] ${subject}`,
      preheader,
      content,
      targetSubject,
      targetGrade,
      recipientsCount: 1,
      sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      senderName: 'Prof. Isaque Rocha (Teste)',
      status: 'sent'
    };

    onSendNotification(testNotif, true);
    setTestSentSuccess(true);
    setTimeout(() => setTestSentSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-indigo-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Comunicação Pedagógica
              </span>
              <h2 className="text-lg font-bold font-['Outfit']">
                Disparador de Notificações por E-mail
              </h2>
            </div>
          </div>
          <button
            id="btn-close-email-modal"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split into Composer and Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto flex-1">
          
          {/* Composer Column (7 cols) */}
          <form onSubmit={handleSendBroadcast} className="lg:col-span-7 p-6 space-y-4 border-r border-slate-100">
            
            {/* Template Presets */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Modelos Rápidos Pré-configurados
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('new_material')}
                  className="p-2 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                >
                  📄 Novo Material (.PDF/.DOCX)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('quiz_alert')}
                  className="p-2 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                >
                  ⚡ Desafio Gamificado / Quiz
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('workspace_tips')}
                  className="p-2 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                >
                  💻 Dicas de Google Workspace
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('weekly_digest')}
                  className="p-2 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                >
                  🎯 Lembrete Semanal de Estudos
                </button>
              </div>
            </div>

            {/* Target Audience */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Público / Disciplina
                </label>
                <select
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value as SubjectType | 'all')}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todas as Disciplinas</option>
                  <option value="matematica">Alunos de Matemática</option>
                  <option value="biologia">Alunos de Biologia</option>
                  <option value="fisica">Alunos de Física</option>
                  <option value="workspace">Alunos de Google Workspace</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nível / Turma
                </label>
                <select
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value as GradeLevel | 'all')}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todos os Estudantes</option>
                  <option value="fundamental">Ensino Fundamental</option>
                  <option value="medio">Ensino Médio</option>
                </select>
              </div>
            </div>

            {/* Subject Line */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Assunto do E-mail
              </label>
              <input
                id="input-email-subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>

            {/* Preheader / Subtitle */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Texto de Prévia (Preheader na caixa de entrada)
              </label>
              <input
                type="text"
                value={preheader}
                onChange={(e) => setPreheader(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Content Body */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Mensagem do Professor
              </label>
              <textarea
                id="textarea-email-content"
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />
            </div>

            {/* Test Email to Teacher button */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-600">
                <span className="font-bold">E-mail do Professor:</span>
                <span className="block text-slate-500">{teacherEmail}</span>
              </div>
              <button
                type="button"
                id="btn-send-test-email"
                onClick={handleSendTestToTeacher}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold rounded-lg transition-colors cursor-pointer text-slate-700"
              >
                {testSentSuccess ? '✓ Enviado!' : 'Enviar Teste para Mim'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                id="btn-broadcast-email-submit"
                type="submit"
                disabled={sentSuccess}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all cursor-pointer ${
                  sentSuccess ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {sentSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Disparo Realizado!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Disparar para Alunos</span>
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Live Email Preview Column (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                <Eye className="w-3.5 h-3.5" />
                <span>Prévia do E-mail (Gmail / Workspace)</span>
              </div>

              {/* Mock Inbox Envelope */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden text-xs">
                
                {/* Email Header bar */}
                <div className="bg-slate-50 p-3 border-b border-slate-100">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                    <span>IRS Nexus Cloud Mail Delivery</span>
                    <span>Agora</span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs truncate">
                    {subject || 'Sem assunto'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    De: Prof. Isaque Rocha &lt;{teacherEmail}&gt;
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Para: Alunos de {targetSubject === 'all' ? 'Todas as Matérias' : formatSubjectName(targetSubject)}
                  </p>
                </div>

                {/* Email Body */}
                <div className="p-4 space-y-3">
                  <div className="border-b border-indigo-100 pb-2 flex items-center justify-between">
                    <span className="font-extrabold text-sm text-indigo-950 font-['Outfit']">
                      IRS Nexus Cloud
                    </span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                      Notificação de Aula
                    </span>
                  </div>

                  <p className="text-slate-700 whitespace-pre-line leading-relaxed text-xs">
                    {content}
                  </p>

                  {/* Call to action button */}
                  <div className="py-2 text-center">
                    <div className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-xs">
                      Acessar Material no Portal
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                    <p>💡 Seus materiais ficam sempre disponíveis na nuvem para não ocupar a memória do seu smartphone.</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-4 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Esta notificação engaja seus alunos automaticamente com links diretos, eliminando a sobrecarga de mensagens no WhatsApp.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

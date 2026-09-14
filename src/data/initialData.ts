import { StudyMaterial, Student, ActivitySubmission, EmailNotification } from '../types';

export const INITIAL_MATERIALS: StudyMaterial[] = [
  {
    id: 'phet-01',
    title: 'Simulador PhET Interativo: Movimento de Projétil e Balística',
    description: 'Experimente na prática as trajetórias oblíquas de projéteis, variando massa, resistência do ar, ângulo de lançamento e gravidade com medição de alcance e tempo em tempo real.',
    subject: 'fisica',
    gradeLevel: 'medio',
    contentType: 'html_embed',
    embedCode: '<iframe src="https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_all.html" width="800" height="600" allowfullscreen></iframe>',
    dateAdded: '2026-09-12',
    viewsCount: 230,
    completionsCount: 145,
    tags: ['PhET Colorado', 'Cinemática', 'Laboratório Virtual', 'Gravidade'],
    isImportant: true,
  },
  {
    id: 'mat-01',
    title: 'Guia Completo: Funções Quadráticas e Parábolas no Cotidiano',
    description: 'Apostila detalhada com passo a passo para calcular raízes (Bhaskara), vértice da parábola, estudo de sinais e aplicações práticas em lançamentos oblíquos.',
    subject: 'matematica',
    gradeLevel: 'medio',
    contentType: 'document',
    fileName: 'Apostila_Funcoes_Quadraticas_Prof_Isaque.pdf',
    fileSize: '2.4 MB',
    fileFormat: 'pdf',
    fileUrl: '#',
    dateAdded: '2026-09-10',
    viewsCount: 142,
    completionsCount: 89,
    tags: ['Álgebra', 'Equações do 2º Grau', 'Geometria Analítica'],
    isImportant: true,
  },
  {
    id: 'mat-02',
    title: 'Desafio Gamificado: Teorema de Pitágoras e Trigonometria',
    description: 'Atividade interativa com cálculo de hipotenusa, catetos e relações no triângulo retângulo com feedback passo a passo imediato.',
    subject: 'matematica',
    gradeLevel: 'fundamental',
    contentType: 'interactive_quiz',
    dateAdded: '2026-09-08',
    viewsCount: 198,
    completionsCount: 112,
    tags: ['Geometria', 'Triângulos', 'Pitágoras'],
    quizQuestions: [
      {
        id: 'q1',
        question: 'Em um triângulo retângulo, os catetos medem 6 cm e 8 cm. Qual é a medida da hipotenusa?',
        options: ['9 cm', '10 cm', '12 cm', '14 cm'],
        correctIndex: 1,
        explanation: 'Aplicando Pitágoras: a² = b² + c² => a² = 6² + 8² = 36 + 64 = 100 => a = √100 = 10 cm.',
        points: 25
      },
      {
        id: 'q2',
        question: 'Se a hipotenusa de um triângulo retângulo mede 13 cm e um dos catetos mede 5 cm, quanto mede o outro cateto?',
        options: ['8 cm', '10 cm', '12 cm', '11 cm'],
        correctIndex: 2,
        explanation: '13² = 5² + c² => 169 = 25 + c² => c² = 144 => c = 12 cm.',
        points: 25
      },
      {
        id: 'q3',
        question: 'O Teorema de Pitágoras só é válido para qual tipo de triângulo?',
        options: ['Equilátero', 'Isósceles qualquer', 'Retângulo (com ângulo de 90°)', 'Obtusângulo'],
        correctIndex: 2,
        explanation: 'A relação métrica a² = b² + c² é estritamente definida para triângulos retângulos.',
        points: 25
      },
      {
        id: 'q4',
        question: 'Uma escada de 5 metros está encostada numa parede e sua base fica a 3 metros dela. A que altura ela alcança?',
        options: ['3.5 m', '4 metros', '4.2 m', '4.5 m'],
        correctIndex: 1,
        explanation: 'Hipotenusa = 5m, cateto adjacente = 3m. Altura = √(5² - 3²) = √(25 - 9) = √16 = 4 metros.',
        points: 25
      }
    ]
  },
  {
    id: 'mat-03',
    title: 'Videoaula Tutorial: Resolução Rápida de Equações com o Método Prático',
    description: 'Vídeo explicativo de 12 minutos ensinando truques mentais para resolver equações de 1º e 2º grau sem se perder nos sinais.',
    subject: 'matematica',
    gradeLevel: 'fundamental',
    contentType: 'video',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', // safe embed
    videoDuration: '12:45 min',
    dateAdded: '2026-09-05',
    viewsCount: 230,
    completionsCount: 95,
    tags: ['Videoaula', 'Álgebra', 'Dicas Rápidas']
  },
  {
    id: 'bio-01',
    title: 'Apostila Ilustrada: Estrutura Celular, Organelas e Membrana Plasmática',
    description: 'Material com esquemas em alta resolução comparando células procariontes, eucariontes animais e vegetais, e transporte ativo/passivo.',
    subject: 'biologia',
    gradeLevel: 'medio',
    contentType: 'document',
    fileName: 'Guia_Citologia_Organelas_Prof_Isaque.pdf',
    fileSize: '4.1 MB',
    fileFormat: 'pdf',
    fileUrl: '#',
    dateAdded: '2026-09-11',
    viewsCount: 165,
    completionsCount: 78,
    tags: ['Citologia', 'Células', 'Bioquímica'],
    isImportant: true
  },
  {
    id: 'bio-02',
    title: 'Quiz Gamificado: Genética Mendeliana e Hereditariedade',
    description: 'Teste seus conhecimentos sobre 1ª Lei de Mendel, dominância, alelos recessivos, genótipo e fenótipo.',
    subject: 'biologia',
    gradeLevel: 'medio',
    contentType: 'interactive_quiz',
    dateAdded: '2026-09-09',
    viewsCount: 140,
    completionsCount: 94,
    tags: ['Genética', 'Mendel', 'DNA'],
    quizQuestions: [
      {
        id: 'bq1',
        question: 'No cruzamento de dois indivíduos heterozigotos (Aa x Aa), qual a probabilidade de gerar um indivíduo recessivo (aa)?',
        options: ['100%', '50%', '25%', '75%'],
        correctIndex: 2,
        explanation: 'O quadro de Punnett resulta em: AA (25%), Aa (50%) e aa (25%). Logo, 1/4 = 25%.',
        points: 25
      },
      {
        id: 'bq2',
        question: 'Qual a diferença fundamental entre fenótipo e genótipo?',
        options: [
          'Genótipo é a aparência física e fenótipo são os genes.',
          'Fenótipo é a manifestação visível/fisiológica influenciada pelo genótipo e ambiente.',
          'Não há diferença, são termos sinônimos.',
          'Genótipo só existe em plantas e fenótipo em humanos.'
        ],
        correctIndex: 1,
        explanation: 'O fenótipo resulta da interação entre o genótipo (constituição genética) e os fatores ambientais.',
        points: 25
      },
      {
        id: 'bq3',
        question: 'A organela responsável pela respiração celular e produção de ATP é:',
        options: ['Ribossomo', 'Complexo de Golgi', 'Mitocôndria', 'Lisossomo'],
        correctIndex: 2,
        explanation: 'As mitocôndrias produzem a maior parte do ATP celular através do ciclo de Krebs e fosforilação oxidativa.',
        points: 25
      },
      {
        id: 'bq4',
        question: 'Qual é o pareamento correto de bases nitrogenadas no DNA?',
        options: ['Adenina com Uracila e Citosina com Guanina', 'Adenina com Timina e Citosina com Guanina', 'Adenina com Guanina e Timina com Citosina', 'Todas se ligam aleatoriamente'],
        correctIndex: 1,
        explanation: 'Pela regra de Chargaff, a Adenina (A) se liga à Timina (T) por 2 pontes de hidrogênio, e Citosina (C) à Guanina (G) por 3 pontes.',
        points: 25
      }
    ]
  },
  {
    id: 'bio-03',
    title: 'Formulário Avaliativo: Cadeias Alimentares e Ciclos Biogeoquímicos',
    description: 'Atividade interativa vinculada ao Google Forms oficial com perguntas abertas e dissertativas de ecologia.',
    subject: 'biologia',
    gradeLevel: 'fundamental',
    contentType: 'google_forms',
    googleFormsUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScXexampleEcologia/viewform',
    dateAdded: '2026-09-06',
    viewsCount: 110,
    completionsCount: 65,
    tags: ['Ecologia', 'Google Forms', 'Sustentabilidade']
  },
  {
    id: 'fis-01',
    title: 'Lista de Exercícios Resolvidos: Cinemática Escalar (MRU e MRUV)',
    description: 'Arquivo em formato Word (.docx) editável com fórmulas, gráficos de velocidade x tempo e 15 questões resolvidas com dicas didáticas.',
    subject: 'fisica',
    gradeLevel: 'medio',
    contentType: 'document',
    fileName: 'Lista_Cinematica_MRU_MRUV_Prof_Isaque.docx',
    fileSize: '1.2 MB',
    fileFormat: 'docx',
    fileUrl: '#',
    dateAdded: '2026-09-07',
    viewsCount: 180,
    completionsCount: 104,
    tags: ['Cinemática', 'Mecânica', 'Velocidade Média'],
    isImportant: true
  },
  {
    id: 'fis-02',
    title: 'Simulador & Quiz Interativo: Leis de Newton e Força Resultante',
    description: 'Teste prático de dinâmica: 1ª Lei (Inércia), 2ª Lei (F = m·a) e 3ª Lei (Ação e Reação) com resolução explicada.',
    subject: 'fisica',
    gradeLevel: 'medio',
    contentType: 'interactive_quiz',
    dateAdded: '2026-09-04',
    viewsCount: 155,
    completionsCount: 88,
    tags: ['Dinâmica', 'Leis de Newton', 'Força'],
    quizQuestions: [
      {
        id: 'fq1',
        question: 'Um corpo de massa 5 kg é acelerado a 3 m/s². Qual é o módulo da força resultante sobre ele?',
        options: ['8 N', '15 N', '1.66 N', '45 N'],
        correctIndex: 1,
        explanation: 'Pela Segunda Lei de Newton: F = m · a => F = 5 kg · 3 m/s² = 15 Newtons.',
        points: 25
      },
      {
        id: 'fq2',
        question: 'Segundo a Primeira Lei de Newton (Lei da Inércia), um corpo em movimento retilíneo uniforme tende a:',
        options: [
          'Parar imediatamente após 10 segundos',
          'Continuar em movimento retilíneo uniforme a menos que uma força resultante atue sobre ele',
          'Aumentar sua velocidade espontaneamente',
          'Mudar de direção em direção ao centro da Terra'
        ],
        correctIndex: 1,
        explanation: 'A inércia faz com que corpos mantenham seu estado de repouso ou MRU caso a resultante das forças seja nula.',
        points: 25
      },
      {
        id: 'fq3',
        question: 'Sobre o par Ação e Reação (3ª Lei de Newton), é CORRETO afirmar:',
        options: [
          'Eles atuam no mesmo corpo e por isso se anulam',
          'A força de reação é sempre menor que a de ação',
          'Eles atuam sempre em corpos diferentes e nunca se anulam',
          'Apenas corpos em repouso obedecem a essa lei'
        ],
        correctIndex: 2,
        explanation: 'As forças de ação e reação têm mesma intensidade e direção, sentidos opostos, mas atuam em corpos diferentes, logo nunca se anulam.',
        points: 25
      },
      {
        id: 'fq4',
        question: 'Qual a unidade de medida padrão para Energia e Trabalho no Sistema Internacional (SI)?',
        options: ['Watt (W)', 'Joule (J)', 'Newton (N)', 'Pascal (Pa)'],
        correctIndex: 1,
        explanation: 'No SI, tanto o trabalho de uma força quanto a energia são mensurados em Joules (J).',
        points: 25
      }
    ]
  },
  {
    id: 'fis-03',
    title: 'Tutorial em Vídeo: Como Interpretar Gráficos de Velocidade e Aceleração',
    description: 'Vídeo passo a passo demonstrando como calcular a área sob a curva para descobrir o deslocamento.',
    subject: 'fisica',
    gradeLevel: 'fundamental',
    contentType: 'video',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    videoDuration: '15:20 min',
    dateAdded: '2026-09-02',
    viewsCount: 174,
    completionsCount: 82,
    tags: ['Gráficos', 'Cinemática', 'Ensino Fundamental']
  },
  {
    id: 'gws-01',
    title: 'Guia Prático: Formatação de Trabalhos Escolares no Google Docs (Normas ABNT)',
    description: 'Template e manual em formato DOCX/PDF com margens configuradas, fontes recomendadas, numeração automática e sumário dinâmico no Google Docs.',
    subject: 'workspace',
    gradeLevel: 'todos',
    contentType: 'document',
    fileName: 'Modelo_Formatacao_GoogleDocs_ABNT_Prof_Isaque.docx',
    fileSize: '890 KB',
    fileFormat: 'docx',
    fileUrl: '#',
    dateAdded: '2026-09-11',
    viewsCount: 310,
    completionsCount: 220,
    tags: ['Google Docs', 'ABNT', 'Workspace', 'Produtividade'],
    isImportant: true
  },
  {
    id: 'gws-02',
    title: 'Dominando o Google Sheets para Ciências: Médias, Fórmulas e Gráficos de Linha',
    description: 'Tutorial passo a passo ensinando a criar planilhas de coleta de dados de experimentos, usar =MÉDIA, =SOMA, e gerar gráficos científicos.',
    subject: 'workspace',
    gradeLevel: 'todos',
    contentType: 'video',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    videoDuration: '18:10 min',
    dateAdded: '2026-09-09',
    viewsCount: 285,
    completionsCount: 175,
    tags: ['Google Sheets', 'Planilhas', 'Fórmulas', 'Gráficos']
  },
  {
    id: 'gws-03',
    title: 'Quiz de Certificação Rápida: Atalhos e Recursos Avançados do Google Workspace',
    description: 'Teste se você conhece os atalhos essenciais do Drive, Docs e Classroom que economizam horas na semana de estudos.',
    subject: 'workspace',
    gradeLevel: 'todos',
    contentType: 'interactive_quiz',
    dateAdded: '2026-09-05',
    viewsCount: 240,
    completionsCount: 160,
    tags: ['Atalhos', 'Certificação', 'Google Drive', 'Google Docs'],
    quizQuestions: [
      {
        id: 'gq1',
        question: 'Qual atalho no Google Docs permite abrir o histórico de versões para restaurar alterações anteriores?',
        options: ['Ctrl + Alt + Shift + H', 'Ctrl + Z', 'Ctrl + Shift + V', 'Alt + F4'],
        correctIndex: 0,
        explanation: 'Ctrl + Alt + Shift + H (no Windows/Linux) ou Cmd + Option + Shift + H (no Mac) abre diretamente o histórico de versões.',
        points: 25
      },
      {
        id: 'gq2',
        question: 'No Google Planilhas (Sheets), qual fórmula calcula a média aritmética do intervalo B2 até B10?',
        options: ['=MED(B2:B10)', '=AVERAGE(B2:B10) ou =MÉDIA(B2:B10)', '=SOMA(B2:B10)/2', '=CALCULAR_MEDIA(B2..B10)'],
        correctIndex: 1,
        explanation: 'Em português do Brasil a função é =MÉDIA(B2:B10) e em inglês =AVERAGE(B2:B10).',
        points: 25
      },
      {
        id: 'gq3',
        question: 'Qual das seguintes ferramentas permite criar testes com pontuação automática e feedback imediato para os alunos?',
        options: ['Google Keep', 'Google Forms (Formulários)', 'Google Meet', 'Google Fonts'],
        correctIndex: 1,
        explanation: 'O Google Forms possui o modo "Teste", que atribui pontos a cada questão e exibe mensagens de feedback automático.',
        points: 25
      },
      {
        id: 'gq4',
        question: 'Ao compartilhar um arquivo no Google Drive para estudo em grupo sem permitir que alterem o texto original, qual permissão deve ser dada?',
        options: ['Editor', 'Leitor ou Comentarista', 'Proprietário', 'Administrador'],
        correctIndex: 1,
        explanation: 'A permissão de Leitor permite apenas visualização e download, enquanto Comentarista permite sugerir notas sem modificar o original.',
        points: 25
      }
    ]
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'st-01',
    name: 'Mariana Silveira',
    email: 'mariana.silveira@escola.edu.br',
    grade: '2º Ano Médio A',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    xp: 450,
    streakDays: 6,
    badges: [
      { id: 'b1', name: 'Mestre de Pitágoras', icon: '📐', description: 'Acertou 100% no teste de Matemática' },
      { id: 'b2', name: 'DNA Expert', icon: '🧬', description: 'Completou módulo de Genética' }
    ],
    completedActivityIds: ['mat-02', 'bio-02', 'gws-03']
  },
  {
    id: 'st-02',
    name: 'Lucas Gabriel Costa',
    email: 'lucas.costa@escola.edu.br',
    grade: '9º Ano Fundamental B',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    xp: 320,
    streakDays: 4,
    badges: [
      { id: 'b3', name: 'Explorador Científico', icon: '🔬', description: 'Assistiu a 3 tutoriais seguidos' }
    ],
    completedActivityIds: ['mat-02', 'gws-03']
  },
  {
    id: 'st-03',
    name: 'Beatriz Vasconcelos',
    email: 'beatriz.v@escola.edu.br',
    grade: '3º Ano Médio B',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    xp: 580,
    streakDays: 11,
    badges: [
      { id: 'b1', name: 'Mestre de Pitágoras', icon: '📐', description: 'Acertou 100% no teste de Matemática' },
      { id: 'b4', name: 'Gênio de Newton', icon: '⚡', description: 'Nota máxima em Física' },
      { id: 'b5', name: 'Pro Workspace', icon: '💻', description: 'Concluiu módulo do Google Sheets' }
    ],
    completedActivityIds: ['mat-02', 'bio-02', 'fis-02', 'gws-03']
  },
  {
    id: 'st-04',
    name: 'Enzo Rodrigues',
    email: 'enzo.rodrigues@escola.edu.br',
    grade: '1º Ano Médio C',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    xp: 210,
    streakDays: 2,
    badges: [
      { id: 'b2', name: 'DNA Expert', icon: '🧬', description: 'Completou módulo de Genética' }
    ],
    completedActivityIds: ['bio-02']
  },
  {
    id: 'st-05',
    name: 'Camila Ferreira',
    email: 'camila.f@escola.edu.br',
    grade: '8º Ano Fundamental A',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    xp: 380,
    streakDays: 5,
    badges: [
      { id: 'b1', name: 'Mestre de Pitágoras', icon: '📐', description: 'Acertou 100% no teste de Matemática' }
    ],
    completedActivityIds: ['mat-02', 'gws-03']
  }
];

export const INITIAL_SUBMISSIONS: ActivitySubmission[] = [
  {
    id: 'sub-01',
    studentId: 'st-01',
    studentName: 'Mariana Silveira',
    studentEmail: 'mariana.silveira@escola.edu.br',
    studentGrade: '2º Ano Médio A',
    materialId: 'mat-02',
    materialTitle: 'Desafio Gamificado: Teorema de Pitágoras e Trigonometria',
    subject: 'matematica',
    score: 100,
    maxScore: 100,
    percentage: 100,
    submittedAt: '2026-09-12 14:32',
    answers: [
      { questionIndex: 0, selectedIndex: 1, isCorrect: true },
      { questionIndex: 1, selectedIndex: 2, isCorrect: true },
      { questionIndex: 2, selectedIndex: 2, isCorrect: true },
      { questionIndex: 3, selectedIndex: 1, isCorrect: true }
    ],
    feedbackNotes: 'Excelente domínio de relações métricas!'
  },
  {
    id: 'sub-02',
    studentId: 'st-01',
    studentName: 'Mariana Silveira',
    studentEmail: 'mariana.silveira@escola.edu.br',
    studentGrade: '2º Ano Médio A',
    materialId: 'bio-02',
    materialTitle: 'Quiz Gamificado: Genética Mendeliana e Hereditariedade',
    subject: 'biologia',
    score: 75,
    maxScore: 100,
    percentage: 75,
    submittedAt: '2026-09-12 15:10',
    answers: [
      { questionIndex: 0, selectedIndex: 2, isCorrect: true },
      { questionIndex: 1, selectedIndex: 1, isCorrect: true },
      { questionIndex: 2, selectedIndex: 2, isCorrect: true },
      { questionIndex: 3, selectedIndex: 0, isCorrect: false }
    ],
    feedbackNotes: 'Rever pareamento de bases no DNA (A-T e C-G).'
  },
  {
    id: 'sub-03',
    studentId: 'st-03',
    studentName: 'Beatriz Vasconcelos',
    studentEmail: 'beatriz.v@escola.edu.br',
    studentGrade: '3º Ano Médio B',
    materialId: 'fis-02',
    materialTitle: 'Simulador & Quiz Interativo: Leis de Newton e Força Resultante',
    subject: 'fisica',
    score: 100,
    maxScore: 100,
    percentage: 100,
    submittedAt: '2026-09-11 18:45',
    answers: [
      { questionIndex: 0, selectedIndex: 1, isCorrect: true },
      { questionIndex: 1, selectedIndex: 1, isCorrect: true },
      { questionIndex: 2, selectedIndex: 2, isCorrect: true },
      { questionIndex: 3, selectedIndex: 1, isCorrect: true }
    ],
    feedbackNotes: 'Desempenho perfeito nas aplicações das Leis de Newton!'
  },
  {
    id: 'sub-04',
    studentId: 'st-02',
    studentName: 'Lucas Gabriel Costa',
    studentEmail: 'lucas.costa@escola.edu.br',
    studentGrade: '9º Ano Fundamental B',
    materialId: 'mat-02',
    materialTitle: 'Desafio Gamificado: Teorema de Pitágoras e Trigonometria',
    subject: 'matematica',
    score: 75,
    maxScore: 100,
    percentage: 75,
    submittedAt: '2026-09-11 10:20',
    answers: [
      { questionIndex: 0, selectedIndex: 1, isCorrect: true },
      { questionIndex: 1, selectedIndex: 0, isCorrect: false },
      { questionIndex: 2, selectedIndex: 2, isCorrect: true },
      { questionIndex: 3, selectedIndex: 1, isCorrect: true }
    ],
    feedbackNotes: 'Bom raciocínio na questão da escada!'
  },
  {
    id: 'sub-05',
    studentId: 'st-03',
    studentName: 'Beatriz Vasconcelos',
    studentEmail: 'beatriz.v@escola.edu.br',
    studentGrade: '3º Ano Médio B',
    materialId: 'gws-03',
    materialTitle: 'Quiz de Certificação Rápida: Atalhos e Recursos Avançados do Google Workspace',
    subject: 'workspace',
    score: 100,
    maxScore: 100,
    percentage: 100,
    submittedAt: '2026-09-10 16:30',
    answers: [
      { questionIndex: 0, selectedIndex: 0, isCorrect: true },
      { questionIndex: 1, selectedIndex: 1, isCorrect: true },
      { questionIndex: 2, selectedIndex: 1, isCorrect: true },
      { questionIndex: 3, selectedIndex: 1, isCorrect: true }
    ],
    feedbackNotes: 'Certificação concluída com maestria.'
  }
];

export const INITIAL_NOTIFICATIONS: EmailNotification[] = [
  {
    id: 'notif-01',
    subject: '📚 Novo Material Disponível: Funções Quadráticas e Gráficos de Parábolas',
    preheader: 'Confira a apostila em PDF e os exemplos práticos já disponíveis no IRS Nexus Cloud!',
    content: 'Olá Estudante! Já está disponível na plataforma o material de apoio completo sobre Funções Quadráticas com exercícios resolvidos e esquemas visuais para preparar vocês para as próximas avaliações. Acessem o portal para baixar o arquivo em PDF sem sobrecarregar a memória do seu smartphone!',
    targetSubject: 'matematica',
    targetGrade: 'medio',
    recipientsCount: 48,
    sentAt: '2026-09-10 08:30',
    materialTitle: 'Guia Completo: Funções Quadráticas e Parábolas',
    materialLink: '#',
    senderName: 'Prof. Isaque Rocha',
    status: 'sent'
  },
  {
    id: 'notif-02',
    subject: '⚡ Desafio Aberto: Quiz Gamificado de Leis de Newton e Dinâmica',
    preheader: 'Teste seus conhecimentos em tempo real com feedbacks automáticos e ganhe até +100 XP!',
    content: 'Caros alunos de Física! O quiz gamificado sobre as 3 Leis de Newton já está aberto no painel. Cada questão contém explicação passo a passo caso você erre. Teste sua velocidade de raciocínio e conquiste o selo de Gênio de Newton no seu perfil!',
    targetSubject: 'fisica',
    targetGrade: 'medio',
    recipientsCount: 42,
    sentAt: '2026-09-09 14:15',
    materialTitle: 'Simulador & Quiz Interativo: Leis de Newton',
    materialLink: '#',
    senderName: 'Prof. Isaque Rocha',
    status: 'sent'
  },
  {
    id: 'notif-03',
    subject: '💻 Aula Prática: Fórmulas no Google Sheets para Ciências e Matemática',
    preheader: 'Aprenda a automatizar médias e gráficos científicos no Google Workspace.',
    content: 'Atenção a todos os participantes do curso de Google Workspace! Disponibilizei o tutorial em vídeo e modelo prático para trabalhar com dados e planilhas colaborativas. O material está centralizado no portal com acesso direto sem necessidade de download pesado.',
    targetSubject: 'workspace',
    targetGrade: 'all',
    recipientsCount: 95,
    sentAt: '2026-09-07 19:00',
    materialTitle: 'Dominando o Google Sheets para Ciências',
    materialLink: '#',
    senderName: 'Prof. Isaque Rocha',
    status: 'sent'
  }
];

export const INITIAL_COMMENTS = [
  {
    id: 'comm-01',
    materialId: 'mat-01',
    authorName: 'Lucas Silva (1º Ano B)',
    authorGrade: '1º Ano Médio',
    content: 'Professor, na página 3 da apostila, quando o Delta é igual a zero, a parábola tangencia o eixo X em um único ponto, certo?',
    createdAt: '2026-09-11 10:24',
    isTeacher: false,
  },
  {
    id: 'comm-02',
    materialId: 'mat-01',
    authorName: 'Prof. Isaque Rocha',
    authorGrade: 'Professor',
    content: 'Exatamente, Lucas! Quando Δ = 0, temos duas raízes reais e iguais (x₁ = x₂ = -b / 2a), o que geometricamente significa que o vértice da parábola toca exatamente o eixo das abscissas.',
    createdAt: '2026-09-11 11:05',
    isTeacher: true,
  },
  {
    id: 'comm-03',
    materialId: 'bio-01',
    authorName: 'Mariana Costa (2º Ano A)',
    authorGrade: '2º Ano Médio',
    content: 'Baixei a apostila em PDF no celular, muito mais fácil do que procurar no grupo do WhatsApp! Os esquemas de síntese de proteínas ficaram muito claros.',
    createdAt: '2026-09-10 16:40',
    isTeacher: false,
  },
  {
    id: 'comm-04',
    materialId: 'fis-01',
    authorName: 'Gabriel Santos (9º Ano A)',
    authorGrade: '9º Ano Fundamental',
    content: 'Professor, a terceira lei de Newton (ação e reação) sempre ocorre em corpos diferentes?',
    createdAt: '2026-09-09 18:12',
    isTeacher: false,
  },
  {
    id: 'comm-05',
    materialId: 'fis-01',
    authorName: 'Prof. Isaque Rocha',
    authorGrade: 'Professor',
    content: 'Perfeito, Gabriel! As forças de ação e reação NUNCA se anulam porque atuam em corpos distintos: se o corpo A aplica uma força no corpo B, o corpo B reage no corpo A.',
    createdAt: '2026-09-09 19:00',
    isTeacher: true,
  },
  {
    id: 'comm-06',
    materialId: 'ws-01',
    authorName: 'Beatriz Lima (Ensino Médio)',
    authorGrade: '3º Ano Médio',
    content: 'A dica da função PROCV e criação de gráficos rápidos no Sheets ajudou demais no trabalho de Ciências da Natureza.',
    createdAt: '2026-09-08 14:20',
    isTeacher: false,
  }
];

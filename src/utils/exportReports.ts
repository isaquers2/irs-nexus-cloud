import { Student, ActivitySubmission, StudyMaterial } from '../types';

export function exportPerformanceToCSV(
  students: Student[],
  submissions: ActivitySubmission[],
  materials: StudyMaterial[]
): void {
  // Generate header
  const headers = [
    'ID Aluno',
    'Nome do Aluno',
    'E-mail',
    'Turma / Série',
    'XP Total',
    'Dias Consecutivos (Streak)',
    'Qtd Atividades Concluídas',
    'Média Geral (%)',
    'Média Matemática (%)',
    'Média Biologia (%)',
    'Média Física (%)',
    'Média Google Workspace (%)',
    'Última Atividade Realizada',
    'Data da Última Atividade'
  ];

  const rows = students.map(student => {
    const studentSubs = submissions.filter(s => s.studentId === student.id);
    const totalSubs = studentSubs.length;
    
    const avgOverall = totalSubs > 0
      ? (studentSubs.reduce((acc, curr) => acc + curr.percentage, 0) / totalSubs).toFixed(1)
      : '0.0';

    const getAvgBySubject = (subj: string) => {
      const match = studentSubs.filter(s => s.subject === subj);
      if (match.length === 0) return 'N/A';
      return (match.reduce((acc, curr) => acc + curr.percentage, 0) / match.length).toFixed(1);
    };

    const lastSub = studentSubs.length > 0
      ? [...studentSubs].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0]
      : null;

    return [
      `"${student.id}"`,
      `"${student.name.replace(/"/g, '""')}"`,
      `"${student.email}"`,
      `"${student.grade}"`,
      student.xp,
      student.streakDays,
      totalSubs,
      avgOverall,
      getAvgBySubject('matematica'),
      getAvgBySubject('biologia'),
      getAvgBySubject('fisica'),
      getAvgBySubject('workspace'),
      lastSub ? `"${lastSub.materialTitle.replace(/"/g, '""')}"` : '"Nenhuma"',
      lastSub ? `"${lastSub.submittedAt}"` : '"-"'
    ].join(';');
  });

  // UTF-8 BOM for Excel compatibility with Portuguese characters
  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio_desempenho_irsnexus_cloud_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatSubjectName(subject: string): string {
  switch (subject) {
    case 'matematica':
      return 'Matemática';
    case 'biologia':
      return 'Biologia';
    case 'fisica':
      return 'Física';
    case 'workspace':
      return 'Google Workspace';
    default:
      return subject;
  }
}

export function formatGradeName(grade: string): string {
  switch (grade) {
    case 'fundamental':
      return 'Ensino Fundamental';
    case 'medio':
      return 'Ensino Médio';
    case 'todos':
      return 'Todos os Níveis';
    default:
      return grade;
  }
}

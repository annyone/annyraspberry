// Главная не создаёт страницы кейсов: их список остаётся в projects.json.
// Первый обычный проект после featured занимает широкую карточку.
export const homeProjects = {
  featuredId: 'axelnac',
  compact: [
    // Заглушки скрыты до подготовки материалов и страниц.
    // { id: 'plugin', symbol: '</>', tone: 'violet' },
    // { id: 'editorial', symbol: 'Aa', tone: 'sand' },
  ],
};

export function arrangeProjects(projects, featuredId) {
  const featured = projects.find(project => project.id === featuredId) || projects[0];
  const remaining = projects.filter(project => project !== featured);
  return { featured, primary: remaining[0], rest: remaining.slice(1) };
}

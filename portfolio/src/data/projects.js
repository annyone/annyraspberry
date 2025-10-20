const projects = [
  {
    id: 'logiq',
    title: 'Редизайн основного раздела LogIQ',
    excerpt: 'Переосмыслила и пересобрала интерфейс основного раздела продукта после MVP в условиях ограниченной вводной информации. Получила позитивную обратную связь об изменениях от пользователей после релиза.',
    thumbnail: '/images/logiq/thumbnail.png',
    // `page` is the name of a component under src/casepages that will render this project's page.
    // If the module doesn't exist, the app will fall back to the generic template.
    page: 'logiq',
  },
  {
    id: 'darts',
    title: 'Система управления турнирами Дартс',
    excerpt: 'С нуля спроектировала сложную систему для проведения турниров по дартс. Участвовала во всем цикле разработки от сбора требований до дизайн-ревью готовых фичей.',
    thumbnail: '/images/darts/thumbnail.png',
    page: 'darts'
  }
]

export default projects;

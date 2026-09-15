// Описание страницы кейса «Дартс». Пояснения к формату — в data/cases/axelnac.js.
const darts = {
  // Единственный кейс без нижнего отступа у <main>.
  mainClassName: '',
  sections: [
    {
      title: 'task.title',
      className: 'gap-4',
      blocks: [
        { type: 'text', key: 'task.text1' },
        { type: 'text', key: 'task.text2' },
      ],
    },
    {
      title: 'participation.title',
      className: 'gap-4',
      blocks: [{ type: 'list', key: 'participation.items' }],
    },
    {
      title: 'scenarios.title',
      className: 'gap-4',
      blocks: [
        {
          type: 'article',
          title: 'scenarios.player.title',
          blocks: [
            { type: 'text', key: 'scenarios.player.text1' },
            { type: 'text', key: 'scenarios.player.text2' },
            {
              type: 'image',
              src: '/images/darts/10.gif',
              alt: 'scenarios.player.alt',
              shadow: true,
            },
          ],
        },
        {
          type: 'article',
          title: 'scenarios.tournament.title',
          blocks: [
            { type: 'text', key: 'scenarios.tournament.text1' },
            { type: 'text', key: 'scenarios.tournament.text2' },
            { type: 'text', key: 'scenarios.tournament.text3' },
            {
              type: 'image',
              src: '/images/darts/scenario.webp',
              alt: 'scenarios.tournament.alt',
            },
          ],
        },
      ],
    },
    {
      title: 'scalability.title',
      className: 'gap-4',
      blocks: [
        { type: 'text', key: 'scalability.text' },
        { type: 'image', src: '/images/darts/scale.webp', alt: 'scalability.alt' },
      ],
    },
    {
      title: 'stages.title',
      className: 'gap-4',
      blocks: [
        { type: 'text', key: 'stages.text' },
        {
          type: 'article',
          title: 'stages.participants.title',
          blocks: [
            { type: 'text', key: 'stages.participants.text' },
            { type: 'image', src: '/images/darts/add.webp', alt: 'stages.participants.alt' },
          ],
        },
        {
          type: 'article',
          title: 'stages.documents.title',
          blocks: [
            { type: 'text', key: 'stages.documents.text' },
            {
              type: 'image',
              src: '/images/darts/player.webp',
              alt: 'stages.documents.alt',
              shadow: true,
            },
          ],
        },
        {
          type: 'article',
          title: 'stages.groups.title',
          blocks: [
            { type: 'text', key: 'stages.groups.text' },
            {
              type: 'image',
              src: '/images/darts/groups.webp',
              alt: 'stages.groups.alt',
              shadow: true,
            },
          ],
        },
        {
          type: 'article',
          title: 'stages.finish.title',
          blocks: [
            { type: 'text', key: 'stages.finish.text' },
            {
              type: 'image',
              src: '/images/darts/results.webp',
              alt: 'stages.finish.alt',
              shadow: true,
            },
          ],
        },
      ],
    },
    {
      title: 'informativeness.title',
      className: 'gap-4',
      blocks: [
        { type: 'text', key: 'informativeness.text' },
        { type: 'image', src: '/images/darts/stages.webp', alt: 'informativeness.alt' },
      ],
    },
    {
      title: 'familiarity.title',
      className: 'gap-4',
      blocks: [
        { type: 'text', key: 'familiarity.text' },
        { type: 'image', src: '/images/darts/calc.webp', alt: 'familiarity.alt' },
      ],
    },
    {
      title: 'result.title',
      className: 'gap-4',
      blocks: [
        { type: 'text', key: 'result.text1' },
        { type: 'list', key: 'result.items' },
        { type: 'text', key: 'result.text2' },
      ],
    },
  ],
};

export default darts;

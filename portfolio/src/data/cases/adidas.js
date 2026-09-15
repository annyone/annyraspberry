// Описание страницы кейса Adidas. Пояснения к формату — в data/cases/axelnac.js.
const adidas = {
  sections: [
    {
      title: 'task.title',
      className: 'gap-4',
      blocks: [{ type: 'text', key: 'task.text' }],
    },
    {
      title: 'concept.title',
      className: 'gap-4',
      blocks: [
        {
          type: 'article',
          blocks: [
            { type: 'text', key: 'concept.main1' },
            { type: 'text', key: 'concept.main2' },
            { type: 'text', key: 'concept.main3' },
          ],
        },
        {
          type: 'article',
          title: 'concept.ai.title',
          blocks: [{ type: 'text', key: 'concept.ai.text' }],
        },
        {
          type: 'article',
          title: 'concept.ar.title',
          blocks: [{ type: 'text', key: 'concept.ar.text' }],
        },
      ],
    },
    {
      title: 'result.title',
      className: 'gap-4',
      blocks: [
        {
          type: 'article',
          title: 'result.landing.title',
          blocks: [
            { type: 'text', key: 'result.landing.text' },
            { type: 'image', src: '/images/adidas/1.png', alt: 'result.landing.alt' },
          ],
        },
        {
          type: 'article',
          title: 'result.outfit.title',
          blocks: [
            { type: 'text', key: 'result.outfit.text' },
            { type: 'image', src: '/images/adidas/2.png', alt: 'result.landing.alt' },
          ],
        },
        {
          type: 'article',
          title: 'result.specs.title',
          blocks: [
            { type: 'text', key: 'result.specs.text' },
            { type: 'image', src: '/images/adidas/3.png', alt: 'result.landing.alt' },
          ],
        },
        {
          type: 'article',
          title: 'result.animation.title',
          blocks: [
            { type: 'text', key: 'result.animation.text' },
            {
              type: 'video',
              src: 'https://kinescope.io/embed/cmjUG9xfXuJy1kFNc8D3ZT',
              title: 'result.animation.videoTitle',
            },
          ],
        },
      ],
    },
    {
      title: 'feedback.title',
      className: 'gap-4',
      blocks: [
        { type: 'feedback', key: 'feedback.text1' },
        { type: 'feedback', key: 'feedback.text2' },
      ],
    },
  ],
};

export default adidas;

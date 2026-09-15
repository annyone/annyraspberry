// Описание страницы кейса LogIQ. Пояснения к формату — в data/cases/axelnac.js.
const logiq = {
  sections: [
    {
      title: 'tasks.title',
      className: 'gap-4',
      blocks: [
        {
          type: 'banners',
          className: 'grid gap-4 grid-cols-1 xl:grid-cols-3',
          items: [
            { emoji: '🤩', key: 'tasks.simplify' },
            { emoji: '📉', key: 'tasks.reduce' },
            { emoji: 'ℹ️', key: 'tasks.increase' },
          ],
        },
      ],
    },
    {
      title: 'what.title',
      className: 'gap-4',
      blocks: [{ type: 'list', key: 'what.items' }],
    },
    {
      title: 'before.title',
      className: 'gap-4',
      blocks: [
        {
          type: 'article',
          blocks: [
            { type: 'text', key: 'before.main' },
            { type: 'image', src: '/images/logiq/was.webp', alt: 'before.altBefore', shadow: true },
          ],
        },
        {
          type: 'article',
          blocks: [
            { type: 'text', key: 'before.constructor1' },
            { type: 'text', key: 'before.constructor2' },
            {
              type: 'image',
              src: '/images/logiq/2.png',
              alt: 'before.altBefore',
              className: '!pb-0',
              shadow: true,
            },
          ],
        },
      ],
    },
    {
      title: 'after.title',
      className: 'gap-4',
      blocks: [
        {
          type: 'article',
          title: 'after.structure.title',
          blocks: [
            { type: 'text', key: 'after.structure.text' },
            { type: 'image', src: '/images/logiq/now.webp', alt: 'after.altAfter', shadow: true },
          ],
        },
        {
          type: 'article',
          blocks: [
            { type: 'text', key: 'after.grouped' },
            {
              type: 'image',
              src: '/images/logiq/layout.webp',
              alt: 'after.altAfter',
              shadow: true,
            },
          ],
        },
        {
          type: 'article',
          title: 'after.modes.title',
          blocks: [
            {
              type: 'row',
              blocks: [
                {
                  type: 'group',
                  className: 'w-full lg:w-[35%] grid gap-2',
                  blocks: [
                    { type: 'text', key: 'after.modes.text1' },
                    { type: 'text', key: 'after.modes.text2' },
                  ],
                },
                {
                  type: 'image',
                  src: '/images/logiq/12.gif',
                  alt: 'after.altAfter',
                  className: 'w-full lg:w-[65%]',
                  shadow: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'constructor.title',
      className: 'gap-4',
      blocks: [
        {
          type: 'article',
          blocks: [
            { type: 'text', key: 'constructor.main1' },
            { type: 'text', key: 'constructor.main2' },
            { type: 'image', src: '/images/logiq/board.webp', alt: 'after.altAfter', shadow: true },
          ],
        },
        {
          type: 'article',
          title: 'constructor.fields.title',
          blocks: [
            { type: 'text', key: 'constructor.fields.text' },
            { type: 'image', src: '/images/logiq/fields.webp', alt: 'after.altAfter' },
          ],
        },
        {
          type: 'article',
          title: 'constructor.search.title',
          blocks: [
            {
              type: 'row',
              blocks: [
                {
                  type: 'image',
                  src: '/images/logiq/6.gif',
                  alt: 'after.altAfter',
                  className: 'w-full lg:w-1/2 !pb-0',
                  shadow: true,
                },
                {
                  type: 'text',
                  key: 'constructor.search.text',
                  className: 'w-full lg:w-1/2',
                },
              ],
            },
          ],
        },
        {
          type: 'article',
          title: 'constructor.sorting.title',
          blocks: [
            { type: 'text', key: 'constructor.sorting.text' },
            { type: 'image', src: '/images/logiq/sorting.webp', alt: 'after.altAfter' },
          ],
        },
      ],
    },
    {
      title: 'result.title',
      className: 'gap-4',
      blocks: [
        { type: 'text', key: 'result.text' },
        { type: 'feedback', key: 'result.feedback1' },
        { type: 'feedback', key: 'result.feedback2' },
      ],
    },
  ],
};

export default logiq;

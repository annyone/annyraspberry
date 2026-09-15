// Описание страницы кейса AxelNAC. Разметку по этому описанию строит
// pages/CasePage.js, перечень допустимых блоков — в components/CaseBlocks.js.
//
// Ключи записаны без префикса pages.axelnac — его подставляет CasePage.
// Второй источник картинки для экранов высокой плотности не указывают:
// для .webp он вычисляется из имени файла (см. retinaSources в Image.js).
const axelnac = {
  sections: [
    {
      title: 'tasks.title',
      className: 'gap-4',
      blocks: [
        {
          type: 'banners',
          className: 'grid gap-4 grid-cols-1 xl:grid-cols-2',
          key: 'tasks.items',
        },
      ],
    },
    {
      title: 'done.title',
      className: 'gap-4',
      blocks: [{ type: 'list', key: 'done.items' }],
    },
    {
      title: 'problems.title',
      className: 'gap-4',
      blocks: [{ type: 'list', key: 'problems.items' }],
    },
    {
      title: 'before.title',
      className: 'gap-4',
      blocks: [
        {
          type: 'article',
          blocks: [
            { type: 'text', key: 'before.1' },
            { type: 'image', src: '/images/axelnac/step1.webp', alt: 'before.alt1', shadow: true },
          ],
        },
        {
          type: 'article',
          blocks: [
            { type: 'text', key: 'before.2' },
            { type: 'image', src: '/images/axelnac/step2.webp', alt: 'before.alt2', shadow: true },
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
          blocks: [
            { type: 'text', key: 'after.1' },
            { type: 'image', src: '/images/axelnac/empty.webp', alt: 'after.alt1', shadow: true },
          ],
        },
        {
          type: 'article',
          blocks: [
            { type: 'text', key: 'after.2' },
            { type: 'image', src: '/images/axelnac/started.webp', alt: 'after.alt2', shadow: true },
          ],
        },
        {
          type: 'article',
          blocks: [
            {
              type: 'row',
              blocks: [
                {
                  type: 'group',
                  className: 'w-full lg:w-[55%] grid gap-2',
                  blocks: [{ type: 'text', key: 'after.3' }],
                },
                {
                  type: 'image',
                  src: '/images/axelnac/actions.webp',
                  alt: 'after.alt3',
                  shadow: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'result.title',
      className: 'gap-4',
      blocks: [{ type: 'text', key: 'result.1' }],
    },
  ],
};

export default axelnac;

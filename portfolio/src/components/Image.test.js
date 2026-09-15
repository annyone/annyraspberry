import { render } from '@testing-library/react';
import Image, { retinaSources } from './Image';

// На этом контракте стоят CasePage, CaseBlocks и ProjectCard: они больше
// не хранят адрес ретина-версии в данных, а выводят его из имени файла.
describe('retinaSources', () => {
  test('для .webp даёт пару -2x с порогом 1024px', () => {
    expect(retinaSources('/images/darts/scale.webp')).toEqual([
      { srcSet: '/images/darts/scale-2x.webp', media: '(min-width: 1024px)' },
    ]);
  });

  // Правило проверено по public/images: пара -2x есть у каждого .webp
  // и ни у одного .png или .gif. Второй источник для них означал бы
  // <source> с адресом, которого нет.
  test.each([
    ['/images/adidas/1.png'],
    ['/images/darts/10.gif'],
    ['/images/adidas/thumbnail.PNG'],
    [''],
    [undefined],
    [null],
  ])('для %p второго источника нет', src => {
    expect(retinaSources(src)).toEqual([]);
  });
});

test('ни один source не рендерится без srcset', () => {
  // Ровно тот случай, что был у Adidas: поля thumbnail_2x нет, а источник
  // передавался безусловно, и в разметку уходил <source> без srcset.
  render(
    <Image
      src="/images/adidas/thumbnail.png"
      sources={retinaSources('/images/adidas/thumbnail.png')}
      alt="Adidas"
    />
  );

  for (const source of document.querySelectorAll('source')) {
    expect(source).toHaveAttribute('srcset');
  }
});

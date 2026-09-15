import { render, screen, fireEvent } from '@testing-library/react';
import Image, { retinaSources } from './Image';

// Заглушка лежит первым элементом в том же контейнере, что и картинка.
function skeletonOf(img) {
  return img.parentElement.firstElementChild;
}

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

// animate-pulse нельзя держать постоянно: объявления анимации в каскаде
// стоят выше инлайновых стилей, и заглушка с opacity: 0 продолжала бы
// мерцать поверх уже загруженной картинки.
test('заглушка перестаёт пульсировать после загрузки картинки', () => {
  render(<Image src="/images/darts/scale.webp" alt="Масштабируемость" />);
  const img = screen.getByAltText('Масштабируемость');

  expect(skeletonOf(img)).toHaveClass('animate-pulse');

  fireEvent.load(img);

  expect(skeletonOf(img)).not.toHaveClass('animate-pulse');
  expect(skeletonOf(img)).toHaveStyle({ opacity: '0' });
});

test('второй источник для экранов высокой плотности не мешает погасить пульсацию', () => {
  render(
    <Image
      src="/images/darts/scale.webp"
      sources={[{ srcSet: '/images/darts/scale-2x.webp', media: '(min-width: 1024px)' }]}
      alt="Масштабируемость"
    />
  );
  const img = screen.getByAltText('Масштабируемость');

  expect(skeletonOf(img)).toHaveClass('animate-pulse');

  fireEvent.load(img);

  expect(skeletonOf(img)).not.toHaveClass('animate-pulse');
});

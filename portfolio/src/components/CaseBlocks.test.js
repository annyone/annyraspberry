import { screen } from '@testing-library/react';
import CaseBlocks from './CaseBlocks';
import { renderWithLanguage } from '../testing/renderWithLanguage';

// Единственное место, где описание кейса превращается в разметку.
//
// Переводчик здесь подставной, и это единственное исключение из правила
// «не мокать словарь». Причина: проверяется контракт между блоком и t(),
// а не содержимое словаря — нужен полный контроль над тем, какой ключ
// найдётся, а какой нет. Что настоящий словарь отвечает на все ключи
// настоящих описаний, проверяет i18n/i18n-coverage.test.js.
//
// Заглушка повторяет поведение настоящего t(): нашёлся ключ — значение,
// не нашёлся — запасное значение, а без него сама строка ключа.
const t = (key, fallback) => {
  const dictionary = {
    'первый абзац': 'Текст первого абзаца',
    'второй абзац': 'Текст второго абзаца',
    'подпись картинки': 'Что изображено на картинке',
    'заголовок статьи': 'Заголовок статьи',
    отзыв: 'Текст отзыва',
    'название видео': 'Название видео',
    'баннер.title': 'Заголовок баннера',
    'баннер.text': 'Текст баннера',
    список: ['Первый пункт', 'Второй пункт'],
    баннеры: [{ icon: '🤩', title: 'Из словаря', text: 'Текст из словаря' }],
  };

  if (key in dictionary) return dictionary[key];
  // Так ведёт себя настоящий t(): при отсутствующем ключе возвращает
  // запасное значение, а при его отсутствии — саму строку ключа.
  return fallback ?? key;
};

const renderBlocks = blocks => renderWithLanguage(<CaseBlocks blocks={blocks} t={t} />);

describe('отрисовка блоков кейса', () => {
  test('неизвестный тип блока не роняет страницу', () => {
    const { container } = renderBlocks([
      { type: 'опечатка', key: 'первый абзац' },
      { type: 'text', key: 'второй абзац' },
    ]);

    expect(screen.getByText('Текст второго абзаца')).toBeInTheDocument();
    expect(container.textContent).not.toContain('опечатка');
  });

  test('список из отсутствующего ключа рисует пустой список, а не строку ключа', () => {
    // Дословно тот случай, из-за которого страница падала с
    // «items.map is not a function»: t() возвращает не массив.
    const { container } = renderBlocks([{ type: 'list', key: 'ключа.нет' }]);

    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(0);
    expect(container.textContent).not.toContain('ключа.нет');
  });

  test('список отрисовывает все пункты из словаря', () => {
    const { container } = renderBlocks([{ type: 'list', key: 'список' }]);

    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(screen.getByText('Первый пункт')).toBeInTheDocument();
  });

  test('у картинки .webp появляется второй источник, у .png — нет', () => {
    const { container } = renderBlocks([
      { type: 'image', src: '/images/logiq/was.webp', alt: 'подпись картинки' },
    ]);
    expect(container.querySelector('source')).toHaveAttribute(
      'srcset',
      '/images/logiq/was-2x.webp'
    );

    const plain = renderBlocks([
      { type: 'image', src: '/images/adidas/1.png', alt: 'подпись картинки' },
    ]);
    expect(plain.container.querySelector('source')).toBeNull();
  });

  test('подпись картинки берётся из перевода, а без ключа остаётся пустой', () => {
    renderBlocks([{ type: 'image', src: '/images/logiq/was.webp', alt: 'подпись картинки' }]);
    expect(screen.getByAltText('Что изображено на картинке')).toBeInTheDocument();

    // Пустая подпись — допустимое состояние для декоративной картинки.
    // Недопустимо другое: строка ключа, зачитанная скринридером вслух.
    const { container } = renderBlocks([{ type: 'image', src: '/images/adidas/1.png' }]);
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  test('row и group отрисовывают вложенные блоки', () => {
    renderBlocks([
      {
        type: 'row',
        blocks: [
          {
            type: 'group',
            className: 'w-full lg:w-[55%]',
            blocks: [{ type: 'text', key: 'первый абзац' }],
          },
          { type: 'image', src: '/images/logiq/was.webp', alt: 'подпись картинки' },
        ],
      },
    ]);

    expect(screen.getByText('Текст первого абзаца')).toBeInTheDocument();
    expect(screen.getByAltText('Что изображено на картинке')).toBeInTheDocument();
  });

  test('баннеры собираются и из списка в словаре, и из перечисления в описании', () => {
    renderBlocks([{ type: 'banners', className: 'grid', key: 'баннеры' }]);
    expect(screen.getByText('Из словаря')).toBeInTheDocument();

    renderBlocks([{ type: 'banners', className: 'grid', items: [{ emoji: '📉', key: 'баннер' }] }]);
    expect(screen.getByText('Заголовок баннера')).toBeInTheDocument();
    expect(screen.getByText('Текст баннера')).toBeInTheDocument();
  });

  test('видео вставляется с названием из перевода', () => {
    const { container } = renderBlocks([
      { type: 'video', src: 'https://kinescope.io/embed/test', title: 'название видео' },
    ]);

    expect(container.querySelector('iframe')).toHaveAttribute('title', 'Название видео');
  });

  test('отзыв отрисовывается текстом из перевода', () => {
    renderBlocks([{ type: 'feedback', key: 'отзыв' }]);

    expect(screen.getByText('Текст отзыва')).toBeInTheDocument();
  });
});

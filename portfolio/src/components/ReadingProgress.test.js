import { render, screen, act } from '@testing-library/react';
import ReadingProgress, { readingProgress } from './ReadingProgress';

// jsdom не считает вёрстку: scrollHeight и clientHeight у него всегда 0,
// а прокрутки нет вовсе. Подставляем значения напрямую — расчёт от них
// и зависит.
function setPage({ scrollY, scrollHeight, clientHeight }) {
  window.scrollY = scrollY;
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(document.documentElement, 'clientHeight', {
    value: clientHeight,
    configurable: true,
  });
}

describe('readingProgress', () => {
  // Знаменатель — высота содержимого минус высота окна. При делении на
  // полную высоту содержимого полоса на долистанной до конца странице
  // остановилась бы, не дойдя до правого края ровно на высоту окна.
  test('в конце страницы даёт единицу', () => {
    expect(readingProgress(4000, 5000, 1000)).toBe(1);
  });

  test('в начале страницы даёт ноль', () => {
    expect(readingProgress(0, 5000, 1000)).toBe(0);
  });

  test('на середине прокрутки даёт половину', () => {
    expect(readingProgress(2000, 5000, 1000)).toBe(0.5);
  });

  // Страница короче окна: прокручивать нечего, знаменатель равен нулю.
  // Без отдельной проверки деление дало бы Infinity, и в transform
  // уехало бы scaleX(Infinity).
  test.each([
    ['страница ровно в окно', 0, 800, 800],
    ['страница короче окна', 0, 500, 800],
  ])('%s — прогресс нулевой', (_name, scrollY, scrollHeight, clientHeight) => {
    expect(readingProgress(scrollY, scrollHeight, clientHeight)).toBe(0);
  });

  // Отрицательный scrollY даёт резиновая прокрутка в Safari: страницу
  // тянут вниз от начала. Положительный перелёт — она же в конце.
  test.each([
    ['перетянули вверх', -120, 0],
    ['перетянули вниз', 6000, 1],
  ])('%s — значение остаётся в границах', (_name, scrollY, expected) => {
    expect(readingProgress(scrollY, 5000, 1000)).toBe(expected);
  });
});

describe('ReadingProgress', () => {
  beforeEach(() => {
    setPage({ scrollY: 0, scrollHeight: 5000, clientHeight: 1000 });
  });

  // Поток событий прокрутки идёт чаще, чем браузер рисует кадры. Без
  // объединения каждый пиксель прокрутки вызывал бы пересчёт вёрстки.
  // Условие проверки: несколько событий подряд до наступления кадра
  // дают ровно один запрос кадра.
  test('поток событий прокрутки сводится к одному пересчёту за кадр', async () => {
    const spy = jest.spyOn(window, 'requestAnimationFrame');
    render(<ReadingProgress />);
    spy.mockClear();

    await act(async () => {
      for (const scrollY of [100, 200, 300, 400]) {
        setPage({ scrollY, scrollHeight: 5000, clientHeight: 1000 });
        window.dispatchEvent(new Event('scroll'));
      }
      await new Promise(resolve => window.requestAnimationFrame(() => resolve()));
    });

    // Один запрос от компонента и один от ожидания кадра в самом тесте.
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockRestore();
  });

  // Обработчики висят на window и переживут размонтирование, если их
  // не снять: при переходе с кейса на главную полоса уже удалена из
  // разметки, а событие прокрутки продолжало бы дёргать setState
  // размонтированного компонента.
  test('обработчики снимаются при размонтировании', () => {
    const added = [];
    const removed = [];
    const origAdd = window.addEventListener;
    const origRemove = window.removeEventListener;
    window.addEventListener = (type, ...rest) => {
      added.push(type);
      return origAdd.call(window, type, ...rest);
    };
    window.removeEventListener = (type, ...rest) => {
      removed.push(type);
      return origRemove.call(window, type, ...rest);
    };

    try {
      const { unmount } = render(<ReadingProgress />);
      unmount();
    } finally {
      window.addEventListener = origAdd;
      window.removeEventListener = origRemove;
    }

    for (const type of ['scroll', 'resize']) {
      expect(added).toContain(type);
      expect(removed).toContain(type);
    }
  });

  // Полоса скрыта от программ чтения с экрана: те же сведения им уже
  // даёт полоса прокрутки браузера.
  test('полоса не попадает в дерево доступности', () => {
    render(<ReadingProgress />);
    expect(screen.getByTestId('reading-progress')).toHaveAttribute('aria-hidden', 'true');
  });
});

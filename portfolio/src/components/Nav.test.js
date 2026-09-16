import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Nav, { revealCircle } from './Nav';
import { getSectionItems, getSocialItems } from '../data/navItems';
import { renderWithLanguage } from '../testing/renderWithLanguage';
import { NAV_TRANSITION } from '../data/viewTransitions';

const fs = require('fs');
const path = require('path');

// Пункты собираются той же функцией, что и на сайте, но с переводчиком,
// возвращающим сам ключ: тексты проверяет i18n-coverage.test.js, здесь
// важны количество пунктов и их адреса.
const sections = getSectionItems(key => key);
const socials = getSocialItems(key => key);

const renderNav = () => renderWithLanguage(<Nav sections={sections} socials={socials} />);

const burger = () => screen.getByRole('button', { name: 'Меню' });
const cross = () => screen.getByRole('button', { name: 'Закрыть меню' });
const menu = () => screen.getByTestId('main-menu');
// Заливка и содержимое меню — разные слои: круг режет только заливку,
// содержимое поверх неё проявляется прозрачностью.
const backdrop = () => screen.getByTestId('menu-backdrop');
const content = () => screen.getByTestId('menu-content');

// Радиус круга раскрытия в пикселях, вытащенный из inline-стиля заливки.
const radius = () => Number(backdrop().style.clipPath.match(/circle\((-?[\d.]+)px/)[1]);

const pressEscape = () => fireEvent.keyDown(document, { key: 'Escape' });

// Блокировка прокрутки снимается не в момент клика, а после того, как
// сойдётся круг. Длительность должна совпадать с REVEAL_MS в Nav.js.
const REVEAL_MS = 500;
const finishReveal = () => act(() => jest.advanceTimersByTime(REVEAL_MS));

describe('шапка и меню', () => {
  // Время подменяется во всём наборе: закрытие меню снимает блокировку
  // прокрутки по таймеру, и без подмены пришлось бы ждать полсекунды
  // в каждой такой проверке.
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('в шапке только логотип, переключатель языка и бургер', () => {
    // Пункты меню тоже лежат в разметке (меню не размонтируется), поэтому
    // проверяется содержимое шапки, а не всей страницы.
    const { container } = renderNav();
    const header = container.querySelector('nav');

    expect(header.querySelector('img[alt="logo"]')).not.toBeNull();
    expect(header.querySelectorAll('a')).toHaveLength(1); // только логотип
    expect(header.textContent).toContain('RU');
    expect(header.textContent).toContain('EN');
  });

  test('шапка, распорка под ней и отступ в меню одной высоты', () => {
    // Высота шапки стояла числом в пяти местах: сама шапка, распорка под
    // ней, отступ в раскрытом меню, прокрутка к якорю и высота обложки.
    // Правка отступов означала правку пяти файлов, и пропущенное место
    // давало либо наезд шапки на текст, либо щель под ней. Теперь число
    // одно — переменная --nav-height в src/index.css.
    const { container } = renderNav();
    const header = container.querySelector('nav');
    const spacer = header.nextElementSibling;
    const menuOffset = content().querySelector('[aria-hidden="true"]');

    for (const element of [header, spacer, menuOffset]) {
      expect(element.className).toContain('h-[var(--nav-height)]');
    }
  });

  test('шапка вынута в отдельный слой перехода и лежит поверх него', () => {
    // Без собственного имени шапка попадает в общий снимок страницы,
    // а он лежит ниже всех переезжающих частей: подложка кейса,
    // разворачиваясь на весь экран, накрывала логотип — он пропадал
    // на время перехода и возвращался в конце.
    const { container } = renderNav();

    expect(container.querySelector('nav').className).toContain(NAV_TRANSITION);

    // Одного класса мало: имя назначается объявлением в src/index.css,
    // а слой поднимается z-index'ом. Нет объявления — шапка снова уходит
    // в общий снимок, и разметка при этом выглядит правильной.
    const css = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf8');

    expect(css).toContain(`.${NAV_TRANSITION} {`);
    expect(css).toMatch(/::view-transition-group\(site-nav\)\s*{[^}]*z-index/);
  });

  test('шапка ничем не залита', () => {
    // Условие проверки: среди классов шапки нет ни одного класса заливки
    // (bg-*). Прозрачность в jsdom не измерить — стили Tailwind тут
    // не применяются, — а список классов виден точно.
    const { container } = renderNav();
    const classes = container.querySelector('nav').className.split(/\s+/);

    expect(classes.filter(name => /(^|:)bg-/.test(name))).toEqual([]);
  });

  test('закрытое меню не ловит клики и не попадает под Tab', () => {
    renderNav();

    expect(menu()).toHaveAttribute('inert');
    expect(menu()).toHaveAttribute('aria-hidden', 'true');
    expect(menu().className).toContain('pointer-events-none');
    expect(content().className).toContain('opacity-0');
    expect(radius()).toBe(0);
  });

  test('по клику меню раскрывается, по второму клику закрывается', () => {
    renderNav();

    expect(burger()).toHaveAttribute('aria-expanded', 'false');

    userEvent.click(burger());

    // Подпись кнопки меняется на «Закрыть меню» — это и есть крестик.
    expect(cross()).toHaveAttribute('aria-expanded', 'true');
    expect(menu()).not.toHaveAttribute('inert');
    expect(content().className).toContain('opacity-100');
    expect(radius()).toBeGreaterThan(0);

    userEvent.click(cross());

    expect(burger()).toHaveAttribute('aria-expanded', 'false');
    expect(radius()).toBe(0);
  });

  test('раскрытое меню закрывается клавишей Escape', () => {
    renderNav();

    userEvent.click(burger());
    pressEscape();

    expect(burger()).toHaveAttribute('aria-expanded', 'false');
  });

  test('под раскрытым меню страница не прокручивается', () => {
    renderNav();

    userEvent.click(burger());
    expect(document.body.style.overflow).toBe('hidden');

    userEvent.click(cross());
    // Пока круг сходится, страница под ним закрыта и прокрутка не нужна:
    // возврат полосы в первом же кадре анимации даёт рывок.
    expect(document.body.style.overflow).toBe('hidden');

    finishReveal();
    expect(document.body.style.overflow).toBe('');
  });

  describe('ширина полосы прокрутки возмещается отступом', () => {
    // Запрет прокрутки убирает полосу, видимая область становится шире,
    // и без возмещения содержимое страницы прыгает вбок. В jsdom вёрстка
    // не считается, поэтому ширина полосы задаётся руками: window.innerWidth
    // шире documentElement.clientWidth ровно на неё.
    const SCROLLBAR = 17;

    const withScrollbar = width => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        configurable: true,
        value: window.innerWidth - width,
      });
    };

    afterEach(() => {
      delete document.documentElement.clientWidth;
    });

    test('при раскрытии отступ равен ширине полосы, при закрытии обнуляется', () => {
      withScrollbar(SCROLLBAR);
      const { container } = renderNav();

      userEvent.click(burger());

      const gap = SCROLLBAR + 'px';
      // Телу — поле, а не отступ: отступ у тела занят под px-8 xl:px-12,
      // и inline-стиль padding-right перебил бы его целиком.
      expect(document.body.style.marginRight).toBe(gap);
      expect(document.body.style.paddingRight).toBe('');
      // Шапка и меню стоят position: fixed и считают правый край от края
      // видимой области, а не от тела страницы, — им отступ нужен свой.
      expect(container.querySelector('nav').style.paddingRight).toBe(gap);
      expect(content().style.paddingRight).toBe(gap);

      userEvent.click(cross());
      finishReveal();

      expect(document.body.style.marginRight).toBe('');
      expect(container.querySelector('nav').style.paddingRight).toBe('0px');
      expect(content().style.paddingRight).toBe('0px');
    });

    test('без полосы прокрутки отступ не ставится', () => {
      // Полосы поверх содержимого (macOS, мобильные браузеры) места
      // не занимают, разница ширин нулевая — возмещать нечего.
      withScrollbar(0);
      const { container } = renderNav();

      userEvent.click(burger());

      expect(document.body.style.marginRight).toBe('');
      expect(container.querySelector('nav').style.paddingRight).toBe('0px');
    });
  });

  test('в меню есть разделы, резюме и ссылки на внешние площадки', () => {
    renderNav();
    const panel = menu();

    for (const item of sections) {
      expect(panel.querySelector('a[href="' + item.to + '"]')).not.toBeNull();
    }

    // Резюме — ссылка на файл с атрибутом download.
    expect(panel.querySelector('a[download]')).not.toBeNull();

    for (const item of socials) {
      expect(panel.querySelector('a[href="' + item.url + '"]')).not.toBeNull();
    }
  });

  test('переход по пункту меню закрывает меню', () => {
    renderNav();

    userEvent.click(burger());
    userEvent.click(screen.getByRole('link', { name: 'nav.cases' }));

    expect(burger()).toHaveAttribute('aria-expanded', 'false');
  });

  test('внизу меню стоит локация и местное время', () => {
    renderNav();

    expect(screen.getByText('Санкт-Петербург')).toBeInTheDocument();
    expect(screen.getByTestId('daypart-icon')).toBeInTheDocument();
  });
});

describe('круг раскрытия', () => {
  // Кнопка стоит у правого верхнего угла, поэтому дальний угол — левый
  // нижний. При радиусе в половину диагонали окна меню не докрывало бы
  // именно этот угол.
  const button = { getBoundingClientRect: () => ({ left: 940, top: 20, width: 40, height: 40 }) };

  test('радиус дотягивается до самого дальнего угла окна', () => {
    const { x, y, r } = revealCircle(button, 1000, 800);

    expect([x, y]).toEqual([960, 40]);
    expect(r).toBeCloseTo(Math.hypot(960, 760), 5);
  });

  test('без кнопки круг нулевой, а не NaN', () => {
    expect(revealCircle(null, 1000, 800)).toEqual({ x: 0, y: 0, r: 0 });
  });
});

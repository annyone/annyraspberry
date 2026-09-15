import { render } from '@testing-library/react';
import App from './App';
import Home from './pages/Home';
import projects from './data/projects.json';
import { reportProblems } from './testing/problems';
import { existsInPublic } from './testing/publicFiles';
import { renderWithLanguage } from './testing/renderWithLanguage';

// Ссылки живут в четырёх разных местах: меню (data/navItems.js), словарь
// статей, словарь опыта и список проектов. Ничто не сверяет их между собой,
// а переименованный кейс или поправленный якорь ломают ссылку молча —
// ни сборка, ни глаза этого не показывают.
//
// Метод: отрисовать все страницы, собрать каждый <a href> и проверить его
// по типу — внутренний адрес, якорь, внешний адрес, файл.

const PAGES = [
  ['главная', '/'],
  ...projects.map(project => ['кейс ' + project.id, '/' + project.id]),
  ['несуществующий адрес', '/takoy-stranicy-net'],
];

// Адреса, на которые вообще можно вести внутри сайта.
const ROUTES = new Set(['/', ...projects.map(project => '/' + project.id)]);

// Разделы главной собираются из настоящей разметки, а не перечисляются
// руками: если id раздела переименуют, проверка якорей это увидит.
function collectHomeAnchors() {
  const { container, unmount } = renderWithLanguage(<Home />);
  const ids = [...container.querySelectorAll('[id]')].map(element => element.id);
  unmount();
  return new Set(ids);
}

const HOME_ANCHORS = collectHomeAnchors();

// Все ссылки со всех страниц с пометкой, где именно они найдены.
function collectLinks() {
  const links = [];

  for (const [pageName, route] of PAGES) {
    window.localStorage.setItem('lang', 'ru');
    window.history.pushState({}, '', route);

    const { container, unmount } = render(<App />);

    for (const element of container.querySelectorAll('a')) {
      links.push({
        page: pageName,
        href: element.getAttribute('href'),
        name: (element.getAttribute('aria-label') || element.textContent || '').trim(),
        target: element.getAttribute('target'),
        rel: element.getAttribute('rel'),
      });
    }

    unmount();
  }

  return links;
}

const links = collectLinks();

const where = link =>
  'страница «' + link.page + '» → ссылка «' + (link.name || '(без имени)') + '»';

const isExternal = href => /^[a-z]+:/i.test(href || '');

describe('ссылки', () => {
  test('на страницах вообще есть ссылки', () => {
    // Защита от бессмысленного прогона: если разметка перестанет
    // отрисовываться, все проверки ниже позеленеют на пустом списке.
    expect(links.length).toBeGreaterThan(10);
  });

  test('у каждой ссылки непустой адрес', () => {
    const problems = links
      .filter(link => !link.href || link.href === '#' || link.href.includes('undefined'))
      .map(link => where(link) + ' → href="' + link.href + '"');

    reportProblems({
      title: 'Ссылки без адреса.',
      problems,
      howToFix:
        'проверить поле, из которого берётся адрес. «undefined» в href — след пустого ' +
        'поля в данных: ссылка выглядит рабочей и никуда не ведёт.',
    });
  });

  test('у каждой ссылки есть доступное имя', () => {
    const problems = links
      .filter(link => link.name === '')
      .map(link => 'страница «' + link.page + '» → ' + link.href);

    reportProblems({
      title: 'Ссылки без текста и без aria-label.',
      problems,
      howToFix:
        'добавить текст или aria-label. Такая ссылка кликается мышью, но для ' +
        'скринридера она немая — он объявит её как «ссылка» и не скажет куда.',
    });
  });

  test('внутренние ссылки ведут на существующий адрес', () => {
    const problems = [];

    for (const link of links) {
      const href = link.href || '';
      if (isExternal(href) || !href.startsWith('/')) continue;

      const [pathPart] = href.split('#');
      if (pathPart === '' || ROUTES.has(pathPart)) continue;
      if (existsInPublic(pathPart)) continue;

      problems.push(where(link) + ' → ' + href);
    }

    reportProblems({
      title: 'Внутренние ссылки, ведущие в никуда.',
      problems,
      howToFix:
        'адрес должен быть либо «/», либо «/<id проекта>» из data/projects.json, ' +
        'либо файлом, лежащим в public. Чаще всего причина — переименовали кейс ' +
        'в projects.json и забыли поправить ссылку.',
    });
  });

  test('якоря ведут на существующие разделы главной', () => {
    const problems = [];

    for (const link of links) {
      const href = link.href || '';
      if (isExternal(href) || !href.includes('#')) continue;

      const anchor = href.split('#')[1];
      if (!anchor) continue;
      if (HOME_ANCHORS.has(anchor)) continue;

      problems.push(where(link) + ' → #' + anchor + ' — раздела с таким id на главной нет');
    }

    reportProblems({
      title: 'Якоря, которым не соответствует ни один раздел.',
      problems,
      howToFix:
        'сверить id в data/navItems.js с id разделов в pages/Home.js. Ссылка ' +
        'с несуществующим якорем открывает главную и никуда не прокручивает — ' +
        'выглядит как «ничего не произошло».',
    });
  });

  test('ссылки на разделы записаны от корня сайта', () => {
    const problems = links
      .filter(link => (link.href || '').startsWith('#'))
      .map(link => where(link) + ' → ' + link.href);

    reportProblems({
      title: 'Якорные ссылки без ведущего «/».',
      problems,
      howToFix:
        'писать «/#cases» вместо «#cases». Со страницы кейса второй вариант ' +
        'даёт адрес /logiq#cases: остаёмся на кейсе, раздела с таким id там нет, ' +
        'прокрутки не происходит.',
    });
  });

  test('внешние ссылки открываются по https', () => {
    const problems = [];

    for (const link of links) {
      const href = link.href || '';
      if (!isExternal(href)) continue;

      let url = null;
      try {
        url = new URL(href);
      } catch {
        problems.push(where(link) + ' → адрес не разбирается: ' + href);
        continue;
      }

      if (url.protocol !== 'https:') {
        problems.push(where(link) + ' → схема ' + url.protocol + ' вместо https: — ' + href);
      }
    }

    reportProblems({
      title: 'Внешние ссылки с неверным адресом или без https.',
      problems,
      howToFix:
        'исправить адрес в словаре или в data/navItems.js. По http браузер ' +
        'покажет предупреждение о незащищённом соединении.',
    });
  });

  test('у внешних ссылок есть target и rel с noopener', () => {
    const problems = [];

    for (const link of links) {
      if (!isExternal(link.href || '')) continue;
      if (link.target !== '_blank') {
        problems.push(where(link) + ' → нет target="_blank"');
        continue;
      }
      if (!(link.rel || '').includes('noopener')) {
        problems.push(where(link) + ' → rel="' + link.rel + '" без noopener');
      }
    }

    reportProblems({
      title: 'Внешние ссылки без защиты открываемой вкладки.',
      problems,
      howToFix:
        'добавить target="_blank" и rel="noopener noreferrer". Без noopener ' +
        'открытая страница получает доступ к window.opener и может подменить ' +
        'вкладку, из которой её открыли, на свою копию.',
    });
  });

  test('файлы, на которые ведут ссылки, лежат в public', () => {
    const problems = [];

    for (const link of links) {
      const href = link.href || '';
      if (isExternal(href) || !href.startsWith('/')) continue;

      const [pathPart] = href.split('#');
      // Адрес маршрута расширения не имеет; всё остальное — файл.
      if (!/\.[a-z0-9]+$/i.test(pathPart)) continue;
      if (existsInPublic(pathPart)) continue;

      problems.push(where(link) + ' → ' + pathPart);
    }

    reportProblems({
      title: 'Ссылки на файлы, которых нет в public.',
      problems,
      howToFix:
        'сверить имя файла. У резюме в имени есть пробелы и адрес собирается ' +
        'через encodeURIComponent — расхождение в одном символе даёт скачивание ' +
        'пустоты без единой ошибки в консоли.',
    });
  });
});

import { render, screen, within, fireEvent } from '@testing-library/react';
import App from './App';
import projects from './data/projects.json';
import caseTexts from './i18n/translations/projects.json';

// Прямой заход по адресу кейса — ровно тот сценарий, который раньше
// отдавал 404 на сервере: ссылка из мессенджера, F5 на странице кейса,
// переход из поиска.
function renderAt(pathname) {
  window.history.pushState({}, '', pathname);
  return render(<App />);
}

beforeEach(() => {
  // Язык берётся из localStorage, иначе в jsdom определился бы по navigator
  window.localStorage.setItem('lang', 'ru');
});

// Пункты меню лежат в разметке всегда, но у закрытого меню стоит inert:
// оно целиком убрано из дерева доступности, и getByRole его не видит —
// ровно как не видит его посетитель. Поэтому до проверок меню открывают.
function openMenu() {
  fireEvent.click(screen.getByRole('button', { name: 'Меню' }));
}

test.each(projects.map(p => p.id))('прямой адрес /%s рисует страницу кейса', id => {
  renderAt(`/${id}`);
  const title = caseTexts.projects[id].title.ru;
  expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
});

test('заголовок вкладки содержит название кейса', () => {
  renderAt('/logiq');
  expect(document.title).toContain(caseTexts.projects.logiq.title.ru);
});

// Переключатель внизу страницы кейса: порядок берётся из data/projects.json,
// у крайних кейсов одна из двух ссылок отсутствует.
test.each([
  ['axelnac', null, 'logiq'],
  ['logiq', 'axelnac', 'darts'],
  ['darts', 'logiq', 'adidas'],
  ['adidas', 'darts', null],
])('на /%s переключатель ведёт на соседние кейсы', (id, previousId, nextId) => {
  renderAt(`/${id}`);
  const switcher = screen.getByRole('navigation', { name: 'Другие кейсы' });

  for (const [label, neighbourId] of [
    ['Предыдущий кейс', previousId],
    ['Следующий кейс', nextId],
  ]) {
    const name = neighbourId && `${label}: ${caseTexts.projects[neighbourId].title.ru}`;
    const link = name ? within(switcher).queryByRole('link', { name }) : null;

    if (neighbourId) {
      expect(link).toHaveAttribute('href', `/${neighbourId}`);
    } else {
      expect(within(switcher).queryByText(label)).not.toBeInTheDocument();
    }
  }
});

test('несуществующий адрес ведёт на страницу «не найдено»', () => {
  renderAt('/takoy-stranicy-net');
  expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument();
});

test('со страницы кейса пункты меню ведут на секции главной', () => {
  renderAt('/logiq');
  openMenu();
  // Раньше здесь было просто "#cases", то есть /logiq#cases: клик оставлял
  // на кейсе, секции с таким id там нет, прокрутки не происходило
  for (const [name, href] of [
    ['Кейсы', '/#cases'],
    ['Обо мне', '/#about'],
    ['Статьи', '/#articles'],
  ]) {
    const links = screen.getAllByRole('link', { name });
    expect(links.length).toBeGreaterThan(0);
    links.forEach(link => expect(link).toHaveAttribute('href', href));
  }
});

// Переключение языка — единственный сценарий, где проверяется связка
// «контекст → все компоненты сразу»: заголовок страницы, заголовок вкладки
// и пункты меню приходят из разных мест, а меняться должны вместе.
function switchTo(label) {
  // Переключатель — одна кнопка в шапке, рядом с бургером; она доступна
  // и при закрытом меню. Метка описывает действие, а не текущий язык,
  // поэтому после нажатия она становится обратной.
  fireEvent.click(screen.getByRole('button', { name: label }));
}

test('переключение языка меняет заголовок страницы и заголовок вкладки', () => {
  renderAt('/logiq');
  expect(
    screen.getByRole('heading', { name: caseTexts.projects.logiq.title.ru })
  ).toBeInTheDocument();

  switchTo('Переключить на английский');

  expect(
    screen.getByRole('heading', { name: caseTexts.projects.logiq.title.en })
  ).toBeInTheDocument();
  expect(document.title).toContain(caseTexts.projects.logiq.title.en);
});

test('переключение языка не уводит со страницы кейса', () => {
  renderAt('/darts');

  switchTo('Переключить на английский');

  expect(window.location.pathname).toBe('/darts');
  expect(
    screen.getByRole('heading', { name: caseTexts.projects.darts.title.en })
  ).toBeInTheDocument();
});

// Полоса прочитанного нужна на длинных страницах кейсов и не нужна
// на остальных: на главной прокрутка ведёт по разделам, а не по одному
// связному тексту.
test.each(projects.map(p => p.id))('на странице кейса /%s есть полоса прочитанного', id => {
  renderAt(`/${id}`);
  expect(screen.getByTestId('reading-progress')).toBeInTheDocument();
});

test.each([
  ['главная', '/'],
  ['страница «не найдено»', '/takoy-stranicy-net'],
])('на %s полосы прочитанного нет', (_name, pathname) => {
  renderAt(pathname);
  expect(screen.queryByTestId('reading-progress')).not.toBeInTheDocument();
});

// Резюме стоит последним среди разделов сайта и выше разделителя,
// за которым идут ссылки на внешние площадки. Проверка смотрит на
// порядок в разметке: «после разделов» — это требование к расположению,
// а не к наличию.
describe('резюме в меню', () => {
  test('нарисовано ссылкой на файл с атрибутом download', () => {
    renderAt('/');
    openMenu();
    const cv = screen.getByRole('link', { name: 'Скачать CV' });

    expect(cv).toHaveAttribute('href', expect.stringContaining('.pdf'));
    expect(cv).toHaveAttribute('download');
  });

  test('стоит после разделов сайта и перед ссылками на площадки', () => {
    renderAt('/');
    openMenu();
    const cv = screen.getByRole('link', { name: 'Скачать CV' });
    const articles = screen.getByRole('link', { name: 'Статьи' });
    const telegram = screen.getByRole('link', { name: 'Telegram' });

    // compareDocumentPosition сообщает порядок узлов в документе:
    // DOCUMENT_POSITION_FOLLOWING означает, что второй узел идёт после.
    expect(articles.compareDocumentPosition(cv) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(cv.compareDocumentPosition(telegram) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('файл резюме меняется вместе с языком', () => {
    renderAt('/');
    openMenu();
    expect(screen.getByRole('link', { name: 'Скачать CV' })).toHaveAttribute(
      'href',
      expect.stringContaining('RU')
    );

    switchTo('Переключить на английский');

    expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute(
      'href',
      expect.stringContaining('EN')
    );
  });
});

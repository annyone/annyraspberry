import { render, screen, within } from '@testing-library/react';
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

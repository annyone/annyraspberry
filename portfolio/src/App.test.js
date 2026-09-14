import { render, screen } from '@testing-library/react';
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

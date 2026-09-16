import { screen } from '@testing-library/react';
import Home from './Home';
import projects from '../data/projects.json';
import caseTexts from '../i18n/translations/projects.json';
import articles from '../i18n/translations/articles.json';
import experiences from '../i18n/translations/experiences.json';
import { renderWithLanguage } from '../testing/renderWithLanguage';

describe('главная страница', () => {
  test('id раздела висит на теге section, а не на внутреннем div', () => {
    // Якорь на внутреннем div оставлял подзаголовок раздела («кейсы»,
    // «обо мне») выше верхней кромки экрана: переход по /#cases попадал
    // сразу в карточки. Прокрутку в jsdom не проверить — layout не считается,
    // а вот на каком элементе висит id, видно точно.
    renderWithLanguage(<Home />);

    for (const id of ['cases', 'about', 'articles']) {
      const target = document.getElementById(id);
      expect(target).not.toBeNull();
      expect(target.tagName).toBe('SECTION');
    }
  });

  test('на главной есть карточка каждого проекта', () => {
    const { container } = renderWithLanguage(<Home />);

    for (const project of projects) {
      const link = container.querySelector('a[href="/' + project.id + '"]');
      expect(link).not.toBeNull();
      expect(screen.getByText(caseTexts.projects[project.id].title.ru)).toBeInTheDocument();
    }
  });

  test('отрисованы все записи опыта и все статьи', () => {
    // Карточки опыта рисовались правильно почти случайно: пять вызовов
    // t() внутри ExperienceCard не разрешались никогда, и спасало только
    // запасное значение. Проверка на количество ловит обрыв этой связки.
    renderWithLanguage(<Home />);

    for (const experience of experiences.experiences) {
      const position = experience.position.ru ?? experience.position;
      expect(screen.getAllByRole('heading', { name: position }).length).toBeGreaterThan(0);
    }

    for (const article of articles.articles.items) {
      expect(screen.getByText(article.title.ru)).toBeInTheDocument();
    }
  });

  test('подзаголовки разделов переводятся', () => {
    // Берётся раздел «обо мне»: у раздела кейсов подзаголовка нет —
    // он стоял бы первой строкой сразу под обложкой и выглядывал бы
    // на первый экран, ради пустоты которого обложка и растянута.
    const { unmount } = renderWithLanguage(<Home />, { lang: 'ru' });
    expect(screen.getByText('обо мне')).toBeInTheDocument();
    unmount();

    renderWithLanguage(<Home />, { lang: 'en' });
    expect(screen.getByText('about')).toBeInTheDocument();
  });
});

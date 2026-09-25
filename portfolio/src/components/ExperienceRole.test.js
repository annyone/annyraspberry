import { screen } from '@testing-library/react';
import ExperienceRole from './ExperienceRole';
import { renderWithLanguage } from '../testing/renderWithLanguage';

// Роль получает уже локализованную запись — так её вызывает Home,
// который читает t('experiences') целиком.
const now = new Date(2026, 8, 25);

const base = {
  id: 'design',
  role: 'Продуктовый дизайнер',
  jobs: [
    {
      id: 'ideco',
      company: 'Айдеко',
      logo: '/images/companies/ideco.svg',
      link: 'https://ideco.ru/',
      start: '2026-01',
      end: null,
      description: 'Описание задач',
    },
    {
      id: 'axelpro',
      company: 'Аксель Про',
      start: '2022-06',
      end: '2026-01',
      achievements: ['Первое', 'Второе'],
    },
  ],
};

describe('роль в опыте работы', () => {
  test('заголовок роли и стаж, посчитанный по датам', () => {
    renderWithLanguage(<ExperienceRole experience={base} now={now} />);

    expect(screen.getByRole('heading', { name: base.role })).toBeInTheDocument();
    expect(screen.getByText('4 года')).toBeInTheDocument();
  });

  test('каждое место работы: компания, период, описание', () => {
    renderWithLanguage(<ExperienceRole experience={base} now={now} />);

    expect(screen.getByRole('heading', { name: 'Айдеко' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Аксель Про' })).toBeInTheDocument();
    expect(screen.getByText('с января 2026')).toBeInTheDocument();
    expect(screen.getByText('июнь 2022 — январь 2026')).toBeInTheDocument();
    expect(screen.getByText('Описание задач')).toBeInTheDocument();
  });

  test('достижения рисуются с тире в качестве маркера', () => {
    const { container } = renderWithLanguage(<ExperienceRole experience={base} now={now} />);

    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(screen.getAllByText('—')).toHaveLength(2);
  });

  test('без описания и достижений место работы не рисует пустой блок', () => {
    const bare = {
      ...base,
      jobs: [{ id: 'uspeh', company: 'Успех', start: '2014-06', end: '2016-04' }],
    };
    const { container } = renderWithLanguage(<ExperienceRole experience={bare} now={now} />);

    expect(container.querySelector('article').children).toHaveLength(2);
    expect(screen.getByText('2 года')).toBeInTheDocument();
  });

  test('логотип — картинка, без него — первая буква названия', () => {
    const { container } = renderWithLanguage(<ExperienceRole experience={base} now={now} />);
    const [withLogo, withoutLogo] = container.querySelectorAll('article');

    expect(withLogo.querySelector('img')).toHaveAttribute('src', '/images/companies/ideco.svg');
    expect(withoutLogo.querySelector('img')).toBeNull();
    expect(withoutLogo.querySelector('[aria-hidden="true"]')).toHaveTextContent('А');
  });

  test('ссылка на сайт компании только при наличии link, в новой вкладке с noopener', () => {
    const { container } = renderWithLanguage(<ExperienceRole experience={base} now={now} />);
    const links = container.querySelectorAll('a');

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', 'https://ideco.ru/');
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0].getAttribute('rel')).toContain('noopener');
  });

  test('на английском — английские месяцы и форма слова', () => {
    renderWithLanguage(<ExperienceRole experience={base} now={now} />, { lang: 'en' });

    expect(screen.getByText('4 years')).toBeInTheDocument();
    expect(screen.getByText('since January 2026')).toBeInTheDocument();
    expect(screen.getByText('June 2022 — January 2026')).toBeInTheDocument();
  });
});

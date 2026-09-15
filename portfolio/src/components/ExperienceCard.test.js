import { screen } from '@testing-library/react';
import ExperienceCard from './ExperienceCard';
import { renderWithLanguage } from '../testing/renderWithLanguage';

// Карточка получает уже локализованную запись — так её вызывает Home,
// который читает t('experiences') целиком. Отдельного обращения к словарю
// внутри карточки нет и быть не должно: experiences в JSON это массив,
// и ключи вида experiences.<id>.<поле> не разрешались никогда.
const base = {
  id: 'axelpro',
  dates: '06.24 — 01.26',
  position: 'Продуктовый дизайнер',
  company: 'Аксель Про',
  link: 'https://axel.pro',
  tasks: 'Описание задач на позиции',
  achievements: {
    marker: '🔥',
    items: ['Первое достижение', 'Второе достижение'],
  },
};

describe('карточка опыта', () => {
  test('показывает даты, должность, компанию и задачи', () => {
    renderWithLanguage(<ExperienceCard experience={base} />);

    expect(screen.getByText(base.dates)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: base.position })).toBeInTheDocument();
    expect(screen.getByText(base.company)).toBeInTheDocument();
    expect(screen.getByText(base.tasks)).toBeInTheDocument();
  });

  test('достижения рисуются с заданным маркером', () => {
    const { container } = renderWithLanguage(<ExperienceCard experience={base} />);

    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(screen.getByText('Первое достижение')).toBeInTheDocument();
    expect(screen.getAllByText('🔥')).toHaveLength(2);
  });

  test('пустые и отсутствующие достижения не ломают карточку', () => {
    // В experiences.json обе формы реально встречаются: у первой записи
    // achievements это пустой массив, у остальных — объект с items.
    for (const achievements of [[], undefined, { items: [] }]) {
      const { container, unmount } = renderWithLanguage(
        <ExperienceCard experience={{ ...base, achievements }} />
      );

      expect(screen.getByRole('heading', { name: base.position })).toBeInTheDocument();
      expect(container.querySelectorAll('li')).toHaveLength(0);
      unmount();
    }
  });

  test('ссылка на компанию появляется только при наличии link', () => {
    const { container, unmount } = renderWithLanguage(<ExperienceCard experience={base} />);
    expect(container.querySelector('a')).toHaveAttribute('href', base.link);
    unmount();

    const withoutLink = renderWithLanguage(
      <ExperienceCard experience={{ ...base, link: undefined }} />
    );
    expect(withoutLink.container.querySelector('a')).toBeNull();
    // Название компании при этом никуда не пропадает, просто не ссылка.
    expect(screen.getByText(base.company)).toBeInTheDocument();
  });

  test('ссылка на сайт компании открывается в новой вкладке с noopener', () => {
    const { container } = renderWithLanguage(<ExperienceCard experience={base} />);
    const link = container.querySelector('a');

    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
  });
});

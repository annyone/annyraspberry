import { screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';
import projects from '../data/projects.json';
import caseTexts from '../i18n/translations/projects.json';
import { renderWithLanguage } from '../testing/renderWithLanguage';

const adidas = projects.find(project => project.id === 'adidas');
const logiq = projects.find(project => project.id === 'logiq');

describe('карточка проекта на главной', () => {
  // У Adidas обложка в .png, ретина-версии у неё нет и быть не должно.
  // Раньше источник передавался безусловно из поля thumbnail_2x, которого
  // у этого проекта нет, и в разметку уходил <source> вообще без srcset.
  test('без ретина-версии не добавляет source без srcset', () => {
    const { container } = renderWithLanguage(<ProjectCard project={adidas} />);

    const sources = container.querySelectorAll('source');
    sources.forEach(source => expect(source).toHaveAttribute('srcset'));
  });

  test('с ретина-версией отдаёт второй источник с порогом 1024px', () => {
    const { container } = renderWithLanguage(<ProjectCard project={logiq} />);

    const source = container.querySelector('source');
    expect(source).toHaveAttribute('srcset', '/images/logiq/thumbnail-2x.webp');
    expect(source).toHaveAttribute('media', '(min-width: 1024px)');
  });

  test('показывает заголовок и описание из словаря', () => {
    renderWithLanguage(<ProjectCard project={logiq} />);

    // Тексты берутся из того же JSON, что читает сайт: поправленная
    // формулировка не должна ронять тест.
    expect(screen.getByText(caseTexts.projects.logiq.title.ru)).toBeInTheDocument();
    expect(screen.getByText(caseTexts.projects.logiq.description.ru)).toBeInTheDocument();
  });

  test('ведёт на адрес кейса', () => {
    const { container } = renderWithLanguage(<ProjectCard project={logiq} />);

    expect(container.querySelector('a')).toHaveAttribute('href', '/logiq');
  });

  test('подпись картинки совпадает с заголовком кейса', () => {
    renderWithLanguage(<ProjectCard project={logiq} />);

    expect(screen.getByAltText(caseTexts.projects.logiq.title.ru)).toBeInTheDocument();
  });
});

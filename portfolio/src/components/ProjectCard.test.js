import { screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';
import projects from '../data/projects.json';
import caseTexts from '../i18n/translations/projects.json';
import { renderWithLanguage } from '../testing/renderWithLanguage';
import { CASE_TRANSITION } from '../data/viewTransitions';
import { variants } from './Text';

const fs = require('fs');
const path = require('path');

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

describe('подложка карточки', () => {
  // Цвет вынесен из самой карточки в отдельный слой: при наведении растёт
  // он один, а заголовок, описание и снимок остаются на месте. Будь цвет
  // задан карточке, расти пришлось бы её отступам, и содержимое ползло бы
  // вместе с ними.
  const background = container => container.querySelector('[data-testid="card-background"]');

  test('цвет лежит на отдельном слое, а не на самой карточке', () => {
    const { container } = renderWithLanguage(<ProjectCard project={logiq} />);
    const article = container.querySelector('article');

    expect(background(container)).not.toBeNull();
    expect(article.style.backgroundImage).toBe('');
    expect(article.style.backgroundColor).toBe('');
  });

  test('при наведении слой растёт вверх и вниз, а не в стороны', () => {
    // Вёрстку в jsdom не измерить, но видно, какими классами задан рост:
    // сверху и снизу. Появись здесь горизонтальный рост, подложка вылезла
    // бы за край окна и дала бы прокрутку вбок.
    const { container } = renderWithLanguage(<ProjectCard project={logiq} />);
    const { className } = background(container);

    expect(className).toContain('group-hover:-top-4');
    expect(className).toContain('group-hover:-bottom-4');
    expect(className).not.toContain('group-hover:-left');
    expect(className).not.toContain('group-hover:-right');
  });
});

describe('переход на страницу кейса', () => {
  // Имя должно быть уникальным на всю страницу в момент съёмки. Карточек
  // на главной четыре, и если бы имена стояли на всех, браузер отказался
  // бы анимировать переход вообще.
  test('вне перехода имён для анимации на карточке нет', () => {
    const { container } = renderWithLanguage(<ProjectCard project={logiq} />);

    for (const name of Object.values(CASE_TRANSITION)) {
      expect(container.querySelector(`.${name}`)).toBeNull();
    }
  });

  test('карточка и обложка кейса берут имена из одного места', () => {
    // Анимация держится на совпадении имён по обе стороны перехода.
    // Разойдись они — переход не сломается заметно: части просто
    // растворятся вместо переезда, и понять это по коду будет нечем.
    expect(Object.keys(CASE_TRANSITION).sort()).toEqual(['background', 'thumbnail', 'title']);
    // Классы объявлены в src/index.css: без объявления имя не назначится,
    // и переход тихо выродится в растворение.
    const css = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf8');
    for (const name of Object.values(CASE_TRANSITION)) {
      expect(css).toContain(`.${name} {`);
    }
  });
});

describe('заголовок карточки', () => {
  const heading = () => screen.getByText(caseTexts.projects.logiq.title.ru);

  // Тот же набор стилей стоит у заголовка страницы кейса (CaseCover.test.js).
  // Разойдись они, заголовок менял бы размер прямо во время перехода: браузер
  // переводит его с карточки на страницу как один элемент, и скачок кегля был
  // бы виден именно в полёте.
  test('набран набором h2 — тем же, что заголовок страницы кейса', () => {
    renderWithLanguage(<ProjectCard project={logiq} />);

    for (const token of variants.h2.className.split(' ')) {
      expect(heading().className).toContain(token);
    }
  });

  test('остаётся заголовком второго уровня', () => {
    // Заголовков первого уровня на главной четыре быть не должно: по ним
    // программы чтения с экрана строят оглавление страницы.
    renderWithLanguage(<ProjectCard project={logiq} />);

    expect(heading().tagName).toBe('H2');
  });
});

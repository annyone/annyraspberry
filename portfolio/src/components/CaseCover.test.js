import { screen } from '@testing-library/react';
import CaseCover from './CaseCover';
import projects from '../data/projects.json';
import caseTexts from '../i18n/translations/projects.json';
import { renderWithLanguage } from '../testing/renderWithLanguage';
import { CASE_TRANSITION } from '../data/viewTransitions';
import { variants } from './Text';

const fs = require('fs');
const path = require('path');

const logiq = projects.find(project => project.id === 'logiq');
const title = caseTexts.projects.logiq.title.ru;

const render = () => renderWithLanguage(<CaseCover project={logiq} title={title} />);

// Элемент, помеченный для анимации перехода.
const namedBy = (container, name) => container.querySelector(`.${name}`);

describe('обложка страницы кейса', () => {
  test('подложка тянется до краёв окна и до самого его верха', () => {
    // Своей ширины подложка не ограничивает вовсе — оттого и доходит
    // до краёв. Верхнее отрицательное поле втягивает её под распорку
    // шапки, а такой же padding возвращает содержимое на место; шапка
    // прозрачная, поэтому цвет виден и за ней.
    const { container } = render();
    const { className } = container.querySelector('div');

    expect(className).toContain('-mt-[var(--nav-height)]');
    expect(className).toContain('pt-[var(--nav-height)]');
    expect(className).not.toContain('max-w-');
  });

  test('содержимое обложки стоит по общей сетке страницы', () => {
    // Та же сетка у шапки, карточек кейсов и разделов главной. Пока
    // обложка отступала от края сама по себе, заголовок под логотипом
    // с ним не совпадал.
    const { container } = render();

    expect(container.querySelector('.page-grid')).not.toBeNull();
  });

  test('подложка кончается на 16px ниже снимка', () => {
    // Нижняя граница снимка должна остаться видна на цвете — ради этого
    // отступ и оставлен, а не сведён к нулю.
    const { container } = render();

    expect(namedBy(container, CASE_TRANSITION.thumbnail).className).toContain('pb-4');
  });

  test('у подложки нет скругления', () => {
    const { container } = render();

    expect(container.querySelector('div').className).not.toContain('rounded');
  });

  test('заголовок набран тем же кеглем, что карточка кейса на главной', () => {
    // Набор h2, хотя тег h1: разойдись кегли, заголовок менял бы размер
    // прямо во время перехода с главной — браузер переводит его с карточки
    // на страницу как один элемент.
    render();
    const heading = screen.getByRole('heading', { name: title });

    expect(heading.tagName).toBe('H1');
    for (const token of variants.h2.className.split(' ')) {
      expect(heading.className).toContain(token);
    }
  });

  test('заголовок набран белым', () => {
    // Подложка тёмная при любой теме, и заголовок цветом из темы на ней
    // пропадал бы в светлой.
    render();

    expect(screen.getByRole('heading', { name: title }).className).toContain('text-white');
  });

  test('подложка, заголовок и снимок помечены для анимации перехода', () => {
    // Те же имена стоят на карточке главной, пока идёт переход на этот
    // кейс: по ним браузер понимает, что это один и тот же элемент,
    // и переводит его с места на место, а не растворяет.
    const { container } = render();

    for (const name of Object.values(CASE_TRANSITION)) {
      expect(namedBy(container, name)).not.toBeNull();
    }
  });
});

describe('заголовок при переходе', () => {
  const css = () => fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf8');
  // Тело правила для заданного псевдоэлемента. Без регулярного выражения:
  // экранировать в нём скобки селектора и не ошибиться дороже, чем найти
  // блок по его границам.
  const rule = name => {
    const text = css();
    const start = text.indexOf(name + '(case-title)');
    const open = text.indexOf('{', start);

    expect(start).toBeGreaterThan(-1);

    return text.slice(open, text.indexOf('}', open));
  };

  test('не растягивается под размер блока', () => {
    // Снимок по умолчанию тянется под размер группы, а группа едет от блока
    // в две строки (карточка, колонка на 40% ширины) к блоку в одну строку
    // (страница во всю ширину). Без отмены растяжения текст раздувался
    // по высоте вдвое в начале перехода.
    expect(rule('::view-transition-new')).toContain('object-fit: none');
  });

  test('показывается в одной копии, а не растворяется из старой в новую', () => {
    // Текст по обе стороны один и тот же. Пока показывались оба снимка,
    // в середине перехода на экране были две копии текста, разбитые
    // на строки по-разному, — это читалось как два разъезжающихся
    // заголовка.
    expect(rule('::view-transition-old')).toContain('display: none');
    expect(rule('::view-transition-new')).toContain('animation: none');
  });
});

import { caseDescriptions } from '../../routes';
import projects from '../projects.json';
import { reportProblems } from '../../testing/problems';
import { existsInPublic, publicFiles } from '../../testing/publicFiles';

// Перечень должен совпадать с ветками switch в components/CaseBlocks.js.
// Опечатка в type сейчас ничего не ломает: блок молча попадает в ветку
// default и просто не отрисовывается — раздел выходит пустым, и заметить
// это можно только открыв страницу глазами.
const KNOWN_TYPES = [
  'text',
  'list',
  'image',
  'banners',
  'article',
  'row',
  'group',
  'feedback',
  'video',
];

// Обход всех блоков описания с человекочитаемым адресом каждого:
// «logiq → раздел after.title → блок 2 → вложенный блок 1».
function eachBlock(visit) {
  for (const [caseId, description] of Object.entries(caseDescriptions)) {
    (description.sections || []).forEach((section, sectionIndex) => {
      const sectionLabel =
        caseId + ' → раздел «' + (section.title || '№' + (sectionIndex + 1)) + '»';

      const walk = (blocks, parentLabel) => {
        (blocks || []).forEach((block, index) => {
          const label = parentLabel + ' → блок ' + (index + 1);
          visit(block, label, caseId);
          if (Array.isArray(block.blocks)) walk(block.blocks, label);
        });
      };

      walk(section.blocks, sectionLabel);
    });
  }
}

describe('описания кейсов', () => {
  test('у каждого проекта есть описание кейса', () => {
    const problems = [];

    for (const project of projects) {
      if (!caseDescriptions[project.id]) {
        problems.push('проект «' + project.id + '» есть в data/projects.json, но описания нет');
      }
    }
    for (const id of Object.keys(caseDescriptions)) {
      if (!projects.some(project => project.id === id)) {
        problems.push('описание «' + id + '» есть, но такого проекта нет в data/projects.json');
      }
    }

    reportProblems({
      title: 'Списки проектов и описаний кейсов разошлись.',
      problems,
      howToFix:
        'привести в соответствие data/projects.json и routes.js. Проект без описания ' +
        'не получает маршрута (см. App.js): карточка на главной есть, а по клику ' +
        'открывается «страница не найдена».',
    });
  });

  test('у каждого блока известный тип', () => {
    const problems = [];

    eachBlock((block, label) => {
      if (KNOWN_TYPES.includes(block.type)) return;
      problems.push(label + ' → тип «' + block.type + '»');
    });

    reportProblems({
      title: 'Блоки с типом, которого нет в CaseBlocks.js.',
      problems,
      howToFix:
        'исправить опечатку либо добавить обработку типа в components/CaseBlocks.js. ' +
        'Сейчас неизвестный тип попадает в ветку default и просто не рисуется — ' +
        'раздел выходит пустым без единой ошибки. Допустимые типы: ' +
        KNOWN_TYPES.join(', ') +
        '.',
    });
  });

  test('каждая картинка существует в public с точностью до регистра', () => {
    const problems = [];

    eachBlock((block, label) => {
      if (block.type !== 'image') return;
      if (existsInPublic(block.src)) return;

      problems.push(label + ' → ' + block.src);
    });

    reportProblems({
      title: 'Картинки, которых нет в папке public.',
      problems,
      howToFix:
        'поправить путь в описании кейса либо положить файл. Сверка идёт по точному ' +
        'списку файлов, а не через существование пути: Windows не различает регистр, ' +
        'а сервер на Linux различает — «Scale.webp» вместо «scale.webp» иначе всплыл бы ' +
        'только на сайте.',
    });
  });

  test('у каждой картинки .webp есть пара -2x.webp', () => {
    const problems = [];

    eachBlock((block, label) => {
      if (block.type !== 'image') return;
      if (typeof block.src !== 'string' || !block.src.endsWith('.webp')) return;

      const retina = block.src.replace(/\.webp$/, '-2x.webp');
      if (publicFiles.has(retina)) return;

      problems.push(label + ' → нет файла ' + retina);
    });

    reportProblems({
      title: 'Картинки .webp без версии для экранов высокой плотности.',
      problems,
      howToFix:
        'положить рядом файл с суффиксом -2x. Функция retinaSources (components/Image.js) ' +
        'выводит второй источник из имени файла для любого .webp и не проверяет, ' +
        'существует ли он: без пары браузер на ретине запросит адрес, которого нет.',
    });
  });

  test('у каждой картинки задана подпись', () => {
    const problems = [];

    eachBlock((block, label) => {
      if (block.type !== 'image') return;
      if (typeof block.alt === 'string' && block.alt.trim() !== '') return;

      problems.push(label + ' → ' + block.src);
    });

    reportProblems({
      title: 'Картинки без ключа подписи.',
      problems,
      howToFix:
        'добавить поле alt со ссылкой на ключ перевода. Подпись читают скринридеры ' +
        'и поисковики. Что текст по этому ключу непустой, отдельно проверяет ' +
        'i18n/translations.test.js, а что ключ вообще существует — i18n/i18n-coverage.test.js.',
    });
  });

  test('каждый раздел имеет заголовок и непустой список блоков', () => {
    const problems = [];

    for (const [caseId, description] of Object.entries(caseDescriptions)) {
      const sections = description.sections || [];

      if (sections.length === 0) {
        problems.push(caseId + ' → ни одного раздела');
        continue;
      }

      sections.forEach((section, index) => {
        const label = caseId + ' → раздел №' + (index + 1);
        if (!section.title) problems.push(label + ' → нет title');
        if (!Array.isArray(section.blocks) || section.blocks.length === 0) {
          problems.push(label + ' («' + section.title + '») → пустой список блоков');
        }
      });
    }

    reportProblems({
      title: 'Разделы без заголовка или без содержимого.',
      problems,
      howToFix:
        'дописать блоки либо убрать раздел. Пустой раздел рисует заголовок, ' +
        'под которым ничего нет.',
    });
  });
});

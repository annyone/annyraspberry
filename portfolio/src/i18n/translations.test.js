import { reportProblems } from '../testing/problems';
import projects from '../data/projects.json';

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = path.resolve(__dirname, 'translations');
const PAGES_DIR = path.join(TRANSLATIONS_DIR, 'pages');

// Файлы читаются с диска, а не импортируются списком: новый словарь
// попадает в проверку сам, без правки теста. Именно это и нужно —
// забытый файл иначе проверялся бы только глазами.
function readJsonDir(dir) {
  return fs
    .readdirSync(dir)
    .filter(name => name.endsWith('.json'))
    .map(name => ({
      name,
      relative: path
        .relative(path.resolve(__dirname, '..'), path.join(dir, name))
        .replace(/\\/g, '/'),
      data: JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')),
    }));
}

const rootFiles = readJsonDir(TRANSLATIONS_DIR);
const pageFiles = readJsonDir(PAGES_DIR);
const allFiles = [...rootFiles, ...pageFiles];

// Пара — это узел ровно с двумя ключами ru и en. Такое же условие стоит
// в resolveNode (i18n/LanguageContext.js), и тесты ниже опираются на него.
function isPair(node) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return false;
  const keys = Object.keys(node);
  return keys.length === 2 && keys.includes('ru') && keys.includes('en');
}

// Обход дерева словаря с накоплением пути вида "hero.subtitle.part1".
function walk(node, visit, keyPath = '') {
  visit(node, keyPath);

  if (Array.isArray(node)) {
    node.forEach((item, index) => walk(item, visit, keyPath + '.' + index));
  } else if (node && typeof node === 'object' && !isPair(node)) {
    for (const [key, value] of Object.entries(node)) {
      walk(value, visit, keyPath ? keyPath + '.' + key : key);
    }
  }
}

function walkAllFiles(visit) {
  for (const file of allFiles) {
    walk(file.data, (node, keyPath) => visit(node, keyPath, file));
  }
}

describe('словари переводов', () => {
  test('у каждой двуязычной пары есть и ru, и en', () => {
    const problems = [];

    walkAllFiles((node, keyPath, file) => {
      if (!node || typeof node !== 'object' || Array.isArray(node)) return;
      const keys = Object.keys(node);
      const hasRu = keys.includes('ru');
      const hasEn = keys.includes('en');
      if (hasRu === hasEn) return;

      problems.push(
        file.relative + ' → ' + keyPath + ' → есть только «' + (hasRu ? 'ru' : 'en') + '»'
      );
    });

    reportProblems({
      title: 'Переводы, у которых заполнен только один язык.',
      problems,
      howToFix:
        'дописать недостающий язык. Само по себе это не ломает сайт: resolveNode ' +
        'подставит второй язык молча, и посетитель просто увидит текст не на том языке, ' +
        'который выбрал. Поэтому такое и не всплывает само.',
    });
  });

  test('ни одна строка перевода не пустая и не состоит из пробелов', () => {
    const problems = [];

    walkAllFiles((node, keyPath, file) => {
      if (typeof node !== 'string') return;
      if (node.trim() !== '') return;

      problems.push(file.relative + ' → ' + keyPath + ' → ' + JSON.stringify(node));
    });

    reportProblems({
      title: 'Пустые строки в переводах.',
      problems,
      howToFix:
        'написать текст либо убрать ключ вместе с его использованием. ' +
        'Пустая подпись у картинки хуже отсутствующей: скринридер объявит картинку, ' +
        'но не скажет о ней ничего.',
    });
  });

  test('структура ru и en совпадает', () => {
    const problems = [];

    walkAllFiles((node, keyPath, file) => {
      if (!isPair(node)) return;

      const { ru, en } = node;

      if (Array.isArray(ru) || Array.isArray(en)) {
        if (!Array.isArray(ru) || !Array.isArray(en)) {
          problems.push(file.relative + ' → ' + keyPath + ' → массив только в одном языке');
        } else if (ru.length !== en.length) {
          problems.push(
            file.relative +
              ' → ' +
              keyPath +
              ' → в ru ' +
              ru.length +
              ' элементов, в en ' +
              en.length
          );
        }
        return;
      }

      const bothObjects = ru && en && typeof ru === 'object' && typeof en === 'object';
      if (!bothObjects) return;

      const ruKeys = Object.keys(ru).sort().join(', ');
      const enKeys = Object.keys(en).sort().join(', ');
      if (ruKeys !== enKeys) {
        problems.push(
          file.relative +
            ' → ' +
            keyPath +
            ' → разный набор ключей: [' +
            ruKeys +
            '] и [' +
            enKeys +
            ']'
        );
      }
    });

    reportProblems({
      title: 'Русская и английская версии описаны по-разному.',
      problems,
      howToFix:
        'привести к одной структуре. Иначе на сайте будет разное число пунктов ' +
        'в зависимости от выбранного языка.',
    });
  });

  test('списки записаны массивами, а не объектом с числовыми ключами', () => {
    const problems = [];

    walkAllFiles((node, keyPath, file) => {
      if (!node || typeof node !== 'object' || Array.isArray(node) || isPair(node)) return;

      const keys = Object.keys(node);
      if (keys.length === 0) return;
      if (!keys.every(key => /^\d+$/.test(key))) return;

      problems.push(file.relative + ' → ' + keyPath + ' → ключи ' + keys.join(', '));
    });

    reportProblems({
      title: 'Списки, записанные объектом с числовыми ключами.',
      problems,
      howToFix:
        'переписать массивом. При таком формате длина списка становится частью кода: ' +
        'шестой пункт не появится на странице, пока в разметку не допишут items.5, ' +
        'а при удалении пятого на странице отрисуется текст самого ключа.',
    });
  });

  test('объект не притворяется парой ru/en случайно', () => {
    const problems = [];

    walkAllFiles((node, keyPath, file) => {
      if (!node || typeof node !== 'object' || Array.isArray(node)) return;

      const keys = Object.keys(node);
      if (keys.length <= 2) return;
      if (typeof node.ru !== 'string' || typeof node.en !== 'string') return;

      const extra = keys.filter(key => key !== 'ru' && key !== 'en').join(', ');
      problems.push(file.relative + ' → ' + keyPath + ' → лишние ключи: ' + extra);
    });

    reportProblems({
      title: 'Узел со строковыми ru и en, но с лишними ключами рядом.',
      problems,
      howToFix:
        'разнести на два узла. resolveNode считает парой узел ровно с двумя ключами: ' +
        'при трёх ключах перевод не подставится и на страницу уедет объект целиком. ' +
        'Проверка смотрит только на строковые ru/en — узел nav.lang, где lang.ru сам ' +
        'является парой, под неё не попадает.',
    });
  });

  test('файлы словарей не объявляют одинаковых ключей верхнего уровня', () => {
    const seen = new Map();
    const problems = [];

    for (const file of rootFiles) {
      for (const key of Object.keys(file.data)) {
        if (seen.has(key)) {
          problems.push(
            'ключ «' + key + '» объявлен и в ' + seen.get(key) + ', и в ' + file.relative
          );
        } else {
          seen.set(key, file.relative);
        }
      }
    }

    reportProblems({
      title: 'Пересечение ключей верхнего уровня между файлами словарей.',
      problems,
      howToFix:
        'переименовать один из ключей. В LanguageContext.js файлы сливаются спредом, ' +
        'и одинаковый ключ означает тихую перезапись: половина словаря просто исчезнет.',
    });
  });

  test('каждый файл pages/*.json объявляет один корневой ключ, равный имени файла', () => {
    const problems = [];

    for (const file of pageFiles) {
      const expected = file.name.replace(/\.json$/, '');
      const keys = Object.keys(file.data);

      if (keys.length !== 1 || keys[0] !== expected) {
        problems.push(
          file.relative +
            ' → ожидался единственный корневой ключ «' +
            expected +
            '», найдено: ' +
            (keys.join(', ') || 'ничего')
        );
      }
    }

    reportProblems({
      title: 'Файл словаря страницы объявляет не тот корневой ключ.',
      problems,
      howToFix:
        'переименовать корневой ключ под имя файла. Это самый вероятный сценарий ' +
        'добавления пятого кейса: скопировать adidas.json, переименовать файл и забыть ' +
        'ключ внутри. Тогда pages.adidas молча перезапишется, и страница Adidas опустеет.',
    });
  });

  test('id проектов совпадают с ключами словаря projects', () => {
    const texts = rootFiles.find(file => file.name === 'projects.json').data.projects;
    const problems = [];

    for (const project of projects) {
      if (!texts[project.id]) {
        problems.push(
          'проект «' + project.id + '» есть в data/projects.json, но текстов для него нет'
        );
      }
    }
    for (const id of Object.keys(texts)) {
      if (!projects.some(project => project.id === id)) {
        problems.push(
          'тексты «' + id + '» есть в словаре, но такого проекта нет в data/projects.json'
        );
      }
    }

    reportProblems({
      title: 'Списки проектов и их текстов разошлись.',
      problems,
      howToFix:
        'привести в соответствие data/projects.json и i18n/translations/projects.json. ' +
        'Без текста CasePage нарисует заголовок в виде строки ключа, а сборка ' +
        'упадёт на scripts/generate-case-html.js.',
    });
  });

  test('articles.items и experiences — массивы', () => {
    const articles = rootFiles.find(file => file.name === 'articles.json').data;
    const experiences = rootFiles.find(file => file.name === 'experiences.json').data;

    // Обе ветки кода обходят эти узлы через .map(). Объект вместо массива
    // означает либо пустой раздел, либо падение страницы.
    expect(Array.isArray(articles.articles.items)).toBe(true);
    expect(Array.isArray(experiences.experiences)).toBe(true);
  });
});

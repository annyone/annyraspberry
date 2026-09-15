import projects from './projects.json';
import { getNavItems, getCvItem } from './navItems';
import { reportProblems } from '../testing/problems';
import { existsInPublic, publicFiles } from '../testing/publicFiles';

const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../public/manifest.json'), 'utf8')
);

// Меню строится функцией от переводчика и языка. Тексты здесь не нужны,
// проверяются только адреса, поэтому вместо словаря подставляется
// функция, возвращающая сам ключ.
// Резюме больше не входит в getNavItems — в шапке оно рисуется кнопкой.
// Его нужно добавить сюда руками, иначе проверка ниже перестанет что-либо
// проверять: ни одного элемента с полем download в списке не останется,
// цикл отработает вхолостую и тест позеленеет при отсутствующем файле.
const navItems = [
  ...getNavItems(key => key, 'ru'),
  ...getNavItems(key => key, 'en'),
  getCvItem(key => key, 'ru'),
  getCvItem(key => key, 'en'),
];

describe('файлы, на которые ссылаются данные', () => {
  test('обложки и картинки для превью лежат в public', () => {
    const problems = [];

    for (const project of projects) {
      for (const field of ['thumbnail', 'thumbnail_2x', 'ogImage']) {
        const value = project[field];
        if (value === undefined) continue;
        if (existsInPublic(value)) continue;

        problems.push(project.id + ' → ' + field + ' → ' + value);
      }
    }

    reportProblems({
      title: 'Файлы из data/projects.json не найдены.',
      problems,
      howToFix:
        'поправить путь либо положить файл. ogImage уходит в meta-теги страницы кейса ' +
        '(scripts/generate-case-html.js): при неверном пути ссылка в мессенджере ' +
        'развернётся без картинки.',
    });
  });

  test('у обложки .webp есть пара -2x, у .png она не требуется', () => {
    const problems = [];

    for (const project of projects) {
      const { thumbnail } = project;
      if (typeof thumbnail !== 'string') continue;

      // Правило то же, что в retinaSources: второй источник существует
      // только для .webp. У Adidas обложка в .png — и поля thumbnail_2x
      // у него нет намеренно, это не пропуск.
      if (!thumbnail.endsWith('.webp')) continue;

      const retina = thumbnail.replace(/\.webp$/, '-2x.webp');
      if (publicFiles.has(retina)) continue;

      problems.push(project.id + ' → нет файла ' + retina);
    }

    reportProblems({
      title: 'Обложки .webp без версии для экранов высокой плотности.',
      problems,
      howToFix: 'положить рядом файл с суффиксом -2x либо перевести обложку в другой формат.',
    });
  });

  test('файлы резюме из меню существуют', () => {
    const problems = [];

    // Страховка от вхолостую отработавшего цикла: файлов резюме два,
    // по одному на язык. Если их станет ноль, проверка ниже потеряет смысл,
    // но останется зелёной — поэтому количество проверяется отдельно.
    const downloads = navItems.filter(item => item.download && item.url);
    expect(downloads).toHaveLength(2);

    for (const item of navItems) {
      if (!item.download || !item.url) continue;
      if (existsInPublic(item.url)) continue;

      problems.push(item.url);
    }

    reportProblems({
      title: 'Файлы резюме не найдены в public.',
      problems,
      howToFix:
        'сверить имена файлов в public с теми, что собирает getNavItems (data/navItems.js). ' +
        'В именах есть пробелы, адрес собирается через encodeURIComponent — расхождение ' +
        'в одном символе даёт скачивание пустоты без единой ошибки в консоли.',
    });
  });

  test('manifest.json не ссылается на несуществующие файлы', () => {
    const problems = [];

    for (const icon of manifest.icons || []) {
      // В манифесте пути записаны относительно корня сайта и без ведущего
      // слэша: "logo192.png". В списке файлов они лежат как "/logo192.png".
      const urlPath = icon.src.startsWith('/') ? icon.src : '/' + icon.src;
      if (existsInPublic(urlPath)) continue;

      problems.push(icon.src + ' (размеры ' + icon.sizes + ')');
    }

    reportProblems({
      title: 'Значки из manifest.json не найдены.',
      problems,
      howToFix:
        'убрать запись из public/manifest.json либо добавить файл. Браузер читает ' +
        'манифест при добавлении сайта на домашний экран и молча пропускает битые ' +
        'значки — заметить это можно только на телефоне.',
    });
  });
});

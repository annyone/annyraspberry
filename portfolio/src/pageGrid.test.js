import { render } from '@testing-library/react';
import App from './App';
import projects from './data/projects.json';
import { reportProblems } from './testing/problems';

const fs = require('fs');
const path = require('path');

// Отступ от края у всего на странице должен быть один. Задаёт его класс
// .page-grid в src/index.css, и проверка следит, чтобы его не начали
// обходить стороной.
//
// Раньше отступ складывался в двух местах сразу: шапка стоит
// position: fixed, отступы body её не касались, и она брала свои —
// ВНУТРИ ограничения по ширине, а всё остальное сидело внутри body
// и получало отступ СНАРУЖИ ограничения. Шапка отступала от края на 48px
// больше содержимого, и логотип не совпадал с началом текста под ним.
// Глазами это ловится только по линейке и только на широком экране.

const SOURCE_DIR = path.resolve(__dirname);

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    if (!entry.name.endsWith('.js') || entry.name.includes('.test.')) return [];
    return [full];
  });
}

describe('сетка страницы', () => {
  test('боковой отступ задан в одном месте, а не переписан по файлам', () => {
    const problems = [];

    for (const file of sourceFiles(SOURCE_DIR)) {
      const code = fs.readFileSync(file, 'utf8');
      const relative = path.relative(SOURCE_DIR, file).split(path.sep).join('/');

      // Комментарии рядом с сеткой объясняют, почему она одна, и ссылаются
      // на прежние значения — их проверять не за чем.
      const markup = code
        .split('\n')
        .filter(line => !line.trim().startsWith('//') && !line.trim().startsWith('*'))
        .join('\n');

      if (/className=[^\n]*\bpx-8\b/.test(markup)) {
        problems.push(relative + ' → задаёт боковой отступ сам (px-8)');
      }
      if (/className=[^\n]*max-w-\[1600px\]/.test(markup)) {
        problems.push(relative + ' → задаёт ширину сетки сам (max-w-[1600px])');
      }
    }

    reportProblems({
      title: 'Боковой отступ задан мимо общей сетки.',
      problems,
      howToFix:
        'поставить класс page-grid вместо своих px-8 и max-w-[1600px]. ' +
        'Две сетки расходятся молча: на узком экране разницы не видно, ' +
        'а на широком логотип перестаёт совпадать с текстом под ним.',
    });
  });

  test('на каждой странице сетка действительно применена', () => {
    const problems = [];
    const pages = [['главная', '/'], ...projects.map(project => [project.id, '/' + project.id])];

    for (const [name, route] of pages) {
      window.localStorage.setItem('lang', 'ru');
      window.history.pushState({}, '', route);

      const { container, unmount } = render(<App />);
      const count = container.querySelectorAll('.page-grid').length;
      unmount();

      // Шапка, меню и содержимое страницы — меньше трёх быть не может.
      if (count < 3) {
        problems.push('страница «' + name + '» → блоков по сетке ' + count);
      }
    }

    reportProblems({
      title: 'Страницы, где сетка не применена.',
      problems,
      howToFix:
        'проверить, что шапка, меню и содержимое страницы обёрнуты в page-grid. ' +
        'Без него блок прижимается к самому краю окна.',
    });
  });
});

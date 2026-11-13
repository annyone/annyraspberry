import imageSizes from './imageSizes.json';
import { reportProblems } from '../testing/problems';

const { readImageSizes } = require('../../scripts/generate-image-sizes');

// По этим числам Image.js отводит место под картинку до её загрузки.
// Устаревшая запись даёт неверные пропорции: место отведётся не того
// размера, и страница всё равно дёрнется, когда файл загрузится.
describe('размеры картинок', () => {
  const actual = readImageSizes();

  test('записаны для каждой картинки .webp и совпадают с файлами', () => {
    const problems = [];

    for (const [file, [width, height]] of Object.entries(actual)) {
      const saved = imageSizes[file];
      if (!saved) problems.push(file + ' → нет записи');
      else if (saved[0] !== width || saved[1] !== height) {
        problems.push(
          file + ' → записано ' + saved.join('×') + ', в файле ' + width + '×' + height
        );
      }
    }
    for (const file of Object.keys(imageSizes)) {
      if (!actual[file]) problems.push(file + ' → запись есть, файла нет');
    }

    reportProblems({
      title: 'Файл src/data/imageSizes.json разошёлся с картинками в public/images.',
      problems,
      fix: 'запустить npm run images:sizes в папке portfolio и закоммитить результат.',
    });
  });

  // Атрибуты width и height берутся от основной картинки и действуют
  // и на версию -2x. Разойдись у пары пропорции, место под картинку на
  // экране высокой плотности отводилось бы неверно.
  test('у пары X.webp и X-2x.webp одни пропорции', () => {
    const problems = [];

    for (const [file, [width, height]] of Object.entries(actual)) {
      if (file.endsWith('-2x.webp')) continue;
      const retina = actual[file.replace(/\.webp$/, '-2x.webp')];
      if (!retina) continue;

      const ratio = width / height;
      const retinaRatio = retina[0] / retina[1];
      if (Math.abs(ratio - retinaRatio) / ratio > 0.01) {
        problems.push(file + ' → ' + width + '×' + height + ', а версия -2x — ' + retina.join('×'));
      }
    }

    reportProblems({
      title: 'Пропорции картинки и её версии -2x различаются больше чем на 1%.',
      problems,
      fix: 'пересохранить одну из версий так, чтобы пропорции совпали.',
    });
  });
});

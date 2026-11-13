/**
 * Записывает размеры картинок из public/images в src/data/imageSizes.json.
 *
 * Зачем: components/Image.js ставит по этим числам атрибуты width и height.
 * По ним браузер ещё до загрузки файла знает пропорции картинки и сразу
 * отводит под неё место. Без них картинка до загрузки занимает нулевую
 * высоту, а после — раздвигает страницу, и текст под ней прыгает.
 *
 * Запуск: npm run images:sizes — после того, как в public/images добавили
 * или заменили картинку. Забытый запуск ловит data/imageSizes.test.js.
 *
 * Читается только заголовок файла, без сторонних библиотек.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMAGES = path.join(ROOT, 'public/images');
const OUTPUT = path.join(ROOT, 'src/data/imageSizes.json');

/** Ширина и высота .webp. Три разновидности контейнера, у каждой своя запись. */
function webpSize(file) {
  const fd = fs.openSync(file, 'r');
  const head = Buffer.alloc(32);
  fs.readSync(fd, head, 0, 32, 0);
  fs.closeSync(fd);

  const kind = head.toString('ascii', 12, 16);

  // Расширенный формат (в нём же анимации): 24 бита на сторону, минус один.
  if (kind === 'VP8X') return [head.readUIntLE(24, 3) + 1, head.readUIntLE(27, 3) + 1];

  // Сжатие с потерями: по 14 бит на сторону.
  if (kind === 'VP8 ') return [head.readUInt16LE(26) & 0x3fff, head.readUInt16LE(28) & 0x3fff];

  // Сжатие без потерь: 14 бит ширины и 14 бит высоты подряд, минус один.
  if (kind === 'VP8L') {
    const bits = head.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
  }

  throw new Error(`Не удалось прочитать размеры: ${file}`);
}

function collect(dir, prefix, into) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const urlPath = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) collect(path.join(dir, entry.name), urlPath, into);
    else if (entry.name.endsWith('.webp')) into[urlPath] = webpSize(path.join(dir, entry.name));
  }
  return into;
}

/** Размеры всех .webp: { '/images/darts/scale.webp': [2136, 1396], ... } */
function readImageSizes() {
  const sizes = collect(IMAGES, '/images', {});
  return Object.fromEntries(Object.entries(sizes).sort(([a], [b]) => a.localeCompare(b)));
}

module.exports = { readImageSizes };

if (require.main === module) {
  const sizes = readImageSizes();
  const lines = Object.entries(sizes).map(
    ([file, [width, height]]) => `  ${JSON.stringify(file)}: [${width}, ${height}]`
  );
  fs.writeFileSync(OUTPUT, `{\n${lines.join(',\n')}\n}\n`, 'utf8');
  console.log(`Готово: src/data/imageSizes.json, картинок — ${lines.length}.`);
}

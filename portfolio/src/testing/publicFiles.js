const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../../public');

// Все файлы папки public в виде путей, как они пишутся в разметке:
// '/images/darts/scale.webp', '/manifest.json' и так далее.
//
// Сверка идёт по этому множеству, а НЕ через fs.existsSync, специально:
// Windows не различает регистр в именах файлов, а Linux различает.
// Опечатка '/images/darts/Scale.webp' прошла бы existsSync на машине
// автора и обернулась пустым местом на сайте. Сравнение строк с точным
// списком ловит её там, где она сделана.
function collect(dir, prefix, into) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const urlPath = prefix + '/' + entry.name;
    if (entry.isDirectory()) {
      collect(path.join(dir, entry.name), urlPath, into);
    } else {
      into.add(urlPath);
    }
  }
  return into;
}

const publicFiles = collect(PUBLIC_DIR, '', new Set());

// Адрес может быть закодирован (у файлов резюме в имени есть пробелы,
// и navItems.js прогоняет их через encodeURIComponent), поэтому перед
// сверкой раскодируем. Некорректная кодировка — сама по себе поломка,
// поэтому decodeURIComponent не глушим, а возвращаем адрес как есть.
export function existsInPublic(urlPath) {
  if (typeof urlPath !== 'string' || urlPath === '') return false;

  let decoded = urlPath;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return false;
  }

  return publicFiles.has(decoded);
}

export { publicFiles, PUBLIC_DIR };

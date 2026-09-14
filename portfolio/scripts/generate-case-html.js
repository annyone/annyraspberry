/**
 * Делает по отдельному HTML-файлу на каждый кейс: build/logiq/index.html и т. д.
 *
 * Зачем:
 * 1. Telegram, LinkedIn и поисковые роботы читают meta прямо из HTML и не
 *    выполняют JavaScript. Пока на все маршруты отдавался один build/index.html,
 *    ссылка на любой кейс разворачивалась в общий заголовок сайта.
 * 2. Адрес /logiq становится настоящим файлом на диске и открывается даже
 *    если mod_rewrite на хостинге выключен, то есть у починки прямых ссылок
 *    появляется вторая, независимая от .htaccess опора.
 *
 * Запускается после react-scripts build, см. поле scripts.build в package.json.
 */
const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://annyraspberry.pro';
// Язык мета-тегов. Совпадает с языком public/index.html: превью ссылки
// формируется один раз на сервере и не зависит от языка посетителя.
const LANG = 'ru';

const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const INDEX = path.join(BUILD, 'index.html');

const projects = require(path.join(ROOT, 'src/data/projects.json'));
const texts = require(path.join(ROOT, 'src/i18n/translations/projects.json')).projects;

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Строит выражение для поиска тега <meta> или <link> по одному его атрибуту.
 *
 * Между именем тега и атрибутами стоит \s+, а не пробел: Prettier переносит
 * длинный тег на несколько строк, и жёстко записанный пробел перестал бы
 * совпадать. Тогда upsert не нашёл бы тег и дописал бы второй такой же.
 */
function tagPattern(tag, attr, value) {
  return new RegExp('<' + tag + '\\s+' + attr + '="' + value + '"[^>]*>');
}

/** Заменяет содержимое тега, если он есть, иначе добавляет тег перед </head>. */
function upsert(html, pattern, tag) {
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace('</head>', '    ' + tag + '\n  </head>');
}

function buildPage(template, project, title, description) {
  const url = `${ORIGIN}/${project.id}`;
  const image = `${ORIGIN}${project.ogImage}`;
  const t = escapeAttr(title);
  const d = escapeAttr(description);

  // Порядок: [тег, атрибут-опознаватель, значение атрибута, содержимое content/href].
  const tags = [
    ['meta', 'name', 'description', 'content', d],
    ['meta', 'property', 'og:title', 'content', t],
    ['meta', 'property', 'og:description', 'content', d],
    ['meta', 'property', 'og:url', 'content', url],
    ['meta', 'property', 'og:image', 'content', image],
    ['meta', 'property', 'og:type', 'content', 'article'],
    ['meta', 'name', 'twitter:title', 'content', t],
    ['meta', 'name', 'twitter:description', 'content', d],
    ['meta', 'name', 'twitter:url', 'content', url],
    ['meta', 'name', 'twitter:image', 'content', image],
    ['link', 'rel', 'canonical', 'href', url],
  ];

  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`);

  for (const [tag, attr, attrValue, contentAttr, contentValue] of tags) {
    html = upsert(
      html,
      tagPattern(tag, attr, attrValue),
      `<${tag} ${attr}="${attrValue}" ${contentAttr}="${contentValue}" />`
    );
  }

  return html;
}

/**
 * Пишет build/sitemap.xml: главная плюс по адресу на каждый кейс.
 *
 * Список берётся из того же src/data/projects.json, из которого делаются
 * страницы кейсов, поэтому новый кейс попадает в карту сайта сам, без
 * отдельной правки.
 *
 * Тега <lastmod> нет намеренно: под рукой только дата сборки, а она меняется
 * и когда тексты кейса остались прежними. Дата, которой нельзя доверять,
 * поисковым роботам не помогает.
 */
function buildSitemap() {
  const urls = ['/', ...projects.map(project => `/${project.id}`)];
  const body = urls.map(url => `  <url>\n    <loc>${ORIGIN}${url}</loc>\n  </url>`).join('\n');

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    body +
    '\n</urlset>\n';

  fs.writeFileSync(path.join(BUILD, 'sitemap.xml'), xml, 'utf8');
  console.log(`Готово: build/sitemap.xml, адресов в карте — ${urls.length}.`);
}

function main() {
  if (!fs.existsSync(INDEX)) {
    throw new Error(`Не найден ${INDEX}. Скрипт запускают после react-scripts build.`);
  }
  const template = fs.readFileSync(INDEX, 'utf8');

  if (template.includes('src="./static/')) {
    throw new Error(
      'В build/index.html относительные пути к файлам сборки. На вложенном ' +
        'адресе вроде /logiq/ они разрешатся в /logiq/static/... и страница ' +
        'не загрузится. Нужно поле "homepage": "/" в package.json.'
    );
  }

  for (const project of projects) {
    const text = texts[project.id];
    if (!text) {
      throw new Error(
        `Для проекта "${project.id}" из src/data/projects.json нет текстов ` +
          'в src/i18n/translations/projects.json — списки разошлись.'
      );
    }

    const dir = path.join(BUILD, project.id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'index.html'),
      buildPage(template, project, text.title[LANG], text.description[LANG]),
      'utf8'
    );
    console.log(`  build/${project.id}/index.html — ${text.title[LANG]}`);
  }

  console.log(`Готово: отдельный HTML на ${projects.length} кейса.`);

  buildSitemap();
}

main();

import { render } from '@testing-library/react';
import App from '../App';
import projects from '../data/projects.json';
import { reportProblems } from '../testing/problems';

const fs = require('fs');
const path = require('path');

// Проверка, что на сайте не осталось ключей перевода, которым нечего
// подставить. Делается двумя независимыми способами, потому что каждый
// видит своё:
//
// 1. Перехват console.warn. LanguageContext сообщает о каждом ненайденном
//    ключе (см. reportMissingKey), и в тестах этот механизм включён, потому
//    что NODE_ENV === 'test'. Ловит ключи, которых не видно в тексте:
//    подписи картинок, aria-label, заголовки вкладки.
// 2. Просмотр готовой разметки на строки, похожие на ключ. Не зависит
//    от механизма предупреждений вообще — если его когда-нибудь отключат,
//    эта половина продолжит работать.
//
// Две оговорки:
//
// • reportedMissingKeys в LanguageContext — множество на уровне модуля,
//   и про один и тот же ключ предупреждение выдаётся ОДИН раз за прогон
//   файла. Если ключ отсутствует на нескольких страницах, покраснеет та,
//   что рендерится первой. Этого достаточно: задача — поймать факт, а не
//   перечислить все места. Ждать красного на всех страницах не надо.
//
// • Проверка ловит ОТСУТСТВУЮЩИЙ ключ. Ключ, у которого есть ru, но нет
//   en, предупреждения не вызывает: resolveNode молча подставит русский
//   текст. Это ловит translations.test.js. Два теста дополняют друг друга.

// Префиксы ключей собираются из самих словарей, а не перечисляются
// руками: новый раздел словаря попадает в проверку сам.
function collectNamespaces() {
  const dir = path.resolve(__dirname, 'translations');
  const names = new Set();

  for (const file of fs.readdirSync(dir).filter(name => name.endsWith('.json'))) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    Object.keys(data).forEach(key => names.add(key));
  }
  names.add('pages');

  return [...names];
}

// Ключ — это одно «слово» без пробелов, начинающееся с имени раздела
// словаря и точки. Хвост описан как «что угодно без пробелов», а не как
// [\w.]+, потому что \w не покрывает кириллицу: опечатка в ключе вполне
// может оказаться русской.
const KEY_PATTERN = new RegExp('^(' + collectNamespaces().join('|') + ')\\.\\S+$');

const PAGES = [
  ['главная', '/'],
  ...projects.map(project => [project.id, '/' + project.id]),
  ['несуществующий адрес', '/takoy-stranicy-net'],
];

const LANGS = ['ru', 'en'];

const CASES = PAGES.flatMap(([name, route]) => LANGS.map(lang => [name, route, lang]));

// Строки, попавшие в разметку, но выглядящие как ключ перевода.
function findKeysInMarkup(container) {
  const found = new Set();

  const check = value => {
    const text = typeof value === 'string' ? value.trim() : '';
    if (text && KEY_PATTERN.test(text)) found.add(text);
  };

  container.querySelectorAll('*').forEach(element => {
    for (const attribute of ['alt', 'aria-label', 'title']) {
      check(element.getAttribute(attribute));
    }
  });

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) check(walker.currentNode.nodeValue);

  return [...found];
}

describe('переводы на всех страницах', () => {
  test.each(CASES)('%s (%s), язык %s — нет ключей без перевода', (name, route, lang) => {
    const warnings = [];
    const warn = jest.spyOn(console, 'warn').mockImplementation((...args) => {
      const message = args.map(String).join(' ');
      if (message.includes('[i18n]')) warnings.push(message);
    });

    window.localStorage.setItem('lang', lang);
    window.history.pushState({}, '', route);

    const { container, unmount } = render(<App />);
    const keysInMarkup = findKeysInMarkup(container);

    // Размонтируем сразу: иначе двенадцать копий приложения останутся
    // в одном документе и следующая проверка будет считать чужие узлы.
    unmount();
    warn.mockRestore();

    reportProblems({
      title:
        'Страница «' +
        name +
        '» (' +
        route +
        ', язык ' +
        lang +
        ') просит ключи, которых нет в словаре.',
      problems: [
        ...warnings.map(message => message.replace('[i18n] нет ключа перевода: ', 'нет ключа ')),
        ...keysInMarkup.map(key => 'в разметку уехала строка ключа: ' + key),
      ],
      howToFix:
        'добавить ключ в i18n/translations либо поправить обращение к нему. ' +
        'Такой ключ не роняет страницу: t() возвращает саму строку ключа, и она ' +
        'молча уезжает в текст или в подпись картинки.',
    });
  });
});

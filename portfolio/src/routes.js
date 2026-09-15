import axelnac from './data/cases/axelnac';
import logiq from './data/cases/logiq';
import darts from './data/cases/darts';
import adidas from './data/cases/adidas';

// Соответствие id проекта из data/projects.json и описания страницы кейса.
//
// Раньше здесь лежали четыре компонента страниц — почти дословные копии
// друг друга. Теперь страница одна (pages/CasePage.js), а различаются
// только описания: набор разделов, тексты и картинки.
//
// Импорт статический, а не import() по строке с именем файла: описаний
// четыре, они небольшие, и при статическом импорте состояние «отдельный
// файл сборки не загрузился» невозможно в принципе.
//
// Реестр лежит отдельно от data/projects.json: projects.json остаётся
// сериализуемым (его читает scripts/generate-case-html.js под Node),
// а описания — обычные модули.
export const caseDescriptions = {
  axelnac,
  logiq,
  darts,
  adidas,
};

export default caseDescriptions;

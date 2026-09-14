import AxelnacCase from './pages/cases/axelnac';
import LogiqCase from './pages/cases/logiq';
import DartsCase from './pages/cases/darts';
import AdidasCase from './pages/cases/adidas';

// Соответствие id проекта из data/projects.json и компонента страницы кейса.
//
// Импорт статический, а не import() по строке с именем файла: страниц четыре,
// они небольшие, и при статическом импорте состояние «отдельный файл сборки
// не загрузился» невозможно в принципе. Раньше страницы грузились динамически,
// и от этого состояния приходилось защищаться отдельной картой-исключением.
//
// Реестр лежит отдельно от data/projects.json: данные остаются сериализуемыми
// (их читает scripts/generate-case-html.js под Node), а компоненты — кодом.
export const caseComponents = {
  axelnac: AxelnacCase,
  logiq: LogiqCase,
  darts: DartsCase,
  adidas: AdidasCase,
};

export default caseComponents;

import {
  DISSOLVE_MS,
  IN_CLASS,
  OUT_CLASS,
  playLanguageChange,
  prefersReducedMotion,
  visibleTextElements,
} from './langTransition';

const fs = require('fs');
const path = require('path');

// Высота окна в этих проверках. jsdom вёрстку не считает и на все вопросы
// о размерах отвечает нулями, поэтому прямоугольники задаются руками —
// иначе «в кадре» оказывались бы разом все элементы страницы.
const VIEWPORT = 800;

function withRect(element, { top, height = 20 }) {
  element.getBoundingClientRect = () => ({
    top,
    height,
    bottom: top + height,
    left: 0,
    right: 100,
    width: 100,
  });

  return element;
}

// Разметка для проверок: абзац в кадре, абзац ниже кадра и переключатель,
// который эффект обходит стороной.
function buildPage() {
  document.body.innerHTML = `
    <div id="visible"><p>В кадре</p></div>
    <div id="below"><p>За кадром</p></div>
    <div data-lang-static="true"><span>RU</span></div>
  `;

  withRect(document.querySelector('#visible p'), { top: 100 });
  withRect(document.querySelector('#below p'), { top: VIEWPORT + 200 });
  withRect(document.querySelector('[data-lang-static] span'), { top: 10 });

  return document.querySelector('#visible p');
}

describe('выбор текста для эффекта', () => {
  test('берётся только текст, попавший в кадр', () => {
    const inFrame = buildPage();
    const found = visibleTextElements(document.body, VIEWPORT);

    expect(found).toEqual([inFrame]);
  });

  test('переключатель языка эффект не трогает', () => {
    // У него своя анимация — барабан. Рассыпать его в точки значит
    // спрятать ровно то, на что посетитель в этот момент смотрит.
    buildPage();
    const switcher = document.querySelector('[data-lang-static] span');

    expect(visibleTextElements(document.body, VIEWPORT)).not.toContain(switcher);
  });

  test('вложенный текст берётся один раз, а не вместе с обёрткой', () => {
    // Наложив маску и на абзац, и на его обёртку, мы бы применили эффект
    // дважды, и текст в этом месте истаивал бы заметно быстрее остального.
    document.body.innerHTML = '<div><p>Текст</p></div>';
    const wrapper = withRect(document.querySelector('div'), { top: 100, height: 40 });
    withRect(document.querySelector('p'), { top: 100 });

    const found = visibleTextElements(document.body, VIEWPORT);

    expect(found).toHaveLength(1);
    expect(found).not.toContain(wrapper);
  });

  test('пустые строки разметки за текст не считаются', () => {
    // Между тегами в разметке полно переводов строк и отступов: они тоже
    // текстовые узлы, и без отсева эффект вешался бы на их родителей.
    document.body.innerHTML = '<div>\n  <span>  </span>\n</div>';
    withRect(document.querySelector('div'), { top: 100 });
    withRect(document.querySelector('span'), { top: 100 });

    expect(visibleTextElements(document.body, VIEWPORT)).toEqual([]);
  });
});

describe('проигрывание эффекта', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Окно с включёнными анимациями: в самих тестах matchMedia подменён
  // на «меньше движения» (src/setupTests.js), иначе каждая проверка
  // переключения языка требовала бы подмены времени.
  const movingWindow = () => ({
    document,
    innerHeight: VIEWPORT,
    matchMedia: () => ({ matches: false }),
    setTimeout: (fn, ms) => setTimeout(fn, ms),
  });

  test('текст подменяется в середине, когда старый уже рассыпался', () => {
    const element = buildPage();
    const applyChange = jest.fn();

    playLanguageChange(applyChange, movingWindow());

    // Первая половина: старый текст истаивает, язык ещё прежний.
    expect(element.classList.contains(OUT_CLASS)).toBe(true);
    expect(applyChange).not.toHaveBeenCalled();

    jest.advanceTimersByTime(DISSOLVE_MS);

    // Середина: подмена произошла, текст собирается обратно.
    expect(applyChange).toHaveBeenCalledTimes(1);
    expect(element.classList.contains(OUT_CLASS)).toBe(false);
    expect(element.classList.contains(IN_CLASS)).toBe(true);

    jest.advanceTimersByTime(DISSOLVE_MS);

    // После эффекта на элементе не остаётся ничего лишнего.
    expect(element.classList.contains(IN_CLASS)).toBe(false);
  });

  test('с настройкой «меньше движения» язык меняется сразу', () => {
    buildPage();
    const applyChange = jest.fn();

    playLanguageChange(applyChange, { ...movingWindow(), matchMedia: () => ({ matches: true }) });

    expect(applyChange).toHaveBeenCalledTimes(1);
    expect(document.querySelector('#visible p').classList.contains(OUT_CLASS)).toBe(false);
  });

  test('без текста в кадре смена не откладывается', () => {
    document.body.innerHTML = '';
    const applyChange = jest.fn();

    playLanguageChange(applyChange, movingWindow());

    expect(applyChange).toHaveBeenCalledTimes(1);
  });
});

describe('настройка «меньше движения»', () => {
  test('без поддержки медиазапросов эффект не проигрывается', () => {
    // Проигрывать анимацию в таком окружении всё равно нечему, а вот
    // отложить смену языка на таймерах оно бы позволило — и язык просто
    // не менялся бы четверть секунды без всякой причины.
    expect(prefersReducedMotion({})).toBe(true);
  });
});

describe('связка с описанием анимаций', () => {
  test('длительность половины эффекта совпадает с CSS', () => {
    // По DISSOLVE_MS отсчитывается момент подмены текста. Разойдись он
    // с длительностью анимации — подмена стала бы видна: текст сменился
    // бы, ещё не растворившись.
    const css = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf8');

    expect(css).toContain(`lang-dissolve-out ${DISSOLVE_MS}ms`);
    expect(css).toContain(`lang-dissolve-in ${DISSOLVE_MS}ms`);
  });

  test('классы, которые вешает эффект, описаны в CSS', () => {
    const css = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf8');

    expect(css).toContain(`.${OUT_CLASS}`);
    expect(css).toContain(`.${IN_CLASS}`);
  });

  test('маска — шум, и у каждой ступени свой узор', () => {
    // Точки должны скакать, а не редеть на одних и тех же местах. За это
    // отвечает seed: он у каждой ступени свой. Останься он общим, узор
    // просто прореживался бы, и движения не было бы видно — при этом
    // ни одна другая проверка не покраснела бы.
    const css = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf8');
    const variables = css.match(/--lang-noise-\d+:[^;]+;/g) || [];

    expect(variables.length).toBeGreaterThanOrEqual(4);

    const seeds = variables.map(line => (line.match(/seed='(\d+)'/) || [])[1]);

    expect(seeds.every(seed => seed !== undefined)).toBe(true);
    expect(new Set(seeds).size).toBe(seeds.length);
    expect(variables.every(line => line.includes('feTurbulence'))).toBe(true);
  });
});

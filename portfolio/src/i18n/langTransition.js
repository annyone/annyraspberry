// Смена языка не подменяет текст рывком, а проводит его через рассыпание
// в точки: видимый текст истаивает мелкой сеткой, под ней подменяется
// содержимое, и новый текст собирается из тех же точек обратно.
//
// Эффект наложен только на текст и только на тот, что сейчас в кадре.
// Причина не в красоте: маска считается для каждого элемента отдельно,
// и на странице кейса, где текстовых блоков за сотню, разом обсчитывать
// весь документ незачем — за пределами экрана результата всё равно никто
// не увидит, а до момента, когда туда долистают, эффект давно кончится.

// Половина эффекта в миллисекундах: столько истаивает старый текст
// и столько же собирается новый. Должно совпадать с длительностью анимаций
// lang-dissolve-out и lang-dissolve-in в src/index.css — по этому значению
// здесь отсчитывается момент подмены текста. Разойдутся — подмена станет
// видна: текст сменится, пока ещё не растворился.
export const DISSOLVE_MS = 240;

export const OUT_CLASS = 'lang-dissolve-out';
export const IN_CLASS = 'lang-dissolve-in';

// Элементы, которые эффект не трогает. Сейчас это сам переключатель
// языка: у него своя анимация — барабан, — и рассыпать его в точки
// значит спрятать ровно то, на что посетитель в этот момент смотрит.
const SKIP_ATTRIBUTE = 'data-lang-static';

// Виден ли элемент в кадре. Проверяется только по вертикали: страница
// прокручивается вниз, и по горизонтали за край уходит разве что то,
// что и так спрятано overflow.
function isInViewport(element, viewportHeight) {
  const box = element.getBoundingClientRect();

  // Нулевая высота — элемент свёрнут или скрыт; анимировать нечего.
  if (box.height === 0) return false;

  return box.bottom > 0 && box.top < viewportHeight;
}

// Элементы с собственным текстом, попадающие в кадр.
//
// Берётся именно элемент с текстовым узлом внутри, а не любой контейнер:
// накрыв маской и абзац, и его обёртку, мы наложили бы эффект дважды,
// и текст в этих местах истаивал бы заметно быстрее остального.
// По той же причине пропускается элемент, чей предок уже отобран.
export function visibleTextElements(root, viewportHeight) {
  const found = [];
  const taken = new Set();

  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const text = walker.currentNode.nodeValue;
    if (!text || !text.trim()) continue;

    const element = walker.currentNode.parentElement;
    if (!element || taken.has(element)) continue;

    if (element.closest(`[${SKIP_ATTRIBUTE}]`)) continue;
    if (found.some(chosen => chosen.contains(element))) continue;
    if (!isInViewport(element, viewportHeight)) continue;

    taken.add(element);
    found.push(element);
  }

  return found;
}

// Нужно ли обойтись без эффекта. Кроме системной настройки «меньше
// движения» сюда попадает и окружение без медиазапросов вовсе — в нём
// всё равно нечему проигрывать анимацию.
export function prefersReducedMotion(view) {
  if (typeof view.matchMedia !== 'function') return true;

  return view.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Проводит смену языка через эффект.
 *
 * @param {Function} applyChange собственно смена языка
 * @param {Window} view окно, в котором всё происходит
 *
 * Текст подменяется в середине: к этому моменту старый уже рассыпался,
 * и подмены не видно. Если эффект не нужен или в кадре нет текста, смена
 * происходит сразу — задерживать её не за чем.
 */
export function playLanguageChange(applyChange, view = window) {
  if (prefersReducedMotion(view)) {
    applyChange();
    return;
  }

  const elements = visibleTextElements(view.document.body, view.innerHeight);
  if (elements.length === 0) {
    applyChange();
    return;
  }

  elements.forEach(element => element.classList.add(OUT_CLASS));

  view.setTimeout(() => {
    elements.forEach(element => {
      element.classList.remove(OUT_CLASS);
      element.classList.add(IN_CLASS);
    });

    applyChange();

    view.setTimeout(() => {
      elements.forEach(element => element.classList.remove(IN_CLASS));
    }, DISSOLVE_MS);
  }, DISSOLVE_MS);
}

export default playLanguageChange;

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from './Link';
import LanguageSwitcher from './LanguageSwitcher';
import LocalTime from './LocalTime';
import { getCvItem } from '../data/navItems';
import { NAV_TRANSITION } from '../data/viewTransitions';
import logoSrc from '../images/logo.svg';
import { useLanguage } from '../i18n/LanguageContext';

// Высота шапки задана переменной --nav-height в src/index.css: от неё
// зависят ещё распорка под шапкой, отступ в меню, прокрутка к якорю
// и высота обложки. Отступ над логотипом — следствие этой высоты:
// содержимое шапки центрировано по вертикали, и сверху остаётся ровно
// столько же, сколько по бокам.
const NAV_HEIGHT = 'h-[var(--nav-height)]';

// Длительность развёртки круга в миллисекундах. Должна совпадать
// с duration-500 у слоя заливки: по ней снимается блокировка прокрутки
// после закрытия. Разойдутся — прокрутка вернётся либо раньше, чем
// сойдётся круг (виден рывок), либо заметно позже клика.
const REVEAL_MS = 500;

// Радиус круга раскрытия до того, как измерено окно. В браузере
// useLayoutEffect успевает посчитать настоящий радиус до первой отрисовки,
// поэтому нулевое значение видно только там, где вёрстка не считается
// вообще — в тестах на jsdom.
const FALLBACK_RADIUS = 0;

// Круг раскрытия: центр — середина кнопки бургера, радиус — расстояние до
// самого дальнего угла окна. Перебираются все четыре угла, а не берётся
// половина диагонали: кнопка стоит у правого верхнего угла, дальний угол —
// левый нижний, и до него дальше, чем половина диагонали.
export function revealCircle(button, width, height) {
  if (!button) return { x: 0, y: 0, r: FALLBACK_RADIUS };

  const box = button.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;

  const r = Math.max(
    Math.hypot(x, y),
    Math.hypot(width - x, y),
    Math.hypot(x, height - y),
    Math.hypot(width - x, height - y)
  );

  return { x, y, r };
}

// Возврат свойства к тому виду, в каком оно было до вмешательства.
// Пустое значение снимается через removeProperty, а не присваиванием
// пустой строки: margin-right входит в сокращение margin, и реализация
// CSSOM в jsdom на присваивание '' такое свойство не убирает — правило
// остаётся в inline-стиле со старым значением.
function restoreStyle(element, property, value) {
  if (value) element.style.setProperty(property, value);
  else element.style.removeProperty(property);
}

// Кнопка бургера: две полоски, в раскрытом меню они сходятся в крестик.
//
// Обе полоски абсолютные и стоят в центре кнопки — тогда переход в крестик
// это один поворот вокруг общего центра, без пересчёта отступов. В покое
// они разведены на 4px вверх и вниз: при толщине полоски 2px просвет
// между ними получается 6px.
const BurgerButton = React.forwardRef(function BurgerButton(
  { isOpen, onClick, label, controls },
  ref
) {
  const line =
    'absolute block h-0.5 w-7 rounded-full bg-zinc-800 dark:bg-zinc-300 ' +
    'transition-transform duration-300 ease-in-out motion-reduce:transition-none';

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center"
      aria-label={label}
      aria-expanded={isOpen}
      aria-controls={controls}
    >
      <span className={`${line} ${isOpen ? 'rotate-45' : '-translate-y-1'}`} />
      <span className={`${line} ${isOpen ? '-rotate-45' : 'translate-y-1'}`} />
    </button>
  );
});

// Кегль и поведение при наведении общие у всех крупных пунктов меню,
// различается только цвет.
const MENU_ITEM =
  'inline-flex items-center gap-[0.3em] ' +
  'text-4xl md:text-5xl xl:text-4xl leading-tight transition-colors duration-150';

// Розовым набран один пункт — резюме: оно не ведёт по сайту, а скачивает
// файл. Приглушённым серым — ссылки на внешние площадки, тем же zinc-500,
// которым в проекте набраны второстепенные подписи (components/Link.js).
const MENU_TONE = {
  default: 'text-zinc-800 dark:text-zinc-100 hover:text-rose-400',
  accent: 'text-rose-500 hover:text-rose-400',
  muted: 'text-zinc-500 hover:text-rose-400',
};

// Крупный пункт меню. Отдельный элемент, а не components/Link.js: там
// подпись набрана размером от body, а здесь пункт идёт кеглем заголовка.
//
// Поле `to` даёт переход внутри сайта через react-router, `href` — обычную
// ссылку, в том числе на файл для скачивания или на внешнюю площадку.
function MenuItem({ to, href, download, label, tone = 'default', onClick, ...rest }) {
  const className = `${MENU_ITEM} ${MENU_TONE[tone]}`;

  // Значок скрыт от программ чтения с экрана: они и так сообщают, что
  // ссылка открывается в новой вкладке, а второй раз это лишний шум.
  const content = <>{label}</>;

  if (to) {
    return (
      <RouterLink to={to} onClick={onClick} className={className} {...rest}>
        {content}
      </RouterLink>
    );
  }

  return (
    <a href={href} download={download} onClick={onClick} className={className} {...rest}>
      {content}
    </a>
  );
}

export default function Nav({ sections = [], socials = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [circle, setCircle] = useState({ x: 0, y: 0, r: FALLBACK_RADIUS });
  // Ширина полосы прокрутки в пикселях, пока меню раскрыто, и 0 в покое.
  // В покое отступ именно нулевой, а не снятый: у шапки и у меню своего
  // padding-right нет, и «0» и «нет правила» дают одну и ту же вёрстку,
  // зато нулевое значение видно в разметке и его можно проверить тестом.
  const [scrollbarGap, setScrollbarGap] = useState(0);
  // Прокрутка заблокирована. Не то же самое, что «меню раскрыто»:
  // при закрытии блокировка держится, пока круг не сойдётся.
  const [isLocked, setIsLocked] = useState(false);
  const burgerRef = useRef(null);
  const { t, lang } = useLanguage();

  // Резюме вынесено из списка пунктов: оно рисуется кнопкой, а не ссылкой,
  // и стоит последним в меню.
  const cv = getCvItem(t, lang);

  const measure = useCallback(() => {
    setCircle(revealCircle(burgerRef.current, window.innerWidth, window.innerHeight));
  }, []);

  // Размеры круга берутся ДО открытия и обновляются при изменении окна.
  // Если считать их в обработчике клика, радиус приедет в том же кадре,
  // что и раскрытие: переход пойдёт из большого круга в большой, и меню
  // появится рывком, без развёртки.
  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // Escape закрывает раскрытое меню. Обработчик висит на документе,
  // а не на самом меню: фокус в этот момент может стоять и на крестике
  // в шапке, то есть вне меню.
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = event => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Блокировка ставится сразу при открытии, а снимается только после
  // того, как круг сойдётся.
  //
  // Причина задержки: снятие блокировки возвращает странице полосу
  // прокрутки и перекомпоновывает её целиком. Если делать это в момент
  // клика, тяжёлый пересчёт вёрстки приходится ровно на первый кадр
  // анимации закрытия, и она начинается с рывка. За время, пока круг
  // сходится, страница под ним всё равно закрыта, и пересчёт не виден.
  //
  // Проверка: открыть меню на странице кейса, закрыть и смотреть на край
  // круга — он должен сходиться без остановки в начале.
  useEffect(() => {
    if (isOpen) {
      setIsLocked(true);
      return undefined;
    }

    const id = setTimeout(() => setIsLocked(false), REVEAL_MS);
    return () => clearTimeout(id);
  }, [isOpen]);

  // Пока прокрутка заблокирована, колесо не крутит текст, видный сквозь
  // края круга, при неподвижном меню.
  //
  // Запрет прокрутки убирает полосу прокрутки, и видимая область страницы
  // становится шире на её ширину — обычно на 15–17px в Windows. Без
  // возмещения этой ширины содержимое страницы уезжает вправо в момент
  // открытия меню и влево в момент закрытия. Поэтому ровно столько же
  // возвращается обратно: телу страницы — полем справа, шапке и меню —
  // отступом, потому что они position: fixed и считают правый край
  // от края видимой области, а не от тела.
  //
  // Телу задаётся именно поле (margin-right), а не отступ: отступ у тела
  // уже занят — в src/index.css на нём стоит px-8 xl:px-12, и inline-стиль
  // padding-right перебивал бы его целиком. Содержимое тогда не стояло
  // на месте, а прыгало на разницу между 32px и шириной полосы прокрутки.
  //
  // Эффект слоевой (useLayoutEffect), а не обычный: и запрет прокрутки,
  // и возмещение должны попасть в один кадр отрисовки, иначе прыжок всё
  // равно будет виден, только короче.
  //
  // Проверка: открыть кейс, прокрутить до середины, открыть меню и следить
  // за левым краем логотипа — он должен остаться на месте. На странице
  // короче окна полосы прокрутки нет, ширина равна нулю, поле не ставится.
  useLayoutEffect(() => {
    if (!isLocked) {
      setScrollbarGap(0);
      return undefined;
    }

    // Ширина полосы прокрутки — это то, на сколько видимая область окна
    // шире области, отведённой под содержимое. У полос, нарисованных
    // поверх содержимого (macOS, мобильные браузеры), разница нулевая,
    // и возмещать нечего.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    setScrollbarGap(gap);

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousMargin = body.style.marginRight;

    body.style.overflow = 'hidden';
    if (gap > 0) body.style.marginRight = `${gap}px`;

    return () => {
      restoreStyle(body, 'overflow', previousOverflow);
      restoreStyle(body, 'margin-right', previousMargin);
    };
  }, [isLocked]);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(previous => !previous);

  return (
    <>
      {/* Шапка прозрачная: содержимое страницы проходит под ней. Уровень
          z-50 выше меню (z-40), чтобы логотип, переключатель языка
          и крестик оставались нажимаемыми поверх раскрытого меню. */}
      <nav
        className={`w-full fixed top-0 left-0 right-0 z-50 ${NAV_HEIGHT} ${NAV_TRANSITION}`}
        style={{ paddingRight: scrollbarGap }}
      >
        <div
          className={`max-w-[1600px] w-full mx-auto flex items-center ${NAV_HEIGHT} px-8 xl:px-12`}
        >
          <Link
            to="/"
            icon={<img src={logoSrc} alt="logo" className="select-none !w-12 !h-12" />}
            aria-label={t('nav.home', 'Home')}
            className="flex items-center h-full group"
            onClick={close}
          />

          <div className="ml-auto flex items-center gap-4 md:gap-6">
            <LanguageSwitcher />
            <BurgerButton
              ref={burgerRef}
              isOpen={isOpen}
              onClick={toggle}
              controls="main-menu"
              label={isOpen ? t('nav.closeMenu', 'Close menu') : t('nav.menu', 'Menu')}
            />
          </div>
        </div>
      </nav>

      {/* Отступ под шапку, чтобы первый экран начинался под ней, а не за ней */}
      <div className={`${NAV_HEIGHT} w-full`} aria-hidden="true" />

      {/* Меню на всю страницу. Оно остаётся в разметке и закрытым — иначе
          круг схлопывался бы в пустоту, а не в кнопку, и обратной развёртки
          не было бы. Чтобы закрытое меню не ловило клики и не попадало
          под Tab, на нём стоят pointer-events-none и inert. */}
      <div
        id="main-menu"
        data-testid="main-menu"
        inert={isOpen ? undefined : 'true'}
        aria-hidden={isOpen ? undefined : 'true'}
        className={'fixed inset-0 z-40 overflow-hidden ' + (isOpen ? '' : 'pointer-events-none')}
      >
        {/* Круг раскрытия — отдельный слой, в котором нет ничего, кроме
            заливки. Пока круг рос вместе с содержимым, браузер на каждом
            кадре заново рисовал и заголовки кеглем 60px, и значки —
            развёртка шла рывками, особенно обратная. Отдельным слоем
            перерисовывается одна заливка, а содержимое поверх только
            проявляется прозрачностью, а это composition без перерисовки. */}
        <span
          aria-hidden="true"
          data-testid="menu-backdrop"
          className={
            'absolute inset-0 bg-white dark:bg-zinc-900 will-change-[clip-path] ' +
            'transition-[clip-path] duration-500 ease-in-out motion-reduce:transition-none'
          }
          style={{ clipPath: `circle(${isOpen ? circle.r : 0}px at ${circle.x}px ${circle.y}px)` }}
        />

        {/* Содержимое проявляется с задержкой: к этому моменту круг уже
            закрывает большую часть окна, и текст не висит на просвет над
            страницей. Закрывается наоборот — сначала гаснет текст, потом
            сходится круг, поэтому задержка ставится только на открытие. */}
        <div
          data-testid="menu-content"
          className={
            'relative h-full w-full transition-opacity duration-300 ease-out ' +
            'motion-reduce:transition-none ' +
            (isOpen ? 'opacity-100 delay-150' : 'opacity-0')
          }
          style={{ paddingRight: scrollbarGap }}
        >
          <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col overflow-y-auto px-8 xl:px-12">
            <div className={`${NAV_HEIGHT} shrink-0`} aria-hidden="true" />

            <nav
              className="flex flex-col items-start gap-6 py-6"
              aria-label={t('nav.menu', 'Menu')}
            >
              {sections.map(item => (
                <MenuItem key={item.to} to={item.to} label={item.label} onClick={close} />
              ))}

              <MenuItem
                href={cv.url}
                download={cv.download}
                label={cv.label}
                tone="accent"
                onClick={close}
              />

              {socials.map(item => (
                <MenuItem
                  key={item.url}
                  href={item.url}
                  label={item.label}
                  tone="muted"
                  target={item.target}
                  rel={item.rel}
                  onClick={close}
                />
              ))}
            </nav>

            {/* Подпись прибита к низу: mt-auto съедает весь свободный остаток
                колонки. На низком окне остатка нет, колонка прокручивается,
                и подпись оказывается в конце прокрутки, а не поверх пунктов. */}
            <div className="mt-auto flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2 py-8 text-xl">
              <span>{t('nav.location.city')}</span>
              <LocalTime />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

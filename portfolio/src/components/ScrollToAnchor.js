import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Высота фиксированной шапки в пикселях. Прокрутка к секции делается
// с этим отступом, иначе шапка накрывает первые строки секции.
//
// Значение читается из CSS-переменной --nav-height (src/index.css),
// а не записано числом здесь: оно зависит от ширины экрана, и вторая
// копия разъехалась бы с первой при первой же правке отступов.
//
// Если переменной нет (стили ещё не подключены — так бывает в тестах),
// parseFloat вернёт NaN, и отступ считается нулевым: прокрутка просто
// встанет на верх секции, а не упадёт с ошибкой.
function navHeightPx() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
  const value = parseFloat(raw);

  return Number.isFinite(value) ? value : 0;
}

// Прокрутка к разделу, на который указывает якорь в адресе.
//
// Возвратом к началу страницы и восстановлением прежнего положения при
// переходе «Назад» занимается <ScrollRestoration> в App.js. Здесь остался
// только якорь: его ScrollRestoration не знает — для него /#about и / это
// одна и та же запись истории.
//
// Зависимость — key записи истории, а не pathname с hash: при повторном
// клике по пункту меню «Обо мне» уже на /#about адрес не меняется, а key
// меняется, и прокрутка срабатывает каждый раз.
//
// Переходы «Назад» и «Вперёд» (тип POP) пропускаются: положение на них
// восстанавливает ScrollRestoration. Плавная прокрутка к якорю поверх
// восстановленного места уводила посетителя от карточки, с которой он
// ушёл в кейс. Первая загрузка страницы — тоже POP, там к якорю без
// анимации прокручивает сам ScrollRestoration.
//
// Проверка: открыть /#about, прокрутить к кейсам, зайти в кейс и нажать
// «Назад» — страница должна встать на ту же карточку, а не на «обо мне».
export default function ScrollToAnchor() {
  const { key, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (!hash || navigationType === 'POP') return;

    // Элемент появляется в разметке в том же кадре, что и смена адреса,
    // но при переходе с кейса на главную сначала монтируется другая
    // страница — поэтому ищем цель после отрисовки, а не до неё.
    const id = decodeURIComponent(hash.slice(1));
    const target = document.getElementById(id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - navHeightPx();
    window.scrollTo({ top, behavior: 'smooth' });
  }, [key, hash, navigationType]);

  return null;
}

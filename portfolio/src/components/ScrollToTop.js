import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Высота фиксированной шапки (класс h-20 в components/Nav.js) в пикселях.
// Прокрутка к секции делается с этим отступом, иначе шапка накрывает
// первые строки секции.
const NAV_HEIGHT_PX = 80;

// Восстанавливает положение прокрутки при смене адреса: к секции, если
// в адресе есть якорь, иначе к началу страницы.
//
// Следим и за hash, а не только за pathname: при повторном клике по пункту
// меню «Обо мне» уже на главной pathname не меняется, и без этого прокрутка
// сработала бы только в первый раз.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Элемент появляется в разметке в том же кадре, что и смена адреса,
    // но при переходе с кейса на главную сначала монтируется другая
    // страница — поэтому ищем цель после отрисовки, а не до неё.
    const id = decodeURIComponent(hash.slice(1));
    const target = document.getElementById(id);
    if (!target) {
      window.scrollTo(0, 0);
      return;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT_PX;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
}

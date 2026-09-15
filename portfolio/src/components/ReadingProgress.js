import React, { useEffect, useRef, useState } from 'react';

// Доля прочитанного: сколько пикселей уже прокручено от того, сколько
// можно прокрутить всего. Возвращает число от 0 до 1.
//
// Знаменатель — это высота содержимого минус высота окна, а не высота
// содержимого: когда страница долистана до конца, scrollY равен именно
// этой разнице, и только при таком делении полоса заполняется целиком.
//
// Страница короче окна прокручиваться не может, знаменатель равен нулю.
// Деление дало бы NaN или Infinity, поэтому такой случай отсекается
// отдельно и прогресс считается нулевым.
export function readingProgress(scrollY, scrollHeight, clientHeight) {
  const scrollable = scrollHeight - clientHeight;
  if (scrollable <= 0) return 0;

  const ratio = scrollY / scrollable;
  if (!Number.isFinite(ratio)) return 0;

  return Math.min(1, Math.max(0, ratio));
}

// Тонкая полоса прокрутки страницы поверх шапки: заполняется слева
// направо по мере чтения.
//
// Компонент обязан стоять вне <main>: у main есть анимация появления
// с transform, а элемент с ненулевым transform становится содержащим
// блоком для position: fixed внутри себя — полоса считала бы ширину
// от области контента, зажатой боковыми отступами body, вместо ширины
// окна. Поэтому монтируется он в components/Layout.js рядом с шапкой.
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  // Номер запрошенного кадра. Нужен, чтобы при потоке событий прокрутки
  // пересчёт шёл не чаще одного раза на кадр отрисовки и чтобы снять
  // незавершённый запрос при размонтировании.
  const frame = useRef(0);

  useEffect(() => {
    const doc = document.documentElement;

    const measure = () => {
      frame.current = 0;
      setProgress(readingProgress(window.scrollY, doc.scrollHeight, doc.clientHeight));
    };

    const schedule = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(measure);
    };

    measure();

    // passive: true сообщает браузеру, что обработчик не отменит прокрутку,
    // и позволяет ему не ждать его выполнения перед отрисовкой кадра.
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    // Высота страницы кейса растёт по мере загрузки картинок. Без слежения
    // за ней полоса, посчитанная до загрузки, показывала бы завышенный
    // прогресс до первой же прокрутки.
    // Проверка: открыть кейс, дождаться загрузки всех картинок, не трогая
    // колесо, — полоса должна остаться пустой.
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    if (observer) observer.observe(document.body);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (observer) observer.disconnect();
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    // aria-hidden: полосу прокрутки браузер и так отдаёт программам чтения
    // с экрана, и второй источник тех же сведений для них лишний шум.
    <div
      aria-hidden="true"
      data-testid="reading-progress"
      className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none"
    >
      <div
        className="h-full w-full origin-left bg-[#DB557A]"
        // Растягиваем по горизонтали через transform, а не через width:
        // изменение width заставляет браузер пересчитывать вёрстку на каждом
        // кадре прокрутки, transform обрабатывается на этапе композиции.
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

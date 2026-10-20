import { useEffect, useRef } from 'react';

const POINTER_TRAVEL = 24;

// Браузер может не обновить :hover при прокрутке под неподвижным указателем.
// Проверяем карточку и смещаем её ореол в одном кадре, без ререндера React.
export default function usePointerHover() {
  const ref = useRef(null);

  useEffect(() => {
    let point = null;
    let active = null;
    let frame = null;

    const select = next => {
      if (next === active) return;
      active?.removeAttribute('data-pointer-hover');
      active?.style.removeProperty('--pointer-x');
      active?.style.removeProperty('--pointer-y');
      active = next;
      active?.setAttribute('data-pointer-hover', 'true');
    };

    const update = () => {
      frame = null;
      if (!point) return;
      const hit = document.elementFromPoint(point.x, point.y);
      const tile = hit?.closest('.project-tile');
      select(tile && ref.current?.contains(tile) ? tile : null);
      if (!active) return;

      const bounds = active.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      active.style.setProperty(
        '--pointer-x',
        `${((point.x - bounds.left) / bounds.width - 0.5) * POINTER_TRAVEL}px`
      );
      active.style.setProperty(
        '--pointer-y',
        `${((point.y - bounds.top) / bounds.height - 0.5) * POINTER_TRAVEL}px`
      );
    };

    const schedule = () => {
      if (point && frame === null) frame = requestAnimationFrame(update);
    };

    const clear = () => {
      point = null;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      select(null);
    };

    const track = event => {
      if (event.pointerType === 'touch') {
        clear();
        return;
      }
      point = { x: event.clientX, y: event.clientY };
      schedule();
    };

    const leave = event => {
      if (!event.relatedTarget) clear();
    };

    document.addEventListener('pointermove', track, { passive: true });
    document.addEventListener('pointerover', track, { passive: true });
    document.addEventListener('pointerout', leave);
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('blur', clear);
    return () => {
      clear();
      document.removeEventListener('pointermove', track);
      document.removeEventListener('pointerover', track);
      document.removeEventListener('pointerout', leave);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('blur', clear);
    };
  }, []);

  return ref;
}

import { useLayoutEffect } from 'react';

// Цвет нужен псевдоэлементу перехода, который находится вне дерева карточки.
// Сохраняем его и после размонтирования: он используется до конца перехода.
export function useCaseTransitionBackground(project, active = true) {
  useLayoutEffect(() => {
    if (active) {
      document.documentElement.style.setProperty(
        '--case-transition-fill',
        project.background || 'transparent'
      );
    }
  }, [active, project.background]);
}

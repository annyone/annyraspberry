import { useLayoutEffect, useRef } from 'react';

// Подготовка перехода между страницами для подложки кейса. Псевдоэлемент
// перехода находится вне дерева React, поэтому всё, что ему нужно, кладётся
// на <html> и остаётся там после размонтирования — до конца перехода.
//
// --case-transition-fill — цвет подложки.
//
// data-case-transition — между чем идёт переход (правила в src/index.css):
//   'tile'  — между плиткой на главной и страницей кейса: подложка растёт
//             из плитки и проявляется по пути;
//   'cover' — между двумя страницами кейсов: подложка уже на месте
//             и просто меняет цвет, проявлять и скруглять её незачем.
//
// source: 'tile' передаёт плитка на главной, 'cover' — обложка кейса.
// Обложка ставит свою метку только при смене кейса на уже открытой
// странице. При первом появлении она молчит: если сюда пришли с главной,
// метку 'tile' только что поставила плитка, и затирать её нельзя.
export function useCaseTransitionBackground(project, { active = true, source = 'cover' } = {}) {
  const isMounted = useRef(false);

  // Сбрасывается только при настоящем размонтировании. Отдельный эффект
  // нужен из-за StrictMode: в разработке он прогоняет эффекты дважды,
  // и без сброса первое появление обложки считалось бы сменой кейса.
  useLayoutEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  useLayoutEffect(() => {
    if (!active) return;

    const root = document.documentElement;
    root.style.setProperty('--case-transition-fill', project.background || 'transparent');

    if (source === 'tile') root.dataset.caseTransition = 'tile';
    else if (isMounted.current) root.dataset.caseTransition = 'cover';

    isMounted.current = true;
  }, [active, source, project.background]);
}

import React, { useEffect, useMemo } from 'react';
import Nav from './Nav';
import ReadingProgress from './ReadingProgress';
import { getSectionItems, getSocialItems } from '../data/navItems';
import { useLanguage } from '../i18n/LanguageContext';

// Общая обвязка страницы: шапка, ограниченная по ширине область контента
// и заголовок вкладки. До появления этого компонента те же семь строк
// разметки были дословно повторены в Home и в каждой странице кейса.
//
// mainClassName нужен, потому что страница darts единственная идёт без
// нижнего отступа pb-1 — чтобы не копировать разметку ради одного класса.
export default function Layout({
  title,
  cover,
  mainClassName = 'pb-1',
  showProgress = false,
  children,
}) {
  const { t, lang } = useLanguage();

  // Пункты меню собираются заново на каждой перерисовке любой страницы,
  // хотя результат зависит только от языка, — отсюда useMemo. Условие
  // пересборки: изменился lang (вместе с ним меняется и t — оно
  // пересоздаётся в LanguageProvider при смене языка).
  const sections = useMemo(() => getSectionItems(t, lang), [t, lang]);
  const socials = useMemo(() => getSocialItems(t, lang), [t, lang]);

  // Заголовок вкладки задаём в одном месте, а не хуком в каждой странице.
  // Строка зависит от языка, поэтому эффект повторяется при его смене.
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  return (
    <div className="min-h-screen">
      {/* Полоса прочитанного стоит рядом с шапкой, а не внутри main:
          у main анимация появления с transform, и position: fixed внутри
          него отсчитывался бы от области контента, а не от окна. */}
      {showProgress && <ReadingProgress />}
      <Nav sections={sections} socials={socials} />
      {/* Обложка стоит ВНЕ main намеренно: main ограничен по ширине
          (max-w-[1600px]) и центрирован, а обложка занимает весь экран.
          Внутри main её пришлось бы растягивать через 100vw, а это ширина
          окна ВМЕСТЕ с полосой прокрутки — обложка вылезала бы за правый
          край на её ширину. Здесь же боковые отступы body снимаются
          отрицательными полями, и никакой vw не нужен. */}
      {cover}
      <main className={`max-w-[1600px] w-full mx-auto ${mainClassName}`.trim()}>{children}</main>
    </div>
  );
}

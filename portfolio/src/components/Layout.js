import React, { useEffect, useMemo } from 'react';
import Nav from './Nav';
import ReadingProgress from './ReadingProgress';
import { getNavItems } from '../data/navItems';
import { useLanguage } from '../i18n/LanguageContext';

// Общая обвязка страницы: шапка, ограниченная по ширине область контента
// и заголовок вкладки. До появления этого компонента те же семь строк
// разметки были дословно повторены в Home и в каждой странице кейса.
//
// mainClassName нужен, потому что страница darts единственная идёт без
// нижнего отступа pb-1 — чтобы не копировать разметку ради одного класса.
export default function Layout({ title, mainClassName = 'pb-1', showProgress = false, children }) {
  const { t, lang } = useLanguage();

  // getNavItems собирает шесть объектов и два элемента иконок. Без useMemo
  // это происходит при каждой перерисовке любой страницы, хотя результат
  // зависит только от языка. Условие пересборки: изменился lang (вместе с
  // ним меняется и t — оно пересоздаётся в LanguageProvider при смене языка).
  const navItems = useMemo(() => getNavItems(t, lang), [t, lang]);

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
      <Nav items={navItems} />
      <main className={`max-w-[1600px] w-full mx-auto ${mainClassName}`.trim()}>{children}</main>
    </div>
  );
}

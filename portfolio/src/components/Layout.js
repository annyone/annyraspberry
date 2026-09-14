import React, { useEffect } from 'react';
import Nav from './Nav';
import { getNavItems } from '../data/navItems';
import { useLanguage } from '../i18n/LanguageContext';

// Общая обвязка страницы: шапка, ограниченная по ширине область контента
// и заголовок вкладки. До появления этого компонента те же семь строк
// разметки были дословно повторены в Home и в каждой странице кейса.
//
// mainClassName нужен, потому что страница darts единственная идёт без
// нижнего отступа pb-1 — чтобы не копировать разметку ради одного класса.
export default function Layout({ title, mainClassName = 'pb-1', children }) {
  const { t, lang } = useLanguage();

  // Заголовок вкладки задаём в одном месте, а не хуком в каждой странице.
  // Строка зависит от языка, поэтому эффект повторяется при его смене.
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  return (
    <div className="min-h-screen">
      <Nav items={getNavItems(t, lang)} />
      <main className={`max-w-[1600px] w-full mx-auto ${mainClassName}`.trim()}>{children}</main>
    </div>
  );
}

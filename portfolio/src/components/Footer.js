import React from 'react';
import LocalTime from './LocalTime';
import MenuItem from './MenuItem';
import { getCvItem } from '../data/navItems';
import { useLanguage } from '../i18n/LanguageContext';

// Подвал всех страниц: контакты, скачивание резюме и местное время.
//
// Подложка идёт во всю ширину окна и скруглена сверху — тем же радиусом,
// что нижние углы обложки кейса (components/CaseCover.js). Страница кейса
// так открывается и закрывается одной и той же формой. Поэтому подвал
// стоит в Layout вне <main>, а содержимое заворачивается в .page-grid,
// как и у обложки.
//
// Контакты берутся из того же списка, что и в меню (data/navItems.js):
// поменяв адрес там, не нужно искать его второй раз здесь.
export default function Footer({ socials = [] }) {
  const { t, lang } = useLanguage();
  const cv = getCvItem(t, lang);
  const year = new Date().getFullYear();

  return (
    <footer
      id="contacts"
      className="mt-10 lg:mt-16 xl:mt-20 rounded-t-[2rem] xl:rounded-t-[3rem] bg-zinc-100 dark:bg-zinc-800/60"
    >
      <div className="page-grid pt-12 pb-8 lg:pt-16 xl:pt-24 xl:pb-12">
        {/* Пункты те же, что в меню, и в том же порядке: сначала резюме,
            потом площадки. Набраны тем же компонентом, поэтому разойтись
            с меню по виду не могут.

            Видимой подписи «контакты» нет: по самим пунктам понятно, что
            это. Слово осталось только для программ чтения с экрана — они
            называют области навигации по подписи. */}
        <nav
          aria-label={t('footer.title')}
          className="flex flex-col items-start gap-6 sm:flex-row sm:flex-wrap sm:gap-x-12"
        >
          <MenuItem href={cv.url} download={cv.download} label={cv.label} tone="accent" />
          {socials.map(item => (
            <MenuItem
              key={item.url}
              href={item.url}
              label={item.label}
              tone="muted"
              target={item.target}
              rel={item.rel}
            />
          ))}
        </nav>

        <div className="mt-12 xl:mt-20 flex flex-col gap-2 text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>{t('nav.location.city')}</span>
            <LocalTime />
          </div>
          <span>
            © {year} {t('site.author')}
          </span>
        </div>
      </div>
    </footer>
  );
}

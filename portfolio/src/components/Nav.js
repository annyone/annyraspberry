import React, { useState } from 'react';
import Link from './Link';
import logoSrc from '../images/logo.png';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_HEIGHT = 'h-20';
const DRAWER_WIDTH = 'w-64';

// Компонент иконки бургер-меню
const BurgerIcon = ({ isOpen, onClick, label }) => {
  const lineClass = 'block w-6 h-0.5 bg-zinc-900 dark:bg-white';
  
  return (
    <button
      onClick={onClick}
      className="md:hidden flex flex-col justify-center items-center w-10 h-10 relative"
      aria-label={label}
      aria-expanded={isOpen}
    >
      <span className={`${lineClass} absolute -translate-y-2`} />
      <span className={`${lineClass} absolute`} />
      <span className={`${lineClass} absolute translate-y-2`} />
    </button>
  );
};

// Компонент элемента навигации с автоматической передачей всех необходимых props
const NavItem = ({ item, onClick }) => {
  const linkProps = {
    href: item.url,
    label: item.label,
    icon: item.icon,
    ...(onClick && { onClick }),
    ...(item.download && { download: item.download }),
    ...(item.target && { target: item.target }),
    ...(item.rel && { rel: item.rel }),
    ...(item.className && { className: item.className }),
    ...(item['aria-label'] && { 'aria-label': item['aria-label'] }),
  };

  return <Link {...linkProps} />;
};

export default function Nav({ items = [] }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { t } = useLanguage();

  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

  const drawerClasses = `fixed top-0 right-0 h-full ${DRAWER_WIDTH} bg-white dark:bg-zinc-900 shadow-lg transform duration-300 ease-in-out z-50 md:hidden ${
    isDrawerOpen ? 'translate-x-0' : 'translate-x-full invisible'
  }`;

  return (
    <>
      {/* Навигационная панель */}
      <nav className="w-full fixed top-0 left-0 right-0 z-40">
        <div className={`max-w-[1600px] w-full mx-auto flex items-center ${NAV_HEIGHT} px-4 bg-white dark:bg-zinc-900 backdrop-blur-sm`}>
          {/* Логотип */}
          <Link
            to="/"
            icon={<img src={logoSrc} alt="logo" className="select-none !w-12 !h-12" />}
            aria-label={t('nav.home', 'Home')}
            className="flex items-center h-full group"
          />
          
          {/* Иконка бургер-меню */}
          <div className="ml-auto">
            <BurgerIcon isOpen={isDrawerOpen} onClick={toggleDrawer} label={t('nav.menu', 'Menu')} />
          </div>

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            {items.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
            {/* Переключатель языка */}
            <div className="ml-8">
              <LanguageSwitcher />
            </div>
          </div>
          
        </div>
      </nav>

      {/* Отступ для фиксированной навигации */}
      <div className={`${NAV_HEIGHT} w-full`} aria-hidden="true" />

      {/* Затемняющий оверлей */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Мобильное выдвижное меню */}
      <div className={drawerClasses}>
        {/* Кнопка закрытия */}
        <button
          onClick={closeDrawer}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center"
          aria-label={t('nav.closeMenu', 'Close menu')}
        >
          <span className="block w-6 h-0.5 bg-zinc-900 dark:bg-white absolute rotate-45" />
          <span className="block w-6 h-0.5 bg-zinc-900 dark:bg-white absolute -rotate-45" />
        </button>
        
        <nav className="flex flex-col p-6 space-y-6 mt-20" aria-label={t('nav.menu', 'Menu')}>
          {items.map((item, index) => (
            <NavItem key={index} item={item} onClick={closeDrawer} />
          ))}
          <div className="pt-4">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </>
  );
}

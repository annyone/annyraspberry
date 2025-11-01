import React, { useState } from 'react';
import Link from './Link';
import logoSrc from '../images/logo.png';

const NAV_HEIGHT = 'h-20';
const DRAWER_WIDTH = 'w-64';

// Компонент иконки бургер-меню
const BurgerIcon = ({ isOpen, onClick }) => {
  const lineClass = 'block w-6 h-0.5 bg-current';
  
  return (
    <button
      onClick={onClick}
      className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 z-50"
      aria-label="Меню"
      aria-expanded={isOpen}
    >
      <span className={`${lineClass} transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
      <span className={`${lineClass} transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
      <span className={`${lineClass} transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
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

  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

  const drawerClasses = `fixed top-0 right-0 h-full ${DRAWER_WIDTH} bg-zinc-900 shadow-lg transform duration-300 ease-in-out z-50 md:hidden ${
    isDrawerOpen ? 'translate-x-0' : 'translate-x-full invisible'
  }`;

  return (
    <>
      {/* Навигационная панель */}
      <nav className="w-full fixed top-0 left-0 right-0 z-50">
        <div className={`max-w-[1600px] w-full mx-auto flex items-center justify-between ${NAV_HEIGHT} px-4 bg-white dark:bg-zinc-900 backdrop-blur-sm`}>
          {/* Логотип */}
          <Link
            to="/"
            icon={<img src={logoSrc} alt="logo" className="select-none !w-12 !h-12" />}
            aria-label="Главная страница"
            className="flex items-center h-full group"
          />
          
          {/* Иконка бургер-меню */}
          <BurgerIcon isOpen={isDrawerOpen} onClick={toggleDrawer} />

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-8">
            {items.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
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
        <nav className="flex flex-col p-6 space-y-6 mt-16" aria-label="Мобильное меню">
          {items.map((item, index) => (
            <NavItem key={index} item={item} onClick={closeDrawer} />
          ))}
        </nav>
      </div>
    </>
  );
}

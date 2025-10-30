
import React, { useState } from 'react';
import Link from './Link';
import logoSrc from '../images/logo.png';

export default function Nav({ items = [] }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <nav className="w-full">
      <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between h-20 px-4">
        {/* Logo */}
        <Link
          to="/"
          icon={<img src={logoSrc} alt="logo" className="select-none w-10 h-10" />}
          aria-label="Главная страница"
          className="flex items-center h-full group"
        />
        
        {/* Burger Button (visible on small devices) */}
        <button
          onClick={toggleDrawer}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 z-50"
          aria-label="Меню"
        >
          <span className={`block w-6 h-0.5 bg-current transition-transform ${isDrawerOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-current transition-opacity ${isDrawerOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-current transition-transform ${isDrawerOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>


        {/* Desktop Menu (hidden on small devices) */}
        <div className="hidden md:flex items-center space-x-8">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              label={item.label}
              icon={item.icon}
              {...(item.download && { download: item.download })}
              {...(item.target && { target: item.target })}
              {...(item.rel && { rel: item.rel })}
              {...(item.className && { className: item.className })}
              {...(item['aria-label'] && { 'aria-label': item['aria-label'] })}
            />
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeDrawer}
        ></div>
      )}

      {/* Mobile Drawer (slides from right) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-zinc-900 shadow-lg transform duration-300 ease-in-out z-50 md:hidden ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full invisible'
        }`}
      >
        <div className="flex flex-col p-6 space-y-6 mt-16">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              label={item.label}
              icon={item.icon}
              {...(item.download && { download: item.download})}
              {...(item.target && { target: item.target })}
              {...(item.rel && { rel: item.rel })}
              {...(item.className && { className: item.className })}
              {...(item['aria-label'] && { 'aria-label': item['aria-label'] })}
              onClick={closeDrawer}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

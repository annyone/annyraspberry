
import React, { useState } from 'react';
import Link from './Link';
import logoSrc from '../images/logo.png';

export default function Nav() {
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
          <Link href="#cases">Кейсы</Link>
          <Link href="#about">Обо мне</Link>
          <Link href="#articles">Статьи</Link>
          <Link href="/cv.pdf" download>Скачать CV</Link>
          {/* Icons */}
          <Link
            href="https://www.linkedin.com/in/annyraspberry/"
            icon={
              <img 
                src="/images/linkedin.svg" 
                alt="LinkedIn" 
                className="transition-all duration-150 [filter:invert(42%)_sepia(8%)_saturate(348%)_hue-rotate(182deg)_brightness(95%)_contrast(87%)] group-hover:[filter:invert(52%)_sepia(98%)_saturate(2989%)_hue-rotate(314deg)_brightness(99%)_contrast(92%)]"
              />
            }
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 group"
            aria-label="LinkedIn"
          />
          <Link
            href="https://t.me/annyraspberry"
            icon={
              <img 
                src="/images/telegram.svg" 
                alt="Telegram" 
                className="transition-all duration-150 [filter:invert(42%)_sepia(8%)_saturate(348%)_hue-rotate(182deg)_brightness(95%)_contrast(87%)] group-hover:[filter:invert(52%)_sepia(98%)_saturate(2989%)_hue-rotate(314deg)_brightness(99%)_contrast(92%)]"
              />
            }
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 group"
            aria-label="Telegram"
          />
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
        className={`fixed top-0 right-0 h-full w-64 bg-zinc-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-6 space-y-6 mt-16">
          <Link href="#cases" onClick={closeDrawer}>Кейсы</Link>
          <Link href="#about" onClick={closeDrawer}>Обо мне</Link>
          <Link href="#articles" onClick={closeDrawer}>Статьи</Link>
          <Link href="/cv.pdf" download onClick={closeDrawer}>Скачать CV</Link>
          
          {/* Icons */}
          <div className="flex items-center space-x-4 pt-4">
            <Link
              href="https://www.linkedin.com/in/annyraspberry/"
              icon={
                <img 
                  src="/images/linkedin.svg" 
                  alt="LinkedIn" 
                  className="transition-all duration-150 [filter:invert(42%)_sepia(8%)_saturate(348%)_hue-rotate(182deg)_brightness(95%)_contrast(87%)] group-hover:[filter:invert(52%)_sepia(98%)_saturate(2989%)_hue-rotate(314deg)_brightness(99%)_contrast(92%)]"
                />
              }
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 group"
              aria-label="LinkedIn"
              onClick={closeDrawer}
            />
            <Link
              href="https://t.me/annyraspberry"
              icon={
                <img 
                  src="/images/telegram.svg" 
                  alt="Telegram" 
                  className="transition-all duration-150 [filter:invert(42%)_sepia(8%)_saturate(348%)_hue-rotate(182deg)_brightness(95%)_contrast(87%)] group-hover:[filter:invert(52%)_sepia(98%)_saturate(2989%)_hue-rotate(314deg)_brightness(99%)_contrast(92%)]"
                />
              }
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 group"
              aria-label="Telegram"
              onClick={closeDrawer}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

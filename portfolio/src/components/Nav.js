
import React from 'react';
import Link from './Link';
import { ReactComponent as LinkedInIcon } from '../images/icons/linkedIn.svg';
import { ReactComponent as TelegramIcon } from '../images/icons/telegram.svg';
import logoSrc from '../images/logo.png';

export default function Nav() {
  return (
    <nav className="w-full">
      <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between h-20">
        {/* Logo */}
        <Link
          to="/"
          icon={<img src={logoSrc} alt="logo" className="select-none w-10 h-10" />}
          aria-label="Главная страница"
          className="flex items-center h-full group"
        />
        {/* Menu */}
        <div className="flex items-center space-x-8">
          <Link href="#cases">Кейсы</Link>
          <Link href="#about">Обо мне</Link>
          <Link href="#articles">Статьи</Link>
          <Link href="/cv.pdf" download>Скачать CV</Link>
          {/* Icons */}
          <Link
            href="https://www.linkedin.com/in/annyraspberry/"
            icon={<LinkedInIcon color="currentColor" />}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2"
            aria-label="LinkedIn"
          />
          <Link
            href="https://t.me/annyraspberry"
            icon={<TelegramIcon color="currentColor" />}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2"
            aria-label="Telegram"
          />
        </div>
      </div>
    </nav>
  );
}

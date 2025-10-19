
import React from 'react';
import Link from './Link';
import logo from '../data/logo.png';
import { ReactComponent as LinkedInIcon } from '../data/linkedIn.svg';
import { ReactComponent as TelegramIcon } from '../data/telegram.svg';

export default function Nav() {
  return (
    <nav className="w-full">
      <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between h-20">
        {/* Logo */}
        <Link
          to="/"
          icon={<img src={logo} alt="logo" className="h-12 w-auto select-none mt-2" />}
          aria-label="Главная страница"
          className="flex items-center h-full group"
        />
        {/* Menu */}
        <div className="flex items-center space-x-8">
          <Link to="/cases">Кейсы</Link>
          <Link to="/about">Обо мне</Link>
          <Link to="/articles">Статьи</Link>
          <Link href="/cv.pdf" download>Скачать CV</Link>
          {/* Icons */}
          <Link
            href="https://www.linkedin.com/"
            icon={<LinkedInIcon color="currentColor" />}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2"
            aria-label="LinkedIn"
          />
          <Link
            href="https://t.me/"
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

import React from 'react';
import { ReactComponent as LinkedInIcon } from '../images/linkedin.svg';
import { ReactComponent as TelegramIcon } from '../images/telegram.svg';

const navItems = [
  {
    url: '#cases',
    label: 'Кейсы'
  },
  {
    url: '#about',
    label: 'Обо мне'
  },
  {
    url: '#articles',
    label: 'Статьи'
  },
  {
    url: '/CV-Malinina-Anna-UI-UX-designer.pdf',
    label: 'Скачать CV',
    download: true
  },
  {
    url: 'https://www.linkedin.com/in/annyraspberry/',
    icon: <LinkedInIcon />,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': 'LinkedIn'
  },
  {
    url: 'https://t.me/annyraspberry',
    icon: <TelegramIcon />,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': 'Telegram'
  }
];

export default navItems;

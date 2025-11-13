import React from 'react';
import { ReactComponent as LinkedInIcon } from '../images/linkedin.svg';
import { ReactComponent as TelegramIcon } from '../images/telegram.svg';

// Build nav items using translation function t(key)
export function getNavItems(t) {
  return [
    {
      url: '#cases',
      label: t('nav.cases', 'Cases')
    },
    {
      url: '#about',
      label: t('nav.about', 'About')
    },
    {
      url: '#articles',
      label: t('nav.articles', 'Articles')
    },
    {
      url: '/CV-Malinina-Anna-UI-UX-designer.pdf',
      label: t('nav.downloadCV', 'Download CV'),
      download: true
    },
    {
      url: 'https://www.linkedin.com/in/annyraspberry/',
      icon: <LinkedInIcon />,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': t('nav.linkedin', 'LinkedIn')
    },
    {
      url: 'https://t.me/annyraspberry',
      icon: <TelegramIcon />,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': t('nav.telegram', 'Telegram')
    }
  ];
}

export default getNavItems;

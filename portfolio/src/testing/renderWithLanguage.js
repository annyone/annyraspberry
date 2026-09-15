import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';

// Рендер компонента в том же окружении, в каком он работает на сайте:
// настоящий LanguageProvider и роутер.
//
// Словарь намеренно не подменяется моком: половина ошибок этого проекта
// жила именно в связке «компонент + настоящий словарь» — отсутствующий
// ключ, пара без английского варианта, список, записанный не тем способом.
// С идеальным моком ни одна из них не воспроизводится.
//
// Язык кладётся в localStorage ДО рендера: LanguageProvider читает его
// в инициализаторе useState, то есть один раз при монтировании.
export function renderWithLanguage(ui, { lang = 'ru', route = '/' } = {}) {
  window.localStorage.setItem('lang', lang);

  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </LanguageProvider>
  );
}

export default renderWithLanguage;

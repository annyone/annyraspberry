import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';

// Рендер компонента в том же окружении, в каком он работает на сайте:
// настоящий LanguageProvider и роутер.
//
// Словарь намеренно не подменяется моком: половина ошибок этого проекта
// жила именно в связке «компонент + настоящий словарь» — отсутствующий
// ключ, пара без английского варианта, список, записанный не тем способом.
// С идеальным моком ни одна из них не воспроизводится.
//
// Роутер именно из createMemoryRouter, а не MemoryRouter: приложение
// собрано на createBrowserRouter (App.js), и часть хуков — например
// useViewTransitionState в ProjectCard — вне такого роутера не просто
// возвращает пустое значение, а бросает исключение. С MemoryRouter
// проверки падали бы там, где на сайте всё работает.
//
// Язык кладётся в localStorage ДО рендера: LanguageProvider читает его
// в инициализаторе useState, то есть один раз при монтировании.
export function renderWithLanguage(ui, { lang = 'ru', route = '/' } = {}) {
  window.localStorage.setItem('lang', lang);

  const router = createMemoryRouter([{ path: '*', element: ui }], { initialEntries: [route] });

  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}

export default renderWithLanguage;

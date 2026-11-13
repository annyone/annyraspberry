import React, { useEffect, useMemo, useRef } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
  useLocation,
} from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ScrollToAnchor from './components/ScrollToAnchor';
import projects from './data/projects.json';
import CasePage from './pages/CasePage';
import { caseDescriptions } from './routes';
import './App.css';
import { LanguageProvider } from './i18n/LanguageContext';

// Номер счётчика Яндекс.Метрики. Тот же, что в public/index.html.
const METRIKA_ID = 105074916;

// Просмотр страницы при переходе внутри сайта. Счётчик сам считает только
// загрузку документа, а переходы роутера документ не перезагружают: без
// этого в отчётах была бы одна страница входа на весь визит.
//
// Первая отрисовка пропускается — её уже посчитал код в index.html.
// Заголовок вкладки к этому моменту обновлён: его ставит эффект в Layout,
// а эффекты вложенных компонентов выполняются раньше внешних.
function useMetrikaHits() {
  const { pathname } = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (typeof window.ym === 'function') {
      window.ym(METRIKA_ID, 'hit', window.location.href, { title: document.title });
    }
  }, [pathname]);
}

// Общая обвязка всех маршрутов. Нужна ради двух вещей, которые работают
// только внутри дерева маршрутов: восстановления прокрутки и прокрутки
// к якорю.
function RouterRoot() {
  useMetrikaHits();

  return (
    <>
      {/* Кладёт положение прокрутки в sessionStorage при уходе со страницы
          и возвращает его при переходе «Назад». При переходе вперёд ставит
          страницу в начало. Пока этим занимался собственный компонент,
          возврат из кейса всегда открывал главную сверху, и посетитель
          искал в списке ту карточку, на которую только что нажал. */}
      <ScrollRestoration />
      <ScrollToAnchor />
      <Outlet />
    </>
  );
}

// Маршрут на каждый проект объявляется явно. Проект без описания
// в реестре routes.js просто не получает маршрута и попадёт
// на NotFound — вместо пустого экрана «страница недоступна».
const routes = [
  {
    element: <RouterRoot />,
    children: [
      { path: '/', element: <Home /> },
      ...projects
        .filter(project => caseDescriptions[project.id])
        .map(project => ({
          path: `/${project.id}`,
          element: <CasePage project={project} description={caseDescriptions[project.id]} />,
        })),
      { path: '*', element: <NotFound /> },
    ],
  },
];

function App() {
  // Роутер создаётся на монтировании, а не на уровне модуля: он считывает
  // текущий адрес один раз при создании. На уровне модуля это происходило
  // бы при импорте файла, и в тестах, где адрес задаётся перед каждой
  // отрисовкой, все проверки шли бы по адресу первой из них.
  //
  // Роутер здесь именно из createBrowserRouter, а не BrowserRouter:
  // переходы между страницами с анимацией (view transitions) включаются
  // только в нём — BrowserRouter проп viewTransition молча игнорирует.
  const router = useMemo(() => createBrowserRouter(routes), []);

  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}

export default App;

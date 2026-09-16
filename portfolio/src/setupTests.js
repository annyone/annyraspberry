// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom не умеет прокручивать окно и печатает «Not implemented: window.scrollTo»
// на каждый рендер из-за components/ScrollToTop.js. Подменяем заглушкой,
// чтобы вывод тестов оставался читаемым.
window.scrollTo = () => {};

// В jsdom анимаций нет, и эффект рассыпания текста при смене языка только
// отложил бы её на таймерах, из-за чего каждая проверка переключения
// языка требовала бы подмены времени. Отвечаем так же, как система
// с включённой настройкой «меньше движения»: язык меняется сразу.
// Сам эффект проверяется напрямую в i18n/langTransition.test.js.
window.matchMedia = query => ({
  matches: query.includes('prefers-reduced-motion'),
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  onchange: null,
  dispatchEvent: () => false,
});

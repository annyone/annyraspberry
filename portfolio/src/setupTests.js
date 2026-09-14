// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom не умеет прокручивать окно и печатает «Not implemented: window.scrollTo»
// на каждый рендер из-за components/ScrollToTop.js. Подменяем заглушкой,
// чтобы вывод тестов оставался читаемым.
window.scrollTo = () => {};

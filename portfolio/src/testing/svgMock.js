// Заглушка для импортов .svg в тестах.
//
// Своя, а не та, что идёт в react-scripts 5: штатная строит элемент через
// внутренний формат React 17, и React 19 отказывается его рисовать с ошибкой
// «A React Element from an older version of React was rendered». Под эту
// ошибку попадает любой тест, который рисует шапку — там иконки LinkedIn
// и Telegram подключены как <ReactComponent>.
const React = require('react');

const SvgStub = React.forwardRef((props, ref) => React.createElement('svg', { ref, ...props }));
SvgStub.displayName = 'SvgStub';

module.exports = {
  __esModule: true,
  default: 'svg-stub',
  ReactComponent: SvgStub,
};

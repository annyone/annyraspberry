const path = require('path');

module.exports = function override(config, env) {
  // Изменяем путь вывода сборки
  config.output.path = path.join(__dirname, '../');
  return config;
};
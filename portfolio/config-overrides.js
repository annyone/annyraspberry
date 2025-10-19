const path = require('path');

module.exports = function override(config, env) {
  // Настраиваем публичный путь для продакшена
  if (env === 'production') {
    config.output.publicPath = '/';
  }
  return config;
};
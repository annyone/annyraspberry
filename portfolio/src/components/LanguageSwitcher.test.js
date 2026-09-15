import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from './LanguageSwitcher';
import { LanguageProvider } from '../i18n/LanguageContext';

function mount(lang = 'ru') {
  window.localStorage.setItem('lang', lang);
  return render(
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>
  );
}

// Кнопки ищутся по aria-label, а не по видимому тексту: подписи RU и EN
// одинаковы на обоих языках, а метка доступности переводится.
function buttonFor(name) {
  return screen.getByRole('button', { name });
}

test('подписи — коды языков в верхнем регистре и не переводятся', () => {
  mount('ru');
  expect(buttonFor('Русский')).toHaveTextContent('RU');
  expect(buttonFor('Английский')).toHaveTextContent('EN');

  mount('en');
  expect(buttonFor('Russian')).toHaveTextContent('RU');
  expect(buttonFor('English')).toHaveTextContent('EN');
});

// Состояние кнопок — единственное, по чему программа чтения с экрана
// отличает выбранный язык.
//
// После переключения метки доступности приходят уже на новом языке:
// «Английский» становится «English». Поэтому кнопки после нажатия
// ищутся по английским названиям — искать по прежним значит проверять
// не то, что меняется.
test('нажатие переключает язык, и это видно по состоянию кнопок', () => {
  mount('ru');
  expect(buttonFor('Русский')).toHaveAttribute('aria-pressed', 'true');
  expect(buttonFor('Английский')).toHaveAttribute('aria-pressed', 'false');

  fireEvent.click(buttonFor('Английский'));

  expect(buttonFor('Russian')).toHaveAttribute('aria-pressed', 'false');
  expect(buttonFor('English')).toHaveAttribute('aria-pressed', 'true');
});

test('разделитель не попадает в дерево доступности и не нажимается', () => {
  const { container } = mount('ru');
  const separator = screen.getByTestId('language-separator');

  expect(separator).toHaveAttribute('aria-hidden', 'true');
  expect(container.querySelectorAll('button')).toHaveLength(2);
});

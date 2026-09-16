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

const switcher = name => screen.getByRole('button', { name });
const reel = () => screen.getByTestId('language-reel');

// Сдвиг ленты в процентах, вытащенный из inline-стиля. Вёрстку в jsdom
// не измерить, а сдвиг — это ровно то, что двигает барабан.
const shift = () => Number(reel().style.transform.match(/translateY\((-?[\d.]+)%\)/)[1]);

describe('переключатель языка', () => {
  test('кнопка одна, и её метка описывает действие, а не текущий язык', () => {
    // По надписи «RU» программа чтения с экрана не сообщила бы, что
    // произойдёт при нажатии, — отсюда метка «Переключить на английский».
    const { container } = mount('ru');

    expect(container.querySelectorAll('button')).toHaveLength(1);
    expect(switcher('Переключить на английский')).toBeInTheDocument();
  });

  test('на барабане оба кода языков, и они не переводятся', () => {
    // Коды одинаковы на обоих языках: носитель другого языка иначе
    // не нашёл бы в переключателе свой.
    mount('en');
    const codes = [...reel().children].map(element => element.textContent);

    expect(codes).toEqual(['RU', 'EN']);
  });

  test('нажатие меняет язык, и метка становится обратной', () => {
    // После переключения метка приходит уже на новом языке: «Переключить
    // на русский» по-английски — «Switch to Russian».
    mount('ru');

    fireEvent.click(switcher('Переключить на английский'));

    expect(switcher('Switch to Russian')).toBeInTheDocument();
  });

  describe('барабан', () => {
    // Значения стоят лентой сверху вниз: RU, затем EN. Видно то, на которое
    // сдвинута лента, остальное обрезано окном. Поэтому переход на английский
    // уводит ленту вверх, а возврат на русский опускает её обратно — второго
    // состояния для направления не нужно, оно следует из положения ленты.
    test('на русском лента стоит на первом значении', () => {
      mount('ru');
      expect(shift()).toBe(0);
    });

    test('переключение на английский уводит ленту ровно на одну строку вверх', () => {
      mount('ru');
      fireEvent.click(switcher('Переключить на английский'));

      // Лента высотой в два значения, одна строка — половина её высоты.
      expect(shift()).toBe(-50);
    });

    test('возврат на русский опускает ленту обратно', () => {
      mount('en');
      expect(shift()).toBe(-50);

      fireEvent.click(switcher('Switch to Russian'));

      expect(shift()).toBe(0);
    });
  });

  test('лента скрыта от программ чтения с экрана', () => {
    // Иначе в кнопке читалось бы «RU EN», хотя видно одно значение.
    mount('ru');
    expect(reel().closest('[aria-hidden="true"]')).not.toBeNull();
  });
});

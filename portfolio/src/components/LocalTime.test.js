import { screen } from '@testing-library/react';
import LocalTime, { formatTime, hourIn, isDaytime } from './LocalTime';
import { renderWithLanguage } from '../testing/renderWithLanguage';

// Все моменты заданы в UTC. Москва — UTC+3 круглый год, поэтому ожидаемое
// московское время получается прибавлением трёх часов, и проверка не зависит
// от часового пояса машины, на которой идёт прогон.
const at = iso => new Date(iso);

describe('местное время', () => {
  test('час считается по московскому поясу, а не по часам посетителя', () => {
    // 23:30 UTC — это уже 02:30 следующих суток в Москве. Если бы час брали
    // через date.getHours(), на машине в UTC получилось бы 23.
    expect(hourIn(at('2026-09-16T23:30:00Z'))).toBe(2);
    expect(hourIn(at('2026-09-16T09:00:00Z'))).toBe(12);
  });

  test('подпись выводится как часы и минуты через двоеточие', () => {
    expect(formatTime(at('2026-09-16T09:05:00Z'))).toBe('12:05');
    // Полночь — «00:00», а не «24:00»: за это отвечает hourCycle h23.
    expect(formatTime(at('2026-09-16T21:00:00Z'))).toBe('00:00');
  });

  test('день — с 6:00 до 20:59, остальное — ночь', () => {
    expect(isDaytime(5)).toBe(false);
    expect(isDaytime(6)).toBe(true);
    expect(isDaytime(20)).toBe(true);
    expect(isDaytime(21)).toBe(false);
    expect(isDaytime(0)).toBe(false);
  });

  describe('значок рядом со временем', () => {
    // Время берётся из системных часов, поэтому в тесте они подменяются:
    // иначе проверка на «ночь» краснела бы ровно с 6 утра до 9 вечера.
    afterEach(() => {
      jest.useRealTimers();
    });

    const renderAt = iso => {
      jest.useFakeTimers();
      jest.setSystemTime(at(iso));
      return renderWithLanguage(<LocalTime />);
    };

    test('днём рядом со временем стоит слово «День»', () => {
      renderAt('2026-09-16T09:00:00Z'); // 12:00 в Москве
      expect(screen.getByText('День')).toBeInTheDocument();
      expect(screen.getByText('12:00')).toBeInTheDocument();
    });

    test('ночью рядом со временем стоит слово «Ночь»', () => {
      renderAt('2026-09-16T23:30:00Z'); // 02:30 в Москве
      expect(screen.getByText('Ночь')).toBeInTheDocument();
      expect(screen.getByText('02:30')).toBeInTheDocument();
    });

    test('значок скрыт от программ чтения с экрана', () => {
      // Значок сам по себе ничего не сообщает скринридеру: смысл несёт
      // слово рядом. Если значок перестанет быть скрытым, читаться будет
      // дважды или, наоборот, именем файла.
      renderAt('2026-09-16T09:00:00Z');
      expect(screen.getByTestId('daypart-icon')).toHaveAttribute('aria-hidden', 'true');
    });
  });
});

import { render, screen, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';

// Контракт t(), на который опираются все остальные тесты: перехват
// предупреждений в i18n-coverage.test.js, запасные значения [] в описаниях
// страниц, кэш, от которого зависит useMemo в Layout.
//
// Значения достаются через компонент-зонд, а не через прямой вызов:
// t() существует только внутри провайдера.
let api = null;

function Probe() {
  api = useLanguage();
  return null;
}

function mount(lang = 'ru') {
  window.localStorage.setItem('lang', lang);
  return render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>
  );
}

describe('переводчик t()', () => {
  test('возвращает текст на текущем языке', () => {
    mount('ru');
    expect(api.t('nav.cases')).toBe('Кейсы');

    mount('en');
    expect(api.t('nav.cases')).toBe('Cases');
  });

  test('второй аргумент — запасное значение, а не набор опций', () => {
    mount();

    // Именно из-за обратного допущения страница кейса однажды падала:
    // вызов t('...', { returnObjects: true }) возвращал этот объект,
    // и он уезжал в items.map().
    expect(api.t('нет.такого.ключа', [])).toEqual([]);
    expect(api.t('нет.такого.ключа', 'запасной текст')).toBe('запасной текст');
  });

  test('без запасного значения возвращает саму строку ключа', () => {
    mount();
    expect(api.t('нет.такого.ключа')).toBe('нет.такого.ключа');
  });

  test('отсутствующий ключ вызывает предупреждение [i18n]', () => {
    // Положительный контроль детектора. Без этого теста сквозная проверка
    // в i18n-coverage.test.js может однажды молча позеленеть — например,
    // если предупреждения отключат или сменят формат сообщения.
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mount();

    api.t('ключ.которого.точно.нет');

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[i18n]'));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('ключ.которого.точно.нет'));
    warn.mockRestore();
  });

  test('вложенные пары резолвятся рекурсивно, массивы остаются массивами', () => {
    mount();

    const items = api.t('articles.items');
    expect(Array.isArray(items)).toBe(true);
    expect(typeof items[0].title).toBe('string');
  });

  test('объект с тремя ключами парой ru/en не считается', () => {
    mount('ru');

    // В nav.json узел lang содержит group, ru и en. Правило «пара — это
    // ровно два ключа» (resolveNode) не даёт ему схлопнуться в строку.
    const lang = api.t('lang');
    expect(typeof lang).toBe('object');
    expect(lang.ru).toBe('Русский');
    expect(lang.en).toBe('Английский');
  });

  test('смена языка переписывает html lang и localStorage', () => {
    mount('ru');
    expect(document.documentElement.lang).toBe('ru');

    act(() => api.setLang('en'));

    expect(document.documentElement.lang).toBe('en');
    expect(window.localStorage.getItem('lang')).toBe('en');
    expect(api.t('nav.cases')).toBe('Cases');
  });

  test('один и тот же ключ возвращает одну и ту же ссылку', () => {
    mount();

    // Кэш внутри t(). На нём стоит useMemo в Layout: без стабильной
    // ссылки меню пересобиралось бы при каждой перерисовке любой страницы.
    expect(api.t('articles.items')).toBe(api.t('articles.items'));
  });

  test('после смены языка кэш отдаёт новые значения', () => {
    mount('ru');
    const ru = api.t('articles.items');

    act(() => api.setLang('en'));

    const en = api.t('articles.items');
    expect(en).not.toBe(ru);
    expect(en[0].title).not.toBe(ru[0].title);
  });
});

describe('выбор языка при первом открытии', () => {
  test('берётся из localStorage', () => {
    mount('en');
    expect(api.lang).toBe('en');
  });

  test('значение мусора в localStorage игнорируется', () => {
    window.localStorage.setItem('lang', 'кхм');
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );

    expect(['ru', 'en']).toContain(api.lang);
  });
});

describe('провайдер отдаёт словарь потребителям', () => {
  test('компонент внутри провайдера видит перевод', () => {
    function Greeting() {
      const { t } = useLanguage();
      return <p>{t('nav.about')}</p>;
    }

    window.localStorage.setItem('lang', 'ru');
    render(
      <LanguageProvider>
        <Greeting />
      </LanguageProvider>
    );

    expect(screen.getByText('Обо мне')).toBeInTheDocument();
  });
});

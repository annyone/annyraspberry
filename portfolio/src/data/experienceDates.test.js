import { formatPeriod, formatYears, parseMonth, roleYears } from './experienceDates';
import experiences from '../i18n/translations/experiences.json';
import ui from '../i18n/translations/ui.json';
import { reportProblems } from '../testing/problems';
import { existsInPublic } from '../testing/publicFiles';

const labels = lang => ({
  months: ui.experience.months[lang],
  monthsSince: ui.experience.monthsSince[lang],
  since: ui.experience.since[lang],
});

const now = new Date(2026, 8, 25); // 25 сентября 2026

describe('даты опыта', () => {
  test('период с датой окончания и без неё', () => {
    const closed = { start: '2024-06', end: '2026-01' };
    const open = { start: '2026-01', end: null };

    expect(formatPeriod(closed, labels('ru'))).toBe('июнь 2024 — январь 2026');
    expect(formatPeriod(open, labels('ru'))).toBe('с января 2026');
    expect(formatPeriod(closed, labels('en'))).toBe('June 2024 — January 2026');
    expect(formatPeriod(open, labels('en'))).toBe('since January 2026');
  });

  test('стаж роли — от раннего начала до позднего конца, вниз до полугода', () => {
    const design = [
      { start: '2026-01', end: null },
      { start: '2024-07', end: '2026-01' },
      { start: '2022-02', end: '2023-07' },
    ];
    // 2022-02 … 2026-09 — 55 месяцев, 4,58 года → 4,5, а не 5.
    expect(roleYears(design, now)).toBe(4.5);
    // Текущая роль растёт сама: к февралю 2027 — ровно 5 лет.
    expect(roleYears(design, new Date(2027, 0, 31))).toBe(4.5);
    expect(roleYears(design, new Date(2027, 1, 1))).toBe(5);
    // 22 месяца — 1,83 года → 1,5; 3 месяца — до 0,5, а не до нуля.
    expect(roleYears([{ start: '2014-06', end: '2016-04' }], now)).toBe(1.5);
    expect(roleYears([{ start: '2016-04', end: '2024-06' }], now)).toBe(8);
    expect(roleYears([{ start: '2026-06', end: null }], now)).toBe(0.5);
    expect(roleYears([], now)).toBe(0);
  });

  test('форма слова «год» подбирается по числу', () => {
    const ru = ui.experience.years.ru;
    const en = ui.experience.years.en;

    expect(formatYears(1, 'ru', ru)).toBe('1 год');
    expect(formatYears(4, 'ru', ru)).toBe('4 года');
    expect(formatYears(8, 'ru', ru)).toBe('8 лет');
    expect(formatYears(21, 'ru', ru)).toBe('21 год');
    expect(formatYears(0.5, 'ru', ru)).toBe('0,5 года');
    expect(formatYears(4.5, 'ru', ru)).toBe('4,5 года');
    expect(formatYears(4.5, 'en', en)).toBe('4.5 years');
    expect(formatYears(1, 'en', en)).toBe('1 year');
    expect(formatYears(4, 'en', en)).toBe('4 years');
  });

  test('дата не в виде ГГГГ-ММ — ошибка, а не «NaN» на странице', () => {
    for (const value of ['06.24', '2024-13', '2024-6', '', undefined]) {
      expect(() => parseMonth(value)).toThrow();
    }
  });
});

describe('записи в experiences.json', () => {
  const jobs = experiences.experiences.flatMap(experience =>
    experience.jobs.map(job => ({ ...job, where: experience.id + ' → ' + job.id }))
  );

  test('у каждой роли есть хотя бы одно место работы', () => {
    const problems = experiences.experiences
      .filter(experience => !Array.isArray(experience.jobs) || experience.jobs.length === 0)
      .map(experience => experience.id);

    reportProblems({
      title: 'Роли без мест работы.',
      problems,
      howToFix: 'добавить в jobs хотя бы одну запись либо убрать роль. Иначе стаж роли — пусто.',
    });
  });

  test('даты записаны как ГГГГ-ММ и начало не позже конца', () => {
    const problems = [];

    for (const job of jobs) {
      try {
        const start = parseMonth(job.start);
        if (job.end === null) continue;
        const end = parseMonth(job.end);
        if (end.year * 12 + end.month < start.year * 12 + start.month) {
          problems.push(job.where + ' → конец ' + job.end + ' раньше начала ' + job.start);
        }
      } catch (error) {
        problems.push(job.where + ' → ' + error.message);
      }
    }

    reportProblems({
      title: 'Неверные даты в experiences.json.',
      problems,
      howToFix:
        'start и end пишутся как "2024-06". end: null — место работы текущее, ' +
        'на странице появится «с июня 2024».',
    });
  });

  test('логотипы лежат в public', () => {
    const problems = jobs
      .filter(job => job.logo !== undefined && !existsInPublic(job.logo))
      .map(job => job.where + ' → ' + job.logo);

    reportProblems({
      title: 'Логотипы компаний не найдены.',
      problems,
      howToFix:
        'положить файл в public/images/companies либо убрать поле logo — тогда ' +
        'вместо логотипа будет первая буква названия.',
    });
  });
});

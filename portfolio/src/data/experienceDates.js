// Даты опыта работы записаны в experiences.json строкой 'ГГГГ-ММ'.
// Поле end: null означает «работаю по сей день» — тогда концом периода
// считается текущий месяц.

// '2024-06' → { year: 2024, month: 6 }. Строка в другом виде — ошибка
// в данных, а не повод молча нарисовать «NaN»: бросаем исключение.
// experienceDates.test.js прогоняет все записи и называет ту, где опечатка.
export function parseMonth(value) {
  const match = /^(\d{4})-(\d{2})$/.exec(value || '');
  const month = match ? Number(match[2]) : 0;
  if (!match || month < 1 || month > 12) {
    throw new Error(`Дата опыта должна быть в виде ГГГГ-ММ, получено: ${JSON.stringify(value)}`);
  }
  return { year: Number(match[1]), month };
}

function toMonthIndex({ year, month }) {
  return year * 12 + (month - 1);
}

function endOf(job, now) {
  return job.end ? parseMonth(job.end) : { year: now.getFullYear(), month: now.getMonth() + 1 };
}

// Стаж в роли — полных лет от самого раннего начала до самого позднего
// конца среди мест работы этой роли, с округлением до ближайшего целого.
// Паузы между местами работы внутри роли не вычитаются.
// Пример: дизайнер с 2022-06 по 2026-09 — 51 месяц, 4,25 года → «4 года».
// Меньше года округляется вверх до одного: «0 лет» в шапке роли
// выглядит как ошибка.
export function roleYears(jobs, now = new Date()) {
  if (!Array.isArray(jobs) || jobs.length === 0) return 0;

  const starts = jobs.map(job => toMonthIndex(parseMonth(job.start)));
  const ends = jobs.map(job => toMonthIndex(endOf(job, now)));
  const months = Math.max(...ends) - Math.min(...starts);

  return Math.max(1, Math.round(months / 12));
}

// Подпись стажа с правильной формой слова: 1 год, 2 года, 5 лет.
// forms — объект { one, few, many, other } из словаря (ui.json → experience.years),
// ключи совпадают с категориями Intl.PluralRules.
export function formatYears(years, lang, forms) {
  const category = new Intl.PluralRules(lang).select(years);
  return `${years} ${forms[category] ?? forms.other}`;
}

// Период работы: «июнь 2024 — январь 2026» или «с января 2026».
// labels — { months, monthsSince, since } из словаря: у русских месяцев
// после предлога «с» другой падеж, поэтому списков два.
export function formatPeriod(job, labels) {
  const start = parseMonth(job.start);

  if (!job.end) {
    return `${labels.since} ${labels.monthsSince[start.month - 1]} ${start.year}`;
  }

  const end = parseMonth(job.end);
  const from = `${labels.months[start.month - 1]} ${start.year}`;
  const to = `${labels.months[end.month - 1]} ${end.year}`;

  return `${from} — ${to}`;
}

import React, { useEffect, useState } from 'react';
import { ReactComponent as SunIcon } from '../images/sun.svg';
import { ReactComponent as MoonIcon } from '../images/moon.svg';
import { useLanguage } from '../i18n/LanguageContext';

// Часовой пояс, в котором живёт хозяйка сайта. Берётся именно пояс, а не
// смещение в часах: у Москвы перевода часов нет сейчас, но правило смены
// смещения в будущем меняют законом, и Intl возьмёт его из базы часовых
// поясов сам.
export const TIME_ZONE = 'Europe/Moscow';

// Формат подписи один на оба языка: «14:32». Локаль задана жёстко, потому
// что от неё зависит разделитель и порядок частей — при 'ru' это двоеточие,
// а при некоторых других локалях точка, и подпись меняла бы вид при
// переключении языка сайта, хотя время остаётся тем же.
//
// hourCycle: 'h23' — сутки от 00 до 23. Без него полночь в части локалей
// выводится как «24:00».
const TIME_FORMAT = { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' };

export function formatTime(date, timeZone = TIME_ZONE) {
  return new Intl.DateTimeFormat('ru-RU', { ...TIME_FORMAT, timeZone }).format(date);
}

// Час в московском поясе как число от 0 до 23. Считается через Intl, а не
// через date.getHours(): getHours вернул бы час на часах посетителя, и в
// другом поясе рядом с подписью «моё локальное время» стояло бы чужое.
export function hourIn(date, timeZone = TIME_ZONE) {
  const [{ value }] = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date);

  return Number(value);
}

// День — с 6:00 до 20:59 включительно, ночь — остальное время. Границы
// выбраны как круглые, а не по восходу: восход в Петербурге гуляет от 3:35
// в июне до 10:00 в декабре, и значок менялся бы там, где посетитель этого
// не ждёт.
export function isDaytime(hour) {
  return hour >= 6 && hour < 21;
}

// Как часто пересчитывается подпись. Выводятся часы и минуты, поэтому
// достаточно попадать внутрь минуты: при 30 секундах подпись отстаёт от
// настоящего времени не более чем на 30 секунд.
const REFRESH_MS = 30_000;

// Местное время хозяйки сайта со значком дня или ночи перед ним.
export default function LocalTime({ className = '' }) {
  const { t } = useLanguage();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  const day = isDaytime(hourIn(now));
  const Icon = day ? SunIcon : MoonIcon;
  const time = formatTime(now);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      {/* Значок скрыт от программ чтения с экрана, а его смысл дан словом
          рядом: «солнце» они не прочитают никак, а «День» прочитают. */}
      <Icon
        className="h-[1.1em] w-[1.1em] shrink-0"
        aria-hidden="true"
        data-testid="daypart-icon"
      />
      <span className="sr-only">{day ? t('nav.localTime.day') : t('nav.localTime.night')}</span>
      <time dateTime={time}>{time}</time>
    </span>
  );
}

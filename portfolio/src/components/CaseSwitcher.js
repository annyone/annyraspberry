import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Text from './Text';
import projects from '../data/projects.json';
import { caseDescriptions } from '../routes';
import { useLanguage } from '../i18n/LanguageContext';

// Порядок перехода — тот же, в котором кейсы идут на главной и в карте
// сайта, то есть порядок записей в data/projects.json.
//
// Проекты без описания в routes.js пропускаются: маршрута у них нет
// (см. App.js), и ссылка на такой проект вела бы на «страница не найдена».
const navigableProjects = projects.filter(project => caseDescriptions[project.id]);

// Ссылка на соседний кейс. Подпись («Предыдущий кейс») и название кейса
// разнесены по двум строкам: подпись объясняет направление, название
// отвечает на вопрос, стоит ли переходить.
function NeighbourLink({ project, label, arrow, align = '' }) {
  const { t } = useLanguage();
  const title = t(`projects.${project.id}.title`);

  return (
    <RouterLink
      to={`/${project.id}`}
      aria-label={`${label}: ${title}`}
      className={`group flex flex-col gap-1 sm:max-w-[45%] ${align}`.trim()}
    >
      <span className="text-base text-zinc-500">
        {arrow === 'left' && <span aria-hidden="true">← </span>}
        {label}
        {arrow === 'right' && <span aria-hidden="true"> →</span>}
      </span>
      <Text
        variant="p"
        className="font-medium transition-colors duration-150 group-hover:text-rose-500"
      >
        {title}
      </Text>
    </RouterLink>
  );
}

// Переход к соседним кейсам в конце страницы кейса.
//
// Перехода по кругу нет намеренно: у первого кейса нет предыдущего,
// у последнего — следующего. Место при этом не пустует, потому что
// одиночная ссылка прижимается к своему краю (sm:ml-auto у «следующего»).
export default function CaseSwitcher({ currentId }) {
  const { t } = useLanguage();

  const index = navigableProjects.findIndex(project => project.id === currentId);
  if (index === -1) return null;

  const previous = navigableProjects[index - 1];
  const next = navigableProjects[index + 1];
  if (!previous && !next) return null;

  return (
    <nav
      aria-label={t('caseSwitcher.aria')}
      className="mt-10 lg:mt-16 xl:mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 sm:flex-row sm:justify-between sm:gap-8"
    >
      {previous && (
        <NeighbourLink project={previous} label={t('caseSwitcher.previous')} arrow="left" />
      )}
      {next && (
        <NeighbourLink
          project={next}
          label={t('caseSwitcher.next')}
          arrow="right"
          align="sm:ml-auto sm:items-end sm:text-right"
        />
      )}
    </nav>
  );
}

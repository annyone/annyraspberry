import React from 'react';
import Text from './Text';
import { Link as RouterLink, useViewTransitionState } from 'react-router-dom';
import Image, { retinaSources } from './Image';
import { useLanguage } from '../i18n/LanguageContext';
import { projectBackground } from '../data/projectBackground';
import { caseTransitionNames } from '../data/viewTransitions';

// На сколько подложка вырастает вверх и вниз при наведении. Ровно столько же
// она теряет снизу и сверху при уходе указателя.
const HOVER_GROWTH = 'group-hover:-top-4 group-hover:-bottom-4';

export default function ProjectCard({ project }) {
  const { t } = useLanguage();
  const title = t(`projects.${project.id}.title`);
  const description = t(`projects.${project.id}.description`);

  const to = `/${project.id}`;

  // Идёт ли прямо сейчас переход между главной и этим кейсом. Имена для
  // анимации навешиваются только на время перехода и только на эту
  // карточку: имя должно быть уникальным на всю страницу, а карточек
  // на главной четыре — повесив имена на все, браузер отказался бы
  // анимировать вообще.
  const isTransitioning = useViewTransitionState(to);
  const names = caseTransitionNames(isTransitioning);

  return (
    <RouterLink
      to={to}
      viewTransition
      aria-label={`${t('projectCard.open')}: ${title}`}
      // z-index нужен, чтобы подложка при наведении легла ПОВЕРХ соседних
      // карточек: они идут вплотную, и выросшие 16px иначе оказались бы
      // под соседом, то есть эффекта не было бы видно вовсе.
      //
      // Возврат к нулю отложен на время анимации: без задержки карточка
      // проваливается под соседа в первом же кадре сжатия, и вместо
      // плавного ухода видно моргание.
      className={
        'group relative z-0 block ' +
        'transition-[z-index] duration-0 delay-300 hover:z-10 hover:delay-0'
      }
      style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      <article className="relative isolate py-16 xl:py-24">
        {/* Подложка — отдельный слой, а не фон самой карточки: при наведении
            растёт она одна, а содержимое остаётся на месте. Будь цвет задан
            карточке, расти пришлось бы отступам, и заголовок со снимком
            ползли бы вместе с ними.
            Изменение top и bottom, а не масштаб: масштаб растянул бы
            и градиент, и он поехал бы по цвету. */}
        <span
          aria-hidden="true"
          data-testid="card-background"
          className={`absolute inset-x-0 bottom-0 top-0 -z-10 transition-[top,bottom] duration-300 ease-out motion-reduce:transition-none ${HOVER_GROWTH} ${names.background}`}
          style={projectBackground(project.background)}
        />

        <div className="page-grid flex flex-col xl:flex-row gap-8">
          {/* Text block */}
          <div className="w-full xl:w-[40%] flex flex-col">
            {/* Тот же набор стилей стоит у заголовка страницы кейса —
                там он задан тегу h1 через `as`. Разойдись кегли, заголовок
                менял бы размер прямо во время перехода: браузер переводит
                его с карточки на страницу как один элемент. */}
            <Text variant="h2" className={`mb-4 xl:mb-8 text-white ${names.title}`}>
              {title}
            </Text>
            {/* Описание на странице кейса не показывается, поэтому своего
                имени у него нет: при переходе оно растворяется вместе
                с остальным содержимым карточки. */}
            <Text variant="p" className="mb-4 text-white/80">
              {description}
            </Text>

            <span
              className="self-start inline-flex items-center text-white/50 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:text-white"
              aria-hidden="true"
            >
              {t('common.more', 'Подробнее')}
            </span>
          </div>

          {/* Image block */}
          {project.thumbnail && (
            <div className={`w-full xl:w-[60%] flex items-start justify-center ${names.thumbnail}`}>
              {/* Второй источник вычисляется из имени файла, а не берётся из
                  project.thumbnail_2x: у Adidas обложка в .png, поля нет, и
                  раньше в разметку уходил <source> вообще без srcset. */}
              <Image
                src={project.thumbnail}
                sources={retinaSources(project.thumbnail)}
                alt={title}
              />
            </div>
          )}
        </div>
      </article>
    </RouterLink>
  );
}

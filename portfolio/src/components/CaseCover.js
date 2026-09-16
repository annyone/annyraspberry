import React from 'react';
import Text from './Text';
import Image, { retinaSources } from './Image';
import { projectBackground } from '../data/projectBackground';
import { caseTransitionNames } from '../data/viewTransitions';

// Обложка страницы кейса: цветная подложка во всю ширину окна, на ней
// заголовок и снимок экрана. Цвет тот же, что у карточки этого кейса
// на главной, — по нему страница узнаётся как продолжение карточки.
//
// Подложка тянется от самого верха окна: отрицательный верхний отступ
// втягивает её под распорку шапки, а такой же padding возвращает
// содержимое на место. Шапка прозрачная и лежит поверх, поэтому цвет
// виден и за ней.
//
// Боковые отрицательные поля снимают отступы body (px-8, на широких
// экранах xl:px-12), и подложка доходит до краёв окна. Работает это
// только вне <main>: он ограничен по ширине, и внутри него подложку
// пришлось бы растягивать через 100vw — а это ширина окна ВМЕСТЕ
// с полосой прокрутки, и правый край уезжал бы за экран.
export default function CaseCover({ project, title }) {
  // Имена стоят всегда, без условия: кейс на странице один, спорить
  // за имя не с кем. Вне перехода они ни на что не влияют.
  const names = caseTransitionNames();

  return (
    <div
      className={`-mx-8 -mt-[var(--nav-height)] pt-[var(--nav-height)] xl:-mx-12 ${names.background}`}
      style={projectBackground(project.background)}
    >
      <div className="mx-auto max-w-[1600px] px-8 xl:px-12">
        {/* Цвет подписи задан белым, а не взят из темы: подложка тёмная
            при любой теме, и обычный тёмный заголовок на ней пропадал. */}
        {/* Набор стилей тот же, что у карточки этого кейса на главной,
            а тег — h1: это главный заголовок страницы. Вид и место
            в структуре документа здесь расходятся, отсюда `as`. */}
        <Text variant="h2" as="h1" className={`pt-8 text-white ${names.title}`}>
          {title}
        </Text>

        {/* Отступ снизу 16px: подложка кончается чуть ниже снимка, и его
            нижняя граница остаётся видна на цвете. Сверху и по бокам
            отступы прежние — те, что раньше задавал сам Image. */}
        <div className={`mt-8 px-2 pb-4 lg:px-6 xl:px-8 ${names.thumbnail}`}>
          <Image
            src={project.thumbnail}
            sources={retinaSources(project.thumbnail)}
            alt={title}
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}

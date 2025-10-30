import React from 'react';
import Nav from '../components/Nav';
import Text from '../components/Text';
import Section from '../components/Section';
import Image from '../components/Image';
import projects from '../data/projects';
import FeedBackCard from '../components/FeedBackCard';
import navItems from '../data/navItems';
import Article from '../components/Article';

export default function AdidasCase() {
    const project = projects.find(p => p.id === 'adidas');

    return (
        <div className="min-h-screen">
            <Nav items={navItems} />
            <main className="max-w-[1600px] w-full mx-auto pb-1">

                <Section className="pt-12 gap-8">
                    <Text variant="h1">{project.title}</Text>
                    <Image
                        src={project.thumbnail}
                        backgroundColor={project.thumbnailBackground}
                        alt={project.title}
                    />
                    <Text variant="h4">Этот проект — конкурсная работа, в которой я разработала концепт и спроектировала дизайн лендинга для промосайта компании Adidas за 12 дней. </Text>
                </Section>

                <Section title='Задачa' className="gap-4">
                    <Text variant="p">Представить, что все известные айтишники и их компании решили перебраться в Россию. Илон Маск, Цукерберг и другие - запускают бизнес в отечественных городах. Они повторяют успех, но их продукты обрели отечественный колорит. За 12 дней создать дизайн лендинга или промо-сайта и оформи в кейс на Dprofile.</Text>
                </Section>

                <Section title='Идея и концепция' className="gap-4">
                    <Article>
                        <Text variant="p">Так как все известные компании перебираются в Россию в будущем, значит будут возможности создавать высокотехнологичные продукты. Так же учитывается тот факт, что в России активно продвигается диджитализация.</Text>
                        <Text variant="p">В качестве зарубежного бренда выбрала крупнейшую спортивную компанию Adidas, которая будет производить одежду и обувь будущего. Кроме собственного производства Adidas будет создавать уникальные вещи в коллаборации с отечественными компаниями.</Text>
                        <Text variant="p">Добро пожаловать в киберпанк!</Text>
                    </Article>
                    <Article title='Использование нейросетей'>
                        <Text variant="p">С помощью нейросетей онлайн-магазины будут предлагать возможность примерить одежду моментально в пару кликов, а так же подобрать образ на основе контекста.</Text>
                    </Article>
                    <Article title='Адаптация для AR/VR' last>
                        <Text variant="p">Технологии AR/VR будут широко распространены, что повлечет изменение паттернов с появлением новых устройств.</Text>
                    </Article>
                </Section>

                <Section title='Результат' className="gap-4">
                    <Article title='Лендинг'>
                        <Text variant="p">На главной странице пользователь выбирает пол “мужчины” или “женщины”. Так же можно загрузить фото, чтобы “примерить” одежду на конкретного человека.</Text>
                        <Image
                            src="/images/adidas/1.png"
                            alt="Лендинг Adidas"
                        />
                    </Article>

                    <Article title='Просмотр всего образа и выбор одежды'>
                        <Text variant="p">Подобно персонажу в игре, пользователь может настраивать свой образ, выбирая различные элементы одежды и аксессуары. При этом сразу можно увидеть, как выбранные вещи будут выглядеть на модели, и сколько будет стоить полный образ.</Text>
                        <Image
                            src="/images/adidas/2.png"
                            alt="Лендинг Adidas"
                        />
                    </Article>

                    <Article title='Характеристики выбранной модели'>
                        <Text variant="p">На странице определенной модели пользователь может увидеть все характеристики выбранной вещи, включая материалы, размеры и доступные цвета.</Text>
                        <Image
                            src="/images/adidas/3.png"
                            alt="Лендинг Adidas"
                        />
                    </Article>

                    <Article title='Анимация интерфейса' last>
                        <Text variant="p">Интерфейс подразумевает использование окон, которые находятся как бы в воздушном пространстве, создавая эффект глубины и многослойности. Анимация скольжения добавляет динамики и футуристичности.</Text>

                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe 
                                title='Анимация интерфейса'
                                src="https://kinescope.io/embed/cmjUG9xfXuJy1kFNc8D3ZT" 
                                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;" 
                                frameBorder="0" 
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full"
                            ></iframe>
                        </div>

                    </Article>
                </Section>

                <Section title='Комментарии судей о работе' last className="gap-4">
                    <FeedBackCard
                        text=" Привет, Анна! Меня зовут Сергей, я буду проверять твою работу. 
                        Очень сильная работа. Понравилось как ты реализовали анимацию одежды через фигму. Сразу вспомнилась игра киберпанк на релизе. Я тогда купил предзаказ на ps4. Золотое время. В целом, мне всё понравилось. Я бы немного поработал над оформлением кейса. Может быть, переоформить первые слайды и объединить их? Но всё, на твоё усмотрение. Работа крутая, жду возможности заказа Добрый адидас"
                    />
                    <FeedBackCard
                        text="Крутая идея, хоть и не новая. Но на одежду перекладывают редко."
                    />
                </Section>
            </main>
        </div>
    );
}
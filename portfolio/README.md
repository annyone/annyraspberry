# annyraspberry.pro

Сайт-портфолио. Все команды запускаются **из папки `portfolio`**, а не из корня репозитория.

## Команды

| Команда                 | Что делает                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm start`             | Дев-сервер на http://localhost:3000                                                                                                                  |
| `npm test`              | Тесты в режиме наблюдения: пересчитывает только затронутые файлы. `a` — прогнать все, `f` — только упавшие, `p` — фильтр по имени файла, `q` — выход |
| `npm run test:once`     | Один прогон всех тестов и выход                                                                                                                      |
| `npm run test:coverage` | То же плюс отчёт о покрытии в `coverage/lcov-report/index.html`                                                                                      |
| `npm run check`         | **Можно ли пушить:** формат, тесты, сборка                                                                                                           |
| `npm run format`        | Переформатировать исходники                                                                                                                          |

Запустить один файл тестов: `npm test -- src/data/cases/cases.test.js`
Запустить один тест по названию: `npm test -- -t "подпись"`

## Тесты

Лежат рядом с кодом: `Foo.js` и `Foo.test.js` в одной папке. Отдельной папки для тестов нет — Create React App ищет их только внутри `src`, и переопределить это нельзя.

Основной вес набора — не на компонентах, а на проверке данных: словарей переводов, описаний кейсов и путей к картинкам. Там же и возникает большинство ошибок этого сайта. Упавший тест печатает список конкретных мест и строку «что делать».

Панель «Тестирование» в VSCode заполняется расширением `Orta.vscode-jest` — VSCode предложит его установить при открытии папки. Настройки под структуру репозитория уже лежат в `.vscode/settings.json`.

## Проверка перед пушем

В репозитории есть хук, который гоняет формат и тесты перед каждым `git push`. **На новой машине его нужно включить один раз:**

```
git config core.hooksPath .githooks
```

Без этой команды хук не работает. Обойти его в конкретном случае: `git push --no-verify`.

## Деплой

Пуш в `main` запускает GitHub Actions, который собирает проект и выкладывает `build/` на reg.ru по FTP. Тесты в CI пока не запускаются — проверка только локальная.

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---

## Portfolio site setup notes

This repository includes a minimal structure for a static portfolio site built with React (Create React App).

- Pages are in `src/pages/` (Home, ProjectTemplate).
- Reusable components are in `src/components/` (Nav, ProjectCard, Button).
- Project sample data is in `src/data/projects.js` — replace or extend this with your own project entries.
- Add your images to `public/images/` (files are served at `/images/<name>`).

To install dependencies (including router) run:

```powershell
npm install
```

To run locally:

```powershell
npm start
```

Deploy to GitHub Pages

1. Create a GitHub repository and push this project.
2. In the repository settings -> Pages, choose the branch `gh-pages` (or `main` with the `/root` folder) and the `/ (root)` folder for deployment. If you prefer, you can use the `gh-pages` npm package to publish the `build/` folder automatically.

Quick publish using gh-pages package (optional):

```powershell
npm install --save-dev gh-pages; npm run build; npx gh-pages -d build
```

If you need help configuring a custom domain or exact GitHub Pages settings, tell me how you'd like to publish (branch-based or gh-pages package) and I will add the exact steps/scripts.

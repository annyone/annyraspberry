import { arrangeProjects } from './homeProjects';

const projects = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];

test('выбранный главный проект не дублируется, остальные сохраняют порядок', () => {
  expect(arrangeProjects(projects, 'c')).toEqual({
    featured: projects[2],
    primary: projects[0],
    rest: [projects[1], projects[3]],
  });
});

test('при удалении главного проекта используется первый доступный', () => {
  expect(arrangeProjects(projects, 'missing')).toEqual({
    featured: projects[0],
    primary: projects[1],
    rest: [projects[2], projects[3]],
  });
});

test('пустой список и единственный проект не создают повторов', () => {
  expect(arrangeProjects([], 'a')).toEqual({ featured: undefined, primary: undefined, rest: [] });
  expect(arrangeProjects([projects[0]], 'a')).toEqual({
    featured: projects[0],
    primary: undefined,
    rest: [],
  });
});

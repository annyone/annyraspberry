// Фон кейса из data/projects.json.
//
// В поле background может лежать и цвет, и градиент, и картинка,
// а CSS принимает их разными свойствами. Вид значения определяется по самой
// строке: градиент и url() уходят в background-image, всё остальное —
// в background-color. Если записать градиент в background-color, браузер
// молча отбросит правило, и подложка окажется прозрачной.
//
// Раньше эти три строки были переписаны в трёх местах: в карточке на главной,
// в обложке кейса и внутри Image. Расходились они молча — фон просто
// пропадал в одном месте из трёх.
export function projectBackground(value) {
  if (!value) return undefined;

  const isImage = value.includes('gradient') || value.startsWith('url(');

  return isImage ? { backgroundImage: value } : { backgroundColor: value };
}

export default projectBackground;

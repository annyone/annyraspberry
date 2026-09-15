// Накопитель нарушений: тест собирает все найденные проблемы и падает
// один раз читаемым списком.
//
// Зачем не обычный expect в цикле: он падает на первом же нарушении, и
// чтобы узнать, сколько их всего, тест приходится гонять по кругу. Здесь
// сразу виден весь список и одна строка о том, что с ним делать.
export function reportProblems({ title, problems, howToFix }) {
  if (problems.length === 0) return;

  throw new Error(
    [
      '',
      title,
      '',
      ...problems.map(problem => '  • ' + problem),
      '',
      'Что делать: ' + howToFix,
      '',
    ].join('\n')
  );
}

export default reportProblems;

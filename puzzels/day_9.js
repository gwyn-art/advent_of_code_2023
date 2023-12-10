const testInput = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

const parse = (input) => {
  return input.split("\n").map((line) => line.split(" ").map(Number));
};

const extrapolate = (line, isStart = false) => {
  const newLine = [];

  for (let i = 0; i < line.length - 1; i++) {
    newLine.push(line[i + 1] - line[i]);
  }

  const isFinal = line.every((n) => n === 0);
  let moreLines = [];

  if (!isFinal) {
    moreLines = extrapolate(newLine);
  } else {
    return [];
  }

  return [...(isStart ? [line] : []), newLine, ...moreLines];
};

const solve = (input, backwards = false) => {
  const extrapolations = [];

  for (let line of input) {
    line = backwards ? line.reverse() : line;
    extrapolations.push(extrapolate(line, true));
  }

  const extrapolatedValues = extrapolations.map((e) =>
    e.reduce((acc, l) => acc + l[l.length - 1], 0)
  );

  return extrapolatedValues.reduce((acc, v) => acc + v, 0);
};

console.log(solve(parse(testInput), true));

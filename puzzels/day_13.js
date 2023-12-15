const testInput = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

const testInput2 = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

const parse = (input) => {
  return input
    .split("\n")
    .map((x) => (x ? x : "*"))
    .join("&")
    .split("*")
    .map((l) => l.split("&"))
    .map((lines) => lines.filter((l) => l));
};

const reverse = (pattern) => {
  let newPattern = [];

  for (let i = 0; i < pattern[0].length; i++) {
    newPattern.push([]);
    for (let j = 0; j < pattern.length; j++) {
      newPattern[i].push(pattern[j][i]);
    }
  }

  newPattern = newPattern.map((l) => l.join(""));

  return newPattern;
};

const isMirror = (pattern, reflectionIndex, tolerance) => {
  let isMirror = true;
  let lineTolerance = tolerance;
//   console.log("---- mirror ----");
  for (
    let i = reflectionIndex, j = reflectionIndex + 1;
    i > -1 && j < pattern.length;
    i--, j++
  ) {
    const line1 = pattern[i].split("");
    const line2 = pattern[j].split("");
    const diff = line1.reduce(
      (acc, curr, i) => acc + (curr !== line2[i] ? 1 : 0),
      0
    );
    console.log(diff)
    if (diff === 1) {
        console.log(pattern[i], pattern[j])
    }
    // console.log(pattern[i], pattern[j], diff, lineTolerance);

    lineTolerance -= diff;
  }
//   console.log("---- mirror end ----");
  return lineTolerance === 0;
};

const findReflections = (pattern, _tolerance) => {
  for (let i = 0; i < pattern.length - 1; i++) {
    const line1 = pattern[i].split("");
    const line2 = pattern[i + 1].split("");
    const diff = line1.reduce(
      (acc, curr, i) => acc + (curr !== line2[i] ? 1 : 0),
      0
    );
    // console.log(pattern[i], pattern[i + 1], diff, lineTolerance);
    if (diff <= _tolerance && isMirror(pattern, i, _tolerance)) {
      return [i, true];
    }
  }

  return [0, false];
};

const solve = (input, tolerance) => {
  let horizonSum = 0;
  let verticalSum = 0;

  for (pattern of input) {
    const [horizonReflections, horizonMirror] = findReflections(
      pattern,
      tolerance
    );
    const [verticalReflections, verticalMirror] = findReflections(
      reverse(pattern),
      tolerance
    );

    console.log(
      [horizonReflections, horizonMirror],
      [verticalReflections, verticalMirror]
    );
    if (horizonMirror) {
      console.log(horizonReflections);
      horizonSum += horizonReflections + 1;
    } else if (verticalMirror) {
      console.log(verticalReflections);
      verticalSum += verticalReflections + 1;
    } else {
      console.log("WTF");
    }
  }

  return horizonSum * 100 + verticalSum;
};

console.log(solve(parse(testInput2), 1));
// > 33566
// > 39677
// > 17693
// > 27099
// > 32640
// == 42974

// < 38885
// < 39479
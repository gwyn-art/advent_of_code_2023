const testInput = `Time:      7  15   30
Distance:  9  40  200`;

const parse = (input) => {
  const lines = input.split("\n");
  const [time, distance] = lines
    .map((line) => line.split(/\s+/).slice(1).map(Number))
    .filter((x) => x);
  return [time, distance];
};

// ---- Part 1 ----

const countMinMax = (time, distance) => {
  const res = [];

  for (let i = 0; i < time; i++) {
    const passedDistance = i * (time - i);
    if (passedDistance > distance) {
      res.push(passedDistance);
    }
  }

  return res.length;
};

const solve1 = ([timeL, distanceL]) => {
  return timeL.reduce(
    (acc, time, i) => acc * countMinMax(time, distanceL[i]),
    1
  );
};

// ---- Part 2 ----

// kekW
const solve2 = ([timeL, distanceL]) => {
  const time = Number(timeL.join(""));
  const distance =  Number(distanceL.join(""));

  return countMinMax(time, distance);
};

console.log(solve2(parse(testInput)));

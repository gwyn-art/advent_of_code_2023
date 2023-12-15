const testInput = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

const parse = (input) => {
  return input.split("\n").map((l) => l.split(""));
};

const reverse = (pattern) => {
  let newPattern = [];

  for (let i = 0; i < pattern[0].length; i++) {
    newPattern.push([]);
    for (let j = pattern.length - 1; j > -1; j--) {
      newPattern[i].push(pattern[j][i]);
    }
  }

  return newPattern;
};

const mirror = (pattern) => {
  return pattern.map((l) => l.reverse());
};

const map = new Map();
let hit = 0;
let miss = 0;
const tilt = (l) => {
  if (map.has(l.join(""))) {
    hit++;
    return map.get(l.join(""));
  }

  let newL = l.slice();
  for (let i = l.length - 1; i > -1; i--) {
    if (l[i] === "O") {
      let blocker = i + 1;

      for (; blocker < l.length; blocker++) {
        if (newL[blocker] === "#" || newL[blocker] === "O") {
          break;
        }
      }

      if (blocker - 1 < l.length) {
        newL[i] = ".";
        newL[blocker - 1] = "O";
        // console.log(i, blocker, l.join(''), newL.join(''));
      }
    }
  }

  map.set(l.join(""), newL);
  miss++;
  return newL;
};

const solve = (input) => {
  const tilted = [];
  const reversed = reverse(input);

  for (l of reversed) {
    tilted.push(tilt(l));
  }

  let total = 0;

  for (l of tilted) {
    for (let i = 0; i < l.length; i++) {
      if (l[i] === "O") {
        total += i + 1;
      }
    }
  }

  return total;
};

const patternMap = new Map();
const cycleMap = new Map();
let cycleHit = 0;
let cycleMiss = 0;
let newMiss = 0;
let newMissLock = true;

const solve2 = (input, cycles = 1) => {
  let tilted = input;

  for (let i = 0; i < cycles; i++) {
    console.log(`${i + 1}/${cycles}`);
    const north = reverse(tilted);
    const northKey = north.map(l => l.join('')).join('');
    tilted = [];

    if (cycleMap.has(`final${northKey}`)) {
      const [, cycleStart] = cycleMap.get(`final${northKey}`);
      const cycleLength = i - cycleStart;
      const finalPoint = (cycles - cycleStart) % cycleLength;
      console.log(
        "cycleMap:",
        [...cycleMap.values()],
        finalPoint,
        cycleLength,
        cycleStart,
        cycleMiss
      );
      const [finalTilt, cycleIndex] = [...cycleMap.values()].find(
        ([_, cycleIndex]) => cycleIndex - cycleStart + 1 === finalPoint
      );
      console.log("cycleIndex", cycleIndex);
      tilted = finalTilt;
      break;
      // const [newTilt] = cycleMap.get(`final${northKey}`);
      // tilted = newTilt;
      // cycleHit++;
      // continue;
    }

    if (!newMissLock) {
      newMissLock++;
    }
    cycleMiss++;

    if (patternMap.has(northKey)) {
      tilted = patternMap.get(northKey);
    } else {
      for (let l of north) {
        tilted.push(tilt(l));
      }

      patternMap.set(northKey, tilted);
    }

    const west = reverse(tilted);
    const westKey = west.reduce((acc, l) => acc + l.join(""), "");
    tilted = [];

    if (patternMap.has(westKey)) {
      tilted = patternMap.get(westKey);
    } else {
      for (let l of west) {
        tilted.push(tilt(l));
      }

      patternMap.set(westKey, tilted);
    }

    const south = reverse(tilted);
    const southKey = south.reduce((acc, l) => acc + l.join(""), "");
    tilted = [];

    if (patternMap.has(southKey)) {
      tilted = patternMap.get(southKey);
    } else {
      for (let l of south) {
        tilted.push(tilt(l));
      }

      patternMap.set(southKey, tilted);
    }

    const east = reverse(tilted);
    const eastKey = east.reduce((acc, l) => acc + l.join(""), "");
    tilted = [];

    if (patternMap.has(eastKey)) {
      tilted = patternMap.get(eastKey);
    } else {
      for (let l of east) {
        tilted.push(tilt(l));
      }

      patternMap.set(eastKey, tilted);
    }

    cycleMap.set(`final${northKey}`, [tilted, i]);
    // tilted = reverse(tilted)
  }

  console.log(draw(tilted));
  console.log(hit, miss);
  console.log(cycleHit, cycleMiss, newMiss);
  let total = 0;

  for (let l of reverse(tilted)) {
    for (let i = 0; i < l.length; i++) {
      if (l[i] === "O") {
        total += i + 1;
      }
    }
  }

  return total;
};

const draw = (input) => {
  return input.map((l) => l.join("")).join("\n");
};

console.time('solve')
console.log(solve2(parse(testInput), 1000000000));
console.timeEnd('solve')
// < 98504

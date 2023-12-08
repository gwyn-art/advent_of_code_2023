const testWay = "LLR".split("");

const testInput = `AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const testWay2 = "LR".split("");

const testInput2 = `11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX`;

const parse = (input) => {
  const lines = input.split("\n");

  return lines
    .map((line) => line.split("=").map((s) => s.trim()))
    .map(([enter, nodes]) => [
      enter,
      nodes.split(",").map((s) => s.trim().replace("(", "").replace(")", "")),
    ]);
};

const move = (map, way, pos, nextI) => {
  console.log("🚀 ~ file: day_8.js:798 ~ move ~ pos:", pos);
  console.log("🚀 ~ file: day_8.js:798 ~ move ~ nextI:", nextI);
  const nextS = way[nextI];
  const newEnterS = map[pos][1][nextS === "L" ? 0 : 1];
  const newEnterI = map.findIndex(([enter]) => enter === newEnterS);

  return [newEnterI];
};

const solve = (map, way) => {
  let pos = map.findIndex(([enter]) => enter === "AAA");
  const finishPos = map.findIndex(([enter]) => enter === "ZZZ");
  let counter = 0;
  let nextI = 0;

  while (true) {
    const [newPos] = move(map, way, pos, nextI);
    counter++;
    if (newPos === finishPos || counter > 100000000) {
      break;
    }
    pos = newPos;
    nextI = nextI + 1 === way.length ? 0 : nextI + 1;
  }

  return counter;
};

const move2 = (map, way, pos, nextI) => {
  const newPos = [];

  for (let i = 0; i < pos.length; i++) {
    const newPosI = move(map, way, pos[i], nextI);
    newPos.push(newPosI);
  }

  return newPos.flat();
};

// Oh noo...
const solve2 = (map, way) => {
  let pos = map
    .map(([enter], i) => (enter[2] === "A" ? i : -1))
    .filter((p) => p > -1);
  const finishPos = map
    .map(([enter], i) => (enter[2] === "Z" ? i : -1))
    .filter((p) => p > -1);
  console.log("finishPos:", finishPos);
  console.log("pos:", pos);
  let counter = 0;
  let nextI = 0;

  while (true) {
    // console.log(pos.map(p => map[p][0]))
    const newPos = move2(map, way, pos, nextI);
    counter++;
    const finishLen = newPos.filter((p) => map[p][0][2] === "Z").length;
    // console.log("🚀 ~ file: day_8.js:850 ~ solve2 ~ finishLen:", finishLen)
    if (finishLen > 0) {
      console.log(`${finishLen}/${pos.length}`);
    }
    if (finishLen === pos.length || counter > 1000000000) {
      break;
    }
    pos = newPos;
    nextI = nextI + 1 === way.length ? 0 : nextI + 1;
  }

  return counter;
};

// Well ok
const solve3 = (map, way) => {
  let pos = map
    .map(([enter], i) => (enter[2] === "A" ? i : -1))
    .filter((p) => p > -1);
  const res = [];

  for (let i = 0; i < pos.length; i++) {
    let counter = 0;
    let zCounter = 0;
    let posI = pos[i];
    let nextI = 0;
    let cycleCounter = 0;
    let toPositionCounter = 0;

    while (true) {
      const [newPos] = move(map, way, posI, nextI);
      counter++;
      if (zCounter === 0) {
        toPositionCounter++;
      } else if (zCounter === 1) {
        cycleCounter++;
      }
      if (map[newPos][0][2] === "Z") {
        zCounter++;
      }
      if (zCounter === 2 || counter > 100000000) {
        res.push({ toPositionCounter, cycleCounter });
        break;
      }
      posI = newPos;
      nextI = nextI + 1 === way.length ? 0 : nextI + 1;
    }
  }

  console.log(JSON.stringify(res, null, 2));

  // Feels like I need to go to school again
  const max = Math.max(...res.map(({ cycleCounter }) => cycleCounter));
  let realRes = max;

  while (
    res.some(({ cycleCounter }) => {
      return realRes % cycleCounter !== 0;
    })
  ) {
    realRes += max;
  }

  return realRes;
};

console.log(solve3(parse(testInput2), testWay2));

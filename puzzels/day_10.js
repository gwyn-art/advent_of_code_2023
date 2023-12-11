// Let it be a monument for the suffering till 4:36 am

const testInput = `.....
.S-7.
.|.|.
.L-J.
.....`;

const testInput2 = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;

const testInput3 = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`;

const testInput4 = `..........
.S------7.
.|F----7|.
.||OOOO||.
.||OOOO||.
.|L-7F-J|.
.|II||II|.
.L--JL--J.
..........`;

const testInput5 = `OF----7F7F7F7F-7OOOO
O|F--7||||||||FJOOOO
O||OFJ||||||||L7OOOO
FJL7L7LJLJ||LJIL-7OO
L--JOL7IIILJS7F-7L7O
OOOOF-JIIF7FJ|L7L7L7
OOOOL7IF7||L7|IL7L7|
OOOOO|FJLJ|FJ|F7|OLJ
OOOOFJL-7O||O||||OOO
OOOOL---JOLJOLJLJOOO`;

const parse = (input) => {
  return input.split("\n").map((row) => row.split(""));
};

const findStart = (map) => {
  const start = [];

  for (let r of map) {
    for (let c of r) {
      if (c === "S") {
        start.push(map.indexOf(r));
        start.push(r.indexOf(c));
      }
    }
  }

  return start;
};

const possibleConnections = {
  top: ["7", "F", "|"],
  bottom: ["J", "L", "|"],
  left: ["F", "-", "L"],
  right: ["7", "-", "J"],
};

const connectionsMap = {
  ["|"]: {
    first: possibleConnections.top,
    second: possibleConnections.bottom,
  },
  ["-"]: {
    first: possibleConnections.left,
    second: possibleConnections.right,
  },
  7: {
    first: possibleConnections.left,
    second: possibleConnections.bottom,
  },
  J: {
    first: possibleConnections.top,
    second: possibleConnections.left,
  },
  F: {
    first: possibleConnections.right,
    second: possibleConnections.bottom,
  },
  L: {
    first: possibleConnections.top,
    second: possibleConnections.right,
  },
};

// this is not used I guess
const getNearest = (map, pos) => {
  return {
    top: map[pos[0] - 1]?.[pos[1]],
    bottom: map[pos[0] + 1]?.[pos[1]],
    left: map[pos[0]][pos[1] - 1],
    right: map[pos[0]][pos[1] + 1],
  };
};

const getNearestWithDiagonals = (map, pos) => {
  return {
    top: map[pos[0] - 1]?.[pos[1]],
    bottom: map[pos[0] + 1]?.[pos[1]],
    left: map[pos[0]][pos[1] - 1],
    right: map[pos[0]][pos[1] + 1],
    topLeft: map[pos[0] - 1]?.[pos[1] - 1],
    topRight: map[pos[0] - 1]?.[pos[1] + 1],
    bottomLeft: map[pos[0] + 1]?.[pos[1] - 1],
    bottomRight: map[pos[0] + 1]?.[pos[1] + 1],
  };
};

const isConnected = (pipeA, pipeB, isFirst) => {
  const connections = connectionsMap[pipeA];
  if (isFirst) {
    return connections.first.includes(pipeB);
  } else {
    return connections.second.includes(pipeB);
  }
};

// This even works !
const findConnections = (map, pos) => {
  const pipe = map[pos[0]][pos[1]];
  const connections = [];
  const nearest = getNearest(map, pos);

  switch (pipe) {
    case "|":
      if (isConnected(pipe, nearest.top, true)) {
        connections.push([pos[0] - 1, pos[1]]);
      }
      if (isConnected(pipe, nearest.bottom, false)) {
        connections.push([pos[0] + 1, pos[1]]);
      }
      break;

    case "-":
      if (isConnected(pipe, nearest.left, true)) {
        connections.push([pos[0], pos[1] - 1]);
      }
      if (isConnected(pipe, nearest.right, false)) {
        connections.push([pos[0], pos[1] + 1]);
      }
      break;
    case "7":
      if (isConnected(pipe, nearest.left, true)) {
        connections.push([pos[0], pos[1] - 1]);
      }
      if (isConnected(pipe, nearest.bottom, false)) {
        connections.push([pos[0] + 1, pos[1]]);
      }
      break;
    case "J":
      if (isConnected(pipe, nearest.top, true)) {
        connections.push([pos[0] - 1, pos[1]]);
      }
      if (isConnected(pipe, nearest.left, false)) {
        connections.push([pos[0], pos[1] - 1]);
      }
      break;
    case "F":
      if (isConnected(pipe, nearest.right, true)) {
        connections.push([pos[0], pos[1] + 1]);
      }
      if (isConnected(pipe, nearest.bottom, false)) {
        connections.push([pos[0] + 1, pos[1]]);
      }
      break;
    case "L":
      if (isConnected(pipe, nearest.top, true)) {
        connections.push([pos[0] - 1, pos[1]]);
      }
      if (isConnected(pipe, nearest.right, false)) {
        connections.push([pos[0], pos[1] + 1]);
      }
      break;
    case "S":
      if (possibleConnections.top.includes(nearest.top)) {
        connections.push([pos[0] - 1, pos[1]]);
      }
      if (possibleConnections.bottom.includes(nearest.bottom)) {
        connections.push([pos[0] + 1, pos[1]]);
      }
      if (possibleConnections.left.includes(nearest.left)) {
        connections.push([pos[0], pos[1] - 1]);
      }
      if (possibleConnections.right.includes(nearest.right)) {
        connections.push([pos[0], pos[1] + 1]);
      }
      break;
  }

  if (!connections.length) {
    console.log(pipe, pos, nearest);
  }
  return connections;
};

const remove = (map, pos, char) => {
  if (map[pos[0]] && map[pos[0]][pos[1]]) {
    map[pos[0]][pos[1]] = "*";
  }
};

const solve = (map) => {
  const sPos = findStart(map);
  let counter = 0;
  let [aRoute, bRoute] = findConnections(map, sPos);
  remove(map, sPos, counter);
  counter++;

  while (aRoute[0] !== bRoute[0] || aRoute[1] !== bRoute[1]) {
    const [newA] = findConnections(map, aRoute);
    const [newB] = findConnections(map, bRoute);
    remove(map, aRoute, counter);
    remove(map, bRoute, counter);
    aRoute = newA;
    bRoute = newB;
    counter++;
  }

  return counter;
};

// I had an idea to do a water-fill solution
// It was ok
// The water should also pass between the pipes
// It was hell
const fillWater = (map, pos, loop, start, inBetween) => {
  const c = map[pos[0]]?.[pos[1]];
  if (c === "~" || !c) {
    return;
  }
  const notLoop = c !== "*";
  const hasWaterNearby =
    start ||
    inBetween ||
    Object.values(getNearestWithDiagonals(map, pos)).some((c) => c === "~");
  const hasWaterToFill = Object.values(getNearest(map, pos)).some(
    (c) => c !== "*" && c !== "~"
  );

  if (notLoop && hasWaterNearby) {
    map[pos[0]][pos[1]] = "~";
    if (hasWaterToFill) {
      if (map[pos[0] - 1]?.[pos[1]]) {
        fillWater(map, [pos[0] - 1, pos[1]], loop);
      }
      if (map[pos[0] + 1]?.[pos[1]]) {
        fillWater(map, [pos[0] + 1, pos[1]], loop);
      }
      if (map[pos[0]]?.[pos[1] - 1]) {
        fillWater(map, [pos[0], pos[1] - 1], loop);
      }
      if (map[pos[0]]?.[pos[1] + 1]) {
        fillWater(map, [pos[0], pos[1] + 1], loop);
      }
      // fill diagonals
      if (map[pos[0] - 1]?.[pos[1] - 1]) {
        fillWater(map, [pos[0] - 1, pos[1] - 1], loop);
      }
      if (map[pos[0] + 1]?.[pos[1] + 1]) {
        fillWater(map, [pos[0] + 1, pos[1] + 1], loop);
      }
      if (map[pos[0] + 1]?.[pos[1] - 1]) {
        fillWater(map, [pos[0] + 1, pos[1] - 1], loop);
      }
      if (map[pos[0] - 1]?.[pos[1] + 1]) {
        fillWater(map, [pos[0] - 1, pos[1] + 1], loop);
      }
    }
  }
};

// So I check each pipe if it is connected to nearest pipes
// If no we move one step in direction between inside value and pipe
// And check again
// I guess it sounds ok, but coding it is hell
const checkWaterBetweenPipes = (map, loop, pos, inBetween) => {
  const cLoop = loop.find((l) => l.pos[0] === pos[0] && l.pos[1] === pos[1]);
  const { prevLoop, waterFromL, waterFromR, waterFromT, waterFromB } =
    inBetween || {};
  const notPreviusStep = (sL) =>
    sL.pos[0] !== prevLoop?.pos?.[0] || sL.pos[1] !== prevLoop?.pos?.[1];

  const waterFromLeft =
    (waterFromL || map[pos[0]]?.[pos[1] - 1] !== "*") &&
    (!waterFromT || !waterFromB);
  const waterFromRight =
    (waterFromR || map[pos[0]]?.[pos[1] + 1] !== "*") &&
    (!waterFromT || !waterFromB);
  const waterFromLeftOrRight = waterFromLeft || waterFromRight;

  if (waterFromLeftOrRight) {
    const topLoop = loop.find(
      (l) => l.pos[0] === pos[0] - 1 && l.pos[1] === pos[1]
    );
    const bottomLoop = loop.find(
      (l) => l.pos[0] === pos[0] + 1 && l.pos[1] === pos[1]
    );
    if (
      topLoop &&
      notPreviusStep(topLoop) &&
      !possibleConnections.top.includes(topLoop.c)
    ) {
      const newPos = [
        cLoop.pos[0],
        waterFromLeft ? cLoop.pos[1] + 1 : cLoop.pos[1] - 1,
      ];
      const nexC = map[newPos[0]][newPos[1]];
      if (!nexC || nexC === "~") {
        return true;
      } else if (nexC === "*") {
        checkWaterBetweenPipes(map, loop, newPos, {
          prevLoop: cLoop,
          waterFromL: waterFromLeft,
          waterFromR: waterFromRight,
        });
      }
    } else if (!topLoop && map[cLoop.pos[0] - 1]?.[cLoop.pos[1]] === "~") {
      return true;
    }
    if (
      bottomLoop &&
      notPreviusStep(bottomLoop) &&
      !possibleConnections.bottom.includes(bottomLoop.c)
    ) {
      const newPos = [
        cLoop.pos[0],
        waterFromLeft ? cLoop.pos[1] + 1 : cLoop.pos[1] - 1,
      ];
      const nexC = map[newPos[0]][newPos[1]];
      if (!nexC || nexC === "~") {
        return true;
      } else if (nexC === "*") {
        checkWaterBetweenPipes(map, loop, newPos, {
          prevLoop: cLoop,
          waterFromB: waterFromBottom,
          waterFromT: waterFromTop,
        });
      }
    } else if (!bottomLoop && map[cLoop.pos[0] + 1]?.[cLoop.pos[1]] === "~") {
      return true;
    }
  }

  const waterFromTop = waterFromT || map[pos[0] - 1]?.[pos[1]] !== "*";
  const waterFromBottom = waterFromB || map[pos[0] + 1]?.[pos[1]] !== "*";
  const waterFromTopOrBottom = waterFromTop || waterFromBottom;
  if (pos[0] === 6 && pos[1] === 4) {
    console.log(cLoop, waterFromTopOrBottom);
  }
  if (waterFromTopOrBottom) {
    const leftLoop = loop.find(
      (l) => pos[0] === l.pos[0] && l.pos[1] === pos[1] - 1
    );
    const rightLoop = loop.find(
      (l) => pos[0] === l.pos[0] && l.pos[1] === pos[1] + 1
    );
    if (
      leftLoop &&
      notPreviusStep(leftLoop) &&
      !possibleConnections.left.includes(leftLoop.c)
    ) {
      const newPos = [
        waterFromTop ? cLoop.pos[0] + 1 : cLoop.pos[0] - 1,
        cLoop.pos[1],
      ];
      const nexC = map[newPos[0]][newPos[1]];
      if (!nexC || nexC === "~") {
        return true;
      } else if (nexC === "*") {
        checkWaterBetweenPipes(map, loop, newPos, {
          prevLoop: cLoop,
          waterFromB: waterFromBottom,
          waterFromT: waterFromTop,
        });
      }
    } else if (!leftLoop && map[cLoop.pos[0]]?.[cLoop.pos[1] - 1] === "~") {
      return true;
    }

    if (
      rightLoop &&
      notPreviusStep(rightLoop) &&
      !possibleConnections.right.includes(rightLoop.c)
    ) {
      const newPos = [
        waterFromTop ? cLoop.pos[0] + 1 : cLoop.pos[0] - 1,
        cLoop.pos[1],
      ];

      const nexC = map[newPos[0]][newPos[1]];
      if (!nexC || nexC === "~") {
        console.log('$:', cLoop)
        return true;
      } else if (nexC === "*") {
        checkWaterBetweenPipes(map, loop, newPos, {
          prevLoop: cLoop,
          waterFromB: waterFromBottom,
          waterFromT: waterFromTop,
        });
      }
    } else if (!rightLoop && map[cLoop.pos[0]]?.[cLoop.pos[1] + 1] === "~") {
      return true;
    }
  }
};

const searchBetweenPipes = (map, loops, pos) => {
  const nearestLoops = [
    [pos[0] - 1, pos[1]],
    [pos[0] + 1, pos[1]],
    [pos[0], pos[1] - 1],
    [pos[0], pos[1] + 1],
    [pos[0] - 1, pos[1] - 1],
    [pos[0] - 1, pos[1] + 1],
    [pos[0] + 1, pos[1] - 1],
    [pos[0] + 1, pos[1] + 1],
  ].filter((nP) => map[nP[0]]?.[nP[1]] === "*");

  for (let l of nearestLoops) {
    if (checkWaterBetweenPipes(map, loops, l)) {
      fillWater(map, pos, loops, true);
    }
  }
};

// In the result I saw a picture on redit using rendering alogrithm
const fillWater2 = (map, loop) => {
  for (let i = 0; i < map.length; i++) {
    let blocker = false;
    for (let j = 0; j < map[i].length; j++) {
      const cLoop = loop.find(l => l.pos[0] === i && l.pos[1] === j)
      if (cLoop && ['|', 'J', 'L'].includes(cLoop.c)) {
        blocker = !blocker
      } else if (!cLoop && !blocker) {
        map[i][j] = '~'
      }
    }
  }
}

const solve2 = (map) => {
  const sPos = findStart(map);
  let loop = [];
  let [aRoute, bRoute] = findConnections(map, sPos);
  let counter = 0;
  remove(map, sPos, counter);
  loop.push({ pos: aRoute, c: map[aRoute[0]][aRoute[1]] });
  loop.push({ pos: bRoute, c: map[bRoute[0]][bRoute[1]] });

  while (aRoute[0] !== bRoute[0] || aRoute[1] !== bRoute[1]) {
    const [newA] = findConnections(map, aRoute);
    const [newB] = findConnections(map, bRoute);
    remove(map, aRoute, counter);
    remove(map, bRoute, counter);
    aRoute = newA;
    bRoute = newB;
    counter++;
    loop.push({ pos: aRoute, c: map[aRoute[0]][aRoute[1]] });
    loop.push({ pos: bRoute, c: map[bRoute[0]][bRoute[1]] });
  }

  remove(map, aRoute, counter);
  remove(map, bRoute, counter);

  // for (let i = 0; i < map[0].length; i++) {
  //   fillWater(map, [0, i], loop, true);
  //   fillWater(map, [map.length - 1, i], loop, true);
  // }
  // for (let i = 0; i < map.length; i++) {
  //   fillWater(map, [i, 0], loop, true);
  //   fillWater(map, [i, map[0].length - 1], loop, true);
  // }

  fillWater2(map, loop)

  console.log(map.map((r) => r.join("")).join("\n"));
  console.log("----------");
  let countInsde = 0;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      // if (map[i][j] !== "~" && map[i][j] !== "*") {
        // searchBetweenPipes(map, loop, [i, j]);
        if (map[i][j] !== "~" && map[i][j] !== "*") {
          countInsde++;
        }
      // }
    }
  }
  console.log(map.map((r) => r.join("")).join("\n"));
  return countInsde;
};

console.log(solve2(parse(testInput5)));

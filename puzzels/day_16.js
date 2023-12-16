const process = require("process");

const testInput = `.|...*....
|.-.*.....
.....|-...
........|.
..........
.........*
..../.**..
.-.-/..|..
.|....-|.*
..//.|....`;

const parse = (input) => {
  return input.split("\n").map((l) => l.split(""));
};

let pass = new Set();
let cache = new Set();

const moveVertical = (map, pos, dir, start) => {
  if (!start) {
    pass.add(pos[0] + "," + pos[1]);
    // draw(map);
  }

  const newPos = [pos[0] + dir, pos[1]];
  const newC = map[newPos[0]]?.[newPos[1]];
  const hash = "" + newPos[0] + "," + newPos[1] + "vertical" + dir;

  if (!newC || cache.has(hash)) {
    return [];
  }

  cache.add(hash);

  if (newC === "-") {
    moveHorizontal(map, newPos, -1);
    moveHorizontal(map, newPos, 1);
    return;
  }

  if (newC === "/") {
    return moveHorizontal(map, newPos, dir * -1);
  }

  if (newC === "*") {
    return moveHorizontal(map, newPos, dir);
  }

  moveVertical(map, newPos, dir);
};

const moveHorizontal = (map, pos, dir, start) => {
  if (!start) {
    pass.add(pos[0] + "," + pos[1]);
    // draw(map);
  }
  const newPos = [pos[0], pos[1] + dir];
  const newC = map[newPos[0]]?.[newPos[1]];
  const hash = "" + newPos[0] + "," + newPos[1] + "horizontal" + dir;

  if (!newC || cache.has(hash)) {
    return [];
  }

  cache.add(hash);

  if (newC === "|") {
    moveVertical(map, newPos, -1);
    moveVertical(map, newPos, 1);
    return;
  }

  if (newC === "/") {
    return moveVertical(map, newPos, dir * -1);
  }

  if (newC === "*") {
    return moveVertical(map, newPos, dir);
  }

  moveHorizontal(map, newPos, dir);
};

const draw = (map) => {
  console.log(
    map
      .map((l, i) => l.map((c, j) => (pass.has("" + i + j) ? "#" : c)).join(""))
      .join("\n")
  );
  console.log("-----------------------------------------------------");
  console.log("-----------------------------------------------------");
  console.log("-----------------------------------------------------");
};

const solve = (map) => {
  console.log(map);
  console.log("-------");
  moveHorizontal(map, [0, -1], 1, true);

  draw(map);

  return pass.size;
};

const solve2 = (map) => {
  let maxSize = 0;

  const test = (move) => {
    pass = new Set();
    cache = new Set();
    move();
    if (pass.size > maxSize) {
      maxSize = pass.size;
    }
  };

  // top
  for (let i = 0; i < map[0].length; i++) {
    test(() => moveVertical(map, [-1, i], 1, true));

    if (i === 0) {
      test(() => moveHorizontal(map, [0, -1], 1, true));
    } else if (i === map[0].length - 1) {
      test(() => moveHorizontal(map, [0, map[0].length], -1, true));
    }
  }

  // bottom
  for (let i = map[0].length - 1; i > -1; i--) {
    test(() => moveVertical(map, [map[0].length, i], -1, true));

    if (i === 0) {
      test(() => moveHorizontal(map, [map[0].length - 1, -1], 1, true));
    } else if (i === map[0].length - 1) {
      test(() => moveHorizontal(map, [map[0].length -1, map[0].length], -1, true));
    }
  }

  // left
  for (let i = 1; i < map.length; i++) {
    test(() => moveHorizontal(map, [i, -1], 1, true));
  }

  // right
  for (let i = 1; i < map.length; i++) {
    test(() => moveHorizontal(map, [i, map[0].length], -1, true));
  }

  return maxSize;
};

console.log(solve2(parse(testInput)));

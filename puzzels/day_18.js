const testInput = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;


const parse = (input) => {
  return input.split("\n").map((line) => {
    const [direction, ...rest] = line.split(" ");
    const steps = parseInt(rest[0]);
    const color = rest[1].slice(1, 7);
    return { direction, steps, color };
  });
};

const hexMap = {
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
};

const parse2 = (input) => {
  return input.split("\n").map((line) => {
    const [_, ...rest] = line.split(" ");
    const color = rest[1].slice(1, 8);
    const directionNum = hexMap[color[color.length - 1]];
    const direction = directionNum === 0 ? 'R' : directionNum === 1 ? 'D' : directionNum === 2 ? 'L' : 'U';
    const steps = color.slice(1, color.length - 1).split('').reduce((acc, c) => acc * 16 + hexMap[c], 0);

    return { direction, steps };
  });
};

const solve = (input) => {
  let maxR = 1;
  let maxD = 1;

  input.forEach((line) => {
    if (line.direction === "R") {
      maxR += line.steps;
    } else if (line.direction === "D") {
      maxD += line.steps;
    }
  });

  let map = [];

  let pos = [0, 0];

  input.forEach(({ steps, direction }) => {
    if (direction === "R") {
      for (let i = 0; i < steps; i++) {
        pos[1] += 1;
        map.push([pos[0], pos[1], "R"]);
      }
    }
    if (direction === "D") {
      for (let i = 0; i < steps; i++) {
        map.pop();
        map.push([pos[0], pos[1], "D"]);
        pos[0] += 1;
        map.push([pos[0], pos[1], "D"]);
      }
    }
    if (direction === "L") {
      for (let i = 0; i < steps; i++) {
        pos[1] -= 1;
        map.push([pos[0], pos[1], "L"]);
      }
    }
    if (direction === "U") {
      for (let i = 0; i < steps; i++) {
        map.pop();
        map.push([pos[0], pos[1], "U"]);
        pos[0] -= 1;
        map.push([pos[0], pos[1], "U"]);
      }
    }
  });

  const [minU, minL] = map.reduce(
    (acc, [x, y, c]) => {
      console.log(acc, x, y, c);
      return [acc[0] < x ? acc[0] : x, acc[1] < y ? acc[1] : y, c];
    },
    [0, 0]
  );
  console.log([minU, minL]);
  const newKeys = map.map(([x, y, c]) => [x - minU, y - minL, c]);

  let newMap = new Array(maxD).fill(0).map(() => new Array(maxR).fill("."));
  newMap = newMap.map((l, i) =>
    l.map((c, j) => {
      const key = newKeys.find(([x, y]) => x === i && y === j);
      if (key) {
        return key[2];
      }
      return c;
    })
  );

  newMap = newMap.filter(
    (l) =>
      l.indexOf("U") > -1 ||
      l.indexOf("D") > -1 ||
      l.indexOf("L") > -1 ||
      l.indexOf("R") > -1
  );
  console.log(newMap.map((l) => l.join("")).join("\n"));
  console.log("-------------------");

  let count = 0;

  for (let i = 0; i < newMap.length; i++) {
    let inside = false;
    let insidePass = [];
    for (let j = 0; j < maxR; j++) {
      if ("URDL".includes(newMap[i][j])) {
        count += 1;
        if (inside && (newMap[i][j] === "D" || newMap[i][j] === "U")) {
          for (let inside of insidePass) {
            newMap[inside[0]][inside[1]] = "#";
            count++;
          }

          inside = newMap[i][j] !== "D";
          insidePass = [];
        } else if (newMap[i][j] === "U") {
          inside = true;
          insidePass = [];
        }
      } else if (inside) {
        insidePass.push([i, j]);
      }
    }
  }

  console.log(newMap.slice(200, 339).map((l) => l.join("")).join("\n"));
  console.log(newMap.length)
  return count;
};

const solve2 = (steps) => {
  const vertices = [];
  let vertex = [0, 0]
  let perimeter = 0;

  for (let step of steps) {
    if (step.direction === "R") {
      vertex = [vertex[0] + step.steps, vertex[1]]
      vertices.push(vertex);
      perimeter += step.steps;
    }
    if (step.direction === "D") {
      vertex = [vertex[0], vertex[1] + step.steps]
      vertices.push(vertex);
      perimeter += step.steps;
    }
    if (step.direction === "L") {
      vertex = [vertex[0] - step.steps, vertex[1]]
      vertices.push(vertex);
      perimeter += step.steps;
    }
    if (step.direction === "U") {
      vertex = [vertex[0], vertex[1] - step.steps]
      vertices.push(vertex);
      perimeter += step.steps;
    }
  }

  let area = 0;

  for (let i = 0; i< vertices.length; i++) {
    const next = (i+1) % vertices.length
    area += vertices[i][0] * vertices[next][1] 
    area -= vertices[i][1] * vertices[next][0];
  }

  return area * 0.5 + perimeter * 0.5 + 1;
}

console.log(solve2((parse2(testInput))));

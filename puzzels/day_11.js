const testInput = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

const parse = (input) => {
  const lines = input.split("\n");
  const grid = lines.map((line) => line.split(""));

  return grid;
};

const one_mil = 1000000;
const expand = (map) => {
  const rowsToAdd = [];
  const columnsToAdd = [];

  for (let i = 0; i < map.length; i++) {
    let isEmptyRow = true;
    for (let c of map[i]) {
      if (c !== ".") {
        isEmptyRow = false;
        break;
      }
    }
    if (isEmptyRow) {
      rowsToAdd.push(i);
    }
  }

  for (let i = 0; i < map[0].length; i++) {
    let isEmptyColumn = true;
    for (let r of map) {
      if (r[i] !== ".") {
        isEmptyColumn = false;
        break;
      }
    }
    if (isEmptyColumn) {
      columnsToAdd.push(i);
    }
  }

  return [rowsToAdd, columnsToAdd];
};

const findAllGalaxies = (map, empty, old) => {
  const galaxies = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === "#") {
        const emptyRows = empty[0].filter((row) => row < i).length;
        const emptyColumns = empty[1].filter((column) => column < j).length;
        const emptyRowsWithMultiplayer = emptyRows * (old ? one_mil : 1);
        const emptyColumnsWithMultiplayer = emptyColumns * (old ? one_mil : 1);

        galaxies.push([
          i + emptyRowsWithMultiplayer - emptyRows,
          j + emptyColumnsWithMultiplayer - emptyColumns,
        ]);
      }
    }
  }

  return galaxies;
};

const calcDist = (galA, galB) => {
  return Math.abs(galA[0] - galB[0]) + Math.abs(galA[1] - galB[1]);
};

const solve = (map, old) => {
  const empty = expand(map);
  const galaxies = findAllGalaxies(map, empty, old);
  let sumOfDist = 0;

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      sumOfDist += calcDist(galaxies[i], galaxies[j]);
    }
  }

  return sumOfDist;
};

const drawMap = (map) => {
  console.log(map.map((row) => row.join("")).join("\n"));
};

console.log(solve(parse(testInput), true));

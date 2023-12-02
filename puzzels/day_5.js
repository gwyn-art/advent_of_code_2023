const seeds = seedsStr
  .split(" ")
  .map((s) => s.trim())
  .filter((s) => s)
  .map(Number);

const testMapStr = `seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

const testSeedsStr = `79 14 55 13`;
const testSeeds = testSeedsStr
  .split(" ")
  .map((s) => s.trim())
  .filter((s) => s)
  .map(Number);

let maps = mapsStr.split(":").map((s) => s.split("\n"));
maps = maps
  .map((map) =>
    map
      .filter((l) => l && !l.includes("map"))
      .map((l) => l.split(" ").map(Number))
  )
  .filter((m) => m.length);

// ---- Part 1 ----

const convert = (v, map) => {
  const line = map.find(
    ([_, source, range]) => source <= v && source + range >= v
  );

  if (!line) {
    return v;
  }

  const [d, s] = line;

  return d + (v - s);
};

const solve = (values, maps) => {
  const finalMap = maps.reduce(
    (values, map) => values.map((v) => convert(v, map)),
    values
  );
  console.log(finalMap);
  return Math.min(...finalMap);
};

// ---- Part 2 ----

const getRealSeeds = (og, range) => {
  return [og, og + range - 1];
};

const mapNames = [
  "soil",
  "fertilizer",
  "water",
  "light",
  "temperature",
  "humidity",
  "location",
];
let mapNameCounter = 0;
const convert2 = ([sMin, sMax], map) => {
  let lines = map.filter(
    ([_, source, range]) => !(source > sMax || source + range < sMin)
  );

  if (lines.length === 0) {
    return [sMin, sMax];
  }

  console.log("lines: ", lines.length);

  let res = [];
  let leftover = [];
  lines.forEach(([d, s, r]) => {
    let newLeftover = [];
    (leftover.length ? leftover : [[sMin, sMax]]).forEach(([sMin, sMax]) => {
      console.log(sMin, sMax, [d, s, r]);
      if (s <= sMin && s + r >= sMax) {
        console.log("complete");
        res.push([[d + (sMin - s), d + (sMax - s)]]);
      } else if (s <= sMin && s + r >= sMin && s + r <= sMax) {
        console.log("left");
        res.push([[d + (sMin - s), d + r - 1]]);
        newLeftover.push([s + r, sMax]);
      } else if (s > sMin && s + r >= sMax && s <= sMax) {
        console.log("right");
        newLeftover.push([sMin, s - 1]);
        res.push([[d, d + (sMax - s)]]);
      } else if (s > sMin && s + r < sMax) {
        console.log("middle");
        newLeftover.push([sMin, s - 1]);
        newLeftover.push([s + r + 1, sMax]);
        res.push([[d, d + r]]);
      } else {
        newLeftover.push([sMin, sMax]);
      }
    });
    leftover = newLeftover;
  });

  console.log(res, leftover);

  // IT IS SO NESTED OMG
  // Once I did a recursive solution I did not care about that :(
  return res.length > 0 ? [...res, leftover] : [[sMin, sMax]];
};

// Test cases
// Middle case
// console.log(convert2([1, 7], [[13, 3, 2]]));
// Breaking middle case (not sure if this is possible in real data)
// console.log(convert2([1, 7], [[12, 2, 4]]));
// Left case
// console.log(convert2([1, 7], [[11, 1, 3]]));
// console.log(convert2([3, 7], [[11, 1, 4]]));
// Before Left case
// console.log(convert2([3, 7], [[11, 1, 4]]));
// Right case
// console.log(convert2([1, 7], [[11, 3, 4]]));
// After Right case
// console.log(convert2([1, 7], [[11, 3, 10]]));
// Complete case
// console.log(convert2([1, 7], [[11, 1, 10]]));
// console.log(convert2([5, 9], [[11, 1, 10]]));
// Multi line
// console.log(convert2([1, 7], [[11, 1, 10], [21, 1, 10]]));
// console.log(convert2([1, 7], [[11, 1, 10], [21, 3, 10]]));

const convertAll = (v, map) => {
  if (v.every(Number.isInteger)) {
    const res = convert2(v, map).flat();
    return res;
  }

  return v.map((v) => convertAll(v, map));
};

const flatter = (v) => {
  if (v.every(Number.isInteger)) {
    return v;
  }

  return v.reduce((acc, v) => [...acc, ...flatter(v)], []);
};
const findMin = (v) => {
  const flat = flatter(v);
  console.log(flat.length);
  return Math.min(...flat);
};

const solve2 = (values, maps) => {
  const seeds = [];
  for (let i = 0; i < values.length; i += 2) {
    seeds.push(getRealSeeds(values[i], values[i + 1]));
  }

  const res = maps.reduce((v, map) => {
    console.log(
      mapNames[mapNameCounter++] +
        " ---------------------------------------------"
    );

    return v.map((v) => {
      return convertAll(v, map);
    });
  }, seeds);

  return findMin(res);
};

console.log(solve2(seeds, maps));

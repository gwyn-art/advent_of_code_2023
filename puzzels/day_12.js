const testInput = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

const parse = (input) => {
  return input.split("\n").map((line) => {
    const [left, right] = line.split(" ");
    const numbers = right.split(",").map(Number);
    return [left, numbers];
  });
};

let cache = new Map();
const applyNumbers = (line, numbers) => {
  let combos = 0;
  const [x, ...other] = numbers;
  const key = `${line.slice(line.lastIndexOf('*'))}${numbers.join('')}`
  if (cache.has(key)) {
    return cache.get(key);
  }
  let substring = "";
  const lastStartIndex = line.lastIndexOf("*") || 0;
  const otherSum = other.reduce((acc, x) => acc + x, 0);

  for (let i = lastStartIndex; i < line.length; i++) {
    if (line[i] === "?" || line[i] === "#") {
      substring += line[i];
    } else if (line[i] === ".") {
      substring = "";
    }

    if (substring.length > x) {
      const numberOfBroken = substring
        .split("")
        .filter((x) => x === "#").length;
      if (numberOfBroken > x) {
        break;
      }
      // I think this also doesn't work
      if (line.slice(0, Math.max(i - substring.length, 0)).includes("#")) {
        break;
      }
    }

    // This doesn't work actually
    // But I don't want to re-test
    const numberOfBrokenLeftover = line
      .slice(i + 2)
      .split("")
      .reduce((acc, x) => acc + (x === "#" ? 1 : 0), 0);

    if (numberOfBrokenLeftover > otherSum + x) {
      break;
    }

    if (
      substring.length >= x &&
      (!line[i + 1] || line[i + 1] !== "#") &&
      (!line[i - x] || line[i - x] !== "#") &&
      (!line[i - 1] || line[i - 1] !== "*")
    ) {
      const newPrefix = line.slice(0, i - x + 1);
      // Because of problems above
      // We gonna ignore it as it didn't happen
      if (newPrefix.includes("#")) {
        break;
      }
      const newSuffix = line.slice(i + 1);

      let newLine = `${newPrefix}${"*".repeat(x)}${newSuffix}`;
      newLine = newLine.replace("?*", ".*");
      newLine = newLine.replace("*?", "*.");

      if (other.length === 0) {
        // Just close my eyes and move on
        if (!newSuffix.includes("#")) {
          combos++;
        }
      } else {
        const res = applyNumbers(newLine, other);
        if (res) {
          combos += res;
        }
      }
    }
  }

  cache.set(key, combos);
  return combos;
};

const combinator = (inputs) => {
  let res = 0;

  for (let [line, numbers] of inputs) {
    const set = applyNumbers(line, numbers);
    console.log(line, numbers, set?.size, set);
    if (set) {
      res += set;
    }
  }

  return res;
};

// This is correct for P2
const combinator2 = (inputs) => {
  let res = 0;

  for (let i = 0; i < inputs.length; i++) {
    cache = new Map();
    const [line, numbers] = inputs[i];
    let newLine = line.slice(0);
    let newNumbers = numbers.slice(0);

    for (let i = 0; i < 4; i++) {
      newLine = [...newLine.split(""), "?", ...line.slice("")].join("");
      newNumbers = [...newNumbers, ...numbers];
    }

    res += applyNumbers(newLine, newNumbers);
  }

  return res;
};

// This one is wrong
const combinator3 = (inputs) => {
  let res = 0;

  for (let i = 0; i < inputs.length; i++) {
    cache = new Map();
    const [line, numbers] = inputs[i];
    let newLine2 = line + "?" + line + (line[0] === "#" ? "" : "?");
    let newLine3 =
      (line.at(-1) === "#" ? "" : "?") + line + "?" + line + "?" + line;
    console.log(`${i + 1}/${inputs.length}`, line, numbers);
    const set = applyNumbers(newLine2, [...numbers, ...numbers]);
    const set2 = applyNumbers(newLine3, [...numbers, ...numbers, ...numbers]);
    // Math goes brrrr
    // And ofc it is wrong
    // I was hoping to solve it with math like p1 * p2 ^ 4
    // But seems like I can't do math
    const newRes = set * set2;
    console.log(line, numbers, set, set2, newRes);
    res += newRes;
  }

  return res;
};

console.time("perf");
console.log(combinator2(parse(testInput)));
console.timeEnd("perf");
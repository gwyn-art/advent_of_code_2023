const testInput = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

const parse = (input) => {
  return input.split(",");
};

const getCharValue = (char, i, value) => {
  return ((value + char.charCodeAt(i)) * 17) % 256;
};

const solve = (input) => {
  let value = 0;

  for (let phrase of input) {
    let phraseValue = 0;
    for (let i = 0; i < phrase.length; i++) {
      console.log(phrase.charCodeAt(i));
      phraseValue = getCharValue(phrase, i, phraseValue);
    }

    value += phraseValue;
  }

  return value;
};

const solve2 = (input) => {
  const boxes = new Array(256).fill(0).map(() => new Map());

  for (let phrase of input) {
    let phraseValue = 0;
    const [label] = phrase.includes("=")
      ? phrase.split("=")
      : phrase.split("-");

    for (let i = 0; i < label.length; i++) {
      phraseValue = getCharValue(label, i, phraseValue);
    }

    if (phrase.includes("=")) {
      const [_, value] = phrase.split("=");
      boxes[phraseValue].set(label, value);
    } else {
      boxes[phraseValue].delete(label);
    }
  }

  return boxes.reduce(
    (acc, box, boxNumber) =>
      acc +
      [...box.values()].reduce(
        (acc, lens, lensNumber) => (
          acc + (boxNumber + 1) * (lensNumber + 1) * Number(lens)
        ),
        0
      ),
    0
  );
};

console.log(solve2(parse(testInput)));

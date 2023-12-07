const testInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

// ---- Common ----

const cardValues = [
  "J",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
];

const parse = (input) => {
  const lines = input.split("\n");

  return lines
    .map((line) => line.split(" "))
    .map(([hand, bid]) => [hand.split(""), Number(bid)]);
};

const resolveSameValue = (hand1, hand2) => {
  for (let i = 0; i < hand1.length; i++) {
    const card1 = hand1[i];
    const card2 = hand2[i];

    if (card1 === card2) {
      continue;
    }

    return cardValues.indexOf(card1) - cardValues.indexOf(card2);
  }
};

const addRoundValue = ([hand, bid], handValue) => {
  const value = handValue(hand);

  return [hand, bid, value];
};

const solve = (rounds, handValue) => {
  const roundsWithValue = rounds.map((round) =>
    addRoundValue(round, handValue)
  );

  const sortedRounds = roundsWithValue.sort((a, b) => {
    const res = a[2] - b[2];

    return res === 0 ? resolveSameValue(a[0], b[0]) : res;
  });

  return sortedRounds.reduce((acc, [_, bid], i) => acc + bid * (i + 1), 0);
};

// ---- Part 1 ----

const handValue1 = (hand) => {
  let value = 0;
  let tempHand = hand.slice(0);

  for (let i = 0; i < tempHand.length; i++) {
    const card = tempHand[i];
    let sameKindCount = tempHand.reduce(
      (acc, c) => acc + (c === card ? 1 : 0),
      -1
    );
    if (sameKindCount > 0) {
      // 4 of a kind is bigger then full house
      // and to simplify full house value is 2 + 3
      // so we increase the value of 4 of a kind by 2
      if (sameKindCount >= 3) {
        sameKindCount += 2;
      }
      // as three of a kind > 2 pairs
      if (sameKindCount === 2) {
        sameKindCount += 1;
      }
      value += sameKindCount;
      tempHand = tempHand.filter((c) => c !== card);
    }
  }

  return value;
};

// ---- Part 2 ----

const findMostPopularCard = (hand) => {
  const popularity = hand.map(
    (c) => hand.filter((c2) => c === c2 && c !== "J").length
  );
  const max = Math.max(...popularity);
  return hand.find((_, i) => popularity[i] === max);
};

const handValue2 = (hand) => {
  let tempHand = hand.slice(0);
  let mostPopularCard = findMostPopularCard(tempHand);

  for (let c in tempHand) {
    if (tempHand[c] === "J") {
      tempHand[c] = mostPopularCard;
    }
  }
  console.log(hand, tempHand);

  return handValue1(tempHand);
};

console.log(solve(parse(input), handValue2));

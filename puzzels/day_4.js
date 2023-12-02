const testInput =
    `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

const parse = (input) => {
    const lines = input.split('\n').map(line => line.split(':'))
    return lines.map(([, numbers]) => numbers.split('|')).map(([w, n]) => [w.trim().split(' ').filter(n => n), n.trim().split(' ').filter(n => n)])
}

// ---- Part 1 ----

const solve = (input) => {
    const cards = parse(input)

    return cards.reduce((acc, [w, n]) => {
        const count = w.reduce((acc, winingNumber) => n.includes(winingNumber) ? acc + 1 : acc, 0)

        return count > 0 ? acc + Math.pow(2, count - 1) : acc
    }, 0)
}

// ---- Part 2 ----

const add = (map, key, n = 1) => {
    map.get(key) ? map.set(key, map.get(key) + n) : map.set(key, n)
}

const score = ([w, n]) => {
    return w.reduce((acc, winingNumber) => n.includes(winingNumber) ? acc + 1 : acc, 0)
}

const solve2 = (input) => {
    const cards = parse(input)
    const cardsCounts = new Map()

    cards.forEach((_, i) => add(cardsCounts, i))

    cards.forEach((card, key) => {
        const cardScore = score(card)

        new Array(cardScore).fill(cardsCounts.get(key)).forEach((multiplayer, i) => {
            add(cardsCounts, key + i + 1, multiplayer * 1)
        })
    });

    return Array.from(cardsCounts.values()).reduce((acc, x) => acc + x, 0)
}

console.log(solve2(input))
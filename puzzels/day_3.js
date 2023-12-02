const LINE_LENGTH = 141;

// ---- HELPERS ----

const replaceAt = (str, index, replacement) => {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

// --- PART 1 ----

const testInput =
`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`.split('\n')

const parse = (input) => {
    let res = 0;
    let newMatrixStr = input.join('\n')
    let numberStr = '';
    let hasAdjustedSymbol = false;

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            let char = input[i][j];
            if (parseInt(char) >= 0) {
                numberStr = numberStr ? numberStr + char : char;
                if (numberStr === '564') {
                    debugger
                }
                if (checkHasAdjustedSymbol(input, i, j)) {
                    hasAdjustedSymbol = true;
                }
                // if '.'
            } else {
                if (hasAdjustedSymbol && numberStr.length > 0) {
                    res += parseInt(numberStr)
                } else {
                    if (numberStr.length > 0) {
                        const index = i * LINE_LENGTH + j - numberStr.length;
                        newMatrixStr = replaceAt(newMatrixStr, index, new Array(numberStr.length).fill('.').join(''))
                    }
                }
                
                hasAdjustedSymbol = false
                numberStr = ''
            }
        }
    }

    console.log(newMatrixStr)
    return res
}

const checkHasAdjustedSymbol = (input, i, j) => {
    const subMatrixList = [
        [input[i - 1]?.[j - 1], input[i - 1]?.[j], input[i - 1]?.[j + 1]],
        [input[i]?.[j - 1], undefined, input[i]?.[j + 1]],
        [input[i + 1]?.[j - 1], input[i + 1]?.[j], input[i + 1]?.[j + 1]]
    ]

    return subMatrixList.some(line => {
        return line.some(char => char && isNaN(char) && char !== '.')
    })
}

// --- PART 2 ----

const testInput2 =
`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`.split('\n')

const parse2 = (input) => {
    let newMatrixStr = input.join('\n')
    let numberStr = '';
    let adjustedIndex = null;
    const engineMap = new Map()

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            let char = input[i][j];
            if (parseInt(char) >= 0) {
                numberStr = numberStr ? numberStr + char : char;
                const charAdjustedIndex = checkHasAdjustedSymbol2(input, i, j)
                console.log(charAdjustedIndex)
                if (charAdjustedIndex) {
                    adjustedIndex = charAdjustedIndex
                }
            // if '.'
            } else {
                if (adjustedIndex && numberStr.length > 0) {
                    const key = createKey(adjustedIndex)
                    const existingPart = engineMap.get(key);
                    if (existingPart) {
                        existingPart.push(parseInt(numberStr))
                    } else {
                        engineMap.set(key, [parseInt(numberStr)])
                    }
                }
                
                adjustedIndex = null
                numberStr = ''
            }
        }
    }

    console.log(engineMap)
    
    return Array.from(engineMap.values()).reduce((acc, part) => {
        if (part.length === 2) {
            return acc + part[0] * part[1]
        }

        return acc
    }, 0)
}

const createKey = (adjustedIndex) => `${adjustedIndex[0]},${adjustedIndex[1]}`

const checkHasAdjustedSymbol2 = (input, i, j) => {
    const subMatrixList = [
        [input[i - 1]?.[j - 1], input[i - 1]?.[j], input[i - 1]?.[j + 1]],
        [input[i]?.[j - 1], undefined, input[i]?.[j + 1]],
        [input[i + 1]?.[j - 1], input[i + 1]?.[j], input[i + 1]?.[j + 1]]
    ]

    let subI;
    let subJ;

    const isAdjusted = subMatrixList.some((line, i2) => {
        return line.some((char, j2) => {
            if (char === '*') {
                console.log(i2, j2, char)
                subI = i2;
                subJ = j2;
                return true
            }
            return false
        })
    })

    if (isAdjusted) {
        return [i + subI - 1, j + subJ -1]
    }

    return null
}

// --- OUTPUT ---

console.log(parse2(input))
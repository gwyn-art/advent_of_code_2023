const games = gamesStrList.map(gameStr => {
    const [, takesStr] = gameStr.split(':')
    const roundsStrList = takesStr.split(';')
    // console.log(roundsStrList)
    const gamesList = roundsStrList.map(roundStr => roundStr.trim().replaceAll(',', '').split(' '))
    // console.log(roundsTouple)
    let touple = []
    const gamesTouples = gamesList.map(rounds => rounds.reduce((acc, next) => {
        if (touple.length === 0) {
            touple.push(Number(next))
        } else {
            touple.push(next)
            acc.push(touple)
            touple = []
        }

        return acc
    }, []))
    return gamesTouples
})

// console.log(JSON.stringify(games, null, 2))

const MAX_MAP = {
    red: 12,
    green: 13,
    blue: 14,
}

const getRoundsMap = (rounds) => {
    const roundsMap = { red: 0, green: 0, blue: 0 }
    rounds.forEach(([n, color]) => {
        roundsMap[color] = roundsMap[color] + n
    })

    return roundsMap
}

// --- Part 1 ----



const isRoundsPossible = (roundsMap) => {
    const isPossible = (
        roundsMap.green <= MAX_MAP.green &&
        roundsMap.blue <= MAX_MAP.blue &&
        roundsMap.red <= MAX_MAP.red
    )

    return isPossible
}

const getPossibleRoundsSum = (games) => {
    let possibleSum = 0

    games.forEach((roundsList, i) => {
        let isAllRoundsPossible = true

        roundsList.forEach(rounds => {
            const roundsMap = getRoundsMap(rounds)
            console.log(rounds)
            console.log(roundsMap)
            console.log(isRoundsPossible(roundsMap), i + 1)
            if (!isRoundsPossible(roundsMap)) {
                isAllRoundsPossible = false
            }
        })

        if (isAllRoundsPossible) {
            possibleSum += i + 1
        }
    })

    return possibleSum
}

// console.log(getPossibleRoundsSum(games))

// --- Part 2 ----

const getRoundMaxMap = (roundMaps) => {
    const maxMap = { red: 0, green: 0, blue: 0 }

    roundMaps.forEach((roundMap) => {
        maxMap.red = Math.max(roundMap.red, maxMap.red)
        maxMap.green = Math.max(roundMap.green, maxMap.green)
        maxMap.blue = Math.max(roundMap.blue, maxMap.blue)
    })

    return maxMap
}

const getRoundsPower = (games) => {
    let roundsPower = 0

    games.forEach((roundsList, i) => {

        const roundsMaps = roundsList.map(rounds => getRoundsMap(rounds))
        const maxMap = getRoundMaxMap(roundsMaps)

        roundsPower += maxMap.green * maxMap.blue * maxMap.red
    })

    return roundsPower
}

console.log(getRoundsPower(games))
// ---- Part 1 ----

/**
 * The newly-improved calibration document consists of lines of text; 
 * each line originally contained a specific calibration value that the Elves now need to recover. 
 * On each line, the calibration value can be found by combining the first digit and the last digit 
 * (in that order) to form a single two-digit number.
  For example:

    1abc2
    pqr3stu8vwx
    a1b2c3d4e5f
    treb7uchet
    
  In this example, the calibration values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.

  Consider your entire calibration document. What is the sum of all of the calibration values?
 */

const getNumber = (s) => {
    let a = 0;
    let b = 0;
    for (let i = 0; i < s.length; i++) {
        if (Number.parseInt(s[i])) {
            a = s[i];
            break;
        }
    }
    for (let i = s.length - 1; i > -1; i--) {
        if (Number.parseInt(s[i])) {
            b = s[i];
            break;
        }
    }
    return Number.parseInt(a + b);
}

const resolve = (inputs) => input.reduce((acc, str) => acc + getNumber(str), 0)

// ---- Part 2 ----

// Your calculation isn't quite right. 
// It looks like some of the digits are actually spelled out with letters:
//  one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

// Equipped with this new information, you now need to find the real first and last digit on each line. For example:

// two1nine
// eightwothree
// abcone2threexyz
// xtwone3four
// 4nineeightseven2
// zoneight234
// 7pqrstsixteen
// In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.

const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

/**
 * @param {string} input 
 * @returns 
 */
const getNumber2 = input => {
    console.log(input)
    let tempInput = input.slice(0)
    digits.forEach((digit, index) => {
        while (tempInput.includes(digit)) {
            console.log(tempInput)
            tempInput = setCharAt(tempInput, tempInput.indexOf(digit) + 1, index + 1)
        }
    })
    console.log(tempInput)
    return tempInput
}


const resolve2 = (inputs) => inputs.reduce((acc, str) => acc + (str ? getNumber2(str) : 0), 0) 
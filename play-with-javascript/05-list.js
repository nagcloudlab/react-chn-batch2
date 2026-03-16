
// list, set, map


const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


// imperative style
// => solving any problem using step-by-step instructions
// => intention + implementation mixed together
function filterEvenNumbers(numbers) {
    const evenNumbers = []
    for (const number of numbers) {
        if (number % 2 === 0) {
            evenNumbers.push(number)
        }
    }
    return evenNumbers
}

function filterOddNumbers(numbers) {
    const oddNumbers = []
    for (const number of numbers) {
        if (number % 2 !== 0) {
            oddNumbers.push(number)
        }
    }
    return oddNumbers
}

// declarative style


// Lib -> number library
function filterNumbers(numbers, predicate) {
    const filteredNumbers = []
    for (const number of numbers) {
        if (predicate(number)) {
            filteredNumbers.push(number)
        }
    }
    return filteredNumbers
}
const evenNumbers = filterNumbers(numbers, function (number) {
    return number % 2 === 0
})

const oddNumbers = filterNumbers(numbers, function (number) {
    return number % 2 !== 0
})

console.log(evenNumbers)
console.log(oddNumbers)


//---------------------------------------------


const evenNumbers1 = numbers.filter(number => number % 2 === 0)
const squaredNumbers = numbers.map(number => number * number)


//---------------------------------------------
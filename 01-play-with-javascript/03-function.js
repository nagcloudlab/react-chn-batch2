

/*

 - function is an object
 - in javascript we can create function 2 ways

 1. function declaration
 2. function expression

*/


// function declaration
//-----------------------------------------------
// Named function
// Always hoisted with function object
// Creates at context creation-phase

console.log(add(2, 3)); // 5
function add(a, b) {
    return a + b;
}
console.log(add(2, 3)); // 5


// function expression
// -----------------------------------------------

// Anonymous function
// Not hoisted, created at runtime ( i.e context execution-phase)

//console.log(subtract(5, 2)); // Reference Error: subtract is not a function    

let subtract = function (a, b) {
    return a - b;
}
console.log(subtract(5, 2)); // 3


// Function arguments
// -----------------------------------------------

function f(a, b, c, d) {
    console.log(arguments)
    console.log(a)
    console.log(b)
    console.log(c)
    console.log(d)
}

f(10, 20, 30, 40)

// e.g


function sum() {
    let total = 0;
    for (let i = 0; i < arguments.length; i++) {
        total += arguments[i];
    }
    return total;
}
sum(); // 0
sum(1, 2); // 3
sum(1, 2, 3); // 6
sum(1, 2, 3, 4); // 10  


// can we overload function in JavaScript? No
// -----------------------------------------------
function getFood(payment) {
    if (arguments.length === 0)
        return "no food";
    else
        return "food - " + payment;
}
console.log(getFood(100))

// default parameter value
// -----------------------------------------------
function getTransactions(type = "credit") {
    return type + " transactions"
}

getTransactions(); // credit transactions
getTransactions("debit"); // debit transactions

// rest parameter.
// -----------------------------------------------
function getTotal(a = 0, b = 0, ...numbers) {
    let total = a + b;
    for (let number of numbers) {
        total += number;
    }
    return total;
}

getTotal(); // 0
getTotal(1, 2); // 3
getTotal(1, 2, 3); // 6
getTotal(1, 2, 3, 4); // 10


// function return value
// -----------------------------------------------

function getSomething() {
    return "something";
}

let r = getSomething();
console.log(r)

// function as first class citizen ( i.e object)
//------------------------------------------------------------------

// - can be assigned to variable
// - can be passed as argument to function
// - can be returned from function


// #1 can be assigned to variable
// -----------------------------------------------
function greet() {
    console.log("Hello")
}

let sayHello = greet; // function assigned to variable
sayHello(); // Hello


// #2 can be passed as argument to function
// -----------------------------------------------

let numbers = [1, 3, 5, 7, 2, 4, 6, 8, 10];
console.log(numbers)
function compare(a, b) {
    return b - a;
}
numbers.sort(compare);
console.log(numbers)


function greeting(f) {
    console.log("🌸🌸🌸🌸🌸🌸🌸🌸")
    if (f) f()
    else
        console.log("Hello")
    console.log("🌸🌸🌸🌸🌸🌸🌸🌸")
}

greeting();

function timeBasedGreeting() {
    let hour = new Date().getHours();
    if (hour < 12) console.log("Good Morning")
    else if (hour < 18) console.log("Good Afternoon")
    else console.log("Good Evening")
}

greeting(timeBasedGreeting)


// #3 can be returned from function
// -----------------------------------------------

// function teach() {
//     console.log("teaching...")
//     let learn = function () {
//         console.log("learning...")
//     }
//     console.log("teaching ends")
//     return learn;
// }

// let learnFunc = teach()
// learnFunc()
// learnFunc()


// Exercise ( HOF - Higher Order Function )
//------------------------------------------------
function hello() {
    console.log("Hello")
}
function hi() {
    console.log("Hi")
}
function hey() {
    console.log("Hey")
}
// hello();
// hi();
// hey();


function withAuth(f) {
    return function () {
        console.log("👮‍♀️")
        f();
    }
}
function withEmoji(f) {
    return function () {
        f();
        console.log("😀")
    }
}
// hello();
// let hello_with_auth = withAuth(hello)
// hello_with_auth();
// let hello_with_auth_with_emoji = withEmoji(hello_with_auth)
// hello_with_auth_with_emoji();

withEmoji(withAuth(hello))();



// function closure
//------------------------------------------------

// A closure is a function that has access to the parent scope, 
// after the parent function has closed.


function teach(sub) {
    console.log(`teaching ${sub}...`)
    let notes = `${sub} notes`
    function learn() {
        console.log(`learning with ${notes}...`)
    }
    console.log(`teaching ends...`)
    return learn;
}

let learnFunc = teach("javascript")
learnFunc()
learnFunc()


// why we need closure?
// to protect data from outside world ( i.e data encapsulation)
// to create private variables and functions
// to create module ( i.e module pattern)
// to create function factories ( i.e function that returns function)

// e.g  counter module ( module pattern )

// const couter = (function init() {

let count = 0; // private variable
function increment() {
    count++;
}
function getCount() {
    return count;
}
// return {
//     increment: increment,
//     getCount: getCount
// }

// })()


// Exercise. ( Closure )
//------------------------------------------------

var myFunctions = []

// HOF
function getF(i) {
    var f = function () {
        console.log(i)
    }
    return f;
}

for (var i = 0; i < 5; i++) {
    myFunctions.push(getF(i))
}


myFunctions[0]()
myFunctions[4]()

//-----------------------------------------------
"use strict";


//1. arrow functions
//------------------------------------------------

const getPrice = function (price, tax) {
    return price + tax;
}

const getPriceArrow = (price, tax) => {
    return price + tax;
}

const getPriceArrowShort = (price, tax) => price + tax;

// Why we need arrow functions?
// 1. shorter syntax
// 2. to capture lexical this 

// 1. shorter syntax
let numbers = [1, 3, 5, 7, 9, 2, 4, 6, 8, 10];
numbers.sort((x, y) => x - y);

// 2. lexical this
const trainer = {
    name: 'Nag',
    doTeach: function () {
        console.log(this.name + " teaching JS");
        const askQues = (ques) => {
            console.log(this.name + " answering " + ques);
        }
        console.log("teaching javascript ends");
        return askQues;
    }
}

// const askQues = trainer.doTeach(); // teach-context owned by trainer
// askQues("Q1"); // askQues-context owned by trainer object


// function Person(name, age) {
//     this.name = name;
//     this.age = age;
//     const f = () => {
//         console.log("tick..")
//         console.log(this)
//         this.age++;
//         console.log(this.age)
//     }
//     window.setInterval(f, 1000);
// }

// const p1 = new Person("Riya", 0);



// 2. class
//------------------------------------------------

// before ES6
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.show = function () {
    console.log(this.name + " : " + this.age);
}

// after ES6
class PersonES6 {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    show() {
        console.log(this.name + " : " + this.age);
    }
}

const p1 = new PersonES6("Riya", 0);
p1.show();


// 3.enhanced object literals
//------------------------------------------------

const tnrName = "Nag";
const age = 42;

// before ES6
const person1 = {
    tnrName: tnrName,
    age: age,
    sayName: function () {
        console.log("I am " + this.tnrName);
    },
    address: "no 123, abc street"
}

// after ES6

const addressType = "home"; // "home" | "office" | vacation
const person2 = {
    tnrName,
    age,
    sayName() {
        console.log("I am " + this.tnrName);
    },
    [addressType + "-address"]: "computed property name"
}


// 4. template strings
//------------------------------------------------

const name = "Nag";
const course = "React";

const oldWay = "I am " + name + " and I am learning " + course;
const newWay = `I am ${name} and I am learning ${course}`;


// 5. destructuring
//------------------------------------------------

// a. array destructuring
const arr = [1, 2, 3, 4, 5, 6, 7, 8, [9, 10]];

// manually
const a1 = arr[0];
const b1 = arr[1];
const c1 = arr[2];

// with destructuring
const [a, b, c, d = 0, , g1, h, y, [f, yy]] = arr;

// b. object destructuring
const person = {
    name: "Nag",
    age: 42,
    address: {
        city: "Bangalore",
        state: "Karnataka"
    }
}

// manually
const name1 = person.name;
const age1 = person.age;
const city1 = person.address.city;

// with destructuring
const { name: name2, age: age2, address: { city: city2 } } = person;


// e.g

function CardComp({ title, content }) {
    // let title = props.title;
    // let content = props.content;
    // let { title, content } = props;
    return `
        <div class="card">
            <h2>${title}</h2>
            <p>${content}</p>
        </div>
    `
}


// 6. default parameters
//------------------------------------------------

function add(x, y = 0) {
    return x + y;
}


// 7. rest parameters
//------------------------------------------------

function addAll(...numbers) {
    return numbers.reduce((acc, n) => acc + n, 0);
}


// 8. spread operator
//------------------------------------------------


const state = [
    1, 2, 3, 10
]
// state.push(4); // mutating state

const newState = [...state, 4]; // non-mutating way to update state

// state !== newState 


let oldState1 = { name: "Nag", age: 42, address: { city: "Bangalore", state: "Karnataka" } }
let newState2 = { ...oldState1, age: 43 };


// 9. let and const
//------------------------------------------------



// 10. iterators 
//------------------------------------------------
// data-structures -> memory layout 
// iterator -> a object which knows how to access a collection of items and does so one at a time
// data-structure + iterator -> iterable


const arr1 = [1, 2, 3];

const myBox = {
    items: [1, 2, 3],
    [Symbol.iterator]: function () {
        let index = 0;
        return {
            next: () => {
                if (index < this.items.length) {
                    return { value: this.items[index++], done: false }
                } else {
                    return { done: true }
                }
            }
        }
    }
}

// for (let item1 of myBox) {
//     console.log(item1);
// }

let boxNumbers = [...myBox]
let [n1, n2, n3] = myBox;
for (let item1 of myBox) {
    console.log(item1);
}
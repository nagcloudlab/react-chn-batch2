"use strict";

//1. string 

var name1 = "John Doe";
var name2 = 'John Doe';
var name3 = `John Doe`;

var a = 10;
var b = 20;
var string2 = `The sum of a and b is ${a + b}`;
var componentTemplate = `<div>
    <h1>${name1}</h1>
    <p>${string2}</p>
</div>`;



//2. number

var age = 30;
var price = 19.99;



//3. boolean

var isStudent = true;
var isEmployed = false;



// imp-note: 
// false values: false, 0, "", null, undefined, NaN
// remaining all values are true values
// reference: https://dorey.github.io/JavaScript-Equality-Table/

//4. null

var emptyValue = null;

//5. undefined

var v;

//-----------------------------------------------------------
//6. object
//-----------------------------------------------------------

// function Person(name, age) {
//     this.name = name;
//     this.age = age;
// }
// Person.prototype.sayName = function () {
//     console.log("My name is " + this.name);
// }
// Person.prototype.sayAge = function () {
//     console.log("I am " + this.age + " years old");
// }


// Es6 class syntax
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    sayName() {
        console.log("My name is " + this.name);
    }
    sayAge() {
        console.log("I am " + this.age + " years old");
    }
}
console.log(typeof Person); // function

var person1 = new Person("Alice", 25);
var person2 = new Person("Bob", 30);


// Object.preventExtensions(person1);
// Object.seal(person1); 
// Object.freeze(person1);

// console.log(Object.isExtensible(person1));
// console.log(Object.isSealed(person1));
// console.log(Object.isFrozen(person1));

// imp-notes :

// by default 
// # objects are extensible, configurable, and writable

/// extensible: new properties can be added to the object
// person1.address = "123 Main St";

// configurable: properties can be deleted from the object
// delete person1.age;

// writable: property values can be changed
// person1.name = "Alice Smith";

//------------------------------------------------------------
//7. built-in classes
//------------------------------------------------------------


// a. Object

var config = new Object();
config.url = "https://api.example.com";
config.httpMethod = "GET";
config.timeout = 5000;
console.onSuccess = function (message) {
    console.log("Success: " + message);
}
console.onError = function (message) {
    console.error("Error: " + message);
}

// or literal syntax

var config2 = {
    url: "https://api.example.com",
    httpMethod: "GET",
    timeout: 5000,
    onSuccess: function (message) {
        console.log("Success: " + message);
    },
    onError: function (message) {
        console.error("Error: " + message);
    }
}

// b. Array

var numbers = new Array(1, 2, 3, 4, 5);

// or literal syntax

var numbers2 = [1, 2, 3, 4, 5];


// c. Function

var add = new Function("a", "b", "return a + b;");
console.log(add(10, 20)); // 30

// or literal syntax

function subtract(a, b) {
    return a - b;
}
console.log(subtract(20, 10)); // 10


// d. RegExp

// var aadharpattern = new RegExp("\\d{4}-\\d{4}-\\d{4}");
// or literal syntax
var aadharpattern = /\d{4}-\d{4}-\d{4}/;
var userInput = "1234-5678-9012";
if (aadharpattern.test(userInput)) {
    console.log("Valid Aadhar number");
} else {
    console.log("Invalid Aadhar number");
}

// e. Date
// f. Error
// g. Map
// h. Set
// i. WeakMap
// j. WeakSet

// How to access object's properties
// 1. dot notation
// 2. bracket notation

var person = {
    name: "Charlie",
    age: 35,
    1: 100,
    "full name": "Charlie Brown",
    "home-address": "123 Main St"
}

console.log(person.name); // Charlie
console.log(person.age); // 35
console.log(person["name"]); // Charlie
console.log(person["age"]); // 35
console.log(person[1]); // 100
console.log(person["full name"]); // Charlie Brown
console.log(person["home-address"]); // 123 Main St
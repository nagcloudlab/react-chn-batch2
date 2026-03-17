"use strict";


// exceution-context aka scope
// stack-frame with given args & local variables
// each function call creates a new execution context 
// -which is child of the context in which that function is defined
// global execution context is created when the program starts


// imp-note: any variable declared with var is hoisted 
// to the top of its scope and initialized with undefined

// debugger;

// console.log(v); // undefined
// var v = 10;
// console.log(v); // 10


// var v = 10;
// function foo() {
//     console.log(v);
//     var v = 20
// }
// foo() // foo-context --> global-context


// Quiz

var v = 10;
function foo() {
    function bar() {
        console.log(v);
    }
    bar(); // bar-context --> foo-context --> global-context
    var v = 20;
}
foo();  // foo-context --> global-context



var i = 10;
var i = 20;


var k = 10;
if (true) {
    var k = 20;
}
console.log(k);

// problem with var keyword

// - variable always gets hoisted to the top of its scope and initialized with undefined
// - if we declare a variable with the same name in the same scope, it will overwrite the previous variable
// - variable declared with var is function-scoped, not block-scoped, which can lead to unexpected behavior when used inside loops or conditional statements


// solution: use let and const keywords instead of var ( from ES6 onwards) which are block-scoped and do not get hoisted to the top of their scope.

// console.log(x); // ReferenceError: x is not defined
// let x = 10;


// let y = 10;
// let y = 20; // SyntaxError: Identifier 'y' has already been declared


let z = 10;
if (true) {
    let z = 20; // block-scoped variable, does not affect the outer variable z
}
console.log(z); // 10


let a = 10;
a = 20; // reassigning the value of a, but not redeclaring it

const b = 10;
// b = 20; // TypeError: Assignment to constant variable. Cannot reassign a const variable


// Quiz:


const lunch = {
    name: "Pizza",
}
// lunch=null; // TypeError: Assignment to constant variable. Cannot reassign a const variable
lunch.name = "Burger"; // allowed, we are not reassigning the variable, but changing the property of the object
console.log(lunch); // { name: 'Burger' }

// Summary:

// use 'let' for mutable rereference
// use 'const' for immutable reference
// avoid using 'var' for better programming practices and to prevent unexpected behavior due to hoisting and function-scoping.

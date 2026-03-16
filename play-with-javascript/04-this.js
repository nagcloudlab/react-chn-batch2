"use strict";


/*

this => owner of current execution context

*/

function add(a, b) {
    return a + b;
}
let r = add(2, 3)


function sayName() {
    console.log(this);
    console.log(`im ${this.name}`);
}
// sayName()

// in javascript, we can bind function to an object in 2 ways
// 1. static binding
// 2. dynamic binding

// static binding
let person1 = {
    name: "Riya",
    sayName: sayName
}
person1.sayName() // sayName-context 

let person2 = {
    name: "Dhiya",
    sayName: sayName
}
person2.sayName() // sayName-context

let person3 = {
    name: "indu",
    sayName: function () {
        console.log("im " + this.name)
    }
}
person3.sayName() // sayName-context


//----------------------------------------------
// dynamic binding
//----------------------------------------------
//npci
function npciTraining(topic, location, duration) {
    console.log(`
        the trainer - ${this.name},
        teaching sub - ${topic}, location - ${location}, duration - ${duration}
        `)
}
//--------------------------------------------------
// Vendor Trainer
const trainer = {
    name: "Nag"
}
Object.preventExtensions(trainer)
//----------------------------------------------


npciTraining.call(trainer, "js", "chennai", "2hrs") // npciTraining-context
let newF = npciTraining.bind(trainer, "js", "chennai", "2hrs") // npciTraining-context
newF();
newF();


// Quiz
//------------------------------------------------



const snack = {
    snackName: "bingo",
    price: 10,
    sayName: function () {
        console.log(`
            snack name - ${this.snackName},
            price - ${this.price}
            `)
    }
}
snack.sayName()



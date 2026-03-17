

// (function () {

let message = "Hello World"
function greet() {
    console.log(message)
}

// module.exports = { greet } // cjs
export { greet } // esm

// })()
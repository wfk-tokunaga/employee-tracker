// Promise object takes one function as a param
// This function gets passed 2 params of res and rej
// 

let p = new Promise((resolve, reject) => {
    let a = 1 + 1;
    if (a == 2) {
        // Will always call resolve
        resolve([a, " Success"]);
    } else {
        reject([a, ' Failed']);
    }
})

// Anything inside a .then() will run on a resolve
// basically on a resolve, do this code
// p.then((message) => {
//     console.log(`This is in the then: ` + message)
// }).catch((message) => {
//     console.log(`This is in the catch: ` + message)
// })


//a promise takes a function that takes 2 functions as Parameters
//the two functions are resolve and reject
//the promise will use/call these functions if certain conditions are met

// Within a promise, you design an executor, which decides when to resolve or reject the promise

// I promise Eea I'll buy her a new hat.
const birthday = 5;
const today = 4;
// Have to get eea a new hat before her bday
let notForgetBirthday = new Promise((resolve, reject) => {
    let boughtTheHat = false;
    let bdayPassed = false;
    if (boughtTheHat && bdayPassed) {
        // I did it! Promise has been fufilled
        resolve('I did it!');
    } else if (boughtTheHat && !bdayPassed) {
        resolve('I didnt forget, just wait!');
    } else if (!boughtTheHat && bdayPassed) {
        reject('I forgor LOL');
    } else if (!boughtTheHat && !bdayPassed) {
        resolve('I didnt forgor, I just havent bought it yet hahahahah!');
    }
});

// The .then is checking it kinda?
// Takes 2 params, first being what to call if resolve was called
notForgetBirthday.then(message => {
    console.log('Reason I didnt fail the promise: ' + message);
}, message => {
    console.log('Excuse I DID FAIL: ', message)
})




const printCat = () => {
    console.log('Cat');
}

const printDog = () => {
    console.log('DOG WOOF WOOF');
}

// Promise.resolve()
//     .then(printCat, printDog)
//     .then(printDog, printCat);

// Promise.reject().then(printCat, printDog);
// p2
//     .then(x => {
//         console.log(x * x);
//         throw false
//     })
//     .then(null, x => console.log(x))
//19

// p2
//     .then(x => {
//         console.log(x * x);
//         throw false
//     }, x => {
//         console.log('This is on rejection');
//         // console.log(x);
//     })
//     .then(null, x => console.log(x))
//     //19
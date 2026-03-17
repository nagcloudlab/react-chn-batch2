

import {
    Subject
} from 'rxjs';

import {
    filter,
    map,
    bufferCount
} from 'rxjs/operators';


const teachingStream = new Subject();


// -------------------------------------
// trainer
// -------------------------------------
let topic = 1;
setInterval(() => {
    console.log("Trainer Published topic: " + topic);
    teachingStream.next(topic)
    topic++;
}, 1000)


// -------------------------------------
// Employee-1
// -------------------------------------

teachingStream.subscribe({
    next: (topic) => {
        console.log('Employee-1 received topic: ' + topic);
    },
    error: (error) => {
        console.log('Employee-1 received error: ' + error);
    },
    complete: () => {
        console.log('Employee-1 received complete');
    }
});


// -------------------------------------
// Employee-2
// -------------------------------------

teachingStream
    .pipe(filter(topic => topic % 2 === 0))
    .pipe(map(topic => 'Topic-' + topic))
    .pipe(bufferCount(2))
    .subscribe({
        next: (topic) => {
            console.log('Employee-2 received topic: ' + topic);
        },
        error: (error) => {
            console.log('Employee-2 received error: ' + error);
        },
        complete: () => {
            console.log('Employee-2 received complete');
        }
    });


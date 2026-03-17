

// es6 - promise api


//---------------------------------------------------------
// trainer 
//---------------------------------------------------------

const trainer = {
    getTopicDetails(topic) {
        const executor = (resolve, reject) => {
            setTimeout(() => {
                if (topic === 'javascript') {
                    console.log('trainer preparing topic details');
                    console.log('trainer sending/pushing topic details to employee');
                    resolve('javascript is a programming language');
                } else {
                    reject('topic not found');
                }
            }, 5000);
        }
        const promise = new Promise(executor);
        return promise;
    }
}

//---------------------------------------------------------
// ChatGPT
//---------------------------------------------------------

const chatGPT = {
    getTopicDetails(topicDetails) {
        const executor = (resolve, reject) => {
            setTimeout(() => {
                console.log('ChatGPT preparing topic details');
                console.log('ChatGPT sending/pushing topic details to employee');
                resolve(topicDetails);
            }, 5000);
        }
        const promise = new Promise(executor);
        return promise;
    }
}


//---------------------------------------------------------
// Employee 
//---------------------------------------------------------

const employee = {
    doLearn_v1() {
        console.log('employee requesting topic details from trainer');
        const promise = trainer.getTopicDetails('javascript');
        promise
            .then((details) => {
                console.log('employee received topic details from trainer');
                chatGPT.getTopicDetails(details)
                    .then((detailsFromChatGPT) => {
                        console.log('employee received topic details from ChatGPT');
                        console.log(detailsFromChatGPT);
                    })
                    .catch((error) => {
                        console.log('employee received error from ChatGPT');
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log('employee received error from trainer');
                console.log(error);
            });
        console.log('employee continues with other work');
    },
    async doLearn_v2() {
        console.log('employee requesting topic details from trainer');
        try {
            const details = await trainer.getTopicDetails('javascript');
            console.log('employee received topic details from trainer');
            const detailsFromChatGPT = await chatGPT.getTopicDetails(details);
            console.log('employee received topic details from ChatGPT');
            console.log(detailsFromChatGPT);
        } catch (error) {
            console.log('employee received error');
            console.log(error);
        }
    },

    doWork() {
        this.doLearn_v2()
        console.log('employee doing some work');
    }

}




//---------------------------------------------------------

async function fetchTodos() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('error in fetching todos');
        console.log(error);
        return {
            error: 'error in fetching todos'
        }
    }
}

// UI....
fetchTodos()
    .then((todos) => {
        console.log('todos received in UI');
        console.log(todos);
    })
    .catch((error) => {
        console.log('error received in UI');
        console.log(error);
    });
console.log('UI continues with other work');    



// using DOM Api
//--------------------
const clickMeBtn = document.querySelector('.btn-primary');
const cardBody = document.querySelector('.card-body');

clickMeBtn.addEventListener('click', event => {
    const timeHour = new Date().getHours();
    if (timeHour < 12) {
        cardBody.innerHTML = `Good Morning`;
    } else if (timeHour < 18) {
        cardBody.innerHTML = `Good Afternoon`;
    } else {
        cardBody.innerHTML = `Good Evening`;
    }
})


// using DOM Api + XHR/fetch Api
//---------------------------------


const top5TodosBtn = document.getElementById('top5-todos-btn');
const todosTbaleBody = document.getElementById('todos-table-body');

async function fetchTop5Todos() {
    const apiUrl = 'https://jsonplaceholder.typicode.com/todos?_limit=5';
    const response = await fetch(apiUrl);
    const todos = await response.json();
    return todos;
}

top5TodosBtn.addEventListener('click', async event => {
    const todos = await fetchTop5Todos();
    const todoRows = todos.map(todo => {
        return `<tr>
            <td>${todo.id}</td>
            <td>${todo.title}</td>
            <td>${todo.completed}</td>
        </tr>
        `
    })
    todosTbaleBody.innerHTML = todoRows.join('');
});
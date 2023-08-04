const tasks = [];

let time = 0;
let taskTimer = null;
let breakTimer = null;
let currentTask = null;

const addButton = document.getElementById('addButton');
const taskTitle = document.getElementById('taskTitle');
const form = document.getElementById('form');
const taskName = document.querySelector('#time #taskName');

renderTasks();
renderTime();

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(taskTitle.value!=''){
        createTask(taskTitle.value);
        taskTitle.value = '';
        renderTasks();
    }
})

function createTask(taskTitle) {
    const newTask = {
        id:(Math.random()*100).toString(36).slice(3),
        title:taskTitle,
        completed:false
    };
    tasks.unshift(newTask);
}

function renderTasks() {
    const taskElementHTML = tasks.map((task)=>{
        return `<div class="task">
        <div class="completed">${task.completed ? `<span class="done">Done</span`:`<button class="start-button" data-id="${task.id}">Start</button>`}</div>
        <div class="title">${task.title}</div>
        </div>`;
    });
    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.innerHTML = taskElementHTML.join("\n");

    const startButtons = document.querySelectorAll('.task .start-button');
    startButtons.forEach((button)=>{
    button.addEventListener('click', ()=>{
            if(!taskTimer) {
                const id = button.getAttribute('data-id');
                startButtonHandler(id);
                button.textContent = 'In progress...';
            }
        });
    });
}


function startButtonHandler(id){
    time = 25*60;
    currentTask = id;
    const taskIndex = tasks.findIndex((task) => task.id === currentTask);
    taskName.textContent = tasks[taskIndex].title;

    taskTimer = setInterval(()=>{timeHandler(id)},1000);
}

function timeHandler(id) {
    time--;
    renderTime();
    if(time==0){
        clearInterval(taskTimer);
        markCompleted(id);
        taskTimer=null;
        renderTasks();
        startBreak();
    }
}

function renderTime() {
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time/60);
    const seconds = parseInt(time%60);

    timeDiv.textContent = `${minutes<10?'0':''}${minutes}:${seconds<10?'0':''}${seconds}`
}

function markCompleted(id){
    const taskIndex = tasks.findIndex(task => task.id==id);
    tasks[taskIndex].completed = true;
}

function startBreak() {
    time = 5*60;
    taskName.textContent = 'Break';
    breakTimer = setInterval(()=>{timeBreakHandler()},1000);
}

function timeBreakHandler() {
    time --;
    renderTime();
    if(time===0){
        clearInterval(breakTimer);
        currentTask = null;
        taskName.textContent = '';
        breakTimer = null;
        renderTasks();
    }
}
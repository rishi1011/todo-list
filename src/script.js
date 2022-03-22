import { format } from 'date-fns';
import inLocale  from 'date-fns/locale/en-IN';

import TodoTask from './todo.js';

const newTaskContainer = document.querySelector('.new-task');
const newTaskTitle = document.querySelector('.task-title');
const newTaskDesc = document.querySelector('.task-desc');
const newTaskSchedule = document.querySelector('.task-schedule');
const newTaskProject = document.querySelector('.select-project');
const addTaskBtn = document.querySelector('.add-task');
const cancelBtn = document.querySelector('.new-task > .btn.cancel');
const addBtn = document.querySelector('.new-task > .btn.add');
const taskSchedule = document.querySelector('.task-schedule');
const menu = document.querySelector('.material-icons-outlined.menu-icon');
const sidebar = document.querySelector('.sidebar');
const checkboxes = document.querySelectorAll('.checkbox');

let today = format(new Date(), 'yyyy-MM-dd',
    { locale: inLocale },
);
taskSchedule.value = today;

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', () => {
        if (checkbox.innerText === 'check_box') {
            checkbox.innerText = 'check_box_outline_blank';
        } else {
            checkbox.innerText = 'check_box';
        }

        let task = checkbox.parentElement;
        task.classList.toggle('strike');

        let p = checkbox.nextElementSibling;
        // if (!p.innerText.contains('<strike>')) {
        //     p.innerHTML = `<strike>${p.innerText}</strike>`
        // } else {
        //     p.innerHTML = `<strike>${p.innerText}</strike>`
        // }
    })
})


menu.addEventListener('click', () => {
    sidebar.classList.toggle('hide');
});


addBtn.addEventListener('click', () => {
    if (newTaskTitle.value === '') {
        alert('Task title is required!');
        return;
    }

    console.log(newTaskTitle.value, newTaskDesc.value, newTaskSchedule.value, newTaskProject.value);
    
    let newTodoTask = new TodoTask(newTaskTitle.value, newTaskDesc.value, newTaskSchedule.value, newTaskProject.value);
    
    console.log(newTaskTitle.value, newTaskDesc.value, newTaskSchedule.value, newTaskProject.value);
});

addTaskBtn.addEventListener('click', () => {
    showNewTaskContainer();
});

cancelBtn.addEventListener('click', () => {
    hideNewTaskContainer();
});

function showNewTaskContainer() {
    newTaskContainer.classList.remove('hide');
    addTaskBtn.classList.add('hide');
}

function hideNewTaskContainer() {
    newTaskContainer.classList.add('hide');
    addTaskBtn.classList.remove('hide');
}



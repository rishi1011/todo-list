import { format, lightFormat } from 'date-fns';
import inLocale from 'date-fns/locale/en-IN';

import TodoTask from './todo.js';
import Project from './project.js';

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
const defaultProjects = document.querySelectorAll('.project');
const addProjectIcon = document.querySelector('.add-icon');
const addProjectContainer = document.querySelector('.add-icon + .add-project');
const closeIcon = addProjectContainer.querySelector('.close-icon');
const doneIcon = addProjectContainer.querySelector('.done-icon');
const userProjects = document.querySelector('.user-projects');
const projectHeader = document.querySelector('h2.project-header');
const tasks = document.querySelector('ul.tasks');

let inboxProject = new Project('Inbox');

const allProjects = [];
allProjects.push(inboxProject);

defaultProjects.forEach(defaultProject => {
    defaultProject.addEventListener('click', () => addProjectListener(defaultProject));
});

function addProjectListener(project) {
    const selectedProject = document.querySelector('.sidebar .selected');
    selectedProject.classList.remove('selected');
    project.classList.add('selected');
    const projectTitle = project.querySelector('.project-title').textContent;
    updateMainContent(projectTitle);
}

addProjectIcon.addEventListener('click', () => {
    addProjectContainer.classList.remove('hide');
});

doneIcon.addEventListener('click', () => {
    const titleEle = addProjectContainer.querySelector('.new-title');
    const newTitle = titleEle.value;
    titleEle.value = '';
    if (newTitle === '') return;
    addProjectContainer.classList.add('hide');
    const newProject = new Project(newTitle);
    allProjects.push(newProject);
    console.log(allProjects);

    const newProjectElement = document.createElement('li');
    newProjectElement.classList.add('project');

    newProjectElement.innerHTML = `
    <span class="material-icons-outlined">
    checklist
    </span>
    <p class="project-title">${newTitle}</p>
    <span class="count"></span>
    <span class="material-icons-outlined clear-icon">
    clear
    </span>
    `;
    userProjects.appendChild(newProjectElement);
    newProjectElement.addEventListener('click', () => addProjectListener(newProjectElement));
});

closeIcon.addEventListener('click', () => {
    addProjectContainer.classList.add('hide');
});

function updateMainContent(projectTitle) {
    const projectObj = allProjects.find(obj => projectTitle === obj.getName());

    console.log(projectObj);

    const todos = projectObj.getTodos();

    projectHeader.textContent = projectTitle;

    // const tasks = document.createElement('ul');
    // tasks.classList.add('tasks');

    tasks.innerHTML = '';

    todos.forEach(todo => {
        console.log('todo ', todo);
        const todoEle = document.createElement('li');
        todoEle.classList.add('task');
        const title = todo.getTitle();

        const checkbox = document.createElement('span');
        checkbox.classList.add('material-icons-outlined', 'checkbox');
        checkbox.innerText = 'check_box_outline_blank';

        const p = document.createElement('p');
        p.innerText = title;

        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('material-icons-outlined', 'delete-icon');
        deleteIcon.innerText = 'delete';

        // todoEle.innerHTML = `<span class="material-icons-outlined checkbox">
        // check_box_outline_blank
        // </span>
        // <p>${title}</p>
        // <span class="material-icons-outlined delete-icon">
        // delete
        // </span>`;

        checkbox.addEventListener('click', () => hasCompletedTodoTask(checkbox));

        todoEle.appendChild(checkbox);
        todoEle.appendChild(p);
        todoEle.appendChild(deleteIcon);

        if(tasks.innerHTML !== '')
            tasks.appendChild(document.createElement('hr'));
        
        tasks.appendChild(todoEle);
    });

    hideNewTaskContainer();
}

// UI

let today = format(new Date(), 'yyyy-MM-dd',
    { locale: inLocale },
);
taskSchedule.value = today;

addBtn.addEventListener('click', () => {
    if (newTaskTitle.value === '') {
        alert('Task title is required!');
        return;
    }

    let newTodoTask = new TodoTask(newTaskTitle.value, newTaskDesc.value, newTaskSchedule.value, newTaskProject.value);

    inboxProject.addTodo(newTodoTask);

    newTaskTitle.value = '';
    newTaskDesc.value = '';
    // newTaskSchedule.value = '';
    // newTaskProject.value = '';

    updateMainContent(newTaskProject.value);
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

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', () => hasCompletedTodoTask(checkbox));
});

function hasCompletedTodoTask(checkbox) {
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
}


menu.addEventListener('click', () => {
    sidebar.classList.toggle('hide');
});




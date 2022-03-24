import { format, lightFormat } from 'date-fns';
import inLocale from 'date-fns/locale/en-IN';

import TodoTask from './todo.js';
import Project from './project.js';

const newTaskContainer = document.querySelector('.new-task');
const addTaskBtn = document.querySelector('.add-task');
const cancelBtn = document.querySelector('.new-task > .btn.cancel');
const addBtn = document.querySelector('.new-task > .btn.add');
const taskSchedule = document.querySelector('.task-schedule');
const menu = document.querySelector('.material-icons-outlined.menu-icon');
const sidebar = document.querySelector('.sidebar');
const defaultProjects = document.querySelectorAll('.project');
const addProjectIcon = document.querySelector('.add-icon');
const addProjectContainer = document.querySelector('.add-icon + .add-project');
const closeIcon = addProjectContainer.querySelector('.close-icon');
const doneIcon = addProjectContainer.querySelector('.done-icon');
const userProjectsContainer = document.querySelector('.user-projects');
const projectHeader = document.querySelector('h2.project-header');
const tasks = document.querySelector('ul.tasks');
const projectSelector = document.querySelector('.select-project');


closeIcon.addEventListener('click', () => {
    addProjectContainer.classList.add('hide');
});

defaultProjects.forEach(defaultProject => {
    defaultProject.addEventListener('click', () => addProjectListener(defaultProject));
});

addProjectIcon.addEventListener('click', () => {
    addProjectContainer.classList.remove('hide');
});

addBtn.addEventListener('click', () => {
    const newTaskTitle = newTaskContainer.querySelector('.task-title');
    const newTaskDesc = newTaskContainer.querySelector('.task-desc');
    const newTaskSchedule = newTaskContainer.querySelector('.task-schedule');
    const newTaskProject = newTaskContainer.querySelector('.select-project');

    if (newTaskTitle.value === '') {
        alert('Task title is required!');
        return;
    }

    const projectObj = getProjectObject(newTaskProject.value);

    const newTodoTask = new TodoTask(newTaskTitle.value, newTaskDesc.value, newTaskSchedule.value, newTaskProject.value);

    const isAdded = projectObj.addTodo(newTodoTask);

    if (isAdded) {
        const projectElement = findProjectElementFromTitle(newTaskProject.value);
        updateSelectedProjectFromSideBar(projectElement);
        updateMainContent(newTaskProject.value);
        updateProjectTaskCount();
        updateTaskContainer(newTaskTitle, newTaskDesc, newTaskSchedule);
    }
});

function updateTaskContainer(newTaskTitle, newTaskDesc, newTaskSchedule) {
    newTaskTitle.value = '';
    newTaskDesc.value = '';
    newTaskSchedule.value = today;
}


function getProjectTitleFromElement(projectElement) {
    const title = projectElement.querySelector('.project-title').textContent;
    return title;
}

function findProjectElementFromTitle(title) {
    const projectElements = [...document.querySelectorAll('.project')];
    let element;
    projectElements.forEach(projectElement => {
        const projectTitle = getProjectTitleFromElement(projectElement);
        if (title === projectTitle) {
            element = projectElement;
            return;
        }
    });
    return element;
}

function updateCountElement(countEle, length) {
    countEle.value = length;
    countEle.innerText = length === 0 ? '' : length;
}

function updateProjectTaskCount() {
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
        const title = getProjectTitleFromElement(project);
        const countEle = project.querySelector('span.count');

        let tasksLength;
        if (title === 'Today') {
            tasksLength = getAllTasksFromToday().length;
            updateCountElement(countEle, tasksLength);
        } else if (title === 'Upcoming') {
            tasksLength = getAllUpcomingTasks().length;
            updateCountElement(countEle, tasksLength);
        } else {
            const projectObj = getProjectObject(title);
            if (projectObj !== undefined) {
                tasksLength = projectObj.getTodosLength();
                updateCountElement(countEle, tasksLength);
            }
        }
    });
}

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

function hasCompletedTodoTask(checkbox, todo) {
    let p = checkbox.nextElementSibling;
    let task = checkbox.parentElement;
    task.classList.toggle('strike');

    if (checkbox.innerText === 'check_box') {
        checkbox.innerText = 'check_box_outline_blank';
        const textContent = p.querySelector('strike').innerText;
        p.innerHTML = `${textContent}`;
    } else {
        checkbox.innerText = 'check_box';
        p.innerHTML = `<strike>${p.innerText}</strike>`;
    }
    todo.toggleChecked();
}

function updateSelectedProjectFromSideBar(project) {
    const selectedProject = document.querySelector('.sidebar .selected');
    selectedProject.classList.remove('selected');
    project.classList.add('selected');

    const projectTitle = getProjectTitleFromElement(project); 
    selectProjectUnderSelector(projectTitle);
}

menu.addEventListener('click', () => {
    sidebar.classList.toggle('hide');
});

doneIcon.addEventListener('click', () => {
    const titleEle = addProjectContainer.querySelector('.new-title');
    const newTitle = titleEle.value;
    titleEle.value = '';

    const isDuplicate = isDuplicateProjectName(newTitle);
    if (newTitle === '' || isDuplicate) return;

    addProjectContainer.classList.add('hide');
    createAndPushNewProject(newTitle);
    const newProjectElement = createNewProjectElement(newTitle);
    userProjectsContainer.appendChild(newProjectElement);
    newProjectElement.addEventListener('click', () => addProjectListener(newProjectElement));
});

function createNewProjectElement(title) {
    const newProjectElement = document.createElement('li');
    newProjectElement.classList.add('user-project', 'project');
    newProjectElement.innerHTML = `
    <span class="material-icons-outlined">
    checklist
    </span>
    <p class="project-title">${title}</p>
    <span class="count"></span>
    <span class="material-icons-outlined clear-icon">
    clear
    </span>`;
    addNewProjectUnderSelector(title);
    return newProjectElement;
}

function addNewProjectUnderSelector(title) {
    const listItem = document.createElement('option');
    listItem.value = title;
    listItem.innerText = title;
    projectSelector.appendChild(listItem);
}

function selectProjectUnderSelector(title) {
    const listItems = projectSelector.querySelectorAll('option');
    const selectedItem = projectSelector.querySelector('option[selected]');
    selectedItem.selected = false;
    listItems.forEach(item => {
        if (item.textContent === title) {
            item.selected = true;
            return;
        }
    });
}

function updateProjectHeader(title) {
    projectHeader.textContent = title;
}

function createCheckBoxElement(todo) {
    const checkbox = document.createElement('span');
    checkbox.classList.add('material-icons-outlined', 'checkbox');
    checkbox.innerText = todo.isChecked ? 'check_box' : 'check_box_outline_blank';
    checkbox.addEventListener('click', () => hasCompletedTodoTask(checkbox, todo));
    return checkbox;
}

function createParagraphElement(todo) {
    const p = document.createElement('p');
    p.innerText = todo.getTitle();
    if (todo.getProject() === 'Today' || todo.getProject() === 'Upcoming') {
        p.innerText += `  (${todo.getProject()})`;
    }
    return p;
}

function createDeleteIcon() {
    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('material-icons-outlined', 'delete-icon');
    deleteIcon.innerText = 'delete';
    return deleteIcon;
}

function createTodoElement(todo) {
    const todoEle = document.createElement('li');
    todoEle.classList.add('task');
    if (todo.isChecked) todoEle.classList.add('strike');
    const checkbox = createCheckBoxElement(todo);
    const p = createParagraphElement(todo);
    const deleteIcon = createDeleteIcon();
    todoEle.appendChild(checkbox);
    todoEle.appendChild(p);
    todoEle.appendChild(deleteIcon);
    return todoEle;
}

function addProjectListener(project) {
    const projectTitle = getProjectTitleFromElement(project);
    updateSelectedProjectFromSideBar(project);
    updateMainContent(projectTitle);
}

function updateTodosList(todos) {
    tasks.innerHTML = '';
    todos.forEach(todo => {
        const todoEle = createTodoElement(todo);
        if (tasks.innerHTML !== '')
            tasks.appendChild(document.createElement('hr'));

        tasks.appendChild(todoEle);
    });

}

function updateMainContent(projectTitle) {
    const projectObj = getProjectObject(projectTitle);
    updateProjectHeader(projectTitle);
    const todos = getProjectTodos(projectTitle, projectObj);
    updateTodosList(todos);
    hideNewTaskContainer();
}

//App Logic

const today = format(new Date(), 'yyyy-MM-dd',
    { locale: inLocale },
);
taskSchedule.value = today;

let tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow = format(tomorrow, 'yyyy-MM-dd', { locale: inLocale });

let inboxProject = new Project('Inbox');

const allProjects = [];
allProjects.push(inboxProject);

function isDuplicateProjectName(title) {
    let isDuplicate = false;
    allProjects.forEach(project => {
        if (project.getName() === title) {
            alert('Project Names must be different');
            isDuplicate = true;
        }
    });
    return isDuplicate;
}

function createAndPushNewProject(title) {
    const newProject = new Project(title);
    allProjects.push(newProject);
}

function getProjectTodos(projectTitle, projectObj) {
    let todos;
    if (projectTitle === 'Today') {
        todos = getAllTasksFromToday(allProjects);
    } else if (projectTitle === 'Upcoming') {
        todos = getAllUpcomingTasks(allProjects);
    } else {
        todos = projectObj.getTodos();
    }
    return todos;
}


function getAllUpcomingTasks() {
    let upcomingTasks = [];
    allProjects.forEach(project => {
        const projectTodos = project.getUpcomingTodos();
        upcomingTasks = upcomingTasks.concat(projectTodos);
    });
    return upcomingTasks;
}

function getAllTasksFromToday() {
    let todosToday = [];
    allProjects.forEach(project => {
        const projectTodos = project.getTodosToday();
        todosToday = todosToday.concat(projectTodos);
    });

    return todosToday;
}

function getProjectObject(title) {
    let obj;
    allProjects.forEach(project => {
        if (title === project.getName()) {
            obj = project;
            return;
        }
    });
    return obj;
}

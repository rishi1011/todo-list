import { format } from 'date-fns';
import inLocale from 'date-fns/locale/en-IN';

import TodoTask from './todo.js';
import Project from './project.js';

const newTaskContainer = document.querySelector('.new-task');
const addTaskBtn = document.querySelector('.add-task');
const cancelBtn = document.querySelector('.new-task .btn.cancel');
const addBtn = document.querySelector('.new-task .btn.add');
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

const newTaskForm = document.querySelector('.new-task > form');
const addProjectForm = document.querySelector('.add-project > form');

document.body.addEventListener('click', addProjectContainerListener);

function addProjectContainerListener(e) {
    const res1 = e.target !== addProjectIcon;
    const res2 = e.target.closest('.add-project') !== addProjectContainer;
    if (res1 && res2) {
        hideAddProjectContainer();
    }
}

closeIcon.addEventListener('click', () => {
    hideAddProjectContainer();
});

defaultProjects.forEach(defaultProject => {
    defaultProject.addEventListener('click', () => addProjectListener(defaultProject));
});

addProjectIcon.addEventListener('click', () => {
    showAddProjectContainer();
});

function showAddProjectContainer() {
    addProjectContainer.classList.remove('hide');
    // document.body.addEventListener('click', addProjectContainerListener);
}

function hideAddProjectContainer() {
    addProjectContainer.classList.add('hide');
    // document.body.removeEventListener('click', addProjectContainerListener);
}

newTaskForm.addEventListener('submit', createNewTask);
addBtn.addEventListener('click', createNewTask);

function createNewTask(e) {
    e.preventDefault();
    const newTaskTitle = newTaskContainer.querySelector('.task-title');
    const newTaskDesc = newTaskContainer.querySelector('.task-desc');
    const newTaskSchedule = newTaskContainer.querySelector('.task-schedule');
    const newTaskProject = newTaskContainer.querySelector('.select-project');

    if (newTaskTitle.validity.valueMissing) {
        newTaskTitle.reportValidity();
        return;
    }

    const projectObj = getProjectObject(newTaskProject.value);

    const newTodoTask = new TodoTask(newTaskTitle.value, newTaskDesc.value, newTaskSchedule.value, newTaskProject.value);

    const isAdded = projectObj.addTodo(newTodoTask);

    if (isAdded) {
        updateMainContent(projectHeader.innerText);
        updateProjectTaskCount();
        updateTaskContainer(newTaskTitle, newTaskDesc);
    }
}

function updateTaskContainer(newTaskTitle, newTaskDesc) {
    newTaskTitle.value = '';
    newTaskDesc.value = '';
}

function getProjectTitleFromElement(projectElement) {
    const title = projectElement.querySelector('.project-title').textContent;
    return title;
}

function getProjectElementFromTitle(title) {
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
    if (projectHeader.innerText === 'Upcoming') {
        taskSchedule.value = tomorrow;
    } else {
        taskSchedule.value = today;
    }
    newTaskContainer.classList.remove('hide');
    addTaskBtn.classList.add('hide');
}

function hideNewTaskContainer() {
    newTaskContainer.classList.add('hide');
    addTaskBtn.classList.remove('hide');
}

function hasCompletedTodoTask(checkbox, todo) {
    let task = checkbox.parentElement.parentElement;
    task.classList.toggle('strike');
    todo.toggleChecked();
    checkbox.innerText = todo.isChecked ? 'check_box' : 'check_box_outline_blank';
}

function updateSelectedProjectFromSideBar(projectElement) {
    const selectedProject = document.querySelector('.sidebar .selected');
    let projectTitle;
    if (selectedProject === null) {
        projectTitle = getAvailableProject().getName();
        projectElement = getProjectElementFromTitle(projectTitle);
        projectElement.classList.add('selected');
    } else {
        selectedProject.classList.remove('selected');
        projectElement.classList.add('selected');
        projectTitle = getProjectTitleFromElement(projectElement);
    }

    selectProjectUnderSelector(projectTitle);
}

menu.addEventListener('click', () => {
    sidebar.classList.toggle('hide');
});

addProjectForm.addEventListener('submit', createNewProject);
doneIcon.addEventListener('click', createNewProject);

function createNewProject(e) {
    e.preventDefault();
    const titleEle = addProjectContainer.querySelector('.new-title');
    const newTitle = titleEle.value;

    if (titleEle.validity.valueMissing) {
        titleEle.reportValidity();
        return;
    }

    const isDuplicate = isDuplicateProjectName(newTitle);
    if (isDuplicate) return;

    titleEle.value = '';

    addProjectContainer.classList.add('hide');
    createAndPushNewProject(newTitle);
    const newProjectElement = createNewProjectElement(newTitle);
    userProjectsContainer.appendChild(newProjectElement);
    newProjectElement.addEventListener('click', () => addProjectListener(newProjectElement));
}

function createNewProjectElement(title) {
    const newProjectElement = document.createElement('li');
    newProjectElement.classList.add('user-project', 'project');
    const clearIcon = createClearIcon();
    newProjectElement.appendChild(clearIcon);
    newProjectElement.insertAdjacentHTML('beforeend',`<span class="material-icons-outlined checklist-icon">
    checklist
    </span>
    <p class="project-title">${title}</p>
    <span class="count"></span>`);
    addNewProjectUnderSelector(title);
    return newProjectElement;
}

function createClearIcon() {
    const span = document.createElement('span');
    span.classList.add('material-icons-outlined', 'clear-icon');
    span.innerText = 'clear';
    span.addEventListener('click', () => deleteProject(span));
    return span;
}

function deleteProject(span) {
    const projectTitle = span.parentElement.querySelector('.project-title').innerText;
    deleteProjectObj(projectTitle);
    const projectElement = getProjectElementFromTitle(projectTitle);
    projectElement.remove();
    updateProjectTaskCount();
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
    if (projectHeader.innerText === 'Today' || projectHeader.innerText === 'Upcoming') {
        p.innerText += `  (${todo.getProject()})`;
    }
    return p;
}

function createDropDownIconElement() {
    const dropDownIcon = document.createElement('span');
    dropDownIcon.classList.add('material-icons-outlined', 'drop-down-icon');
    dropDownIcon.innerText = 'expand_more';
    dropDownIcon.addEventListener('click', () => dropDownTaskListener(dropDownIcon));
    return dropDownIcon;
}

function dropDownTaskListener(dropDownIcon) {
    const taskElement = dropDownIcon.parentElement.parentElement;
    const hiddenContent = taskElement.querySelector('.hidden-content');
    hiddenContent.classList.toggle('hide');
}

function createDeleteIcon() {
    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('material-icons-outlined', 'delete-icon');
    deleteIcon.innerText = 'delete';
    deleteIcon.addEventListener('click', () => deleteTaskListener(deleteIcon));
    return deleteIcon;
}

function deleteTaskListener(deleteIcon) {
    const headerTitle = projectHeader.innerText;

    let projectTitle;
    let projectObj;
    let taskTitle;
    let taskObj;

    if (headerTitle === 'Today' || headerTitle === 'Upcoming') {
        const taskText = deleteIcon.parentElement.querySelector('p').innerText;
        projectTitle = getProjectTitleFromCombinedName(taskText);
        taskTitle = getTaskTitleFromFromCombinedName(taskText);

        projectObj = getProjectObject(projectTitle);
        taskObj = projectObj.getTodoFromList(taskTitle);

        projectObj.deleteTask(taskObj);

        projectTitle = headerTitle;
    } else {
        projectTitle = headerTitle;
        projectObj = getProjectObject(projectTitle);

        taskTitle = deleteIcon.parentElement.querySelector('p').innerText;
        taskObj = projectObj.getTodoFromList(taskTitle);

        projectObj.deleteTask(taskObj);
    }
    const projectElement = getProjectElementFromTitle(projectTitle);

    updateSelectedProjectFromSideBar(projectElement);
    updateMainContent(projectTitle);
    updateProjectTaskCount();
}

function createDueDateElement(todo) {
    const div = document.createElement('div');
    div.classList.add('due-date');
    const p1 = document.createElement('p');
    p1.classList.add('title');
    const p2 = document.createElement('p');
    p1.innerText = 'Due Date';
    p2.innerText = todo.getDate();

    div.appendChild(p1);
    div.appendChild(p2);

    return div;
}

function createDisplayProjectElement(todo) {
    const div = document.createElement('div');
    div.classList.add('project-name');
    const p1 = document.createElement('p');
    p1.classList.add('title');
    const p2 = document.createElement('p');
    p1.innerText = 'Project';
    p2.innerText = todo.getProject();
    div.appendChild(p1);
    div.appendChild(p2);
    return div;
}

function createDetailsElement(todo) {
    const div = document.createElement('div');
    div.classList.add('details');
    const p1 = document.createElement('p');
    p1.classList.add('title');
    const p2 = document.createElement('p');
    p1.innerText = 'Details';
    p2.innerText = todo.getDesc();
    div.appendChild(p1);
    div.appendChild(p2);
    return div;
}

function createEditIcon() {
    const span = document.createElement('span');
    span.classList.add('material-icons-outlined', 'edit-icon');
    span.innerText = 'edit_note';
    span.addEventListener('click', addEditTaskContainer);
    return span;
}

function addEditTaskContainer(e) {
    const todoElement = e.target.parentElement.parentElement;
    const todoObj = getTodoObjFromElement(todoElement, projectHeader);

    todoElement.appendChild(createEditTaskContainer(todoObj));

}

function createEditTaskContainer(todoObj) {
    const div = document.createElement('div');
    div.classList.add('edit-task');

    const form = document.createElement('form');
    
    const textInputContainer = document.createElement('div');
    textInputContainer.classList.add('text-input-container');

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.classList.add('task-title');
    titleInput.value = todoObj.getTitle();
    titleInput.required = true;
    titleInput.placeholder = 'Title';

    const descText = document.createElement('textarea');
    // descText.type = 'text';
    descText.classList.add('task-desc');
    descText.rows = 2;
    descText.innerText = todoObj.getDesc();
    descText.placeholder = 'Description';

    textInputContainer.appendChild(titleInput);
    textInputContainer.appendChild(descText);

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.classList.add('task-schedule');
    dateInput.value = todoObj.getDate();

    const projectSelector = document.createElement('select');
    projectSelector.classList.add('select-project');
    createOptionElementsUnderSelectorForAllProjects(projectSelector, todoObj);

    const br = document.createElement('br');

    const editBtn = document.createElement('button');
    editBtn.type = 'submit';
    editBtn.classList.add('btn', 'edit');
    editBtn.innerText = 'Edit';
    editBtn.addEventListener('click', updateTodo);
    editBtn.addEventListener('submit', updateTodo);

    function updateTodo(e) {
        e.preventDefault();

        if (titleInput.validity.valueMissing) {
            titleInput.reportValidity();
            return;
        }

        todoObj.setTitle(titleInput.value);
        todoObj.setDesc(descText.value);
        todoObj.setDate(dateInput.value);
        todoObj.setProject(projectSelector.value);
        updateMainContent(todoObj.getProject());
    }

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.classList.add('btn', 'cancel');
    cancelBtn.innerText = 'Cancel';
    cancelBtn.addEventListener('click', () => {
        div.remove();
    });

    form.appendChild(textInputContainer);
    form.appendChild(dateInput);
    form.appendChild(projectSelector);
    form.appendChild(br);
    form.appendChild(editBtn);
    form.appendChild(cancelBtn);

    div.appendChild(form);

    return div;
}

function createOptionElementsUnderSelectorForAllProjects(projectSelector, todoObj) {
    allProjects.forEach(project => {
        const title = project.getName();

        const optionElement = document.createElement('option');
        optionElement.innerText = title;
        optionElement.value = title;
        if (todoObj.getProject() === project) {
            optionElement.selected = true;
        }

        projectSelector.appendChild(optionElement);
    });
}

function createTodoElement(todo) {
    const todoEle = document.createElement('li');
    todoEle.classList.add('task');
    if (todo.isChecked) todoEle.classList.add('strike');
    const checkbox = createCheckBoxElement(todo);
    const p = createParagraphElement(todo);
    const dropDownIcon = createDropDownIconElement();
    const deleteIcon = createDeleteIcon();

    const defaultContent = document.createElement('div');
    defaultContent.classList.add('default-content');

    defaultContent.appendChild(checkbox);
    defaultContent.appendChild(p);
    defaultContent.appendChild(dropDownIcon);
    defaultContent.appendChild(deleteIcon);

    const hiddenContent = document.createElement('div');
    hiddenContent.classList.add('hidden-content', 'hide');
    const dueDate = createDueDateElement(todo);
    const project = createDisplayProjectElement(todo);
    const details = createDetailsElement(todo);
    const editIcon = createEditIcon();

    hiddenContent.appendChild(dueDate);
    hiddenContent.appendChild(project);
    hiddenContent.appendChild(details);
    hiddenContent.appendChild(editIcon);

    todoEle.appendChild(defaultContent);
    todoEle.appendChild(hiddenContent);
    return todoEle;
}

function addProjectListener(projectElement) {
    updateSelectedProjectFromSideBar(projectElement);
    let projectTitle = getProjectTitleFromElement(projectElement);
    let projectObj = getProjectObject(projectTitle);
    if (projectObj === undefined && projectTitle !== 'Today' && projectTitle !== 'Upcoming') {
        projectObj = getAvailableProject();
        projectTitle = projectObj.getName();
    }
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

function getAvailableProject() {
    let projectObj;
    if (allProjects.length > 1) {
        projectObj = allProjects[1];
    } else {
        projectObj = allProjects[0];
    }
    return projectObj;
}

function deleteProjectObj(projectTitle) {
    const projectObj = getProjectObject(projectTitle);
    const objIdx = allProjects.indexOf(projectObj);
    allProjects.splice(objIdx, 1);
}

function getProjectTitleFromCombinedName(combinedName) {
    const regex = /\((.*)\)/;
    const projectTitle = combinedName.match(regex)[1];
    return projectTitle;
}

function getTaskTitleFromFromCombinedName(combinedName) {
    let taskTitle = '';
    for (let i = 0; i < combinedName.length; i++) {
        if (combinedName[i] !== '(') {
            taskTitle += combinedName[i];
        } else {
            break;
        }
    }
    return taskTitle.trim();
}

function getTodoObjFromElement(todoElement, projectHeader) {
    const projectTitle = projectHeader.innerText;
    const projectObj = getProjectObject(projectTitle);

    const taskTitle = todoElement.querySelector('.default-content > p').innerText;
    const taskObj = projectObj.getTodoFromList(taskTitle);

    return taskObj;
}
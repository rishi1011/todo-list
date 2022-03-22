import { format } from 'date-fns';
import inLocale  from 'date-fns/locale/en-IN';

const newTaskContainer = document.querySelector('.new-task');
const newTaskTitle = document.querySelector('.task-title');
const addTaskBtn = document.querySelector('.add-task');
const cancelBtn = document.querySelector('.new-task > .btn.cancel');
const addBtn = document.querySelector('.new-task > .btn.add');
const taskSchedule = document.querySelector('.task-schedule');


let today = format(new Date(), 'yyyy-MM-dd',
    { locale: inLocale },
);
taskSchedule.value = today;

addBtn.addEventListener('click', () => {
    if (newTaskTitle.value === "") {
        alert('Task title is required!');
    }

    
});


addTaskBtn.addEventListener('click', () => {
    newTaskContainer.classList.remove('hide');
    addTaskBtn.classList.add('hide');
});

cancelBtn.addEventListener('click', () => {
    newTaskContainer.classList.add('hide');
    addTaskBtn.classList.remove('hide');
})



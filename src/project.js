import { isToday, isFuture } from "date-fns";

export default class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    getName() {
        return this.name;
    }

    getTodos() {
        return this.todos;
    }

    getTodosLength() {
        return this.todos.length;
    }

    setName(name) {
        this.name = name;
    }

    setTodos(todos) {
        this.todos = todos;
    }

    addTodo(todo) {
        if (this.isTodoDuplicate(todo)) {
            return false;
        }
        this.todos.push(todo);
        return true;
    }

    getTodoFromList(title) {
        let taskObj;
        this.todos.forEach(obj => {
            if (obj.getTitle() === title) {
                taskObj = obj;
            }
        });
        return taskObj;
    }

    deleteTask(taskObj) {
        if (this.todos.includes(taskObj)) {
            const idx = this.todos.indexOf(taskObj);
            this.todos.splice(idx, 1);
        }
        return;
    }

    isTodoDuplicate(todo) {
        let isDuplicate = false;
        this.todos.forEach(item => {
            if (item.getTitle() === todo.getTitle()) {
                alert(`${this.getName()} already contains a task called '${item.getTitle()}'`);
                isDuplicate = true;
            }
        });
        return isDuplicate;
    }

    getTodosToday() {
        const todosToday = this.todos.filter(todo => {
            return isToday(new Date(todo.date));
        });
        return todosToday;
    }

    getUpcomingTodos() {
        const todosUpcoming = this.todos.filter(todo => {
            return !isToday(new Date(todo.date)) && isFuture(new Date(todo.date));
        });
        return todosUpcoming;
    }
}
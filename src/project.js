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

    isTodoDuplicate(todo) {
        let isDuplicate = false;
        this.todos.forEach(item => {
            if (item.getTitle() === todo.getTitle()) {
                alert('The Task names must be different');
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
        const todosThisWeek = this.todos.filter(todo => {
            return isFuture(new Date(todo.date));
        });
        return todosThisWeek;
    }
}
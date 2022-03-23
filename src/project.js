import { isThisWeek, isToday, toDate } from "date-fns";

export default class Project{
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

    setName(name) {
        this.name = name;
    }

    setTodos(todos) {
        this.todos = todos;
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    getTodosToday() {
        const todosToday = this.todos.filter(todo => {
            return isToday(new Date(todo.date));
        });
        return todosToday;
    }

    getTodosThisWeek() {
        const todosThisWeek = this.todos.filter(todo => {
            return isThisWeek(new Date(todo.date));
        });
        return todosThisWeek;
    }
}
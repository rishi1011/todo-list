export default class Todo{
    constructor(title, desc, date, project) {
        this.title = title;
        this.desc = desc;
        this.date = date;
        this.project = project;
    }
    
    get title() {
        return this.title;
    }

    get desc() {
        return this.desc;
    }

    get date() {
        return this.date;
    }

    get project() {
        return this.project;
    }

    set title(title) {
        if (title === '') {
            alert('Title is required!');
            return;
        }

        this._title = title;
    }

    set desc(desc) {
        this._desc = desc;
    }

    set date(date) {
        this._date = date;
    }

    set project(project) {
        this._project = project;
    }


}
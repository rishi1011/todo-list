export default class Todo{
    constructor(title, desc, date, project, isChecked = false) {
        this.title = title;
        this.desc = desc;
        this.date = date;
        this.project = project;
        this.isChecked = isChecked;
    }
    
    getTitle() {
        return this.title;
    }

    getDesc() {
        return this.desc;
    }

    getDate() {
        return this.date;
    }

    getProject() {
        return this.project;
    }

    setTitle(title) {
        this.title = title;
    }

    setDesc(desc) {
        this.desc = desc;
    }

    setDate(date) {
        this.date = date;
    }

    setProject(project) {
        this.project = project;
    }

    toggleChecked() {
        this.isChecked = !this.isChecked;
    }
}
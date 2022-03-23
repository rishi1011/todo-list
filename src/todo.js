export default class Todo{
    constructor(title, desc, date, project) {
        this.title = title;
        this.desc = desc;
        this.date = date;
        this.project = project;
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
        if (title === '') {
            alert('Title is required!');
            return;
        }

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


}
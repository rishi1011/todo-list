export default class Storage{
    static key = 'todolist';

    static storeContent(allProjects) {
        localStorage.setItem('todolist', JSON.stringify(allProjects));
    }
    
    static getContent() {
        const allProjects = JSON.parse(localStorage.getItem('todolist'));
        allProjects.forEach(project => {

        });
        return allProjects;
    }
}
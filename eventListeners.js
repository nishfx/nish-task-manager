import domElements from './domElements.js';
import auth from './auth.js';
import projectManager from './projectManager.js';
import taskManager from './taskManager.js';

function setupEventListeners() {
    domElements.loginButton.addEventListener('click', () => {
        auth.login(domElements.loginUsername.value, domElements.loginPassword.value);
    });

    domElements.registerButton.addEventListener('click', () => {
        auth.register(domElements.registerUsername.value, domElements.registerPassword.value);
    });

    domElements.logoutButton.addEventListener('click', auth.logout);

    domElements.projectForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const projectName = domElements.projectInput.value.trim();
        if (projectName) {
            projectManager.createProject(projectName);
            domElements.projectInput.value = '';
        }
    });

    domElements.projectSelect.addEventListener('change', function() {
        const projectId = this.value;
        if (projectId) {
            taskManager.loadTasks(projectId);
        } else {
            taskManager.renderTasks();
        }
    });

    domElements.taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const projectId = domElements.projectSelect.value;
        if (projectId) {
            const taskName = domElements.taskInput.value.trim();
            if (taskName) {
                taskManager.createTask(projectId, taskName);
                domElements.taskInput.value = '';
            }
        } else {
            alert('Please select a project first.');
        }
    });
}

export default setupEventListeners;

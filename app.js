import auth from './auth.js';
import uiManager from './uiManager.js';
import projectManager from './projectManager.js';
import taskManager from './taskManager.js';

function init() {
    setupEventListeners();
    auth.verifyToken();
}

function setupEventListeners() {
    document.getElementById('loginButton').addEventListener('click', () => {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        auth.login(username, password);
    });

    document.getElementById('registerButton').addEventListener('click', () => {
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        auth.register(username, password);
    });

    document.getElementById('logoutButton').addEventListener('click', auth.logout);

    document.getElementById('projectForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const projectName = document.getElementById('projectInput').value.trim();
        if (projectName) {
            projectManager.createProject(projectName);
            document.getElementById('projectInput').value = '';
        }
    });

    document.getElementById('projectSelect').addEventListener('change', function() {
        const projectId = this.value;
        if (projectId) {
            taskManager.loadTasks(projectId);
        } else {
            taskManager.renderTasks([]);
        }
    });

    document.getElementById('taskForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const projectId = document.getElementById('projectSelect').value;
        if (projectId) {
            const taskName = document.getElementById('taskInput').value.trim();
            if (taskName) {
                taskManager.createTask(projectId, taskName);
                document.getElementById('taskInput').value = '';
            }
        } else {
            alert('Please select a project first.');
        }
    });
}

document.addEventListener('DOMContentLoaded', init);

export { init };
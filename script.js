// script.js
import * as auth from './auth.js';
import * as projects from './projects.js';
import * as tasks from './tasks.js';

let currentUser = null;
let currentProject = null;

document.addEventListener('DOMContentLoaded', async function() {
    // DOM element references
    const authContainer = document.getElementById('authContainer');
    const appContainer = document.getElementById('appContainer');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutButton = document.getElementById('logoutButton');
    const projectForm = document.getElementById('projectForm');
    const projectSelect = document.getElementById('projectSelect');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutButton.addEventListener('click', handleLogout);
    projectForm.addEventListener('submit', handleCreateProject);
    projectSelect.addEventListener('change', handleProjectSelect);
    taskForm.addEventListener('submit', handleCreateTask);

    // Check if user is already logged in
    const user = await auth.verifyToken();
    if (user) {
        currentUser = user;
        showApp();
    } else {
        showAuth();
    }

    // Handler functions
    async function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        try {
            currentUser = await auth.login(username, password);
            showApp();
        } catch (error) {
            alert(error.message);
        }
    }

    async function handleRegister(event) {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        try {
            currentUser = await auth.register(username, password);
            showApp();
        } catch (error) {
            alert(error.message);
        }
    }

    function handleLogout() {
        auth.logout();
        currentUser = null;
        currentProject = null;
        showAuth();
    }

    async function handleCreateProject(event) {
        event.preventDefault();
        const projectName = document.getElementById('projectInput').value.trim();
        if (projectName) {
            try {
                await projects.createProject(projectName);
                document.getElementById('projectInput').value = '';
                loadProjects();
            } catch (error) {
                alert(error.message);
            }
        }
    }

    function handleProjectSelect() {
        const projectId = this.value;
        if (projectId) {
            currentProject = projectId;
            loadTasks(projectId);
        } else {
            currentProject = null;
            taskList.innerHTML = '';
        }
    }

    async function handleCreateTask(event) {
        event.preventDefault();
        if (currentProject) {
            const taskName = document.getElementById('taskInput').value.trim();
            if (taskName) {
                try {
                    await tasks.createTask(currentProject, taskName);
                    document.getElementById('taskInput').value = '';
                    loadTasks(currentProject);
                } catch (error) {
                    alert(error.message);
                }
            }
        } else {
            alert('Please select a project first.');
        }
    }

    // UI functions
    function showAuth() {
        authContainer.style.display = 'block';
        appContainer.style.display = 'none';
    }

    function showApp() {
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
        loadProjects();
    }

    async function loadProjects() {
        try {
            const projectList = await projects.loadProjects();
            renderProjects(projectList);
        } catch (error) {
            alert('Failed to load projects. Please try again.');
        }
    }

    async function loadTasks(projectId) {
        try {
            const taskList = await tasks.loadTasks(projectId);
            renderTasks(taskList);
        } catch (error) {
            alert('Failed to load tasks. Please try again.');
        }
    }

    function renderProjects(projectList) {
        projectSelect.innerHTML = '<option value="">Select a project</option>';
        projectList.forEach(project => {
            const option = document.createElement('option');
            option.value = project._id;
            option.textContent = project.name;
            projectSelect.appendChild(option);
        });
    }

    function renderTasks(taskList) {
        taskList.innerHTML = '';
        taskList.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.name;
            // Add more task details and interaction elements here
            taskList.appendChild(li);
        });
    }
});
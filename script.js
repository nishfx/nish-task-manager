// API configuration
const API_URL = 'http://h2843541.stratoserver.net:5000/api';

// State management
let currentUser = null;
let projects = [];
let currentProject = null;

// DOM Elements
const domElements = {
    authContainer: document.getElementById('authContainer'),
    appContainer: document.getElementById('appContainer'),
    loginUsername: document.getElementById('loginUsername'),
    loginPassword: document.getElementById('loginPassword'),
    loginButton: document.getElementById('loginButton'),
    registerUsername: document.getElementById('registerUsername'),
    registerPassword: document.getElementById('registerPassword'),
    registerButton: document.getElementById('registerButton'),
    logoutButton: document.getElementById('logoutButton'),
    projectForm: document.getElementById('projectForm'),
    projectInput: document.getElementById('projectInput'),
    projectSelect: document.getElementById('projectSelect'),
    taskForm: document.getElementById('taskForm'),
    taskInput: document.getElementById('taskInput'),
    taskList: document.getElementById('taskList')
};

// Authentication module
const auth = {
    async login(username, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                currentUser = { username };
                uiManager.showApp();
                projectManager.loadProjects();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    },
    async register(username, password) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                currentUser = { username };
                uiManager.showApp();
                projectManager.loadProjects();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    },
    async verifyToken() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`${API_URL}/auth/verify`, {
                    headers: { 'x-auth-token': token }
                });
                if (response.ok) {
                    const userData = await response.json();
                    currentUser = { username: userData.username };
                    uiManager.showApp();
                    projectManager.loadProjects();
                } else {
                    localStorage.removeItem('token');
                    uiManager.showAuth();
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                localStorage.removeItem('token');
                uiManager.showAuth();
            }
        } else {
            uiManager.showAuth();
        }
    },
    logout() {
        localStorage.removeItem('token');
        currentUser = null;
        projects = [];
        currentProject = null;
        uiManager.showAuth();
    }
};

// Project management module
const projectManager = {
    async loadProjects() {
        try {
            const response = await fetch(`${API_URL}/projects`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            if (response.ok) {
                projects = await response.json();
                this.renderProjects();
            } else {
                throw new Error('Failed to load projects');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load projects. Please try again.');
        }
    },
    async createProject(name) {
        try {
            const response = await fetch(`${API_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ name })
            });
            if (response.ok) {
                const newProject = await response.json();
                projects.push(newProject);
                this.renderProjects();
            } else {
                throw new Error('Failed to create project');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create project. Please try again.');
        }
    },
    renderProjects() {
        const projectSelect = domElements.projectSelect;
        projectSelect.innerHTML = '<option value="">Select a project</option>';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project._id;
            option.textContent = project.name;
            projectSelect.appendChild(option);
        });
    }
};

// Task management module
const taskManager = {
    async loadTasks(projectId) {
        try {
            const response = await fetch(`${API_URL}/tasks/${projectId}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            if (response.ok) {
                const tasks = await response.json();
                currentProject.tasks = tasks;
                this.renderTasks();
            } else {
                throw new Error('Failed to load tasks');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load tasks. Please try again.');
        }
    },
    async createTask(projectId, name) {
        try {
            const response = await fetch(`${API_URL}/tasks/${projectId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ name })
            });
            if (response.ok) {
                const newTask = await response.json();
                currentProject.tasks.push(newTask);
                this.renderTasks();
            } else {
                throw new Error('Failed to create task');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create task. Please try again.');
        }
    },
    async updateTask(taskId, updates) {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(updates)
            });
            if (response.ok) {
                const updatedTask = await response.json();
                const taskIndex = currentProject.tasks.findIndex(t => t._id === taskId);
                if (taskIndex !== -1) {
                    currentProject.tasks[taskIndex] = updatedTask;
                    this.renderTasks();
                }
            } else {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update task. Please try again.');
        }
    },
    renderTasks() {
        const taskList = domElements.taskList;
        taskList.innerHTML = '';
        if (currentProject && currentProject.tasks) {
            currentProject.tasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                taskList.appendChild(taskElement);
            });
        }
    },
    createTaskElement(task) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        if (task.completed) taskItem.classList.add('completed');
        
        const taskHeader = document.createElement('div');
        taskHeader.className = 'task-header';
        
        const taskTitle = document.createElement('span');
        taskTitle.className = 'task-title';
        taskTitle.textContent = task.name;
        
        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Uncomplete' : 'Complete';
        completeButton.addEventListener('click', () => {
            this.handleTaskUpdate(task._id, { completed: !task.completed });
        });

        const subtaskList = document.createElement('ul');
        subtaskList.className = 'subtask-list';

        task.subtasks.forEach(subtask => {
            const subtaskItem = this.createSubtaskElement(task._id, subtask);
            subtaskList.appendChild(subtaskItem);
        });

        const addSubtaskButton = document.createElement('button');
        addSubtaskButton.className = 'add-subtask';
        addSubtaskButton.textContent = 'Add Subtask';
        addSubtaskButton.addEventListener('click', () => {
            this.addSubtask(task._id, subtaskList);
        });

        taskHeader.appendChild(taskTitle);
        taskHeader.appendChild(completeButton);
        taskItem.appendChild(taskHeader);
        taskItem.appendChild(subtaskList);
        taskItem.appendChild(addSubtaskButton);

        return taskItem;
    },
    createSubtaskElement(taskId, subtask) {
        const subtaskItem = document.createElement('li');
        subtaskItem.className = 'subtask-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'subtask-checkbox';
        checkbox.checked = subtask.completed;
        checkbox.addEventListener('change', () => {
            const updatedSubtasks = currentProject.tasks
                .find(t => t._id === taskId).subtasks
                .map(st => st._id === subtask._id ? {...st, completed: checkbox.checked} : st);
            this.handleTaskUpdate(taskId, { subtasks: updatedSubtasks });
        });
        
        const subtaskText = document.createElement('span');
        subtaskText.textContent = subtask.name;
        
        subtaskItem.appendChild(checkbox);
        subtaskItem.appendChild(subtaskText);
        
        return subtaskItem;
    },
    addSubtask(taskId, subtaskList) {
        const subtaskItem = document.createElement('li');
        subtaskItem.className = 'subtask-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'subtask-checkbox';
        
        const subtaskInput = document.createElement('input');
        subtaskInput.type = 'text';
        subtaskInput.placeholder = 'Enter subtask';
        subtaskInput.addEventListener('blur', () => {
            if (subtaskInput.value.trim() !== '') {
                const newSubtask = {
                    name: subtaskInput.value.trim(),
                    completed: false
                };
                const task = currentProject.tasks.find(t => t._id === taskId);
                const updatedSubtasks = [...task.subtasks, newSubtask];
                this.handleTaskUpdate(taskId, { subtasks: updatedSubtasks });
                subtaskList.removeChild(subtaskItem);
                subtaskList.appendChild(this.createSubtaskElement(taskId, newSubtask));
            } else {
                subtaskList.removeChild(subtaskItem);
            }
        });
        
        subtaskItem.appendChild(checkbox);
        subtaskItem.appendChild(subtaskInput);
        subtaskList.appendChild(subtaskItem);
        subtaskInput.focus();
    },
    handleTaskUpdate(taskId, updates) {
        this.updateTask(taskId, updates);
    }
};

// UI management module
const uiManager = {
    showAuth() {
        domElements.authContainer.style.display = 'block';
        domElements.appContainer.style.display = 'none';
    },
    showApp() {
        domElements.authContainer.style.display = 'none';
        domElements.appContainer.style.display = 'block';
    }
};

// Event listeners
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
        currentProject = projects.find(p => p._id === projectId) || null;
        if (currentProject) {
            taskManager.loadTasks(currentProject._id);
        } else {
            taskManager.renderTasks();
        }
    });

    domElements.taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (currentProject) {
            const taskName = domElements.taskInput.value.trim();
            if (taskName) {
                taskManager.createTask(currentProject._id, taskName);
                domElements.taskInput.value = '';
            }
        } else {
            alert('Please select a project first.');
        }
    });
}

// Initialization
function init() {
    setupEventListeners();
    auth.verifyToken();
}

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
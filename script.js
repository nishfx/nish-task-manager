document.addEventListener('DOMContentLoaded', function() {
    // DOM element references
    const authContainer = document.getElementById('authContainer');
    const appContainer = document.getElementById('appContainer');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const loginButton = document.getElementById('loginButton');
    const registerUsername = document.getElementById('registerUsername');
    const registerPassword = document.getElementById('registerPassword');
    const registerButton = document.getElementById('registerButton');
    const logoutButton = document.getElementById('logoutButton');
    const projectForm = document.getElementById('projectForm');
    const projectInput = document.getElementById('projectInput');
    const projectSelect = document.getElementById('projectSelect');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    let currentUser = null;
    let projects = [];
    let currentProject = null;
    const API_URL = 'http://localhost:5000/api';

    async function login(username, password) {
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
                showApp();
                loadProjects();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    }

    async function register(username, password) {
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
                showApp();
                loadProjects();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    }

    function logout() {
        localStorage.removeItem('token');
        currentUser = null;
        projects = [];
        currentProject = null;
        showAuth();
    }

    async function loadProjects() {
        try {
            const response = await fetch(`${API_URL}/projects`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            if (response.ok) {
                projects = await response.json();
                renderProjects();
            } else {
                throw new Error('Failed to load projects');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load projects. Please try again.');
        }
    }

    async function createProject(name) {
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
                renderProjects();
            } else {
                throw new Error('Failed to create project');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create project. Please try again.');
        }
    }

    async function loadTasks(projectId) {
        try {
            const response = await fetch(`${API_URL}/tasks/${projectId}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            if (response.ok) {
                const tasks = await response.json();
                currentProject.tasks = tasks;
                renderTasks();
            } else {
                throw new Error('Failed to load tasks');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load tasks. Please try again.');
        }
    }

    async function createTask(projectId, name) {
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
                renderTasks();
            } else {
                throw new Error('Failed to create task');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create task. Please try again.');
        }
    }

    async function updateTask(taskId, updates) {
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
                    renderTasks();
                }
            } else {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update task. Please try again.');
        }
    }

    // UI rendering functions (to be implemented)
    function renderProjects() {
        // Implementation for rendering projects
    }

    function renderTasks() {
        // Implementation for rendering tasks
    }

    // Event listeners
    loginButton.addEventListener('click', function() {
        login(loginUsername.value, loginPassword.value);
    });

    registerButton.addEventListener('click', function() {
        register(registerUsername.value, registerPassword.value);
    });

    logoutButton.addEventListener('click', logout);

    projectForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const projectName = projectInput.value.trim();
        if (projectName) {
            createProject(projectName);
            projectInput.value = '';
        }
    });

    projectSelect.addEventListener('change', function() {
        const projectId = this.value;
        currentProject = projects.find(p => p._id === projectId) || null;
        if (currentProject) {
            loadTasks(currentProject._id);
        } else {
            renderTasks();
        }
    });

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (currentProject) {
            const taskName = taskInput.value.trim();
            if (taskName) {
                createTask(currentProject._id, taskName);
                taskInput.value = '';
            }
        } else {
            alert('Please select a project first.');
        }
    });

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // Verify the token and load user data
        verifyTokenAndLoadUser(token);
    } else {
        showAuth();
    }

    async function verifyTokenAndLoadUser(token) {
        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const userData = await response.json();
                currentUser = { username: userData.username };
                showApp();
                loadProjects();
            } else {
                // Token is invalid or expired
                localStorage.removeItem('token');
                showAuth();
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            localStorage.removeItem('token');
            showAuth();
        }
    }

    function showAuth() {
        authContainer.style.display = 'block';
        appContainer.style.display = 'none';
    }

    function showApp() {
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
    }

    // Add this function to handle task updates (completion, subtasks, etc.)
    function handleTaskUpdate(taskId, updates) {
        updateTask(taskId, updates);
    }

    // Update the createTaskElement function to use the new handleTaskUpdate function
    function createTaskElement(task) {
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
        completeButton.addEventListener('click', function() {
            handleTaskUpdate(task._id, { completed: !task.completed });
        });

        const subtaskList = document.createElement('ul');
        subtaskList.className = 'subtask-list';

        task.subtasks.forEach(subtask => {
            const subtaskItem = createSubtaskElement(task._id, subtask);
            subtaskList.appendChild(subtaskItem);
        });

        const addSubtaskButton = document.createElement('button');
        addSubtaskButton.className = 'add-subtask';
        addSubtaskButton.textContent = 'Add Subtask';
        addSubtaskButton.addEventListener('click', function() {
            addSubtask(task._id, subtaskList);
        });

        taskHeader.appendChild(taskTitle);
        taskHeader.appendChild(completeButton);
        taskItem.appendChild(taskHeader);
        taskItem.appendChild(subtaskList);
        taskItem.appendChild(addSubtaskButton);

        return taskItem;
    }

    function createSubtaskElement(taskId, subtask) {
        const subtaskItem = document.createElement('li');
        subtaskItem.className = 'subtask-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'subtask-checkbox';
        checkbox.checked = subtask.completed;
        checkbox.addEventListener('change', function() {
            const updatedSubtasks = currentProject.tasks
                .find(t => t._id === taskId).subtasks
                .map(st => st._id === subtask._id ? {...st, completed: this.checked} : st);
            handleTaskUpdate(taskId, { subtasks: updatedSubtasks });
        });
        
        const subtaskText = document.createElement('span');
        subtaskText.textContent = subtask.name;
        
        subtaskItem.appendChild(checkbox);
        subtaskItem.appendChild(subtaskText);
        
        return subtaskItem;
    }

    function addSubtask(taskId, subtaskList) {
        const subtaskItem = document.createElement('li');
        subtaskItem.className = 'subtask-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'subtask-checkbox';
        
        const subtaskInput = document.createElement('input');
        subtaskInput.type = 'text';
        subtaskInput.placeholder = 'Enter subtask';
        subtaskInput.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                const newSubtask = {
                    name: this.value.trim(),
                    completed: false
                };
                const task = currentProject.tasks.find(t => t._id === taskId);
                const updatedSubtasks = [...task.subtasks, newSubtask];
                handleTaskUpdate(taskId, { subtasks: updatedSubtasks });
                subtaskList.removeChild(subtaskItem);
                subtaskList.appendChild(createSubtaskElement(taskId, newSubtask));
            } else {
                subtaskList.removeChild(subtaskItem);
            }
        });
        
        subtaskItem.appendChild(checkbox);
        subtaskItem.appendChild(subtaskInput);
        subtaskList.appendChild(subtaskItem);
        subtaskInput.focus();
    }
});
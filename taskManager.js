import { API_URL } from './config.js';
import domElements from './domElements.js';

let currentProject = null;

const taskManager = {
    async loadTasks(projectId) {
        try {
            const response = await fetch(`${API_URL}/tasks/${projectId}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            if (response.ok) {
                const tasks = await response.json();
                currentProject = { _id: projectId, tasks };
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

export default taskManager;
// tasks.js
const API_URL = 'http://h2843541.stratoserver.net:5000/api';

export async function loadTasks(projectId) {
    try {
        const response = await fetch(`${API_URL}/tasks/${projectId}`, {
            headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to load tasks');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function createTask(projectId, name) {
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
            return await response.json();
        } else {
            throw new Error('Failed to create task');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function updateTask(taskId, updates) {
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
            return await response.json();
        } else {
            throw new Error('Failed to update task');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
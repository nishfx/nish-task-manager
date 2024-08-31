// projects.js
const API_URL = 'http://h2843541.stratoserver.net:5000/api';

export async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`, {
            headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to load projects');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function createProject(name) {
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
            return await response.json();
        } else {
            throw new Error('Failed to create project');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
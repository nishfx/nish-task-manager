import { API_URL } from './config.js';
import uiManager from './uiManager.js';
import projectManager from './projectManager.js';

let currentUser = null;

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
        uiManager.showAuth();
    }
};

export default auth;
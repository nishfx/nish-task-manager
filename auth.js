// auth.js
const API_URL = 'http://h2843541.stratoserver.net:5000/api';

export async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            return { username };
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function register(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            return { username };
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function verifyToken() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const userData = await response.json();
                return { username: userData.username };
            } else {
                localStorage.removeItem('token');
                return null;
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            localStorage.removeItem('token');
            return null;
        }
    }
    return null;
}

export function logout() {
    localStorage.removeItem('token');
}
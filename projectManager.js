import { API_URL } from './config.js';
import domElements from './domElements.js';

let projects = [];

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

export default projectManager;
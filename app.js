import auth from './auth.js';
import setupEventListeners from './eventListeners.js';
import { AppProvider } from './AppContext.js';
import ErrorBoundary from './ErrorBoundary.js';
import uiManager from './uiManager.js';
import projectManager from './projectManager.js';
import taskManager from './taskManager.js';

function init() {
    setupEventListeners();
    auth.verifyToken();
}

function App() {
    return (
        <AppProvider>
            <ErrorBoundary>
                <div id="app">
                    <div id="authContainer">
                        <div id="loginForm">
                            <h2>Login</h2>
                            <input type="text" id="loginUsername" placeholder="Username" />
                            <input type="password" id="loginPassword" placeholder="Password" />
                            <button id="loginButton">Login</button>
                        </div>
                        <div id="registerForm">
                            <h2>Register</h2>
                            <input type="text" id="registerUsername" placeholder="Username" />
                            <input type="password" id="registerPassword" placeholder="Password" />
                            <button id="registerButton">Register</button>
                        </div>
                    </div>
                    <div id="appContainer" style="display: none;">
                        <button id="logoutButton">Logout</button>
                        <div id="projectManager">
                            <h2>Projects</h2>
                            <form id="projectForm">
                                <input type="text" id="projectInput" placeholder="New Project Name" />
                                <button type="submit">Add Project</button>
                            </form>
                            <select id="projectSelect">
                                <option value="">Select a project</option>
                            </select>
                        </div>
                        <div id="taskManager">
                            <h2>Tasks</h2>
                            <form id="taskForm">
                                <input type="text" id="taskInput" placeholder="New Task" />
                                <button type="submit">Add Task</button>
                            </form>
                            <ul id="taskList"></ul>
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        </AppProvider>
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    root.appendChild(App());
    init();
});

// Event Listeners
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

export default App;
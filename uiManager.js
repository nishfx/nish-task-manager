import domElements from './domElements.js';

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

export default uiManager;
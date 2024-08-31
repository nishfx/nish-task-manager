import auth from './auth.js';
import setupEventListeners from './eventListeners.js';

function init() {
    setupEventListeners();
    auth.verifyToken();
}

document.addEventListener('DOMContentLoaded', init);

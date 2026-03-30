// ===================================
// Back4App (Parse SDK) Configuration
// ===================================
// Replace these with your actual keys from Back4App Dashboard
const PARSE_APP_ID = "iqxBxiKs35uAnSncJ01eAEYCYITd8actbFROnmLB";
const PARSE_JS_KEY = "4ffdGCNMd7hdgDhotg84nOoXjx5BLf5yOo0kC0TJ";
const PARSE_FILE_KEY = "ce48625f-11cf-4f75-a61f-9a4efd3cecec";
const PARSE_MASTER_KEY = "nsAnQBMNvjcAkpRtAhobCwy55tLZL821FHA5ITdl";
const PARSE_HOST_URL = "https://parseapi.back4app.com/";

function initBackend() {
    if (typeof Parse !== 'undefined') {
        Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY, PARSE_FILE_KEY);
        Parse.serverURL = PARSE_HOST_URL;
        console.log('%c Back4App initialized ✓', 'color: #007bff; font-weight: bold;');
        
        // Prepare compatibility layer
        window.auth = {
            onAuthStateChanged: (callback) => {
                // Parse.User.current() is available immediately, 
                // we wrap it in a microtask to ensure it behaves like Firebase's async trigger
                setTimeout(() => callback(Parse.User.current()), 0);
            }
        };
        
        return true;
    } else {
        console.warn('Parse SDK not loaded yet. Add <script src="https://npmcdn.com/parse/dist/parse.min.js"></script> to your HTML files.');
        return false;
    }
}

// Compatibility alias
function initFirebase() {
    return initBackend();
}
let db = null; // Placeholder as Parse uses classes, not a single db object like Firestore

// ===================================
// Auth State Helpers
// ===================================

function getCurrentUser() {
    if (typeof Parse !== 'undefined') {
        return Parse.User.current();
    }
    return null;
}

async function getUserProfile(uid) {
    if (typeof Parse === 'undefined') return null;
    const user = Parse.User.current();
    if (!user) return null;
    
    return {
        id: user.id,
        firstName: user.get('firstName'),
        lastName: user.get('lastName'),
        email: user.get('email'),
        role: user.get('role')
    };
}

async function getUserRole(uid) {
    const user = Parse.User.current();
    return user ? user.get('role') || 'student' : 'student';
}

// ===================================
// Route Protection
// ===================================

function requireAuth(allowedRoles = []) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/pages/auth/login.html';
        return;
    }
    
    if (allowedRoles.length > 0) {
        const role = user.get('role') || 'student';
        if (!allowedRoles.includes(role)) {
            window.location.href = '/pages/auth/login.html';
        }
    }
}

function redirectIfLoggedIn() {
    const user = getCurrentUser();
    if (user) {
        const role = user.get('role') || 'student';
        redirectToDashboard(role);
    }
}

function redirectToDashboard(role) {
    const pathPrefix = window.location.pathname.includes('/auth/') ? '../' : './';
    
    switch (role) {
        case 'student':
            window.location.href = pathPrefix + 'student/dashboard.html';
            break;
        case 'tutor':
            window.location.href = pathPrefix + 'tutor/dashboard.html';
            break;
        default:
            window.location.href = pathPrefix + 'student/dashboard.html';
    }
}

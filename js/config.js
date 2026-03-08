// ===================================
// Firebase Configuration
// ===================================
// Replace these values with your actual Firebase project config
// Get them from: Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ===================================
// Firebase Initialization (using CDN modules)
// ===================================
// We use the compat (v9 compat) SDK loaded via <script> tags

let db, auth, storage;

function initFirebase() {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
        console.log('%c Firebase initialized ✓', 'color: #43A047; font-weight: bold;');
        return true;
    } else {
        console.warn('Firebase SDK not loaded yet.');
        return false;
    }
}

// ===================================
// Auth State Observer
// ===================================

function onAuthStateChanged(callback) {
    if (!auth) return;
    auth.onAuthStateChanged(callback);
}

// ===================================
// Get Current User
// ===================================

function getCurrentUser() {
    return auth ? auth.currentUser : null;
}

// ===================================
// Get User Role from Firestore
// ===================================

async function getUserRole(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            return doc.data().role;
        }
        return null;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
}

// ===================================
// Get User Profile from Firestore
// ===================================

async function getUserProfile(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
}

// ===================================
// Route Protection
// ===================================

function requireAuth(allowedRoles = []) {
    return new Promise((resolve, reject) => {
        if (!auth) {
            window.location.href = '/pages/auth/login.html';
            reject('Not initialized');
            return;
        }

        auth.onAuthStateChanged(async (user) => {
            if (!user) {
                window.location.href = '/pages/auth/login.html';
                reject('Not authenticated');
                return;
            }

            if (allowedRoles.length > 0) {
                const role = await getUserRole(user.uid);
                if (!allowedRoles.includes(role)) {
                    window.location.href = '/pages/auth/login.html';
                    reject('Unauthorized role');
                    return;
                }
            }

            resolve(user);
        });
    });
}

// ===================================
// Redirect if Already Logged In
// ===================================

function redirectIfLoggedIn() {
    if (!auth) return;

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const role = await getUserRole(user.uid);
            redirectToDashboard(role);
        }
    });
}

// ===================================
// Redirect by Role
// ===================================

function redirectToDashboard(role) {
    switch (role) {
        case 'student':
            window.location.href = '/pages/student/dashboard.html';
            break;
        case 'tutor':
            window.location.href = '/pages/tutor/dashboard.html';
            break;
        case 'admin':
            window.location.href = '/pages/admin/dashboard.html';
            break;
        default:
            window.location.href = '/';
    }
}

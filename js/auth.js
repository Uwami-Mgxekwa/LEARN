// ===================================
// Authentication Logic
// ===================================

// ===================================
// Register Student
// ===================================

async function registerStudent(firstName, lastName, email, password) {
    try {
        // Create Firebase Auth user
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Update display name
        await user.updateProfile({
            displayName: `${firstName} ${lastName}`
        });

        // Create user document in Firestore
        await db.collection('users').doc(user.uid).set({
            firstName,
            lastName,
            email,
            role: 'student',
            avatar: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            profile: {
                level: 'C1',
                goals: [],
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        });

        return { success: true, user };
    } catch (error) {
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

// ===================================
// Login User
// ===================================

async function loginUser(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Get user role for redirect
        const role = await getUserRole(user.uid);

        return { success: true, user, role };
    } catch (error) {
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

// ===================================
// Google Sign-In
// ===================================

async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        const isNewUser = result.additionalUserInfo?.isNewUser;

        if (isNewUser) {
            // Create user document for new Google sign-in users
            const nameParts = (user.displayName || '').split(' ');
            await db.collection('users').doc(user.uid).set({
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: user.email,
                role: 'student',
                avatar: user.photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                profile: {
                    level: 'C1',
                    goals: [],
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            });
        }

        const role = await getUserRole(user.uid);
        return { success: true, user, role, isNewUser };
    } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
            return { success: false, error: 'Sign-in was cancelled.' };
        }
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

// ===================================
// Submit Tutor Application
// ===================================

async function submitTutorApplication(data) {
    try {
        // First create auth user
        const userCredential = await auth.createUserWithEmailAndPassword(data.email, data.password);
        const user = userCredential.user;

        // Update display name
        await user.updateProfile({
            displayName: `${data.firstName} ${data.lastName}`
        });

        // Create user document with 'tutor' role (pending approval)
        await db.collection('users').doc(user.uid).set({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: 'tutor',
            avatar: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Create tutor application document
        await db.collection('tutors').doc(user.uid).set({
            userId: user.uid,
            status: 'pending',
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || '',
            bio: data.bio,
            qualifications: data.qualifications || [],
            specialties: data.specialties || [],
            experience: data.experience || '',
            hourlyRate: parseFloat(data.hourlyRate) || 0,
            availability: {},
            rating: 0,
            totalLessons: 0,
            totalRatings: 0,
            appliedAt: firebase.firestore.FieldValue.serverTimestamp(),
            approvedAt: null
        });

        return { success: true, user };
    } catch (error) {
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

// ===================================
// Reset Password
// ===================================

async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        return { success: true };
    } catch (error) {
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

// ===================================
// Logout
// ===================================

async function logoutUser() {
    try {
        await auth.signOut();
        window.location.href = '/';
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===================================
// Error Message Helper
// ===================================

function getAuthErrorMessage(errorCode) {
    const messages = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/operation-not-allowed': 'This sign-in method is not enabled.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/popup-blocked': 'Pop-up was blocked. Please allow pop-ups.',
        'auth/invalid-credential': 'Invalid email or password. Please try again.',
    };

    return messages[errorCode] || 'An unexpected error occurred. Please try again.';
}

// ===================================
// Authentication Logic
// ===================================

// ===================================
// Register Student
// ===================================

async function registerStudent(firstName, lastName, email, password) {
    try {
        const user = new Parse.User();
        user.set("username", email);
        user.set("password", password);
        user.set("email", email);
        user.set("firstName", firstName);
        user.set("lastName", lastName);
        user.set("role", "student");
        
        await user.signUp();
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===================================
// Login User
// ===================================

async function loginUser(email, password) {
    try {
        const user = await Parse.User.logIn(email, password);
        const role = user.get("role") || 'student';
        return { success: true, user, role };
    } catch (error) {
        // Map common Parse error codes to friendly messages if needed
        return { success: false, error: error.message };
    }
}

// ===================================
// Google Sign-In
// ===================================

async function signInWithGoogle() {
    // Note: Google Sign-in with Parse usually requires additional setup/SDKs
    return { success: false, error: 'Google Sign-In is not configured for this project yet.' };
}

// ===================================
// Submit Tutor Application
// ===================================

async function submitTutorApplication(data) {
    try {
        const user = new Parse.User();
        user.set("username", data.email);
        user.set("password", data.password);
        user.set("email", data.email);
        user.set("firstName", data.firstName);
        user.set("lastName", data.lastName);
        user.set("role", "tutor");
        
        await user.signUp();

        // Create Tutor record
        const Tutor = Parse.Object.extend("Tutor");
        const tutor = new Tutor();
        tutor.set("user", user);
        tutor.set("firstName", data.firstName);
        tutor.set("lastName", data.lastName);
        tutor.set("bio", data.bio);
        tutor.set("hourlyRate", parseFloat(data.hourlyRate));
        tutor.set("status", "pending");
        tutor.set("rating", 0);
        tutor.set("totalLessons", 0);
        
        await tutor.save();

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===================================
// Reset Password
// ===================================

async function resetPassword(email) {
    try {
        // TODO: Parse.User.requestPasswordReset(email)
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===================================
// Logout
// ===================================

async function logoutUser() {
    try {
        if (typeof Parse !== 'undefined') {
            await Parse.User.logOut();
        }
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
    return 'An error occurred. Please check your credentials.';
}

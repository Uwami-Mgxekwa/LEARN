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

        // Block tutors who haven't been approved yet
        if (role === 'tutor') {
            const Tutor = Parse.Object.extend("Tutor");
            const query = new Parse.Query(Tutor);
            query.equalTo("userId", user.id);
            const tutorRecord = await query.first().catch(() => null);
            const status = tutorRecord ? tutorRecord.get("status") : "pending";

            if (status !== "approved") {
                await Parse.User.logOut();
                if (status === "rejected") {
                    return { success: false, error: "Your application was not successful. Please contact support for more information." };
                }
                return { success: false, error: "Your application is still under review. You will be notified via email or WhatsApp/SMS once approved." };
            }
        }

        return { success: true, user, role };
    } catch (error) {
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
        user.set("approved", false); // blocked until admin approves
        
        await user.signUp();

        // Create Tutor record
        const Tutor = Parse.Object.extend("Tutor");
        const tutor = new Tutor();
        tutor.set("user", user);
        tutor.set("userId", user.id);
        tutor.set("firstName", data.firstName);
        tutor.set("lastName", data.lastName);
        tutor.set("email", data.email);
        tutor.set("phone", data.phone || '');
        tutor.set("bio", data.bio);
        tutor.set("hourlyRate", parseFloat(data.hourlyRate));
        tutor.set("status", "pending");
        tutor.set("rating", 0);
        tutor.set("totalLessons", 0);
        tutor.set("category", data.category || '');
        tutor.set("subjects", data.subjects || []);
        tutor.set("experience", data.experience || '');
        tutor.set("qualification", data.qualification || '');
        if (data.docId)    tutor.set("docId", data.docId._url || data.docId);
        if (data.docQual)  tutor.set("docQual", data.docQual._url || data.docQual);
        if (data.docCv)    tutor.set("docCv", data.docCv._url || data.docCv);
        if (data.docExtra) tutor.set("docExtra", data.docExtra._url || data.docExtra);
        
        await tutor.save();

        // Log out immediately — they cannot access the platform until approved
        await Parse.User.logOut();

        return { success: true };
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
        // Navigate to root index.html regardless of current depth
        const parts = window.location.pathname.split('/').filter(Boolean);
        const depth = parts.length > 0 && parts[parts.length - 1].includes('.') ? parts.length - 1 : parts.length;
        const prefix = depth === 0 ? './' : '../'.repeat(depth);
        window.location.href = prefix + 'index.html';
        return { success: true };
    } catch (error) {
        window.location.href = window.location.origin + '/index.html';
        return { success: false, error: error.message };
    }
}

// ===================================
// Error Message Helper
// ===================================

function getAuthErrorMessage(errorCode) {
    return 'An error occurred. Please check your credentials.';
}

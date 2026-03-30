// ===================================
// Student Dashboard — Find Tutors
// ===================================

// ---- State ----
let allTutors = [];
let filteredTutors = [];
let activeCategory = 'all';
let activeType = 'all';
let searchQuery = '';
let sortBy = 'rating';
let selectedSlot = null;
let currentTutor = null;
let currentUser = null;

// ---- DOM refs ----
const grid = document.getElementById('tutorsGrid');
const emptyState = document.getElementById('emptyState');
const resultsCount = document.getElementById('resultsCount');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const sortSelect = document.getElementById('sortSelect');
const modalOverlay = document.getElementById('modalOverlay');

// ===================================
// Init
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();

    auth.onAuthStateChanged(async (user) => {
        const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true' || sessionStorage.getItem('devUser');

        if (!user && !isPreview) {
            window.location.href = '../auth/login.html';
            return;
        }

        if (user) {
            currentUser = user;
            const profile = await getUserProfile(user.uid);
            const name = profile?.firstName || user.displayName?.split(' ')[0] || 'Student';
            document.getElementById('userName').textContent = name;
            document.getElementById('userAvatar').textContent = name.charAt(0).toUpperCase();
            loadTutors();
        } else if (isPreview) {
            // Dev/Preview mode
            const devData = JSON.parse(sessionStorage.getItem('devUser') || '{"name":"Emeka"}');
            document.getElementById('userName').textContent = devData.name;
            document.getElementById('userAvatar').textContent = devData.name.charAt(0).toUpperCase();
            loadTutors();
        }
    });

    setupEventListeners();
});

// ===================================
// Load Tutors from Firestore
// ===================================
async function loadTutors() {
    showSkeletons();

    try {
        const snapshot = await db.collection('tutors')
            .where('status', '==', 'approved')
            .get();

        allTutors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // If no tutors in DB yet, show demo data
        if (allTutors.length === 0) {
            allTutors = getDemoTutors();
        }

        applyFilters();
    } catch (err) {
        console.error('Error loading tutors:', err);
        allTutors = getDemoTutors();
        applyFilters();
    }
}

// ===================================
// Demo Tutors (shown before real data)
// ===================================
function getDemoTutors() {
    return [
        {
            id: 'demo1',
            firstName: 'Sarah', lastName: 'Johnson',
            category: 'languages',
            subjects: ['English', 'French', 'Conversation'],
            bio: 'Passionate language tutor with 8 years of experience helping students achieve fluency.',
            rating: 5.0, totalRatings: 142, totalLessons: 380,
            hourlyRate: 25,
            avatar: '../../assets/tutor1.jpg',
            availability: [
                { id: 's1', day: 'Monday', time: '09:00', type: 'private', capacity: 1, booked: 0, price: 25 },
                { id: 's2', day: 'Monday', time: '14:00', type: 'group', capacity: 6, booked: 3, price: 15 },
                { id: 's3', day: 'Wednesday', time: '10:00', type: 'private', capacity: 1, booked: 0, price: 25 },
                { id: 's4', day: 'Friday', time: '11:00', type: 'group', capacity: 8, booked: 8, price: 12 },
            ]
        },
        {
            id: 'demo2',
            firstName: 'Michael', lastName: 'Park',
            category: 'business',
            subjects: ['Business English', 'Public Speaking', 'Finance'],
            bio: 'Former corporate trainer now helping professionals master business communication.',
            rating: 4.9, totalRatings: 98, totalLessons: 210,
            hourlyRate: 35,
            avatar: '../../assets/tutor2.jpg',
            availability: [
                { id: 's5', day: 'Tuesday', time: '08:00', type: 'private', capacity: 1, booked: 0, price: 35 },
                { id: 's6', day: 'Thursday', time: '17:00', type: 'private', capacity: 1, booked: 0, price: 35 },
                { id: 's7', day: 'Saturday', time: '10:00', type: 'group', capacity: 5, booked: 2, price: 20 },
            ]
        },
        {
            id: 'demo3',
            firstName: 'Emma', lastName: 'Chen',
            category: 'academic',
            subjects: ['Maths', 'Physics', 'IELTS Prep'],
            bio: 'PhD student and tutor specialising in exam preparation and academic subjects.',
            rating: 5.0, totalRatings: 211, totalLessons: 540,
            hourlyRate: 30,
            avatar: '../../assets/tutor3.jpg',
            availability: [
                { id: 's8', day: 'Monday', time: '16:00', type: 'private', capacity: 1, booked: 0, price: 30 },
                { id: 's9', day: 'Wednesday', time: '15:00', type: 'group', capacity: 4, booked: 1, price: 18 },
                { id: 's10', day: 'Sunday', time: '09:00', type: 'private', capacity: 1, booked: 0, price: 30 },
            ]
        },
        {
            id: 'demo4',
            firstName: 'Liam', lastName: 'Torres',
            category: 'technology',
            subjects: ['Java', 'Python', 'Web Development', 'Data Science'],
            bio: 'Senior software engineer teaching coding from beginner to advanced level.',
            rating: 4.8, totalRatings: 76, totalLessons: 160,
            hourlyRate: 40,
            avatar: null,
            availability: [
                { id: 's11', day: 'Tuesday', time: '19:00', type: 'private', capacity: 1, booked: 0, price: 40 },
                { id: 's12', day: 'Thursday', time: '19:00', type: 'private', capacity: 1, booked: 0, price: 40 },
                { id: 's13', day: 'Saturday', time: '14:00', type: 'group', capacity: 6, booked: 4, price: 22 },
            ]
        },
        {
            id: 'demo5',
            firstName: 'Aisha', lastName: 'Nkosi',
            category: 'music',
            subjects: ['Guitar', 'Piano', 'Music Theory', 'Vocals'],
            bio: 'Professional musician with 10+ years of teaching experience across all skill levels.',
            rating: 4.9, totalRatings: 134, totalLessons: 290,
            hourlyRate: 28,
            avatar: null,
            availability: [
                { id: 's14', day: 'Monday', time: '11:00', type: 'private', capacity: 1, booked: 0, price: 28 },
                { id: 's15', day: 'Wednesday', time: '13:00', type: 'private', capacity: 1, booked: 0, price: 28 },
                { id: 's16', day: 'Friday', time: '15:00', type: 'group', capacity: 4, booked: 0, price: 16 },
            ]
        },
        {
            id: 'demo6',
            firstName: 'Carlos', lastName: 'Mendez',
            category: 'languages',
            subjects: ['Spanish', 'Portuguese', 'Chinese (Mandarin)'],
            bio: 'Native Spanish speaker fluent in 4 languages. Specialises in conversational learning.',
            rating: 4.7, totalRatings: 55, totalLessons: 120,
            hourlyRate: 22,
            avatar: null,
            availability: [
                { id: 's17', day: 'Tuesday', time: '10:00', type: 'private', capacity: 1, booked: 0, price: 22 },
                { id: 's18', day: 'Thursday', time: '10:00', type: 'group', capacity: 8, booked: 3, price: 12 },
                { id: 's19', day: 'Saturday', time: '09:00', type: 'private', capacity: 1, booked: 0, price: 22 },
            ]
        },
    ];
}

// ===================================
// Filter & Sort
// ===================================
function applyFilters() {
    let results = [...allTutors];

    // Category filter
    if (activeCategory !== 'all') {
        results = results.filter(t => t.category === activeCategory);
    }

    // Lesson type filter
    if (activeType !== 'all') {
        results = results.filter(t =>
            t.availability?.some(s => s.type === activeType && s.booked < s.capacity)
        );
    }

    // Search
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        results = results.filter(t =>
            `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
            t.subjects?.some(s => s.toLowerCase().includes(q)) ||
            t.bio?.toLowerCase().includes(q)
        );
    }

    // Sort
    results.sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'lessons') return (b.totalLessons || 0) - (a.totalLessons || 0);
        if (sortBy === 'name') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        return 0;
    });

    filteredTutors = results;
    renderTutors();
}

function resetFilters() {
    activeCategory = 'all';
    activeType = 'all';
    searchQuery = '';
    searchInput.value = '';
    searchClear.style.display = 'none';
    document.querySelectorAll('#categoryChips .chip').forEach(c => c.classList.toggle('active', c.dataset.value === 'all'));
    document.querySelectorAll('[data-type]').forEach(c => c.classList.toggle('active', c.dataset.type === 'all'));
    applyFilters();
}

// ===================================
// Render
// ===================================
function renderTutors() {
    grid.innerHTML = '';

    if (filteredTutors.length === 0) {
        emptyState.style.display = 'block';
        resultsCount.textContent = 'No tutors found';
        return;
    }

    emptyState.style.display = 'none';
    resultsCount.textContent = `${filteredTutors.length} tutor${filteredTutors.length !== 1 ? 's' : ''} found`;

    filteredTutors.forEach(tutor => {
        grid.appendChild(createTutorCard(tutor));
    });
}

function createTutorCard(tutor) {
    const card = document.createElement('div');
    card.className = 'tutor-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Book a lesson with ${tutor.firstName} ${tutor.lastName}`);

    const availableSlots = tutor.availability?.filter(s => s.booked < s.capacity) || [];
    const slotsText = availableSlots.length === 0
        ? '<span class="slots-none">No slots available</span>'
        : availableSlots.length <= 2
            ? `<span class="slots-limited">${availableSlots.length} slot${availableSlots.length > 1 ? 's' : ''} left</span>`
            : `<span class="slots-available">${availableSlots.length} slots available</span>`;

    const stars = '★'.repeat(Math.round(tutor.rating || 0));
    const subjects = (tutor.subjects || []).slice(0, 3).map(s =>
        `<span class="subject-tag">${s}</span>`
    ).join('');

    const imgHtml = tutor.avatar
        ? `<img src="${tutor.avatar}" alt="${tutor.firstName} ${tutor.lastName}" class="tutor-card-img" loading="lazy">`
        : `<div class="tutor-card-img-placeholder">${tutor.firstName.charAt(0)}${tutor.lastName.charAt(0)}</div>`;

    card.innerHTML = `
        ${imgHtml}
        <div class="tutor-card-body">
            <div class="tutor-card-top">
                <div class="tutor-card-name">${tutor.firstName} ${tutor.lastName}</div>
                <div class="tutor-card-rating">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    ${(tutor.rating || 0).toFixed(1)}
                </div>
            </div>
            <div class="tutor-card-specialty">${(tutor.subjects || [])[0] || 'Tutor'}</div>
            <div class="tutor-card-subjects">${subjects}</div>
            <div class="tutor-card-meta">
                <span class="tutor-card-lessons">${tutor.totalLessons || 0} lessons</span>
                ${slotsText}
            </div>
            <button class="btn btn-primary btn-sm tutor-card-book" data-id="${tutor.id}">
                ${availableSlots.length > 0 ? 'Book a Lesson' : 'View Profile'}
            </button>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (!e.target.closest('.tutor-card-book')) return;
        openBookingModal(tutor);
    });

    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') openBookingModal(tutor);
    });

    return card;
}

function showSkeletons() {
    grid.innerHTML = Array(6).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton-body">
                <div class="skeleton skeleton-line medium"></div>
                <div class="skeleton skeleton-line short"></div>
                <div class="skeleton skeleton-line medium"></div>
            </div>
        </div>
    `).join('');
    emptyState.style.display = 'none';
    resultsCount.textContent = 'Loading tutors...';
}

// ===================================
// Booking Modal
// ===================================
function openBookingModal(tutor) {
    currentTutor = tutor;
    selectedSlot = null;

    // Reset steps
    document.getElementById('modalStep1').style.display = 'block';
    document.getElementById('modalStep2').style.display = 'none';
    document.getElementById('modalStep3').style.display = 'none';

    // Tutor summary
    const avatarHtml = tutor.avatar
        ? `<img src="${tutor.avatar}" alt="${tutor.firstName}" class="modal-tutor-avatar">`
        : `<div class="modal-tutor-avatar-placeholder">${tutor.firstName.charAt(0)}${tutor.lastName.charAt(0)}</div>`;

    document.getElementById('modalTutor').innerHTML = `
        ${avatarHtml}
        <div>
            <div class="modal-tutor-name">${tutor.firstName} ${tutor.lastName}</div>
            <div class="modal-tutor-specialty">${(tutor.subjects || []).join(' · ')}</div>
        </div>
    `;

    // Slots
    const slotsGrid = document.getElementById('slotsGrid');
    const noSlots = document.getElementById('noSlots');
    const slots = tutor.availability || [];

    if (slots.length === 0) {
        slotsGrid.innerHTML = '';
        noSlots.style.display = 'block';
    } else {
        noSlots.style.display = 'none';
        slotsGrid.innerHTML = slots.map(slot => {
            const isFull = slot.booked >= slot.capacity;
            const spotsLeft = slot.capacity - slot.booked;
            const isGroup = slot.type === 'group';
            const metaText = isFull
                ? 'Full'
                : isGroup
                    ? `Group · ${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`
                    : 'Private';
            const metaClass = isFull ? 'full' : isGroup ? 'group' : '';

            return `
                <button class="slot-btn ${isFull ? 'full' : ''}" data-slot-id="${slot.id}" ${isFull ? 'disabled' : ''}>
                    <div class="slot-day">${slot.day}</div>
                    <div class="slot-time">${slot.time}</div>
                    <div class="slot-meta ${metaClass}">${metaText} · $${slot.price}</div>
                </button>
            `;
        }).join('');

        slotsGrid.querySelectorAll('.slot-btn:not(.full)').forEach(btn => {
            btn.addEventListener('click', () => {
                slotsGrid.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const slotId = btn.dataset.slotId;
                selectedSlot = slots.find(s => s.id === slotId);
                showBookingConfirm();
            });
        });
    }

    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function showBookingConfirm() {
    if (!selectedSlot || !currentTutor) return;

    document.getElementById('modalStep1').style.display = 'none';
    document.getElementById('modalStep2').style.display = 'block';

    const commission = (selectedSlot.price * 0.2).toFixed(2);
    const total = selectedSlot.price;

    document.getElementById('bookingSummary').innerHTML = `
        <div class="booking-summary-row">
            <span>Tutor</span>
            <span>${currentTutor.firstName} ${currentTutor.lastName}</span>
        </div>
        <div class="booking-summary-row">
            <span>Day &amp; Time</span>
            <span>${selectedSlot.day} at ${selectedSlot.time}</span>
        </div>
        <div class="booking-summary-row">
            <span>Lesson Type</span>
            <span>${selectedSlot.type === 'group' ? 'Group Lesson' : 'Private Lesson'}</span>
        </div>
        <div class="booking-summary-row">
            <span>Total</span>
            <span>$${total}</span>
        </div>
    `;
}

function closeModal() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    selectedSlot = null;
    currentTutor = null;
}

async function confirmBooking() {
    if (!selectedSlot || !currentTutor || !currentUser) return;

    const btn = document.getElementById('confirmBooking');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Processing...';

    try {
        const slotRef = db.collection('tutors').doc(currentTutor.id)
            .collection('slots').doc(selectedSlot.id);

        // Atomic transaction — prevents double booking
        await db.runTransaction(async (transaction) => {
            const slotDoc = await transaction.get(slotRef);

            // For demo tutors not in Firestore, skip transaction
            if (!slotDoc.exists) {
                // Create booking directly (demo mode)
                await db.collection('bookings').add({
                    studentId: currentUser.uid,
                    tutorId: currentTutor.id,
                    tutorName: `${currentTutor.firstName} ${currentTutor.lastName}`,
                    slotId: selectedSlot.id,
                    day: selectedSlot.day,
                    time: selectedSlot.time,
                    type: selectedSlot.type,
                    price: selectedSlot.price,
                    status: 'confirmed',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                return;
            }

            const data = slotDoc.data();
            if (data.booked >= data.capacity) {
                throw new Error('This slot was just booked by someone else. Please choose another time.');
            }

            // Increment booked count
            transaction.update(slotRef, {
                booked: firebase.firestore.FieldValue.increment(1)
            });

            // Create booking record
            const bookingRef = db.collection('bookings').doc();
            transaction.set(bookingRef, {
                studentId: currentUser.uid,
                tutorId: currentTutor.id,
                tutorName: `${currentTutor.firstName} ${currentTutor.lastName}`,
                slotId: selectedSlot.id,
                day: selectedSlot.day,
                time: selectedSlot.time,
                type: selectedSlot.type,
                price: selectedSlot.price,
                status: 'confirmed',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });

        // Success
        document.getElementById('modalStep2').style.display = 'none';
        document.getElementById('modalStep3').style.display = 'block';

    } catch (err) {
        const alertEl = document.getElementById('bookingAlert');
        alertEl.className = 'alert alert-error visible';
        alertEl.innerHTML = `<span>${err.message || 'Booking failed. Please try again.'}</span>`;
        btn.disabled = false;
        btn.textContent = 'Confirm & Pay';
    }
}

// ===================================
// Event Listeners
// ===================================
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.trim();
        searchClear.style.display = searchQuery ? 'flex' : 'none';
        applyFilters();
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClear.style.display = 'none';
        searchInput.focus();
        applyFilters();
    });

    // Category chips
    document.getElementById('categoryChips').addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        document.querySelectorAll('#categoryChips .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCategory = chip.dataset.value;
        applyFilters();
    });

    // Type chips
    document.querySelectorAll('[data-type]').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('[data-type]').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeType = chip.dataset.type;
            applyFilters();
        });
    });

    // Sort
    sortSelect.addEventListener('change', () => {
        sortBy = sortSelect.value;
        applyFilters();
    });

    // Modal close
    document.getElementById('modalClose').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Back to slots
    document.getElementById('backToSlots').addEventListener('click', () => {
        document.getElementById('modalStep2').style.display = 'none';
        document.getElementById('modalStep1').style.display = 'block';
        document.getElementById('bookingAlert').className = 'alert';
    });

    // Confirm booking
    document.getElementById('confirmBooking').addEventListener('click', confirmBooking);

    // Sidebar toggle (mobile)
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    document.getElementById('menuBtn').addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    });

    document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await logoutUser();
    });
}

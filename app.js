// Supabase Configuration
const SUPABASE_URL = 'https://kfkcohosbpaeuzxuohrm.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtma2NvaG9zYnBhZXV6eHVvaHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDgyODgsImV4cCI6MjA2OTc4NDI4OH0.0f5ux3Z1B2Y8acpn7ZC40HiLeW3QhZcvZkr758ySivk';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_API_KEY);

// Global State
let currentUser = null;
let selectedSchool = null;
let capturedImage = null;
let userRole = null; // 'field', 'rm', or 'zm'

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const formScreen = document.getElementById('formScreen');
const loadingOverlay = document.getElementById('loadingOverlay');
const emailInput = document.getElementById('emailInput');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const visitForm = document.getElementById('visitForm');
const successModal = document.getElementById('successModal');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    loginBtn.addEventListener('click', handleLogin);
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    logoutBtn.addEventListener('click', handleLogout);

    // Form field listeners
    document.getElementById('samplingSelect').addEventListener('change', handleSamplingChange);
    document.getElementById('spocSelect').addEventListener('change', handleSpocChange);
    document.getElementById('captureBtn').addEventListener('click', () => {
        document.getElementById('imageInput').click();
    });
    document.getElementById('imageInput').addEventListener('change', handleImageCapture);
    document.getElementById('removeImageBtn').addEventListener('click', removeImage);
    document.getElementById('newVisitBtn').addEventListener('click', resetForm);

    // Custom dropdown setup
    setupCustomDropdowns();

    // Form submission
    visitForm.addEventListener('submit', handleSubmit);

    // Validation on input
    document.getElementById('newSpocName').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    });
    document.getElementById('newSpocContact').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
}

// Searchable Dropdown
function setupSearchableDropdown(searchId, selectId) {
    const searchInput = document.getElementById(searchId);
    const selectElement = document.getElementById(selectId);

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const options = Array.from(selectElement.options);

        options.forEach(option => {
            if (option.value === '') return;
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Custom Dropdowns Setup
function setupCustomDropdowns() {
    // Keyboard detection for mobile
    setupKeyboardDetection();
    
    // School Modal Dropdown
    setupModalDropdown('school', 'schoolDropdownBtn', 'schoolModal', 'schoolSearch', 'schoolList', 'schoolSelect', handleSchoolSelection);
    
    // District Modal Dropdown (for managers)
    setupModalDropdown('district', 'districtDropdownBtn', 'districtModal', 'districtSearch', 'districtList', 'districtSelect', handleDistrictSelection);
    
    // Subject Multiselect Dropdown
    setupMultiselectDropdown();
    
    // Visit Status Dropdown
    setupStatusDropdown();
}

// Keyboard Detection for Mobile
function setupKeyboardDetection() {
    if (window.visualViewport) {
        const updateViewportHeight = () => {
            const vh = window.visualViewport.height;
            document.documentElement.style.setProperty('--viewport-height', `${vh}px`);
            
            // Add class to modal lists when keyboard is visible
            const keyboardVisible = window.innerHeight > vh + 100;
            document.querySelectorAll('.modal-list').forEach(list => {
                if (keyboardVisible) {
                    list.classList.add('keyboard-visible');
                } else {
                    list.classList.remove('keyboard-visible');
                }
            });
        };
        
        window.visualViewport.addEventListener('resize', updateViewportHeight);
        window.visualViewport.addEventListener('scroll', updateViewportHeight);
        updateViewportHeight();
    }
}

// Setup Modal Dropdown (for School and District)
function setupModalDropdown(name, btnId, modalId, searchId, listId, selectId, selectionHandler) {
    const btn = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    const searchInput = document.getElementById(searchId);
    const list = document.getElementById(listId);
    const select = document.getElementById(selectId);
    const closeBtn = document.getElementById(`close${name.charAt(0).toUpperCase() + name.slice(1)}Modal`);
    
    if (!btn || !modal) return; // Elements might not exist (e.g., district for field employees)
    
    // Open modal
    btn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 300);
    });
    
    // Close modal
    const closeModal = () => {
        modal.classList.add('hidden');
        searchInput.blur(); // Hide keyboard
    };
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    modal.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = list.querySelectorAll('.modal-list-item');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
    
    // Item selection - BOTH touch and click events for mobile
    list.addEventListener('touchend', (e) => {
        e.preventDefault();
        const item = e.target.closest('.modal-list-item');
        if (!item) return;
        
        handleItemSelection(item);
    }, { passive: false });
    
    list.addEventListener('click', (e) => {
        const item = e.target.closest('.modal-list-item');
        if (!item) return;
        
        handleItemSelection(item);
    });
    
    function handleItemSelection(item) {
        const value = item.dataset.value;
        const text = item.textContent;
        
        // Visual feedback
        item.classList.add('selected');
        
        // Update button text
        const btnText = btn.querySelector('.dropdown-text');
        btnText.textContent = text;
        btnText.classList.remove('placeholder');
        
        // Update hidden select
        select.value = value;
        
        // Trigger change event
        select.dispatchEvent(new Event('change'));
        
        // Call selection handler if provided
        if (selectionHandler) {
            selectionHandler(value, text);
        }
        
        // Close modal with slight delay for visual feedback
        setTimeout(() => {
            closeModal();
            item.classList.remove('selected');
        }, 150);
    }
}

// Handle School Selection
function handleSchoolSelection(value, text) {
    if (!value) return;
    
    selectedSchool = JSON.parse(value);
    
    // Show remaining form fields
    document.getElementById('samplingGroup').classList.remove('hidden');
    document.getElementById('discussionGroup').classList.remove('hidden');
    document.getElementById('spocGroup').classList.remove('hidden');
    document.getElementById('coVisitor1Group').classList.remove('hidden');
    document.getElementById('coVisitor2Group').classList.remove('hidden');
    document.getElementById('remarksGroup').classList.remove('hidden');
    document.getElementById('visitStatusGroup').classList.remove('hidden');
    document.getElementById('imageGroup').classList.remove('hidden');
    document.getElementById('submitGroup').classList.remove('hidden');
    
    // Populate SPOC dropdown
    populateSpocDropdown();
}

// Handle District Selection
async function handleDistrictSelection(value, text) {
    if (!value) return;
    await loadSchools(value);
}

// Setup Multiselect Dropdown (for Subjects)
function setupMultiselectDropdown() {
    const btn = document.getElementById('subjectDropdownBtn');
    const dropdown = document.getElementById('subjectDropdown');
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
    
    if (!btn || !dropdown) return;
    
    // Toggle dropdown
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
        btn.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
            btn.classList.remove('active');
        }
    });
    
    // Update button text based on selections
    const updateButtonText = () => {
        const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
        const btnText = btn.querySelector('.dropdown-text');
        
        if (checkedBoxes.length === 0) {
            btnText.textContent = 'Select Subjects...';
            btnText.classList.add('placeholder');
        } else {
            btnText.textContent = `${checkedBoxes.length} subject${checkedBoxes.length > 1 ? 's' : ''} selected`;
            btnText.classList.remove('placeholder');
        }
    };
    
    // Listen for checkbox changes
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateButtonText);
    });
}

// Setup Status Dropdown
function setupStatusDropdown() {
    const btn = document.getElementById('visitStatusDropdownBtn');
    const dropdown = document.getElementById('visitStatusDropdown');
    const options = dropdown.querySelectorAll('.status-option-compact');
    const hiddenInput = document.getElementById('visitStatusHidden');
    
    if (!btn || !dropdown) return;
    
    // Toggle dropdown
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
        btn.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
            btn.classList.remove('active');
        }
    });
    
    // Handle option selection - BOTH touch and click
    options.forEach(option => {
        // Touch event for mobile
        option.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleStatusSelection(option);
        }, { passive: false });
        
        // Click event for desktop
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            handleStatusSelection(option);
        });
    });
    
    function handleStatusSelection(option) {
        const value = option.dataset.value;
        const icon = option.querySelector('.status-icon-compact').textContent;
        const label = option.querySelector('.status-label-compact').textContent;
        const percent = option.querySelector('.status-percent-compact').textContent;
        
        // Visual feedback
        option.classList.add('selected');
        
        // Update button text
        const btnText = btn.querySelector('.dropdown-text');
        btnText.innerHTML = `${icon} ${label} <span style="opacity: 0.7; font-size: 13px;">${percent}</span>`;
        btnText.classList.remove('placeholder');
        
        // Update button color class
        btn.classList.remove('selected-green', 'selected-yellow', 'selected-orange', 'selected-red');
        btn.classList.add(`selected-${value.toLowerCase()}`);
        
        // Update hidden input
        hiddenInput.value = value;
        
        // Close dropdown with slight delay for feedback
        setTimeout(() => {
            dropdown.classList.add('hidden');
            btn.classList.remove('active');
            option.classList.remove('selected');
        }, 150);
    }
}

// Show/Hide Loading
function showLoading(message = 'Processing...') {
    loadingOverlay.querySelector('.loading-text').textContent = message;
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

// Login Handler
async function handleLogin() {
    const email = emailInput.value.trim().toLowerCase();

    if (!email) {
        showError('emailError', 'Please enter your email');
        return;
    }

    if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email');
        return;
    }

    clearError('emailError');
    setButtonLoading(loginBtn, true);
    showLoading('Verifying credentials...');

    try {
        console.log('=== Login Attempt ===');
        console.log('Email:', email);

        // Verify email in emp_record
        const { data: empData, error: empError } = await supabase
            .from('emp_record')
            .select('*')
            .eq('email', email)
            .single();

        console.log('Employee data:', empData);
        console.log('Employee error:', empError);

        if (empError || !empData) {
            showError('emailError', 'Email not authorized. Please contact admin.');
            return;
        }

        currentUser = empData;

        // Determine user role
        userRole = await determineUserRole(email);
        console.log('User role:', userRole);

        // Update UI
        document.getElementById('userName').textContent = empData.name || 'User';
        document.getElementById('userEmail').textContent = email;

        // Load form based on role
        await loadFormData();

        // Switch screens
        loginScreen.classList.remove('active');
        formScreen.classList.add('active');

    } catch (error) {
        console.error('Login error:', error);
        showError('emailError', `An error occurred: ${error.message}`);
    } finally {
        setButtonLoading(loginBtn, false);
        hideLoading();
    }
}

// Determine User Role
async function determineUserRole(email) {
    // Check if user is a reporting manager
    const { data: rmData } = await supabase
        .from('emp_record')
        .select('email')
        .eq('reporting_manager_email', email)
        .limit(1);

    if (rmData && rmData.length > 0) return 'rm';

    // Check if user is a zonal manager
    const { data: zmData } = await supabase
        .from('emp_record')
        .select('email')
        .eq('zonal_manager_email', email)
        .limit(1);

    if (zmData && zmData.length > 0) return 'zm';

    return 'field';
}

// Load Form Data
async function loadFormData() {
    showLoading('Loading data...');

    try {
        if (userRole === 'field') {
            // Field employee - load schools directly
            await loadSchools();
        } else {
            // Manager - show district dropdown first
            document.getElementById('districtGroup').classList.remove('hidden');
            await loadDistricts();
        }

        // Load co-visitors
        await loadCoVisitors();

    } catch (error) {
        console.error('Error loading form data:', error);
        alert(`Error loading data: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Load Districts (for managers)
async function loadDistricts() {
    try {
        console.log('=== Loading Districts ===');
        // Get all employees under this manager
        const { data: employees, error: empError } = await supabase
            .from('emp_record')
            .select('email')
            .or(`reporting_manager_email.eq.${currentUser.email},zonal_manager_email.eq.${currentUser.email}`);

        console.log('Employees:', employees);
        console.log('Employee error:', empError);

        if (empError) throw empError;

        if (!employees || employees.length === 0) {
            alert('No employees found under your management.');
            return;
        }

        const employeeEmails = employees.map(e => e.email);
        console.log('Employee emails:', employeeEmails);

        // Get unique districts for these employees
        const { data: schools, error: schoolError } = await supabase
            .from('lvt_universe_data_school_selector')
            .select('district')
            .in('employee_email', employeeEmails);

        console.log('Schools for districts:', schools);
        console.log('School error:', schoolError);

        if (schoolError) throw schoolError;

        if (!schools) return;

        const uniqueDistricts = [...new Set(schools.map(s => s.district).filter(d => d))];
        uniqueDistricts.sort();

        console.log('Unique districts:', uniqueDistricts);

        // Populate hidden select (for form submission)
        const districtSelect = document.getElementById('districtSelect');
        districtSelect.innerHTML = '<option value="">Select District</option>';
        
        uniqueDistricts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });

        // Populate modal list
        const districtList = document.getElementById('districtList');
        if (districtList) {
            districtList.innerHTML = '';
            uniqueDistricts.forEach(district => {
                const item = document.createElement('button');
                item.className = 'modal-list-item';
                item.type = 'button';
                item.dataset.value = district;
                item.textContent = district;
                districtList.appendChild(item);
            });
        }

    } catch (error) {
        console.error('Error loading districts:', error);
        alert(`Error loading districts: ${error.message}`);
    }
}

// Load Schools
async function loadSchools(district = null) {
    showLoading('Loading schools...');

    try {
        console.log('=== Loading Schools ===');
        console.log('User Role:', userRole);
        console.log('Current User Email:', currentUser.email);
        console.log('District:', district);

        let query = supabase
            .from('lvt_universe_data_school_selector')
            .select('*');

        if (userRole === 'field') {
            console.log('Field employee - filtering by employee_email');
            query = query.eq('employee_email', currentUser.email);
        } else {
            console.log('Manager - getting team employees first');
            // Get employees under this manager
            const { data: employees, error: empError } = await supabase
                .from('emp_record')
                .select('email')
                .or(`reporting_manager_email.eq.${currentUser.email},zonal_manager_email.eq.${currentUser.email}`);

            if (empError) {
                console.error('Error fetching employees:', empError);
                throw empError;
            }

            console.log('Employees found:', employees);

            if (!employees || employees.length === 0) {
                console.warn('No employees found under this manager');
                alert('No employees found under your management.');
                hideLoading();
                return;
            }

            const employeeEmails = employees.map(e => e.email);
            console.log('Employee emails:', employeeEmails);

            query = query.in('employee_email', employeeEmails);

            if (district) {
                console.log('Filtering by district:', district);
                query = query.eq('district', district);
            }
        }

        console.log('Executing query...');
        const { data: schools, error } = await query;

        if (error) {
            console.error('Query error:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            throw error;
        }

        console.log('Schools found:', schools ? schools.length : 0);
        console.log('Schools data:', schools);

        // Populate hidden select (for form submission)
        const schoolSelect = document.getElementById('schoolSelect');
        schoolSelect.innerHTML = '<option value="">Select School</option>';

        if (schools && schools.length > 0) {
            schools.sort((a, b) => (a.school_name || '').localeCompare(b.school_name || ''));

            schools.forEach(school => {
                const option = document.createElement('option');
                option.value = JSON.stringify(school);
                option.textContent = school.school_name;
                schoolSelect.appendChild(option);
            });
            
            // Populate modal list
            const schoolList = document.getElementById('schoolList');
            if (schoolList) {
                schoolList.innerHTML = '';
                schools.forEach(school => {
                    const item = document.createElement('button');
                    item.className = 'modal-list-item';
                    item.type = 'button';
                    item.dataset.value = JSON.stringify(school);
                    item.textContent = school.school_name;
                    schoolList.appendChild(item);
                });
            }
            
            console.log('School dropdown populated successfully');
        } else {
            console.warn('No schools to display');
            alert('No schools found for your account. Please contact admin.');
        }

    } catch (error) {
        console.error('Error loading schools:', error);
        console.error('Error stack:', error.stack);
        alert(`Error loading schools: ${error.message}. Please check console for details.`);
    } finally {
        hideLoading();
    }
}

// Populate SPOC Dropdown
function populateSpocDropdown() {
    const spocSelect = document.getElementById('spocSelect');
    spocSelect.innerHTML = '<option value="">Select SPOC</option>';

    // Add existing SPOCs
    for (let i = 1; i <= 4; i++) {
        const name = selectedSchool[`spoc${i}_name`];
        const designation = selectedSchool[`spoc${i}_designation`];

        if (name && designation) {
            const option = document.createElement('option');
            option.value = JSON.stringify({
                name: name,
                designation: designation,
                phone: selectedSchool[`spoc${i}_phone_number`] || '',
                email: selectedSchool[`spoc${i}_email`] || ''
            });
            option.textContent = `${name} (${designation})`;
            spocSelect.appendChild(option);
        }
    }

    // Add "Add New SPOC" option
    const newOption = document.createElement('option');
    newOption.value = 'new';
    newOption.textContent = 'Add New SPOC';
    spocSelect.appendChild(newOption);
}

// Handle Sampling Change
function handleSamplingChange(e) {
    const value = e.target.value;
    const subjectGroup = document.getElementById('subjectGroup');

    if (value === 'Yes, Subject Identified') {
        subjectGroup.classList.remove('hidden');
    } else {
        subjectGroup.classList.add('hidden');
        // Uncheck all subjects
        document.querySelectorAll('input[name="subject"]').forEach(cb => cb.checked = false);
    }
}

// Handle SPOC Change
function handleSpocChange(e) {
    const value = e.target.value;
    const newSpocSection = document.getElementById('newSpocSection');

    if (value === 'new') {
        newSpocSection.classList.remove('hidden');
    } else {
        newSpocSection.classList.add('hidden');
        // Clear new SPOC fields
        document.getElementById('newSpocDesignation').value = '';
        document.getElementById('newSpocName').value = '';
        document.getElementById('newSpocContact').value = '';
        document.getElementById('newSpocEmail').value = '';
    }
}

// Load Co-Visitors
async function loadCoVisitors() {
    try {
        // Get user's zonal manager
        const zmEmail = currentUser.zonal_manager_email;

        if (!zmEmail) return;

        // Get all employees under the same ZM
        const { data: employees } = await supabase
            .from('emp_record')
            .select('email, name')
            .eq('zonal_manager_email', zmEmail);

        if (!employees) return;

        // Add saksham.agarwal@pw.live
        const coVisitors = [...employees];
        const sakshamExists = coVisitors.some(e => e.email === 'saksham.agarwal@pw.live');
        if (!sakshamExists) {
            coVisitors.push({ email: 'saksham.agarwal@pw.live', name: 'Saksham Agarwal' });
        }

        // Sort by name
        coVisitors.sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));

        // Populate both co-visitor dropdowns
        const coVisitor1Select = document.getElementById('coVisitor1Select');
        const coVisitor2Select = document.getElementById('coVisitor2Select');

        [coVisitor1Select, coVisitor2Select].forEach(select => {
            select.innerHTML = '<option value="">Select Co-Visitor</option>';
            coVisitors.forEach(visitor => {
                const option = document.createElement('option');
                option.value = visitor.email;
                option.textContent = `${visitor.name || visitor.email} (${visitor.email})`;
                select.appendChild(option);
            });
        });

    } catch (error) {
        console.error('Error loading co-visitors:', error);
    }
}

// Handle Image Capture
async function handleImageCapture(e) {
    const file = e.target.files[0];
    if (!file) return;

    showLoading('Processing image...');

    try {
        // Compress image
        const compressedBlob = await compressImage(file, 100); // 100KB max
        capturedImage = compressedBlob;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').classList.remove('hidden');
            document.getElementById('captureBtn').style.display = 'none';
        };
        reader.readAsDataURL(compressedBlob);

    } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image. Please try again.');
    } finally {
        hideLoading();
    }
}

// Compress Image
function compressImage(file, maxSizeKB) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                const maxDimension = 1200;
                if (width > height && width > maxDimension) {
                    height = (height * maxDimension) / width;
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = (width * maxDimension) / height;
                    height = maxDimension;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress with quality adjustment
                let quality = 0.7;
                const compress = () => {
                    canvas.toBlob((blob) => {
                        if (blob.size <= maxSizeKB * 1024 || quality <= 0.1) {
                            resolve(blob);
                        } else {
                            quality -= 0.1;
                            compress();
                        }
                    }, 'image/jpeg', quality);
                };

                compress();
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

// Remove Image
function removeImage() {
    capturedImage = null;
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('previewImg').src = '';
    document.getElementById('captureBtn').style.display = '';
    document.getElementById('imageInput').value = '';
}

// Form Validation
function validateForm() {
    let isValid = true;

    // Clear all errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.input-field').forEach(el => el.classList.remove('error'));

    // School selection
    if (!selectedSchool) {
        showError('schoolError', 'Please select a school');
        isValid = false;
    }

    // Sampling needed
    const sampling = document.getElementById('samplingSelect').value;
    if (!sampling) {
        showError('samplingError', 'Please select an option');
        isValid = false;
    }

    // Subjects (if applicable)
    if (sampling === 'Yes, Subject Identified') {
        const subjects = document.querySelectorAll('input[name="subject"]:checked');
        if (subjects.length === 0) {
            showError('subjectError', 'Please select at least one subject');
            isValid = false;
        }
    }

    // Discussion stage
    const discussion = document.getElementById('discussionSelect').value;
    if (!discussion) {
        showError('discussionError', 'Please select a discussion stage');
        isValid = false;
    }

    // SPOC
    const spoc = document.getElementById('spocSelect').value;
    if (!spoc) {
        showError('spocError', 'Please select a SPOC');
        isValid = false;
    }

    // New SPOC validation
    if (spoc === 'new') {
        const designation = document.getElementById('newSpocDesignation').value;
        const name = document.getElementById('newSpocName').value.trim();
        const contact = document.getElementById('newSpocContact').value.trim();
        const email = document.getElementById('newSpocEmail').value.trim();

        if (!designation) {
            showError('newSpocDesignationError', 'Please select a designation');
            isValid = false;
        }

        if (!name) {
            showError('newSpocNameError', 'Please enter a name');
            isValid = false;
        }

        if (!contact || contact.length < 9 || contact.length > 11) {
            showError('newSpocContactError', 'Contact must be 9-11 digits');
            isValid = false;
        }

        if (email && !isValidEmail(email)) {
            showError('newSpocEmailError', 'Please enter a valid email');
            isValid = false;
        }
    }

    // Visit status
    const visitStatus = document.getElementById('visitStatusHidden').value;
    if (!visitStatus) {
        showError('visitStatusError', 'Please select a visit status');
        isValid = false;
    }

    // Image
    if (!capturedImage) {
        showError('imageError', 'Please capture an image');
        isValid = false;
    }

    return isValid;
}

// Handle Form Submission
async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        // Scroll to first error
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    setButtonLoading(document.getElementById('submitBtn'), true);
    showLoading('Submitting visit...');

    try {
        // Get geolocation
        const location = await getCurrentLocation();

        // Upload image
        const imageUrl = await uploadImage();

        // Generate submission ID
        const submissionId = await generateSubmissionId();

        // Prepare submission data
        const submissionData = await prepareSubmissionData(submissionId, location, imageUrl);

        // Insert into database
        const { error: insertError } = await supabase
            .from('live_visit_tracker_form_responses')
            .insert([submissionData]);

        if (insertError) throw insertError;

        // Update SPOC if new
        const spocValue = document.getElementById('spocSelect').value;
        if (spocValue === 'new') {
            await updateSchoolSpoc();
        }

        // Show success modal
        document.getElementById('submissionIdText').textContent = submissionId;
        successModal.classList.remove('hidden');

    } catch (error) {
        console.error('Submission error:', error);
        alert(`Error submitting visit: ${error.message}`);
    } finally {
        setButtonLoading(document.getElementById('submitBtn'), false);
        hideLoading();
    }
}

// Get Current Location
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                console.error('Geolocation error:', error);
                // Resolve with null if location fails (optional field)
                resolve({ latitude: null, longitude: null });
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}

// Upload Image
async function uploadImage() {
    try {
        const timestamp = Date.now();
        const fileName = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${timestamp}.jpg`;

        const { data, error } = await supabase.storage
            .from('LVT Images')
            .upload(fileName, capturedImage, {
                contentType: 'image/jpeg',
                cacheControl: '3600'
            });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('LVT Images')
            .getPublicUrl(fileName);

        return urlData.publicUrl;

    } catch (error) {
        console.error('Image upload error:', error);
        throw error;
    }
}

// Generate Submission ID
async function generateSubmissionId() {
    try {
        const { data, error } = await supabase
            .from('live_visit_tracker_form_responses')
            .select('submission_id')
            .order('submission_id', { ascending: false })
            .limit(1);

        if (error) throw error;

        let nextNumber = 1;
        if (data && data.length > 0) {
            const lastId = data[0].submission_id;
            const match = lastId.match(/K8LVT(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        return `K8LVT${String(nextNumber).padStart(7, '0')}`;

    } catch (error) {
        console.error('Error generating submission ID:', error);
        return `K8LVT${String(Date.now()).slice(-7)}`;
    }
}

// Prepare Submission Data
async function prepareSubmissionData(submissionId, location, imageUrl) {
    const sampling = document.getElementById('samplingSelect').value;
    const discussion = document.getElementById('discussionSelect').value;
    const spocValue = document.getElementById('spocSelect').value;
    const coVisitor1 = document.getElementById('coVisitor1Select').value || null;
    const coVisitor2 = document.getElementById('coVisitor2Select').value || null;
    const remarks = document.getElementById('remarksInput').value.trim() || null;
    const visitStatus = document.getElementById('visitStatusHidden').value;

    // Get subjects
    let subjects = null;
    if (sampling === 'Yes, Subject Identified') {
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="subject"]:checked'))
            .map(cb => cb.value);
        subjects = selectedSubjects.join(', ');
    }

    // Get SPOC details
    let spocData;
    if (spocValue === 'new') {
        spocData = {
            name: document.getElementById('newSpocName').value.trim(),
            designation: document.getElementById('newSpocDesignation').value,
            phone: document.getElementById('newSpocContact').value.trim(),
            email: document.getElementById('newSpocEmail').value.trim() || null
        };
    } else {
        spocData = JSON.parse(spocValue);
    }

    return {
        submission_id: submissionId,
        longitude: location.longitude,
        latitude: location.latitude,
        employee_email_id: currentUser.email,
        rm_email_id: currentUser.reporting_manager_email || null,
        zm_email_id: currentUser.zonal_manager_email || null,
        state: selectedSchool.state || null,
        district: selectedSchool.district || null,
        school_name: selectedSchool.school_name,
        meeting_outcome: discussion,
        spoc_designation: spocData.designation,
        spoc_name: spocData.name,
        spoc_phone: spocData.phone,
        spoc_email: spocData.email,
        co_visitor_1: coVisitor1,
        co_visitor_2: coVisitor2,
        remarks: remarks,
        image_link: imageUrl,
        sampling_needed_in_this_school: sampling,
        subject: subjects,
        visit_status: visitStatus,
        created_at: new Date().toISOString()
    };

}

// Update School SPOC
async function updateSchoolSpoc() {
    try {
        const newSpoc = {
            name: document.getElementById('newSpocName').value.trim(),
            designation: document.getElementById('newSpocDesignation').value,
            phone: document.getElementById('newSpocContact').value.trim(),
            email: document.getElementById('newSpocEmail').value.trim() || null
        };

        // Find first available SPOC slot
        let spocSlot = null;
        for (let i = 1; i <= 4; i++) {
            if (!selectedSchool[`spoc${i}_name`]) {
                spocSlot = i;
                break;
            }
        }

        if (!spocSlot) return; // All slots filled

        // Update the school record
        const updateData = {
            [`spoc${spocSlot}_name`]: newSpoc.name,
            [`spoc${spocSlot}_designation`]: newSpoc.designation,
            [`spoc${spocSlot}_phone_number`]: newSpoc.phone,
            [`spoc${spocSlot}_email`]: newSpoc.email
        };

        const { error } = await supabase
            .from('lvt_universe_data_school_selector')
            .update(updateData)
            .eq('school_name', selectedSchool.school_name)
            .eq('district', selectedSchool.district);

        if (error) throw error;

    } catch (error) {
        console.error('Error updating SPOC:', error);
    }
}

// Reset Form
function resetForm() {
    successModal.classList.add('hidden');
    visitForm.reset();
    selectedSchool = null;
    capturedImage = null;

    // Hide conditional fields
    document.getElementById('subjectGroup').classList.add('hidden');
    document.getElementById('newSpocSection').classList.add('hidden');
    document.getElementById('samplingGroup').classList.add('hidden');
    document.getElementById('discussionGroup').classList.add('hidden');
    document.getElementById('spocGroup').classList.add('hidden');
    document.getElementById('coVisitor1Group').classList.add('hidden');
    document.getElementById('coVisitor2Group').classList.add('hidden');
    document.getElementById('remarksGroup').classList.add('hidden');
    document.getElementById('visitStatusGroup').classList.add('hidden');
    document.getElementById('imageGroup').classList.add('hidden');
    document.getElementById('submitGroup').classList.add('hidden');

    // Reset image
    removeImage();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        selectedSchool = null;
        capturedImage = null;
        userRole = null;

        visitForm.reset();
        emailInput.value = '';

        formScreen.classList.remove('active');
        loginScreen.classList.add('active');

        // Hide district group
        document.getElementById('districtGroup').classList.add('hidden');
    }
}

// Utility Functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        const inputElement = errorElement.previousElementSibling;
        if (inputElement && inputElement.classList.contains('input-field')) {
            inputElement.classList.add('error');
        }
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        const inputElement = errorElement.previousElementSibling;
        if (inputElement && inputElement.classList.contains('input-field')) {
            inputElement.classList.remove('error');
        }
    }
}

function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
        button.querySelector('.btn-loader').classList.remove('hidden');
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        button.querySelector('.btn-loader').classList.add('hidden');
    }
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';
import { getFirestore, setDoc, doc, collection, getDocs} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";  // Correct Storage import


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyADxi3zu6KuQE_o6VzaCZ5TUzSZ6efyQnU",
    authDomain: "memorylane-69159.firebaseapp.com",
    projectId: "memorylane-69159",
    storageBucket: "memorylane-69159.appspot.com",
    messagingSenderId: "993836375281",
    appId: "1:993836375281:web:b27fc58d0f3b7a67c21d50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

// Function to show messages (notifications)
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Fetch doctors from Firestore and populate the dropdown
async function fetchDoctors() {
    const doctorDropdown = document.getElementById('doctor-selection');
    doctorDropdown.innerHTML = ''; // Clear existing options

    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            // Check if the user's role is 'doctor'
            if (userData.role === 'doctor') {
                const option = document.createElement('option');
                option.value = doc.id; // Use doctor ID as the value
                option.textContent = userData.fullName; // Display doctor's name
                doctorDropdown.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching doctors: ", error);
    }
}

// // Handle form submission for file upload and OCR
// const uploadForm = document.getElementById('uploadForm');
// if (uploadForm) {
//     uploadForm.addEventListener('submit', async (event) => {
//         event.preventDefault();  // Prevent default form submission

//         const file = document.getElementById('fileInput').files[0];
//         if (!file) {
//             showMessage('Please select a file to upload.', 'ocrResult');
//             return;
//         }

//         // Upload the file to Firebase Storage
//         const storageRef = ref(storage, `uploads/${file.name}`);
//         const uploadTask = uploadBytesResumable(storageRef, file);

//         // Show upload progress
//         uploadTask.on('state_changed',
//             (snapshot) => {
//                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                 console.log('Upload is ' + progress + '% done');
//             },
//             (error) => {
//                 console.error('File upload failed:', error);
//                 showMessage('File upload failed.', 'ocrResult');
//             },
//             async () => {
//                 // Get the download URL of the uploaded file
//                 const downloadURL = await getDownloadURL(storageRef);
//                 console.log('File available at', downloadURL);

//                 // Process the file for OCR if it's an image
//                 if (file.type.includes('image')) {
//                     processImageOCR(downloadURL);
//                 } else if (file.type.includes('pdf')) {
//                     processPdfOCR(downloadURL); // Placeholder for PDF OCR logic
//                 } else {
//                     showMessage('Invalid file type. Please upload an image or PDF.', 'ocrResult');
//                 }
//             }
//         );
//     });
// }





// Sign Up functionality
const signup = document.getElementById('submitSignUp');
if (signup) {
    signup.addEventListener("click", async (event) => {
        event.preventDefault();
        const name = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('signup-role').value;
        const selectedDoctorId = document.getElementById('doctor-selection').value; // Get selected doctor ID

        if (role === "") {
            showMessage("Please select a role", "signUpMessage");
            return; // Prevent further execution if no role is selected
        }

        const userData = {
            email: email,
            fullName: name,
            role: role, // Save the role
        };

        if (role === 'patient' && selectedDoctorId) {
            userData.selectedDoctorId = selectedDoctorId; // Add selected doctor ID for patients
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            showMessage('Account Created Successfully', 'signUpMessage');

            // Save user data in Firestore
            const docRef = doc(db, 'users', user.uid);
            await setDoc(docRef, userData);
            
            // Redirect based on the selected role
            if (role === 'patient') {
                window.location.href = 'patient-dashboard.html';
            } else if (role === 'caretaker') {
                window.location.href = 'caretaker-dashboard.html';
            } else if (role === 'doctor') {
                window.location.href = 'doctor-dashboard.html';
            }
        } catch (error) {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Already Exists', 'signUpMessage');
            } else {
                showMessage('Unable to create user', 'signUpMessage');
            }
        }
    });
}

// Show/hide doctor dropdown based on selected role
document.addEventListener('DOMContentLoaded', function () {
    const signupRole = document.getElementById('signup-role');
    const doctorDropdownContainer = document.getElementById('doctor-dropdown-container');
    
    if (signupRole && doctorDropdownContainer) {
        signupRole.addEventListener('change', function () {
            const role = this.value;

            if (role === 'patient') {
                doctorDropdownContainer.classList.remove('hidden'); // Show the dropdown
                fetchDoctors();  // Call function to populate dropdown with doctors
            } else {
                doctorDropdownContainer.classList.add('hidden'); // Hide the dropdown if not patient
            }
        });
    }
});

// Sign In functionality
const signIn = document.getElementById('loginsubmit');
if (signIn) {
    signIn.addEventListener('click', (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const role = document.getElementById('login-role').value;

        if (role === "") {
            showMessage("Please select a role", "signInMessage");
            return; // Prevent further execution if no role is selected
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                showMessage('Login is successful', 'signInMessage');
                localStorage.setItem('loggedInUserId', user.uid);

                // Redirect based on the selected role
                if (role === 'patient') {
                    window.location.href = 'patient-dashboard.html';
                } else if (role === 'caretaker') {
                    window.location.href = 'caretaker-dashboard.html';
                } else if (role === 'doctor') {
                    window.location.href = 'doctor-dashboard.html';
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/invalid-credential') {
                    showMessage('Incorrect Email or Password', 'signInMessage');
                } else {
                    showMessage('Account does not exist', 'signInMessage');
                }
            });
})}

// Check if user is logged in when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const userAuthSection = document.getElementById('user-auth-section');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            userAuthSection.innerHTML = `
                <button class="btn-accent w-[120px] h-[50px] lg:p-0 p-2 rounded-lg text-white hover:text-black" id="logout-btn">
                    Logout
                </button>
            `;

            // Add logout functionality
            const logoutBtn = document.getElementById('logout-btn');
            logoutBtn.addEventListener('click', () => {
                signOut(auth).then(() => {
                    localStorage.removeItem('loggedInUserId');
                    window.location.href = 'index.html';  // Redirect to home page after logout
                }).catch((error) => {
                    console.error('Logout failed:', error);
                });
            });
        } else {
            // No user is signed in, show "Sign In" button
            userAuthSection.innerHTML = `
                <button class="btn-accent w-[120px] h-[50px] lg:p-0 p-2 rounded-lg">
                    <a href="./sign-in.html" class="text-white hover:text-black" id="auth-btn">Sign In</a>
                </button>
            `;
        }
    });
});


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js'
import {getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"

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

// Function to show messages (notifications)
function showMessage(message, divId){
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    }, 5000);
}

// Sign Up functionality
const signup = document.getElementById('submitSignUp');
if (signup) {
    signup.addEventListener("click", (event) => {
       event.preventDefault();
        const name = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const auth = getAuth();
        const db = getFirestore();

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email : email,
                fullName : name,
            };
            showMessage('Account Created Successfully', 'signUpMessage');
            
            // Save user data in Firestore
            const docRef = doc(db, 'users', user.uid);
            setDoc(docRef, userData)
            .then(() => {
                window.location.href = "index.html";  // Redirect to index page after sign-up
            })
            .catch((error) => {
                console.error("Error writing document", error);
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            if(errorCode == 'auth/email-already-in-use'){
                showMessage('Email Already Exists', 'signUpMessage');
            }
            else{
                showMessage('Unable to create user', 'signUpMessage');
            }
        });
    });
}

// Sign In functionality
const signIn = document.getElementById('loginsubmit');
if (signIn) {
    signIn.addEventListener('click', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'index.html';  // Redirect to index page after login
        })
        .catch((error) => {
            const errorCode = error.code;
            if(errorCode === 'auth/invalid-credential'){
                showMessage('Incorrect Email or Password', 'signInMessage');
            }
            else{
               showMessage('Account does not exist', 'signInMessage');
            }
        });
    });
}

// Check if user is logged in when the page loads
const auth = getAuth();
const userAuthSection = document.getElementById('user-auth-section');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, change "Sign In" to "Logout"
        userAuthSection.innerHTML = `
            <button class="btn-accent w-[120px] h-[50px] lg:p-0 p-2 rounded-lg" id="logout-btn">
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
                <a href="./sign-up.html" class="text-white hover:text-black" id="auth-btn">Sign In</a>
            </button>
        `;
    }
});

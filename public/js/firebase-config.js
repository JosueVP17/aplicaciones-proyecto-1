import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js"
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBedLslZ8C6p252DZIoVP7KsZMgjPGWNJs",
        authDomain: "proyecto-1-1d365.firebaseapp.com",
        projectId: "proyecto-1-1d365",
        storageBucket: "proyecto-1-1d365.firebasestorage.app",
        messagingSenderId: "915507907393",
        appId: "1:915507907393:web:666690d71a5d0ecff9efc0"
    }

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export {auth, db}
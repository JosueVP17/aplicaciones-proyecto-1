import {auth} from "./firebase-config.js"
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js"

export const logIn = async(email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const register = async(email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
}

export const logOut = async() => {
    return signOut(auth)
}
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js"

export const logOut = async () => {
    return signOut(auth)
}

onAuthStateChanged(auth, (user) => {
    if(!user) {
        window.location.href = 'index.html'
    }
})
import {logIn} from "./auth.js"

const loginForm = document.getElementById('loginForm')

if(loginForm) {
    loginForm.addEventListener('submit', async(event) => {
        event.preventDefault()

        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        try {
            await logIn(email, password)

            window.location.href = '../dashboard.html'
        } catch(error) {
            alert(error)
        }
    })
}
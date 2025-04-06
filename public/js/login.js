import {logIn} from "./auth.js"
import { addProduct } from "./products.js"

const loginForm = document.getElementById('loginForm')

if(loginForm) {
    loginForm.addEventListener('submit', async(event) => {
        event.preventDefault()

        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        try {
            await logIn(email, password)

            window.location.href = '../dashboard.html'
            addProduct("Zapato Deportivo", "12345", "Calzado", 50.99, 100, "par", "2026-12-31", 10)
        } catch(error) {
            alert(error)
        }
    })
}
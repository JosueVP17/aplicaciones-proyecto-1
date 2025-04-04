import { products } from "./products.js"
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js"
import { getProducts, addProduct, updateProduct, deleteProduct } from "./products.js"

const addProduct = document.getElementById('addProduct')

addProduct.addEventListener('submit', async(event) => {
    await addProduct()
})
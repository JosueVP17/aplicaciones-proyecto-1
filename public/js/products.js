import {db} from "./firebase-config.js"
import {collection, addDoc, getDocs, updateDoc, deleteDoc, doc} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js"

const productsCollection = collection(db, 'products')

export const addProduct = async(name, id, category, price, quantity, unit, expiry_date, threshold_value) => {
    await addDoc(name, id, category, price, quantity, unit, expiry_date, threshold_value)
}

export const updateProduct = async(name, id, category, price, quantity, unit, expiry_date, threshold_value) => {
    await updateDoc(name, id, category, price, quantity, unit, expiry_date, threshold_value)
}

export const deleteProduct = async(id) => {
    const product = doc(db, 'products', id)
    await deleteDoc(product)
}

export const getProducts = async() => {
    const products = await getDocs(productsCollection)
    return products.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }))
}
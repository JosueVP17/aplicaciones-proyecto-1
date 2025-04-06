import {db} from "./firebase-config.js"
import {collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js"

const productsCollection = collection(db, 'products')

export const addProduct = async(name, id, category, price, quantity, unit, expiry_date, threshold_value) => {
    //await addDoc(name, id, category, price, quantity, unit, expiry_date, threshold_value)

    // Consultar si ya existe un producto con el mismo id
    const existingProductQuery = query(productsCollection, where("id", "==", id))
    const querySnapshot = await getDocs(existingProductQuery)

    if (!querySnapshot.empty) {
        console.log("El producto ya existe")
        return
    }

    try {

        const newProduct = {
            name: name,
            id: id,
            category: category,
            price: price,
            quantity: quantity,
            unit: unit,
            expiry_date: expiry_date,
            threshold_value: threshold_value
        }
        
        const newDoc = await addDoc(productsCollection, newProduct)
        console.log('Producto agregado: ', newDoc)
    
    } catch (error) {
        console.error('Error al agregar el producto => ', error)
    }
}

export const updateProduct = async(name, id, category, price, quantity, unit, expiry_date, threshold_value) => {
    //await updateDoc(name, id, category, price, quantity, unit, expiry_date, threshold_value)

    const queryProduct = query(productsCollection, where('id', '==', id)) //hace una consulta
    const docsRef = await getDocs(queryProduct) //regresa los documentos que encontro
    const productRef = docsRef.docs[0].ref // hace referencia al primer documento


    try {

        await updateDoc(productRef, {
            
            name: name,
            id: id,
            category: category,
            price: price,
            quantity: quantity,
            unit: unit,
            expiry_date: expiry_date,
            threshold_value: threshold_value
        
        })

        console.log(`Producto con id: ${id} actualizado correctamente.`)
    
    } catch (error) {
        console.error('Error al actualizar el producto => ', error)
    }
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

//ZONA DE PRUEBAS

//addProduct('Camisa', '1', 'Ropa', 150, 34, 'm/s', "20/10/2028", 10)
updateProduct('Camisa de vestir', '1', 'Ropa', 340, 12, 'm/s', '20/10/2028', 10)
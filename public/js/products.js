import {db} from "./firebase-config.js"
import {collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js"

const productsCollection = collection(db, 'products')

export const addProduct = async(name, id, category, price, quantity, unit, expiry_date, threshold_value) => {
    //await addDoc(name, id, category, price, quantity, unit, expiry_date, threshold_value)

    try {

        // Consultar si ya existe un producto con el mismo id
        const existingProductQuery = query(productsCollection, where("id", "==", id)) //hace una consulta
        const docsRef = await getDocs(existingProductQuery) //regresa los documentos que encontro

        if (!docsRef.empty) {
            console.log("El producto ya existe")
            return
        }

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

    try {

        const existingProductQuery = query(productsCollection, where('id', '==', id)) //hace una consulta
        const docsRef = await getDocs(existingProductQuery) //regresa los documentos que encontro
        
        if(docsRef.empty)
        {
            console.log('El producto que deseas actualizar no existe.')
            return
        }

        const productRef = docsRef.docs[0].ref // hace referencia al primer documento

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

        console.log(`Producto con id: ${id}, actualizado correctamente.`)
    
    } catch (error) {
        console.error('Error al actualizar el producto => ', error)
    }
}

export const deleteProduct = async(id) => {

    try {

        const existingProductQuery = query(productsCollection, where('id', '==', id)) //hace una consulta
        const docsRef = await getDocs(existingProductQuery) //regresa los documentos que encontro
        
        if(docsRef.empty)
        {
            console.log('El producto que deseas eliminar no existe.')
            return
        }

        const productRef = docsRef.docs[0].ref // hace referencia al primer documento

        await deleteDoc(productRef)
        console.log(`Producto con id: ${id}, eliminado correctamente.`)

    } catch (error) {
        console.error('Error al eliminar el producto => ', error)
    }
    
}

export const getProducts = async() => {

    try {

        const products = await getDocs(productsCollection)
        return products.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))

    } catch (error) {
        console.error('Error al obtener los productos => ', error)
    }
    
}


//ZONA DE PRUEBAS

//addProduct('Camisa', '1', 'Ropa', 150, 34, 'm/s', "20/10/2028", 10)
//addProduct('Pantalon', '2', 'Ropa', 160, 74, 'm/s', "20/10/2027", 15)
//updateProduct('Camisa de vestir', '1', 'Ropa', 340, 12, 'm/s', '20/10/2028', 10)
//deleteProduct('1')
//console.log(getProducts())

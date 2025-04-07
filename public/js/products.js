import {db} from "./firebase-config.js"
import {collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js"

const productsCollection = collection(db, 'products')

export const addProduct = async() => {
    try {
        const image = document.getElementById('image').value
        const name = document.getElementById('name').value
        const category = document.getElementById('category').value
        const price = document.getElementById('price').value
        const quantity = document.getElementById('quantity').value
        const unit = document.getElementById('unit').value
        const expiryDate = document.getElementById('expiryDate').value
        const threshold = document.getElementById('threshold').value

        const existingProductQuery = query(productsCollection, where('name', '==', name), where('category', '==', category))
        const docsRef = await getDocs(existingProductQuery)

        if (!docsRef.empty) {
            console.log('El producto ya existe')
            return
        }

        const newProduct = {
            image: image,
            name: name,
            category: category,
            price: price,
            quantity: quantity,
            unit: unit,
            expiryDate: expiryDate,
            threshold: threshold
        }

        // Agregar el producto y dejar que Firestore genere el ID automáticamente
        const newDoc = await addDoc(productsCollection, newProduct)

        console.log('Producto agregado con ID: ', newDoc.id)
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProduct'))
        modal.hide()

    } catch (error) {
        console.error('Error al agregar el producto => ', error)
    }

    renderProducts()
}

export const updateProduct = async(docId, image, name, category, price, quantity, unit, expiryDate, threshold) => {
    try {
        const productRef = doc(productsCollection, docId); // Referencia directa al documento por su ID

        await updateDoc(productRef, {
            image: image,
            name: name,
            category: category,
            price: price,
            quantity: quantity,
            unit: unit,
            expiryDate: expiryDate,
            threshold: threshold
        })

        console.log(`Producto con ID: ${docId}, actualizado correctamente.`)
    } catch (error) {
        console.error('Error al actualizar el producto => ', error)
    }
}

export const deleteProduct = async(docId) => {
    try {
        const existingProductQuery = query(productsCollection, where('id', '==', id)) //hace una consulta
        const docsRef = await getDocs(existingProductQuery) //regresa los documentos que encontro
        
        if(docsRef.empty)
        {
            console.log('El producto que deseas eliminar no existe.')
            return
        }

        const productRef = docsRef.docs[0].ref // hace referencia al primer documento

        await deleteDoc(productRef);
        console.log(`Producto con ID: ${docId}, eliminado correctamente.`)
    } catch (error) {
        console.error('Error al eliminar el producto => ', error)
    }
};

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

const renderProducts = async() => {
    const productsTable = document.getElementById('productsTable')
    productsTable.innerHTML = ''

    const products = await getProducts()

    products.forEach((product) => {
        const productRow = document.createElement('tr')
    

        productRow.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.quantity} Packets</td>
            <td>${product.threshold} Packets</td>
            <td>${product.expiryDate}</td>
        `

        const availability = document.createElement('td')
        if(product.quantity > product.threshold) {
            availability.innerText = 'In stock'
            availability.classList.add('availability-in-stock')
        } else if(product.quantity == 0) {
            availability.innerText = 'Out of stock'
            availability.classList.add('availability-no-stock')
        } else {
            availability.innerText = 'Low stock'
            availability.classList.add('availability-low-stock')
        }

        productRow.append(availability)

        productsTable.appendChild(productRow)
    })

    document.querySelectorAll('productClick').forEach((product) => {
        product.addEventListener('click', async(event) => {

        })
    })
}

//ZONA DE PRUEBAS
//updateProduct('Camisa de vestir', '1', 'Ropa', 340, 12, 'm/s', '20/10/2028', 10)
//deleteProduct('1')
//console.log(getProducts())

renderProducts()
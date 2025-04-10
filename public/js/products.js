import {db} from "./firebase-config.js"
import {collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js"
import {logOut} from "./auth.js"

const productsCollection = collection(db, 'products')

const logoutBtn = document.getElementById('logOutBtn')
logoutBtn.addEventListener('click', async() => {
    await logOut()
    window.location.href = 'index.html'
})

export const addProduct = async() => {
    try {
        const image = document.getElementById('addImage').value
        const name = document.getElementById('addName').value
        const category = document.getElementById('addCategory').value
        const price = document.getElementById('addPrice').value
        const quantity = document.getElementById('addQuantity').value
        const unit = document.getElementById('addUnit').value
        const expiryDate = document.getElementById('addExpiryDate').value
        const threshold = document.getElementById('addThreshold').value

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

        const newDoc = await addDoc(productsCollection, newProduct)

        console.log('Producto agregado con ID: ', newDoc.id)
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('productAddModal'))
        modal.hide()

    } catch (error) {
        console.error(error)
    }

    renderProducts()
}

export const updateProduct = async() => {
    try {
        const id = document.getElementById('updateProduct').getAttribute('data-id')
        const image = document.getElementById('updateImage').value
        const name = document.getElementById('updateName').value
        const category = document.getElementById('updateCategory').value
        const price = document.getElementById('updatePrice').value
        const quantity = document.getElementById('updateQuantity').value
        const unit = document.getElementById('updateUnit').value
        const expiryDate = document.getElementById('updateExpiryDate').value
        const threshold = document.getElementById('updateThreshold').value

        const productRef = doc(productsCollection, id)

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

        const modal = bootstrap.Modal.getInstance(document.getElementById('productUpdateModal'))
        modal.hide()

        document.getElementById('tab-product-title').innerText = name
        document.getElementById('primary-details-name').innerText = name
        document.getElementById('primary-details-category').innerText = category
        document.getElementById('primary-details-expiryDate').innerText = expiryDate
        document.getElementById('primary-details-threshold').innerText = threshold
        document.getElementById('primary-details-img').src = image
        document.getElementById('primary-details-stock').innerText = quantity
        document.getElementById('primary-details-remaining').innerText = quantity
        document.getElementById('primary-details-thresholdValue').innerText = threshold
        document.getElementById('primary-details-store1').innerText = quantity
    } catch (error) {
        console.error(error)
    }
}

export const deleteProduct = async() => {
    try {
        const id = document.getElementById('deleteProduct').getAttribute('data-id')
        const productRef = doc(productsCollection, id)

        await deleteDoc(productRef)

        const modal = bootstrap.Modal.getInstance(document.getElementById('productDeleteModal'))
        modal.hide()

        const inventory = document.getElementById('inventory')
        inventory.classList.toggle('hide')

        const productDetails = document.getElementById('product-details')
        productDetails.classList.toggle('hide')
    } catch (error) {
        console.error(error)
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

const renderProducts = async() => {
    const productsTable = document.getElementById('productsTable')
    productsTable.innerHTML = ''

    const products = await getProducts()
    document.getElementById('overall-products').innerText = products.length

    const categories = []
    let revenue = 0
    let notStock = 0

    products.forEach((product) => {
        if(!categories.includes(product.category)) {
            categories.push(product.category)
        }
        revenue += product.price * product.quantity
        if(product.quantity == 0) notStock++

        const productRow = document.createElement('tr')
        productRow.setAttribute('data-id', product.id)

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

        productRow.addEventListener('click', () => {
            const inventory = document.getElementById('inventory')
            inventory.classList.toggle('hide')

            const productDetails = document.getElementById('product-details')
            productDetails.classList.toggle('hide')

            const dataId = productRow.getAttribute('data-id')
            const editBtn = document.getElementById('edit')
            editBtn.setAttribute('data-id', dataId)

            const deleteBtn = document.getElementById('delete')
            deleteBtn.setAttribute('data-id', dataId)

            document.getElementById('tab-product-title').innerText = product.name
            document.getElementById('primary-details-name').innerText = product.name
            document.getElementById('primary-details-id').innerText = product.id
            document.getElementById('primary-details-category').innerText = product.category
            document.getElementById('primary-details-expiryDate').innerText = product.expiryDate
            document.getElementById('primary-details-threshold').innerText = product.threshold
            document.getElementById('primary-details-img').src = product.image
            document.getElementById('primary-details-stock').innerText = product.quantity
            document.getElementById('primary-details-remaining').innerText = product.quantity
            document.getElementById('primary-details-thresholdValue').innerText = product.threshold
            document.getElementById('primary-details-store1').innerText = product.quantity
        })

        productsTable.appendChild(productRow)
    })

    document.getElementById('overall-categories').innerText = categories.length
    document.getElementById('overall-revenue').innerText = '$' + revenue
    document.getElementById('overall-notStock').innerText = notStock
}

document.getElementById('backToTable').addEventListener('click', () => {
    const inventory = document.getElementById('inventory')
    inventory.classList.toggle('hide')

    const productDetails = document.getElementById('product-details')
    productDetails.classList.toggle('hide')

    renderProducts()
})

document.getElementById('edit').addEventListener('click', async (event) => {
    const productId = event.target.getAttribute('data-id')
    const productRef = doc(productsCollection, productId)
    const productSnapshot = await getDoc(productRef)
    const product = productSnapshot.data()

    const image = document.getElementById('updateImage')
    const name = document.getElementById('updateName')    
    const category = document.getElementById('updateCategory')
    const price = document.getElementById('updatePrice')
    const quantity = document.getElementById('updateQuantity')
    const unit = document.getElementById('updateUnit')
    const expiryDate = document.getElementById('updateExpiryDate')
    const threshold = document.getElementById('updateThreshold')

    image.value = product.image
    name.value = product.name
    category.value = product.category
    price.value = product.price
    quantity.value = product.quantity
    unit.value = product.unit
    expiryDate.value = product.expiryDate
    threshold.value = product.threshold

    document.getElementById('updateProduct').setAttribute('data-id', productId)
})

document.getElementById('delete').addEventListener('click', async(event) => {
    const productId = event.target.getAttribute('data-id')
    document.getElementById('deleteProduct').setAttribute('data-id', productId)
})

renderProducts()
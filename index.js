const express = require("express");
const app = express();
const port = process.env.port || 3000;

//express.json() used as a middleware
//Declared at the beginning if it is eneded for other operations in the future
app.use(express.json());

//Product array declaration
const products = [
    {"id": 1, "name": "Sandwich", "price": 10000},
    {"id": 2, "name": "Hot dog", "price": 7000},
    {"id": 3, "name": "Croissant", "price": 5000}
]

/*
 * GET route to /products
 * Returns a json of the products array
 */
app.get('/products', (req, res) => {
    res.json(products);
})

/*
 * GET route to /products:id
 * Returns a json of the product with the corresponding id
 */
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);

    //Shows error 400 if id is not a number (NaN) or if it is not positive.
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({error: 'ID must be a postive number.'});
    }

    const product = products.find(p => p.id == id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(product);
})

/*
 * POST route to /products
 * Creates a new product if all fields are used and valid, and if the id is different to the existant ones
 * Finally, it adds it to the products array
 */
app.post('/products', (req, res) => {
    const {id, name, price} = req.body;

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({error: 'ID must be a postive number.'});
    }

    if (products.find(p => p.id == id)) {
        return res.status(400).json({error: `Product with id ${id} already exists.`});
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: 'Name must be a non-empty string.' });
    }

    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: 'Price must be a positive number.' });
    }

    const newProduct = {id, name, price};

    products.push(newProduct)

    res.status(201).json({ message: 'Prodcut created successfully', product: newProduct });
})

//Server starts to listen through port 3000
app.listen(port, () => {
    console.log("Server running");
})
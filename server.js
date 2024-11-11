const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a Mongoose schema and model
const ItemSchema = new mongoose.Schema({
    name: String,
    description: String,
});

const Item = mongoose.model('Item', ItemSchema);

// CRUD Operations

// Create
app.post('/items', async (req, res) => {
    const item = new Item(req.body);
    try {
        await item.save();
        res.status(201).send(item);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Read
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).send(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update
app.put('/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) {
            return res.status(404).send();
        }
        res.status(200).send(item);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete
app.delete('/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).send();
        }
        res.status(200).send(item);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


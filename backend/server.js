// server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors'); // Import cors
import express from 'express';
import mongoose from 'mongoose'
import cors from 'cors'

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Replace with your MongoDB Atlas connection string
const dbUri = 'mongodb+srv://dharshan:dharshan@cluster0.x88jkfu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// {
//     type: String,
//         required: [true, 'Expenses  is required'],
//     },
// Define a Mongoose schema and model
const billSchema = new mongoose.Schema({
    "Income From (Stay Name)": String,
    "Date Of Booking": String,
    "Booking From": String,
    "Room No": String,
    "Share Percentage": Number,
    "Adavance Amount": Number,
    "Extra Amount": Number,
    "Extra Amount Detail": String,
    "Expenses": Number,
    "Debited Amount": Number,
    "Amount Credited to": String,
    "Credited Amount": Number,
    "Amount Received As (Rs / Euro)": String,
    "Is GST Included": Boolean,
    "GST Percentage": Number,
    "Final Amount": Number,
});

const Item = mongoose.model('Item', billSchema);

app.get('/bill', async (req, res) => {
    try {
        const items = await Item.find();
        const totalFinalAmount = items.reduce((total, item) => {
            return total + Number(item["Final Amount"]);
        }, 0); res.json({ items: items, totalFinalAmount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// POST route to create a new item
app.post('/bill', async (req, res) => {
    const newItem = new Item(req.body);
    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {

        res.status(400).json({ err });
    }
});
app.put('/bill/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (updatedItem) {
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PhoneBook = require('./model/studenDetails'); // Ensure this path and filename are correct

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not defined

app.use(express.json());
app.use(cors());

const DB = process.env.MONGODB_URI;
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected..');
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });

app.post('/add-phone', async (req, res) => {
    const { name, rollNumber, phoneNumber, email } = req.body;
    try {
        const phoneBookEntry = new PhoneBook({ name, rollNumber, phoneNumber, email });
        const savedEntry = await phoneBookEntry.save();
        res.status(201).json({
            status: 'Success',
            data: savedEntry
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});

app.get('/phone-entries', async (req, res) => {
    try {
        const phoneEntries = await PhoneBook.find();
        res.status(200).json({
            status: 'Success',
            data: phoneEntries
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});

app.patch('/update-phone/:id', async (req, res) => {
    const { id } = req.params;
    const { name, rollNumber, phoneNumber, email } = req.body;
    try {
        const updatedEntry = await PhoneBook.findByIdAndUpdate(id, { name, rollNumber, phoneNumber, email }, { new: true });
        if (!updatedEntry) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Phone entry not found'
            });
        }
        res.status(200).json({
            status: 'Success',
            data: updatedEntry
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});

app.delete('/delete-phone/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEntry = await PhoneBook.findByIdAndDelete(id);
        if (!deletedEntry) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Phone entry not found'
            });
        }
        res.status(200).json({
            status: 'Success',
            message: 'Phone entry deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}...`);
});

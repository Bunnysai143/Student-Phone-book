const mongoose = require('mongoose');

const PhoneBookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true,
        maxlength:10,
        validate: {
            validator: function(value) {
                return /^[A-Za-z0-9]+$/.test(value);
                
            },
            message: props => `${props.value} is not a valid roll number!`
        }
    },
    phoneNumber: {
        type: String,
        
        required: true,
        validate: {
            validator: function(value) {
                return /^\d{10}$/.test(value);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return /\S+@\S+\.\S+/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    }
});

const PhoneBook = mongoose.model('PhoneBook', PhoneBookSchema);

module.exports = PhoneBook;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Age: {
        type: Number,
        required: true,
        min: 13
    },
    Gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    Password: {
        type: String,
        required: true
    },
    Interests: {
        type: [{
            type: String,
            enum: [
                'Art', 'Movies', 'Community', 'Food & Drink', 'Sports',
                'Gaming', 'Travel', 'Fashion', 'Music & Entertainment',
                'School & Education', 'Holiday', 'Coding'
            ]
        }],
        default: [] // Default to an empty array if no interests are provided
    },
    Description: {
        type: String, 
        required: true
    },
    Tagline: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);

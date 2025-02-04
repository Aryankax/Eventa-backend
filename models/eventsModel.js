const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { 
        type: String,
        enum: ["Concert", "Conference", "Sports", "Exhibition", "Workshop", "Theatre", "Festival", "Meetup", "Other", "Stand-Up Comedy"], 
        required: true 
    },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String },
    venue: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        latitude: { type: Number },
        longitude: { type: Number }
    },
    maxAttendees: { type: Number, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    images: { type: [String], default: [] },
    contactDetails: {
        email: { type: String, required: true },
        phone: { type: String },
        website: { type: String }
    },
    status: { type: String, enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"], default: "Upcoming" },
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});


const Event = mongoose.model("Event", EventSchema);

module.exports = Event;  
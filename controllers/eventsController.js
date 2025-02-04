const Event = require("../models/eventsModel");
const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel');

// Create a new event
const createEvent = async (req, res) => {
    try {
        // Extract token from cookies safely
        const cookie = req.headers.cookie;
        if (!cookie) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = cookie.split("jwt=")[1];
        if (!token) {
            return res.status(401).json({ error: "Invalid token format" });
        }

        // Decode JWT
        const decodedToken = jwt.verify(token, "Hum Jeet Gaye");
        const userID = decodedToken.id;
        const userType = decodedToken.type;

        // Check if user is an organizer
        if (userType !== "Organiser") {
            return res.status(403).json({ error: "Unauthorized: Only organizers can create events" });
        }

        // Extract event details from request body
        const {
            name,
            description,
            category,
            date,
            startTime,
            endTime,
            venue,
            maxAttendees,
            attendees,
            images,
            contactDetails,
            status,
            tags
        } = req.body;

        // Validate required fields
        if (!name || !description || !category || !date || !startTime || !venue || !maxAttendees || !contactDetails) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create event
        const newEvent = new Event({
            name,
            description,
            category,
            date,
            startTime,
            endTime,
            venue,
            maxAttendees,
            attendees: attendees || [],
            images: images || [],
            contactDetails,
            status: status || "Upcoming",
            tags: tags || [],
            organizer: userID
        });

        await newEvent.save();

        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllEvents = async (req, res) => {
    try {
        // Fetch all events from the database
        const events = await Event.find();

        // If no events are found
        if (!events.length) {
            return res.status(404).json({ message: "No events found" });
        }

        // Return the fetched events
        res.status(200).json({ events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const joinEvent = async (req, res) => {
    try {
        const cookie = req.headers.cookie;
        if (!cookie) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = cookie.split("jwt=")[1];
        if (!token) {
            return res.status(401).json({ error: "Invalid token format" });
        }

        // Decode JWT
        const decodedToken = jwt.verify(token, "Hum Jeet Gaye");
        const userID = decodedToken.id;
        const userType = decodedToken.type;

        // Check if the user is not an organizer (optional validation for userType)
        if (userType === "Organiser") {
            return res.status(403).json({ error: "Organizers cannot join events" });
        }

        // Get the event ID from the request params (or body if needed)
        const eventId = req.params.eventId;  // Assuming you pass the event ID via URL params

        // Find the event in the database
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Check if the user is already in the attendees list
        if (event.attendees.includes(userID)) {
            return res.status(400).json({ error: "You are already attending this event" });
        }

        // Check if the event has reached the maximum attendees limit
        if (event.attendees.length >= event.maxAttendees) {
            return res.status(400).json({ error: "Event has reached its maximum capacity" });
        }

        // Add the user's ID to the attendees array
        event.attendees.push(userID);

        // Save the updated event
        await event.save();

        // Respond with success
        res.status(200).json({ message: "Successfully joined the event", event });

    } catch (error) {
        console.error("Error joining event:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createEvent, getAllEvents, joinEvent};
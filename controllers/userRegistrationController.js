const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

//time for expiry of token is 5 hours
const expireAge = 5 * 60 * 60;

const createToken = (id, email, type) => {
    return jwt.sign({id, email, type}, 'Hum Jeet Gaye', {
        expiresIn: expireAge
    });
}

const decodeToken = async(req, res) => {
    try {

        const token = req.headers.authorization;
        
        console.log(token);

        if(token){
            try{
                const decodedToken = await jwt.verify(token, 'Hum Jeet Gaye');

                console.log(decodeToken);

                const userId = decodedToken.id;
                const userType = decodeToken.id;

                res.status(201).json({msg: `${userId}` `and` `${userType}`});
            } catch {
                console.log('Failed to verify token:', err.message);
                res.status(401).json({ error: 'Failed to verify token' });
            }
        } else {
            res.status(401).json({ error: 'Token not provided' });
          }

    } catch {
        console.error('Error fetching startups:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const SignUp = async(req, res) => {
    try {
        const {
            Name,
            Type,
            Age,
            Gender,
            Email,
            Password,
            Interests,
            Description,
            Tagline
        } = req.body;

        const newUserRegistration = new userModel({
            Name,
            Type,
            Age,
            Gender,
            Email,
            Password,
            Interests,
            Description,
            Tagline
        });

        const existingUser = await userModel.findOne({Email});

        if(existingUser) {
            return res.status(400).json({error: 'User already exists'});
        }

        await newUserRegistration.save();

        res.status(201).json({
            message: 'User Registered Successfully', user: newUserRegistration,
        });
    } catch (error) {
        console.log('Error during SignUp: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const login = async(req, res) => {
    try {
        const {email, password} = req.body;

        //find user by email 

        const User = await userModel.findOne({Email: email});

        if(!User){
            return res.status(401).json({
                error: 'User does not exist'
            });
        }

        if(password === User.Password){
            const token = createToken(User._id, email, User.Type);

            res.cookie('jwt', token, { httpOnly: true, maxAge: expireAge * 1000 });

            return res.status(200).json({Message: 'User Logged In', JWT: token})

        } else {
            return res.status(401).json({error: 'Wrong Password'});
        };
    } catch {
        console.error('Error during login: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const userData = async(req, res) => {
    try {

        const cookie = req.headers.cookie;

        const token = cookie.split('jwt=')[1];

        console.log(token);

        const decodedToken = jwt.verify(token, 'Hum Jeet Gaye');

        const userID = decodedToken.id;

        const userDetails = await userModel.findById(userID);

        res.status(200).json({details: userDetails});

    } catch(error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {SignUp, login, userData};
const env = process.env;
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.signup = (req, res) => {
	function createNewUser(hash) {
		const user = new User({
			email: req.body.email,
			password: hash
		});

		user.save().then(() => res.status(201).json({ message: "User successfully created !" })).catch(error => res.status(400).json({ error }));
	}

	bcrypt.hash(req.body.password, 10).then(hash => validator.isEmail(req.body.email) ? createNewUser(hash) : res.status(400).json({ message: "Email not valid !" })).catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => { // Check if the user exists in the database and if the password is correct
    function authenticateUser(user) {
        bcrypt.compare(req.body.password, user.password) // Compare the password sent by the user with the password stored in the database
        .then(valid => { // valid = true if the password is correct
            valid ? connectUser(user) : res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte !' });
        })
        .catch(error => res.status(500).json({ error }));
    }

    function connectUser(user) { // Connect the user
        res.status(200).json({
            userId: user._id, 
            token: jwt.sign( 
                { userId: user._id }, 
                `${env.SECRET_TOKEN}`, 
                { expiresIn: '24h' } 
            ),
        })
        console.log('User connected: ' + user._id)
    }

    User.findOne({ email: req.body.email })
        .then(user => { // user = the user found in the database
            user ? authenticateUser(user) : res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte !' });
        })
        .catch(error => { res.status(500).json({ error })});
};
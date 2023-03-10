const env = process.env;
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => { // Check if the user is authenticated
    try { 
        const token = req.headers.authorization.split(' ')[1]; // Split the token from the authorization header [Bearer, token] and extract the token [1]
        const decodedToken = jwt.verify(token, `${env.SECRET_TOKEN}`); // Decode the token with the SECRET_TOKEN
        const userId = decodedToken.userId; // Extract the user ID from the token 

        console.log(`Auth was called and the token was decoded successfully.\nThe user ID is: ${ userId }`);

        // if user token is expired, redirect to login page
        if (decodedToken.exp < Date.now() / 1000) {
            console.log('Token expired');
            res.status(401).json({ error: 'Token expired' });
        }

        req.auth = { // Adding the userId to the request object.
            userId: userId
        }

        next();
    } 
    catch (error) {
        console.log(`Auth was called and the token was not decoded successfully.\nError: ${ error }`);
        res.status(401).json({ error });
    }
};
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const User = require("./models/User"); // Adjust the path as needed to your User model

// Get the JWT_SECRET from environment variables
const secretOrKey = process.env.JWT_SECRET;

// Set up the options for JWT extraction and validation
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
  secretOrKey: secretOrKey, // Use the secret stored in the .env file
};

// Define the strategy
passport.use(
  new Strategy(options, async (jwt_payload, done) => {
    try {
      // Find the user based on the ID in the JWT payload
      const user = await User.findById(jwt_payload.id);
      if (!user) {
        return done(null, false); // If no user is found, authentication fails
      }

      // If user is found, pass the user object to the next middleware
      return done(null, user);
    } catch (err) {
      return done(err, false); // If an error occurs, pass it to the next middleware
    }
  })
);

// Export passport so it can be used in the main application
module.exports = passport;

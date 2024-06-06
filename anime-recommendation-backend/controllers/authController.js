// controllers/authController.js
const { sequelize, User } = require('../models'); // Import Sequelize instance and User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { username, email, password, age, gender } = req.body;

        // Find the maximum User_ID in the table
        const latestUser = await User.findOne({ 
            attributes: [[sequelize.fn('MAX', sequelize.col('User_ID')), 'maxUserId']] 
        });

        let newUserId = 1; // Default to 1 if there are no existing users
        if (latestUser && latestUser.dataValues.maxUserId) {
            newUserId = latestUser.dataValues.maxUserId + 1;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with the calculated User_ID
        const newUser = await User.create({
            User_ID: newUserId,
            Username: username,
            Email: email,
            Password: hashedPassword,
            Age: age,
            Gender: gender,
            Date_joined: new Date(),
            Last_login: new Date()
        });

        // Generate JWT token
        const token = jwt.sign({ userId: newUser.User_ID }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.User_ID }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.logout = async (req, res) => {
    // You can implement logout logic here if needed
    res.status(200).json({ message: "Logout successful" });
};
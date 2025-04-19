"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const hunt_1 = __importDefault(require("../database/hunt"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const SECRET = process.env.JWT_SECRET;
const defaultOptions = {
    httpOnly: true,
    sameSite: 'Lax',
};
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.use((0, cookie_parser_1.default)());
router.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173",
}));
router.use(express_1.default.json());
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "Email and password are required" });
    }
    try {
        const user = yield UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found please signup first" });
        }
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ msg: "Incorrect password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, SECRET, {
            expiresIn: 1 * 60 * 60 * 24, // Token expiration time in seconds
        });
        res.cookie('jwt', token, defaultOptions);
        console.log(token);
        return res.status(200).json({ msg: "Login successful" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!email || !password || !firstName || !lastName || !phone) {
        return res.status(400).json({ msg: "All fields are required" });
    }
    try {
        const existingUser = yield UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ msg: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
        });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, email: newUser.email }, SECRET, {
            expiresIn: 1 * 60 * 60 * 24,
        });
        res.cookie('jwt', token, defaultOptions);
        return res.status(201).json({ msg: "User created" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error creating user" });
    }
}));
router.post('/createteam', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.cookies.jwt;
    if (!authToken) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(authToken, SECRET);
        const user = yield UserModel.findOne({ email: decoded.email }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const newTeam = yield TeamModel.create({
            name: req.body.name,
            leader: user._id, // Use the user's ObjectId as the leader
            teamId: teamID++,
        });
        newTeam.members.push(user._id);
        yield newTeam.save();
        user.teams.push(newTeam._id);
        yield user.save();
        req.body.members.map((member) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const user = yield UserModel.findById(member); // Use `member` instead of `userId` if it's the correct variable
                if (user) {
                    user.teams.push(newTeam._id); // Assuming `teams` is an array in the User model
                    yield user.save();
                    newTeam.members.push(user._id);
                }
                yield newTeam.save();
            }
            catch (error) {
                console.error(`Error processing member ${member}:`, error);
            }
        }));
        return res.status(201).json({
            msg: "Team created and added to user",
            team: newTeam,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token or error creating team.' });
    }
}));
router.post('/addmember', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.cookies.jwt;
    if (!authToken) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    const { teamId, memberId } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(authToken, SECRET);
        const user = yield UserModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Validate input
        if (!teamId || !memberId) {
            return res.status(400).json({ message: "Team ID and Member ID are required." });
        }
        // Fetch the team from the database
        const team = yield TeamModel.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found." });
        }
        // Check if the user is the team leader
        if (team.leader.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Only the team leader can add members." });
        }
        // Check if the member is already in the team
        if (team.members.includes(memberId)) {
            return res.status(400).json({ message: "User is already a member of the team." });
        }
        // Add the member to the team
        team.members.push(memberId);
        yield team.save();
        // Update the `team` field of the new member
        const member = yield UserModel.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: "Member not found." });
        }
        member.teams.push(teamId); // Assuming `team` is a field in the User schema
        yield member.save();
        return res.status(200).json({ message: "Member added successfully!", team });
    }
    catch (error) {
        console.error("Error adding member to team:", error);
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
}));
router.get('/getteams', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt; // Retrieve token from cookies
    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        const userId = decoded.id;
        // Fetch the user from the database
        const user = yield UserModel.findById(userId); // Populate the teams
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        let teams = [];
        for (let i = 0; i < user.teams.length; i++) {
            const team = yield TeamModel.findById(user.teams[i]);
            teams.push(team);
        }
        // Return the user's teams
        return res.status(200).json({ teams });
    }
    catch (error) {
        console.error('Error fetching teams:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
router.get('/gethunts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all hunts from the database
        const hunts = yield hunt_1.default.find();
        // Check if hunts exist
        if (!hunts || hunts.length === 0) {
            return res.status(404).json({ message: 'No hunts found.' });
        }
        return res.status(200).json({ hunts });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}));
router.get('/getspecifichunt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { huntId } = req.query;
    if (!huntId) {
        return res.status(400).json({ msg: 'Hunt ID is required' });
    }
    try {
        // Fetch the hunt from the database
        const hunt = yield hunt_1.default.findById(huntId);
        if (!hunt) {
            return res.status(404).json({ msg: 'Hunt not found' });
        }
        return res.status(200).json({ hunt });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
router.get('/getuser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt; // Retrieve token from cookies
    console.log(token);
    if (!token) {
        return res.status(401).json({ msg: 'Please SignIn' });
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        const userId = decoded.id;
        // Validate user existence
        const user = yield UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error('Error fetching user:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
router.post('/addteamtohunt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { huntId, teamId } = req.body; // Details from frontend
    if (!huntId || !teamId) {
        return res.status(400).json({ msg: 'Hunt ID and Team ID are required' });
    }
    try {
        // Check if the hunt exists
        const hunt = yield hunt_1.default.findById(huntId);
        if (!hunt) {
            return res.status(404).json({ msg: 'Hunt not found' });
        }
        // Check if the team exists
        const team = yield TeamModel.findById(teamId);
        if (!team) {
            return res.status(404).json({ msg: 'Team not found' });
        }
        // Check if the team is already part of the hunt
        const teamExists = hunt.teams.some((t) => t.teamId.toString() === teamId);
        if (teamExists) {
            return res.status(409).json({ msg: 'Team already added to this hunt' });
        }
        // Add team to the hunt
        hunt.teams.push({
            teamId,
            score: 0, // Default score
            completedClues: 0, // Default completed clues
        });
        for (const member of team.members) {
            try {
                const user = yield UserModel.findById(member); // Use `member` instead of `userId` if it's the correct variable
                if (user) {
                    user.hunts.push(hunt._id); // Assuming `hunts` is an array in the User model
                    yield user.save();
                }
            }
            catch (error) {
                console.error(`Error processing member ${member}:`, error);
            }
        }
        yield hunt.save();
        return res.status(200).json({ msg: 'Team added to hunt successfully' });
    }
    catch (error) {
        console.error('Error adding team to hunt:', error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
router.get('/users/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query; // Retrieve search query from the request query params
    try {
        // Search for users by name (firstName or lastName) or by ID (or email, if necessary)
        const users = yield UserModel.find({
            $or: [
                { firstName: { $regex: query, $options: 'i' } }, // case-insensitive match for first name
                { lastName: { $regex: query, $options: 'i' } }, // case-insensitive match for last name
                { email: { $regex: query, $options: 'i' } }, // case-insensitive match for email                                  // Search by user ID
            ]
        }); // Limit the result to a maximum of 10 matches
        // If no users found, return an empty array
        if (!users.length) {
            return res.status(404).json({ message: 'No users found' });
        }
        // Return the matching users
        return res.status(200).json({ users });
    }
    catch (error) {
        console.error('Error searching users:', error);
        return res.status(500).json({ message: 'Server error, please try again later' });
    }
}));
router.post('/jointeam', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt; // Retrieve token from cookies
    const { teamId } = req.body;
    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        const userId = decoded.id;
        // Validate user existence
        const user = yield UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // Validate team existence
        const team = yield TeamModel.findById(teamId);
        if (!team) {
            return res.status(404).json({ msg: 'Team not found' });
        }
        // Check if the user is already part of the team
        if (user.teams.includes(team._id)) {
            return res.status(400).json({ msg: 'User is already part of the team' });
        }
        // Add the team to the user's `teams` array
        user.teams.push(team._id);
        yield user.save();
        // Add the user to the team's `members` array (if applicable in the Team schema)
        if (!team.members)
            team.members = []; // Ensure the field exists
        team.members.push(user._id);
        yield team.save();
        return res.status(200).json({ msg: 'User successfully joined the team' });
    }
    catch (error) {
        console.error('Error joining team:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
exports.default = router;

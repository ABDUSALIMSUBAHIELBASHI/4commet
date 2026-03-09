const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- MONGODB CONNECTION ---
const MONGO_URI = 'mongodb://localhost:27017/4comment'; 

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ DATABASE CONNECTION SUCCESSFUL'))
    .catch(err => console.error('❌ MONGODB ERROR:', err));

// --- DATA SCHEMAS ---
const ColorSchema = new mongoose.Schema({ hex: String, date: { type: Date, default: Date.now }});
const MsgSchema = new mongoose.Schema({ user: String, email: String, text: String, date: { type: Date, default: Date.now }});
const UserSchema = new mongoose.Schema({ name: String, passcode: String });

const Color = mongoose.model('Color', ColorSchema);
const Message = mongoose.model('Message', MsgSchema);
const User = mongoose.model('User', UserSchema);

// --- API ROUTES ---

// 🎨 Color Actions
app.get('/api/colors', async (req, res) => {
    const data = await Color.find().sort({ date: -1 });
    res.json(data);
});

app.post('/api/colors', async (req, res) => {
    const newColor = new Color(req.body);
    await newColor.save();
    res.json(newColor);
});

// 📩 Message Actions
app.get('/api/messages', async (req, res) => {
    const data = await Message.find().sort({ date: -1 });
    res.json(data);
});

app.post('/api/messages', async (req, res) => {
    const newMsg = new Message(req.body);
    await newMsg.save();
    res.json(newMsg);
});

// 🔐 Sign Up Action
app.post('/api/signup', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: 'User Saved to DB' });
});

// --- START SERVER ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 STUDIO BACKEND ACTIVE: http://localhost:${PORT}`);
});
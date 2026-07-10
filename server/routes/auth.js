const express = require('express');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const jwt = require('jsonwebtoken'); // NEW: We imported the library you just installed
const User = require('../models/User');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// 1. ENTERPRISE REGISTRATION (Unchanged)
router.post('/register', async (req, res) => {
    try {
        const { email, serverHash } = req.body;
        
        if (!email || !serverHash) return res.status(400).json({ error: 'Email and Auth Key are required.' });

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedServerKey = await bcrypt.hash(serverHash, salt);

        const secret = speakeasy.generateSecret({ length: 20 });
        const mfaSecret = secret.base32;

        user = new User({ email, serverHash: hashedServerKey, mfaSecret, isMfaEnabled: true });
        await user.save();
        
        res.status(201).json({ message: 'User registered.', mfaSecret });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 2. ZERO-KNOWLEDGE LOGIN (Updated)
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, serverHash, mfaToken } = req.body;

        if (!email || !serverHash || !mfaToken) return res.status(400).json({ error: 'Email, Auth Key, and MFA token are required.' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(serverHash, user.serverHash);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const isValidMfa = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token: mfaToken,
            window: 1 
        });

        if (!isValidMfa) return res.status(400).json({ error: 'Invalid MFA token' });

        // NEW: Generate the JWT Session Token
        // This bundles the user's database ID into a cryptographically signed string.
        // It expires in 1 hour to limit the blast radius if the token is ever stolen.
        const token = jwt.sign(
            { userId: user._id }, 
            'enterprise-vault-super-secret-key', 
            { expiresIn: '1h' }
        );

        // NEW: Return the token to the React frontend
        res.json({ message: 'Authentication successful.', token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
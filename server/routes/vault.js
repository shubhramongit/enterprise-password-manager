const express = require('express');
const router = express.Router();
const VaultItem = require('../models/VaultItem');
const requireAuth = require('../middleware/requireAuth');

// 1. THE BOUNCER: Protects all routes below this line
router.use(requireAuth);

// 2. READ: Retrieve all encrypted vault items for the logged-in user
router.get('/', async (req, res) => {
    try {
        const items = await VaultItem.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 3. CREATE: Save a new encrypted item to the database
router.post('/', async (req, res) => {
    try {
        const { name, encryptedData, iv } = req.body;

        if (!name || !encryptedData || !iv) {
            return res.status(400).json({ error: 'Name, encrypted data, and IV are required.' });
        }

        const newItem = new VaultItem({
            user: req.user.userId,
            name,
            encryptedData,
            iv
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 4. DELETE: Remove an item from the vault
router.delete('/:id', async (req, res) => {
    try {
        const item = await VaultItem.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Security check: Ensure the user attempting to delete it actually owns it
        if (item.user.toString() !== req.user.userId) {
            return res.status(401).json({ error: 'Not authorized to delete this item' });
        }

        await item.deleteOne();
        res.json({ message: 'Item removed from vault' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
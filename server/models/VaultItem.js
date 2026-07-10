const mongoose = require('mongoose');

const VaultItemSchema = new mongoose.Schema({
    // Links this specific vault item to the user who created it
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The plaintext name of the entry so the user knows what it is (e.g., "Netflix")
    name: {
        type: String,
        required: true 
    },
    // The AES-256 encrypted string containing the actual username and password
    encryptedData: {
        type: String,
        required: true 
    },
    // Initialization Vector: Cryptographically required to safely decrypt AES-GCM
    iv: {
        type: String,
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VaultItem', VaultItemSchema);
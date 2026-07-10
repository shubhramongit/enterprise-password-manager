const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    // We do NOT store the Auth Key directly. We store a bcrypt hash of it.
    serverHash: { 
        type: String, 
        required: true 
    },
    // The secret used to verify 6-digit Google Authenticator codes
    mfaSecret: { 
        type: String,
        required: true
    },
    isMfaEnabled: { 
        type: Boolean, 
        default: true // Enforcing MFA at the enterprise level
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
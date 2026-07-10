const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    // Check if the React app sent the VIP pass in the headers
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Extract the token (Format is usually "Bearer <token>")
        const token = authHeader.split(' ')[1];
        
        // Verify the token hasn't been tampered with
        const decoded = jwt.verify(token, 'enterprise-vault-super-secret-key');
        
        // Attach the verified user ID to the request so the next route knows who is asking
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired session token.' });
    }
};

module.exports = requireAuth;
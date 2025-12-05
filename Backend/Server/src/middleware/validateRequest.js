module.exports = (required = []) => (req, res, next) => {
    const missing = [];
    required.forEach((k) => {
        const exists = req.body[k] !== undefined && req.body[k] !== null && req.body[k] !== '';
        if (!exists) missing.push(k);
    });
    if (missing.length) return res.status(400).json({ success: false, error: `Missing fields: ${missing.join(', ')}` });
    next();
};
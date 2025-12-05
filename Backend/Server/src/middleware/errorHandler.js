const logger = require('../config/logger');


module.exports = (err, req, res, next) => {
    const status = err.status || 500;
    logger.error('Unhandled error', { message: err.message, stack: err.stack, path: req.originalUrl });
    res.status(status).json({ success: false, error: err.message || 'Server Error' });
};
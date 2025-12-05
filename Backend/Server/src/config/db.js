const mongoose = require('mongoose');
const logger = require('./logger');


const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error('MongoDB connection error', { message: err.message });
        process.exit(1);
    }
};


module.exports = connectDB;
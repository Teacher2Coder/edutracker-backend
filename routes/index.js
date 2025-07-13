const router = require('express').Router();

// Import all routes
const apirouter = require('./api');

router.use('/api', apirouter);

module.exports = router;
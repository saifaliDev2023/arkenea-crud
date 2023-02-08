const express = require('express');
const router = express.Router();
const crudRoutes = require('./crud.routers');

// users apis
router.use('/crud', crudRoutes);

module.exports = router;
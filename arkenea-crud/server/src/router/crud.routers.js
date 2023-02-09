const express = require('express');
const router = express.Router();
const { crudController } = require('../controller');

// users apis
router.post('/create', crudController.create);
router.get('/getAll', crudController.getAll);
router.get('/getOne/:id', crudController.getOne);
router.put('/update/:id', crudController.updateOne);
router.delete('/delete/:id', crudController.delete);

module.exports = router;
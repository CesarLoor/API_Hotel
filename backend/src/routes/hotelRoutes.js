// =============================================
// Rutas: Hoteles
// =============================================
const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

router.get('/', hotelController.getAll);
router.get('/:id', hotelController.getById);
router.post('/', hotelController.create);
router.put('/:id', hotelController.update);
router.delete('/:id', hotelController.delete);

module.exports = router;

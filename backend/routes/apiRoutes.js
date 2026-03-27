const express = require('express');
const router = express.Router();
const { getAllItems, createItem, updateItem, deleteItem } = require('../controllers/dataController');
const { ensureAuthenticated } = require('../middleware/auth');

// All API routes require authentication
router.use(ensureAuthenticated);

router.get('/data', getAllItems);
router.post('/data', createItem);
router.put('/data/:id', updateItem);
router.delete('/data/:id', deleteItem);

module.exports = router;

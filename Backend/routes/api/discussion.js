const express = require('express');
const router = express.Router();


router.get('/routes', (req,res) => {
    res.json({notice:'discuss route works'})
});

module.exports = router;

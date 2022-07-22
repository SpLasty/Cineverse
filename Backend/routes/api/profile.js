const express = require('express');
const router = express.Router();


router.get('/routes', (req,res) => {
    res.json({notice:'Prof route works'})
});

module.exports = router;

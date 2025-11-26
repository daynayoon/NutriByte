const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/recipe', async (req, res) => {
    const tableContent = await appService.fetchRecipeFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-recipe", async (req, res) => {
    const initiateResult = await appService.initiateRecipe();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-recipe", async (req, res) => {
    const { id, title, time_consumed, difficulty, cuisineID} = req.body;
    const insertResult = await appService.insertRecipe(id, title, time_consumed, difficulty, cuisineID);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/customer', async (req, res) => {
    const tableContent = await appService.fetchCustomerFromDb();
    res.json({data: tableContent});
});

router.post("/select-customer", async (req, res) => {
    const { id, name, email_address, history} = req.body;
    const selectCustomerResult = await appService.selectCustomerType(id, name, email_address, history);
    if (selectCustomerResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

module.exports = router;
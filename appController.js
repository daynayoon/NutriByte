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
    const {type} = req.body;
    const selectCustomerResult = await appService.selectCustomerType(type);
    if (selectCustomerResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/ingredients', async (req, res) => {
    const ingredients = await appService.fetchIngredients();
    res.json({ data: ingredients });
});

router.delete('/ingredient/:id', async (req, res) => {
    const id = req.params.id;
    const success = await appService.deleteIngredient(id);
    if (success) {
        res.json({ success: true, message: 'Ingredient deleted successfully.' });
    } else {
        res.status(400).json({ success: false, message: 'Failed to delete ingredient.' });
    }
});

router.post('/customers-by-recipe', async (req, res) => {
    const { recipeTitle, minStars } = req.body;

    if (!recipeTitle || !minStars) {
        return res.status(400).json({ success: false, message: 'recipeTitle and minStars are required.' });
    }

    const rows = await appService.getCustomersByRecipeAndRating(recipeTitle, minStars);
    res.json({ data: rows });
});

module.exports = router;
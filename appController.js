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
    const type = req.body.type;
    const name = req.body.name;
    const andOr = req.body.andOr;
    const selectCustomerResult = await appService.selectCustomerType(type, name, andOr);
    if (selectCustomerResult) {
        res.json({ data: selectCustomerResult, success: true });
    } else {
        res.status(404).json({ success: false });
    }
});

router.post("/savedListCountTable", async (req, res) => {
    const savedListCountTableResult = await appService.savedListCountTable();
    if (savedListCountTableResult) {
        res.json({ data: savedListCountTableResult, success: true });
    } else {
        res.status(404).json({ success: false });
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

router.get('/top-cuisines', async (req, res) => {
    const rows = await appService.getTopCuisinesByAvgRating();
    res.json({ data: rows });
});

// UPDATE Customer info
router.put('/customer/:id', async (req, res) => {
    const customerID = req.params.id;
    const { newName, newEmail } = req.body;

    if (!newName && !newEmail) {
        return res.status(400).json({ success: false, message: "Nothing to update." });
    }

    const success = await appService.updateCustomer(customerID, newName, newEmail);

    if (success) {
        res.json({ success: true, message: "Customer updated successfully." });
    } else {
        res.status(400).json({ success: false, message: "Failed to update customer." });
    }
});

// PROJECTION: Return only selected Recipe attributes
router.post('/recipes/projection', async (req, res) => {
    const { attributes } = req.body;

    if (!attributes || attributes.length === 0) {
        return res.status(400).json({ success: false, message: "No attributes provided." });
    }

    const rows = await appService.projectRecipe(attributes);

    if (!rows) {
        return res.status(400).json({ success: false });
    }

    res.json({ success: true, data: rows });
});

// HAVING: recipe that ave rating >= threshold
router.post('/recipes/avg-rating', async (req, res) => {
    const { threshold } = req.body;

    if (threshold === undefined) {
        return res.status(400).json({ success: false, message: "threshold is required." });
    }

    const rows = await appService.getRecipesAboveAvgRating(threshold);
    res.json({ data: rows });
});



module.exports = router;
/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('recipe');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/recipe', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the Recipe.
async function resetRecipe() {
    const response = await fetch("/initiate-recipe", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "Recipe initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating Recipe!");
    }
}

// Inserts new records into the Recipe.
async function insertRecipe(event) {
    event.preventDefault();
    const customerIDValue = document.getElementById('insertCustomerID').value;
    const idValue = document.getElementById('insertId').value;
    const titleValue = document.getElementById('insertTitle').value;
    const time_consumedValue = document.getElementById('insertTimeConsumed').value;
    const difficultyValue = document.getElementById('insertDifficulty').value;
    const cuisineIDValue = document.getElementById('insertCuisineID').value;

    const response = await fetch('/insert-recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            customerID: customerIDValue,
            id: idValue,
            title: titleValue,
            time_consumed: time_consumedValue,
            difficulty: difficultyValue,
            cuisineID: cuisineIDValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Recipe created successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = responseData.message || "Error creating recipe!";
    }
}

async function selectCustomerType(event) {
    const typeValue = document.getElementById('customerType').value;
    const nameValue = document.getElementById('select_name').value;
    const andOrValue = document.getElementById('and_or').value;
    const tableElement = document.getElementById('customer');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/select-customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type : typeValue,
            name: nameValue,
            andOr: andOrValue
        })
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
    
    const messageElement = document.getElementById('customerSelectionResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Customer type selected successfully!";
    } else {
        messageElement.textContent = "Error selecting customers!";
    }
}

// Fetch and display customer type and information
async function fetchAndDisplayCustomerType() {
    const tableElement = document.getElementById('customer');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/customer', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Count recipes for each owner, saved lists. 
async function savedListRecipeCount() {
    const tableElement = document.getElementById('savedListCountTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/savedListCountTable', {
        method: 'POST'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

    const messageElement = document.getElementById('savedListCountResultMsg');

    if (responseData.success) {
        messageElement.textContent = "savedList recipes counted successfully!";
    } else {
        messageElement.textContent = "Error counting savedList recipes!";
    }
}

// Find all recipes 
async function findAllRecipes(event) {
    event.preventDefault();
    const tableElement = document.getElementById('findAllRecipesTable');
    const tableBody = tableElement.querySelector('tbody');
    const ing1Value = document.getElementById('ingone').value;
    const ing2Value = document.getElementById('ingtwo').value;
    const ing3Value = document.getElementById('ingthree').value;
    const ing4Value = document.getElementById('ingfour').value;
    const ing5Value = document.getElementById('ingfive').value;

    const response = await fetch('/findAllRecipesTable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ing1: ing1Value,
            ing2: ing2Value,
            ing3: ing3Value,
            ing4: ing4Value,
            ing5: ing5Value
        })
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

    const messageElement = document.getElementById('findAllRecipeResultMsg');

    if (responseData.success) {
        messageElement.textContent = "found all recipes with selected ingredients successfully!";
    } else {
        messageElement.textContent = "Error finding all recipes with selected ingredients!";
    }
}


/* DELETE: ingredient table + delete button */
async function fetchAndDisplayIngredients() {
    const tableElement = document.getElementById('ingredientTable');
    if (!tableElement) return;
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/ingredients', { method: 'GET' });
    const responseData = await response.json();
    const data = responseData.data; // objects with ID, NAME

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    data.forEach(row => {
        const tr = tableBody.insertRow();

        const idCell = tr.insertCell();
        idCell.textContent = row.ID;

        const nameCell = tr.insertCell();
        nameCell.textContent = row.NAME;

        const actionCell = tr.insertCell();
        const btn = document.createElement('button');
        btn.textContent = 'delete';
        btn.onclick = () => deleteIngredient(row.ID);
        actionCell.appendChild(btn);
    });
}

async function deleteIngredient(id) {
    const msg = document.getElementById('deleteIngredientMsg');

    const response = await fetch(`/ingredient/${id}`, {
        method: 'DELETE'
    });

    const data = await response.json();
    if (response.ok && data.success) {
        msg.textContent = `Ingredient ${id} deleted successfully.`;
        fetchAndDisplayIngredients();
    } else {
        msg.textContent = data.message || 'Failed to delete ingredient.';
    }
}

/* JOIN: customers by recipe and min rating */

async function customersByRecipe(event) {
    event.preventDefault();

    const title = document.getElementById('recipeTitleInput').value;
    const minStars = document.getElementById('minStarsInput').value;

    const response = await fetch('/customers-by-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeTitle: title, minStars: Number(minStars) })
    });

    const data = await response.json();
    const msg = document.getElementById('customersByRecipeMsg');
    const table = document.getElementById('customersByRecipeTable');
    const tbody = table.querySelector('tbody');

    if (!response.ok) {
        msg.textContent = data.message || 'Error running query.';
        table.style.display = 'none';
        return;
    }

    msg.textContent = '';
    if (tbody) tbody.innerHTML = '';

    data.data.forEach(row => {
        const tr = tbody.insertRow();
        const values = [row.ID, row.NAME, row.EMAIL_ADDRESS, row.STARS];
        values.forEach(v => {
            const cell = tr.insertCell();
            cell.textContent = v;
        });
    });

    table.style.display = 'table';
}

/* Nested Aggregation: top cuisines */

async function loadTopCuisines() {
    const response = await fetch('/top-cuisines', { method: 'GET' });
    const data = await response.json();

    const msg = document.getElementById('topCuisinesMsg');
    const table = document.getElementById('topCuisinesTable');
    const tbody = table.querySelector('tbody');

    if (!response.ok) {
        msg.textContent = data.message || 'Error loading cuisines.';
        table.style.display = 'none';
        return;
    }

    msg.textContent = '';
    if (tbody) tbody.innerHTML = '';

    data.data.forEach(row => {
        const tr = tbody.insertRow();
        const styleCell = tr.insertCell();
        const avgCell = tr.insertCell();

        styleCell.textContent = row.STYLE;
        avgCell.textContent = row.AVGCUISINERATING;
    });

    table.style.display = 'table';
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    fetchAndDisplayIngredients();
    document.getElementById("resetRecipe").addEventListener("click", resetRecipe);
    document.getElementById("insertRecipe").addEventListener("submit", insertRecipe);
    document.getElementById("selectCustomerType").addEventListener("click", selectCustomerType);
    document.getElementById("savedListCountBtn").addEventListener("click", savedListRecipeCount);
    document.getElementById("findAllRecipes").addEventListener("submit", findAllRecipes);
    document.getElementById("customersByRecipeForm").addEventListener("submit", customersByRecipe);
    document.getElementById("loadTopCuisines").addEventListener("click", loadTopCuisines);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
    fetchAndDisplayCustomerType();
}
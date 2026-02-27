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

// Fetch and display ingredient table
async function fetchAllIngredients() {
    const table = document.getElementById("allIngredients");
    if (!table) return;
    
    const body = table.querySelector("tbody");

    const res = await fetch("/ingredients", { method: "GET" });
    const data = await res.json();

    const rows = data.data;

    body.innerHTML = "";

    rows.forEach(row => {
        const tr = body.insertRow();
        tr.insertCell(0).textContent = row.ID;
        tr.insertCell(1).textContent = row.NAME;
    });
}


// Fetch and display customer type and information
async function fetchAndDisplayCustomerType() {
    const tableElement1 = document.getElementById('customer');
    const tableBody1 = tableElement1.querySelector('tbody');

    const tableElement2 = document.getElementById('customerUpdateTable');
    const tableBody2 = tableElement2.querySelector('tbody');

    const response = await fetch('/customer', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    tableBody1.innerHTML = '';
    tableBody2.innerHTML = '';


    demotableContent.forEach(user => {
        const row1 = tableBody1.insertRow();
        user.forEach((field, index) => {
            row1.insertCell(index).textContent = field;
        });

        const row2 = tableBody2.insertRow();
        user.forEach((field, index) => {
            row2.insertCell(index).textContent = field;
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

    const title = document.getElementById('recipeTitleInput').value.trim();
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

    if (!data.data || data.data.length === 0) {
        msg.textContent = 'No customers found for that recipe and rating.';
        table.style.display = 'none';
        return;
    }

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

// UPDATE (Query 2)
async function updateCustomer() {
    const id = document.getElementById("updateCustomerID").value;
    const newName = document.getElementById("updateCustomerName").value;
    const newEmail = document.getElementById("updateCustomerEmail").value;
    const msg = document.getElementById("updateCustomerMsg");

    msg.textContent = ""; 

    if (!id) {
        msg.textContent = "Customer ID is required.";
        return;
    }

    if (!newName && !newEmail) {
        msg.textContent = "Enter a name or email to update.";
        return;
    }

    const response = await fetch(`/customer/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName, newEmail })
    });

    const data = await response.json();

    if (data.success) {
        msg.textContent = "Customer updated successfully!";
        fetchAndDisplayCustomerType();  
    } else {
        msg.textContent = data.message || "Failed to update customer.";
    }
}

// PROJECTION (Query 5)
async function runRecipeProjection() {
    const selected = [...document.querySelectorAll('.projAttr:checked')]
        .map(cb => cb.value);

    const msg = document.getElementById("projectionMsg");

    if (selected.length === 0) {
        msg.textContent = "Select at least one attribute.";
        return;
    }

    const res = await fetch("/recipes/projection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attributes: selected })
    });

    const data = await res.json();

    if (!data.success) {
        msg.textContent = "Projection failed.";
        return;
    }

    msg.textContent = "Projection successful.";

    // Render headers
    const headerRow = document.getElementById("projectionHeader");
    const body = document.getElementById("projectionBody");

    headerRow.innerHTML = "";
    body.innerHTML = "";

    selected.forEach(attr => {
        const th = document.createElement("th");
        th.textContent = attr;
        headerRow.appendChild(th);
    });

    data.data.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });
        body.appendChild(tr);
    });
}

// AGGREGATION WITH HAVING (Query 8)
async function runHavingQuery() {
    const thresholdInput = document.getElementById("havingThreshold");
    const msg = document.getElementById("havingMsg");
    const body = document.getElementById("havingBody");

    const thresholdStr = thresholdInput.value;
    msg.textContent = "";
    body.innerHTML = "";

    if (thresholdStr === "") {
        msg.textContent = "Enter a threshold.";
        return;
    }

    const threshold = Number(thresholdStr);

    if (Number.isNaN(threshold)) {
        msg.textContent = "Threshold must be a number.";
        return;
    }

    if (threshold > 5) {
        msg.textContent = "Threshold cannot be greater than 5. Rating is between 1 and 5.";
        return;
    }

    const res = await fetch("/recipes/avg-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threshold })
    });

    const data = await res.json();

    if (!data.data) {
        msg.textContent = data.message || "Query failed.";
        return;
    }

    msg.textContent = "Query executed successfully.";

    data.data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.TITLE || row[0]}</td>
            <td>${row.AVG_RATING || row[1]}</td>
        `;
        body.appendChild(tr);
    });
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    // fetchAllIngredients();
    fetchAndDisplayIngredients();
    document.getElementById("resetRecipe").addEventListener("click", resetRecipe);
    document.getElementById("insertRecipe").addEventListener("submit", insertRecipe);
    document.getElementById("selectCustomerType").addEventListener("click", selectCustomerType);
    document.getElementById("savedListCountBtn").addEventListener("click", savedListRecipeCount);
    document.getElementById("updateCustomerBtn").addEventListener("click", updateCustomer);
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
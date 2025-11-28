# Query Specification
This document is for deciding queries to implement in our project and will act as a guidance during implementation. It is so that we can track functionalities and see the overview of the application.

## INSERT
Query: Insert a recipe with ID, title, time_consumed, difficulty, and cuisineID
relation: `RECIPE`
values: 
    ID: INTEGER 
    title: CHAR(100)
    time_consumed: INTEGER
    difficulty: CHAR(20)
    cuisineID: INTEGER

PK: ID
CK: title
FK: cuisineID

if title is unique and ID is unique, insert new tuple in Recipe

sql:
```sql
INSERT INTO Recipe (ID, title, time_consumed, difficulty, cuisineID)
SELECT <ID>, '<title>', <time_consumed>, '<difficulty>', <cuisineID>
WHERE NOT EXISTS (
    SELECT 1 
    FROM RECIPE
    WHERE ID = <ID> OR title = <title>
)
AND EXISTS (
    SELECT 1 
    FROM Cuisine
    WHERE ID = <cuisineID>
);
```

## UPDATE
Query: UPDATE a Customer's name and/or email_address by selecting an existing Customer.
relation: `Customer`
updated attributes:
    name (non-PK), email_address (non-PK, UNIQUE)
PK: ID
CK: email_address

sql: 
```sql
UPDATE Customer
SET name = :newName,
    email_address = :newEmail
WHERE ID = :customerID;
```

## DELETE
Query: Delete an ingredient by ID. Deleting the ingredient also removes related tuples in Fresh, Processed, Contain, and CanHave via ON DELETE CASCADE.

sql:
```sql
DELETE FROM Ingredient
WHERE ID = <ID>;
```

## SELECTION
Query: SELECT FoodCritic or RecipeCreator and/or name.  Show all customer information that match those conditions.
(RecipeCreator has cookingHistory and FoodCritic has ratingHistory information shown as well)

sql:
```sql
SELECT C.ID, C.name, C.email_address, RC.cookingHistory AS history
FROM Customer C
JOIN RecipeCreator RC ON C.ID = RC.ID
ORDER BY C.ID

SELECT C.ID, C.name, C.email_address, FC.ratingHistory AS history
FROM Customer C
JOIN FoodCritic FC ON C.ID = FC.ID
ORDER BY C.ID
```
with name:
```sql
SELECT C.ID, C.name, C.email_address, RC.cookingHistory, FC.ratingHistory
   FROM Customer C
   LEFT JOIN RecipeCreator RC ON C.ID = RC.ID
   LEFT JOIN FoodCritic FC ON C.ID = FC.ID
   WHERE C.name = :name
   ORDER BY C.ID,
  [name],
  { autoCommit: false }
```

## PROJECTION
Query: Show only the selected attributes of the Recipe relatino based on user selection.
relation: Recipe
attributes:
    ID: INTEGER
    title: CHAR
    time_consumed: INTEGER
    difficulty: CHAR
    cuisineID: INTEGER
User input: User selects which attributes to display (any subset)

sql:
- If user selects ID+title:
```sql
SELECT ID, title
FROM Recipe;
```
- If user select title + difficulty + cuisineID:
```sql
SELECT title, difficulty, cuisineID
FROM Recipe;
```
- If user select all:
```sql
SELECT ID, title, time_consumed, difficulty, cuisineID
FROM Recipe;
```


## JOIN
query: For a given recipe title and minimum rating, find all customers who rated that recipe with at least that many stars, showing customer info and their rating.

sql:
```sql
SELECT C.ID, C.name, C.email_address, R.stars
FROM Customer C
JOIN Rate R ON C.ID = R.CustomerID
JOIN Recipe Re ON Re.ID = R.RecipeID
WHERE Re.title = '<recipeTitle>'
  AND R.stars >= <minStars>
ORDER BY C.ID;
```

## AGGREGATION with GROUPBY
query: Find and show the number of recipes in each savedList of the owner, alongside with the savedList ID and name. 

sql:
```sql
SELECT 
    S.name AS savedListName,
    C.name AS ownerName,
    COUNT(S.recipeID) AS recipeCount
FROM SavedLists S
JOIN Customer C ON S.ownerID = C.ID
GROUP BY S.name, C.name, S.ownerID
ORDER BY C.name, S.name;
```

## AGGREGATION with HAVING
Query: Find recipe titles whose average rating is greater than or equal to a user-selected threshold.
relations: Recipe, Rate
User input: threshold (e.g., 4.0, 4.5)

sql
```sql
SELECT R.title, AVG(RT.stars) AS avg_rating
FROM Recipe R
JOIN Rate RT ON R.ID = RT.RecipeID
GROUP BY R.ID, R.title
HAVING AVG(RT.stars) >= :threshold
ORDER BY avg_rating DESC;
```

## NESTED AGGREGATION with GROUPBY
query: Find the cuisine style(s) with the highest average recipe rating.

sql:
```sql
SELECT Cu.style, AVG(R.stars) AS avgCuisineRating
FROM Cuisine Cu
JOIN Recipe Re ON Cu.ID = Re.cuisineID
JOIN Rate R ON R.RecipeID = Re.ID
GROUP BY Cu.style
HAVING AVG(R.stars) >= ALL (
    SELECT AVG(R2.stars)
    FROM Cuisine Cu2
    JOIN Recipe Re2 ON Cu2.ID = Re2.cuisineID
    JOIN Rate R2 ON R2.RecipeID = Re2.ID
    GROUP BY Cu2.style
);
```

## DIVISION
query: Find the customer ID of the Recipe Creator whose recipe has an average rating of > 4.5

sql:
```sql
SELECT C.ID, C.name
FROM Customer C, AddRelation AR, Rate RT
JOIN AddRelation AR ON C.ID = AR.customerID
JOIN Rate RT ON AR.recipeID = R.ID
GROUP BY C.ID
HAVING AVG(stars) > 4.5
```

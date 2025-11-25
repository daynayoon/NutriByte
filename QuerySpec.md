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
## DELETE
Query: Delete an ingredient by ID. Deleting the ingredient also removes related tuples in Fresh, Processed, Contain, and CanHave via ON DELETE CASCADE.
sql:
```sql
DELETE FROM Ingredient
WHERE ID = <ID>;
```

## SELECTION
Query: SELECT FoodCritic or RecipeCreator and show all customer information for either one of those two categories.
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
## PROJECTION
## JOIN

## AGGREGATION with GROUPBY
query: Find and show the number of recipes in each savedList of the owner, alongside with the savedList ID and name. 

sql:
```sql
SELECT SL.ID, SL.name, COUNT(AR.RecipeID) AS RecipeCount
FROM AddRelation AR, SavedLists SL
LEFT JOIN AddRelation AR ON SL.ownerID = AR.customerID
GROUP BY SL.ID
ORDER BY SL.ID
```

## AGGREGATION with HAVING
## NESTED AGGREGATION with GROUPBY
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

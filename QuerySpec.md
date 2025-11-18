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
## SELECTION
Query: SELECT FoodCritic or RecipeCreator and show all customer information for either one of those two categories.
(RecipeCreator has cookingHistory and FoodCritic has ratingHistory information shown as well)

sql:
```sql
SELECT <ID>, '<name>', '<email_address>',
    CASE 
        WHEN <Food>
```
## PROJECTION
## JOIN
## AGGREGATION with GROUPBY
## AGGREGATION with HAVING
## NESTED AGGREGATION with GROUPBY
## DIVISION

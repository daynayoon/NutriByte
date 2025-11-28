DROP TABLE CanHave CASCADE CONSTRAINTS;
DROP TABLE RecipeReference CASCADE CONSTRAINTS;
DROP TABLE Contain CASCADE CONSTRAINTS;
DROP TABLE Rate CASCADE CONSTRAINTS;
DROP TABLE AddRelation CASCADE CONSTRAINTS;
DROP TABLE FoodCritic CASCADE CONSTRAINTS;
DROP TABLE RecipeCreator CASCADE CONSTRAINTS;
DROP TABLE Processed CASCADE CONSTRAINTS;
DROP TABLE Fresh CASCADE CONSTRAINTS;
DROP TABLE Nutrition2 CASCADE CONSTRAINTS;
DROP TABLE Nutrition1 CASCADE CONSTRAINTS;
DROP TABLE Allergen CASCADE CONSTRAINTS;
DROP TABLE Ingredient CASCADE CONSTRAINTS;
DROP TABLE Instruction CASCADE CONSTRAINTS;
DROP TABLE Recipe CASCADE CONSTRAINTS;
DROP TABLE Cuisine CASCADE CONSTRAINTS;
DROP TABLE SavedLists CASCADE CONSTRAINTS;
DROP TABLE Customer CASCADE CONSTRAINTS;

CREATE TABLE Customer (
  ID INTEGER,
  name CHAR(50),
  email_address CHAR(100) NOT NULL, 
  UNIQUE (email_address),
  PRIMARY KEY (ID)
);

CREATE TABLE SavedLists (
  ID INTEGER,
  name CHAR(50),
  ownerID INTEGER NOT NULL,
  recipeID INTEGER NOT NULL,
  UNIQUE (ownerID, name, recipeID),
  PRIMARY KEY (ID),
  FOREIGN KEY (ownerID) REFERENCES Customer(ID)
);

CREATE TABLE Cuisine (
  ID INTEGER,
  style CHAR(50),
  PRIMARY KEY (ID)
);

CREATE TABLE Recipe (
  ID INTEGER,
  title CHAR(100),
  time_consumed INTEGER,
  difficulty CHAR(20),
  cuisineID INTEGER,
  UNIQUE (title),
  PRIMARY KEY (ID),
  FOREIGN KEY (cuisineID) REFERENCES Cuisine(ID)
);

CREATE TABLE Instruction (
  step INTEGER,
  recipeID INTEGER,
  notes VARCHAR2(500),
  PRIMARY KEY (step, recipeID),
  FOREIGN KEY (recipeID) REFERENCES Recipe(ID)
);

CREATE TABLE Ingredient (
  ID INTEGER,
  name CHAR(100),
  UNIQUE (name),
  PRIMARY KEY (ID)
);

CREATE TABLE Allergen (
  ID INTEGER,
  name CHAR(100),
  UNIQUE (name),
  PRIMARY KEY (ID)
);

CREATE TABLE Nutrition1 (
  name CHAR(100),
  grams DECIMAL(6,2),
  recipeID INTEGER NOT NULL,
  PRIMARY KEY (name, recipeID),
  FOREIGN KEY (recipeID) REFERENCES Recipe(ID)
);

CREATE TABLE Nutrition2 (
  ID INTEGER,
  name CHAR(100),
  recipeID INTEGER,
  PRIMARY KEY (ID),
  FOREIGN KEY (recipeID) REFERENCES Recipe(ID)
);

CREATE TABLE Fresh (
  ID INTEGER,
  location CHAR(100),
  PRIMARY KEY (ID),
  FOREIGN KEY (ID) REFERENCES Ingredient(ID)
  ON DELETE CASCADE
  -- ON UPDATE CASCADE
);

CREATE TABLE Processed (
  ID INTEGER,
  companyName CHAR(100),
  PRIMARY KEY (ID),
  FOREIGN KEY (ID) REFERENCES Ingredient(ID)
  ON DELETE CASCADE
  -- ON UPDATE CASCADE
);


CREATE TABLE RecipeCreator (
  ID INTEGER,
  cookingHistory VARCHAR2(500),
  PRIMARY KEY (ID),
  FOREIGN KEY (ID) REFERENCES Customer(ID)
  ON DELETE CASCADE
  -- ON UPDATE CASCADE
);

CREATE TABLE FoodCritic (
  ID INTEGER,
  ratingHistory VARCHAR2(500),
  PRIMARY KEY (ID),
  FOREIGN KEY (ID) REFERENCES Customer(ID)
  ON DELETE CASCADE
  -- ON UPDATE CASCADE
);


CREATE TABLE AddRelation (
  CustomerID INTEGER,
  RecipeID INTEGER,
  PRIMARY KEY (CustomerID, RecipeID),
  FOREIGN KEY (CustomerID) REFERENCES Customer(ID),
  FOREIGN KEY (RecipeID) REFERENCES Recipe(ID)
);

CREATE TABLE Rate (
  CustomerID INTEGER,
  RecipeID INTEGER,
  stars INTEGER,
  PRIMARY KEY (CustomerID, RecipeID),
  FOREIGN KEY (CustomerID) REFERENCES Customer(ID),
  FOREIGN KEY (RecipeID) REFERENCES Recipe(ID),
  CHECK (stars BETWEEN 1 AND 5)
);

CREATE TABLE Contain (
  RecipeID INTEGER,
  IngredientID INTEGER,
  PRIMARY KEY (RecipeID, IngredientID),
  FOREIGN KEY (RecipeID) REFERENCES Recipe(ID),
  FOREIGN KEY (IngredientID) REFERENCES Ingredient(ID)
);

CREATE TABLE RecipeReference (
  RecipeID INTEGER,
  ReferenceID INTEGER,
  PRIMARY KEY (RecipeID, ReferenceID),
  FOREIGN KEY (RecipeID) REFERENCES Recipe(ID),
  FOREIGN KEY (ReferenceID) REFERENCES Recipe(ID)
);

CREATE TABLE CanHave (
  IngredientID INTEGER,
  AllergenID INTEGER,
  PRIMARY KEY (IngredientID, AllergenID),
  FOREIGN KEY (IngredientID) REFERENCES Ingredient(ID),
  FOREIGN KEY (AllergenID) REFERENCES Allergen(ID)
);


INSERT INTO Customer VALUES (1, 'Satsuki Onome', 'satsuki@example.com');
INSERT INTO Customer VALUES (2, 'Dayna Yoon', 'dayna@example.com');
INSERT INTO Customer VALUES (3, 'Sarah Liang', 'sarah@example.com');
INSERT INTO Customer VALUES (4, 'cpsc304', 'cpsc304@example.com');
INSERT INTO Customer VALUES (5, 'ubc cs', 'ubccs@example.com');
INSERT INTO Customer VALUES (100, 'food critic', 'food_critic@example.com');
INSERT INTO Customer VALUES (200, 'recipe creator', 'recipe_creator@example.com');
INSERT INTO Customer VALUES (300, 'just customer', 'just_customer@example.com');

INSERT INTO RecipeCreator VALUES (1, 'Created 10 recipes this month');
INSERT INTO RecipeCreator VALUES (2, 'Specializes in Korean dishes');
INSERT INTO RecipeCreator VALUES (3, 'Focuses on Italian fusion');
INSERT INTO RecipeCreator VALUES (4, 'Tests community recipes');
INSERT INTO RecipeCreator VALUES (5, 'New creator, learning sushi');
INSERT INTO RecipeCreator VALUES (200, 'recipe professional');

INSERT INTO FoodCritic VALUES (1, 'Rated 50 recipes in total');
INSERT INTO FoodCritic VALUES (2, 'Prefers spicy foods');
INSERT INTO FoodCritic VALUES (3, 'Writes detailed reviews');
INSERT INTO FoodCritic VALUES (4, 'Cares about presentation');
INSERT INTO FoodCritic VALUES (5, 'Values ingredient quality');
INSERT INTO FoodCritic VALUES (100, 'food criticizing professional');

INSERT INTO SavedLists VALUES (1, 'Favorites', 1, 1);
INSERT INTO SavedLists VALUES (2, 'To Try', 2, 2);
INSERT INTO SavedLists VALUES (12, 'Favorites', 2, 5);
INSERT INTO SavedLists VALUES (3, 'High Protein', 3, 3);
INSERT INTO SavedLists VALUES (13, 'High Protein', 3, 6);
INSERT INTO SavedLists VALUES (4, 'Spicy Food', 4, 1);
INSERT INTO SavedLists VALUES (5, 'Comfort Meals', 5, 2);

INSERT INTO Cuisine VALUES (1, 'Japanese');
INSERT INTO Cuisine VALUES (2, 'Italian');
INSERT INTO Cuisine VALUES (3, 'Korean');
INSERT INTO Cuisine VALUES (4, 'Chinese');
INSERT INTO Cuisine VALUES (5, 'Western');

INSERT INTO Recipe VALUES (1, 'Pasta Carbonara', 25, 'Medium', 2);
INSERT INTO Recipe VALUES (2, 'Tteokbokki', 20, 'Easy', 3);
INSERT INTO Recipe VALUES (3, 'Sushi', 45, 'Hard', 1);
INSERT INTO Recipe VALUES (4, 'Fried Rice', 15, 'Easy', 4);
INSERT INTO Recipe VALUES (5, 'Burger', 30, 'Medium', 5);

INSERT INTO Instruction VALUES (1, 1, 'Boil pasta until al dente.');
INSERT INTO Instruction VALUES (2, 1, 'Mix egg and cheese in bowl.');
INSERT INTO Instruction VALUES (1, 2, 'Boil rice cakes in spicy sauce.');
INSERT INTO Instruction VALUES (1, 3, 'Prepare sushi rice and roll with fillings.');
INSERT INTO Instruction VALUES (1, 4, 'Stir-fry rice with vegetables.');

INSERT INTO Ingredient VALUES (1, 'Egg');
INSERT INTO Ingredient VALUES (2, 'Peanut');
INSERT INTO Ingredient VALUES (3, 'Pasta Noodle');
INSERT INTO Ingredient VALUES (4, 'Cheese');
INSERT INTO Ingredient VALUES (5, 'Soy');
INSERT INTO Ingredient VALUES (6, 'Tomato');
INSERT INTO Ingredient VALUES (7, 'Lettuce');
INSERT INTO Ingredient VALUES (8, 'Garlic');
INSERT INTO Ingredient VALUES (9, 'Milk');
INSERT INTO Ingredient VALUES (10, 'Chicken');

INSERT INTO Fresh VALUES (2, 'Vancouver Farm Market'); 
INSERT INTO Fresh VALUES (5, 'Vancouver Farm Market');
INSERT INTO Fresh VALUES (6, 'BC Tomato Farm');
INSERT INTO Fresh VALUES (7, 'Green Leaf Farm');
INSERT INTO Fresh VALUES (10, 'Free Range Poultry');

INSERT INTO Processed VALUES (1, 'Golden Eggs Farm.');
INSERT INTO Processed VALUES (3, 'Walmart'); 
INSERT INTO Processed VALUES (4, 'Dairyland Foods');
INSERT INTO Processed VALUES (8, 'Garlic Picks.'); 
INSERT INTO Processed VALUES (9, 'Happy Cow Dairy');

INSERT INTO Allergen VALUES (1, 'Egg');
INSERT INTO Allergen VALUES (2, 'Dairy');
INSERT INTO Allergen VALUES (3, 'Gluten');
INSERT INTO Allergen VALUES (4, 'Peanut');
INSERT INTO Allergen VALUES (5, 'Soy');

INSERT INTO Nutrition1 VALUES ('Protein', 12.50, 1);
INSERT INTO Nutrition1 VALUES ('Fat', 8.30, 1);
INSERT INTO Nutrition1 VALUES ('Carbs', 65.20, 2);
INSERT INTO Nutrition1 VALUES ('Protein', 10.00, 3);
INSERT INTO Nutrition1 VALUES ('Fat', 5.40, 4);

INSERT INTO Nutrition2 VALUES (1, 'Protein', 1);
INSERT INTO Nutrition2 VALUES (2, 'Fat', 1);
INSERT INTO Nutrition2 VALUES (3, 'Carbs', 2);
INSERT INTO Nutrition2 VALUES (4, 'Protein', 3);
INSERT INTO Nutrition2 VALUES (5, 'Fat', 4);

INSERT INTO AddRelation VALUES (1, 1);
INSERT INTO AddRelation VALUES (1, 2);
INSERT INTO AddRelation VALUES (2, 3);
INSERT INTO AddRelation VALUES (3, 4);
INSERT INTO AddRelation VALUES (4, 5);

INSERT INTO Rate VALUES (1, 1, 5);
INSERT INTO Rate VALUES (2, 1, 5);
INSERT INTO Rate VALUES (3, 1, 4);
INSERT INTO Rate VALUES (4, 1, 5);
INSERT INTO Rate VALUES (5, 1, 5);
INSERT INTO Rate VALUES (100, 1, 5);
INSERT INTO Rate VALUES (200, 1, 4);
INSERT INTO Rate VALUES (300, 1, 5);
INSERT INTO Rate VALUES (1, 2, 4);
INSERT INTO Rate VALUES (2, 2, 3);
INSERT INTO Rate VALUES (3, 2, 5);
INSERT INTO Rate VALUES (4, 2, 4);
INSERT INTO Rate VALUES (5, 2, 4);
INSERT INTO Rate VALUES (100, 2, 3);
INSERT INTO Rate VALUES (200, 2, 4);
INSERT INTO Rate VALUES (300, 2, 3);
INSERT INTO Rate VALUES (1, 3, 2);
INSERT INTO Rate VALUES (2, 3, 2);
INSERT INTO Rate VALUES (3, 3, 3);
INSERT INTO Rate VALUES (4, 3, 1);
INSERT INTO Rate VALUES (5, 3, 2);
INSERT INTO Rate VALUES (100, 3, 2);
INSERT INTO Rate VALUES (200, 3, 1);
INSERT INTO Rate VALUES (300, 3, 2);
INSERT INTO Rate VALUES (1, 4, 4);
INSERT INTO Rate VALUES (2, 4, 4);
INSERT INTO Rate VALUES (3, 4, 3);
INSERT INTO Rate VALUES (4, 4, 5);
INSERT INTO Rate VALUES (5, 4, 4);
INSERT INTO Rate VALUES (100, 4, 4);
INSERT INTO Rate VALUES (200, 4, 5);
INSERT INTO Rate VALUES (300, 4, 3);
INSERT INTO Rate VALUES (1, 5, 5);
INSERT INTO Rate VALUES (2, 5, 5);
INSERT INTO Rate VALUES (3, 5, 4);
INSERT INTO Rate VALUES (4, 5, 5);
INSERT INTO Rate VALUES (5, 5, 5);
INSERT INTO Rate VALUES (100, 5, 5);
INSERT INTO Rate VALUES (200, 5, 5);
INSERT INTO Rate VALUES (300, 5, 4);


INSERT INTO Contain VALUES (1, 3);
INSERT INTO Contain VALUES (1, 1);
INSERT INTO Contain VALUES (1, 4);
INSERT INTO Contain VALUES (2, 2);
INSERT INTO Contain VALUES (4, 5);

INSERT INTO RecipeReference VALUES (1, 2);
INSERT INTO RecipeReference VALUES (2, 3);
INSERT INTO RecipeReference VALUES (3, 4); 
INSERT INTO RecipeReference VALUES (4, 5);
INSERT INTO RecipeReference VALUES (5, 1);

INSERT INTO CanHave VALUES (1, 1);
INSERT INTO CanHave VALUES (4, 2);
INSERT INTO CanHave VALUES (3, 3);
INSERT INTO CanHave VALUES (5, 5);
INSERT INTO CanHave VALUES (2, 4);


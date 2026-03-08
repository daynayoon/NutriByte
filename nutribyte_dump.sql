--
-- PostgreSQL database dump
--

\restrict 34f3yvzE6PexPFdIQUYKuODmXuK2zcAHSNcZ5MjNxwCgleAyX0HtDJKoFP5IaVw

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.savedlists DROP CONSTRAINT IF EXISTS savedlists_ownerid_fkey;
ALTER TABLE IF EXISTS ONLY public.recipecreator DROP CONSTRAINT IF EXISTS recipecreator_id_fkey;
ALTER TABLE IF EXISTS ONLY public.recipe DROP CONSTRAINT IF EXISTS recipe_cuisineid_fkey;
ALTER TABLE IF EXISTS ONLY public.rate DROP CONSTRAINT IF EXISTS rate_customerid_fkey;
ALTER TABLE IF EXISTS ONLY public.processed DROP CONSTRAINT IF EXISTS processed_id_fkey;
ALTER TABLE IF EXISTS ONLY public.fresh DROP CONSTRAINT IF EXISTS fresh_id_fkey;
ALTER TABLE IF EXISTS ONLY public.foodcritic DROP CONSTRAINT IF EXISTS foodcritic_id_fkey;
ALTER TABLE IF EXISTS ONLY public.contain DROP CONSTRAINT IF EXISTS contain_ingredientid_fkey;
ALTER TABLE IF EXISTS ONLY public.canhave DROP CONSTRAINT IF EXISTS canhave_ingredientid_fkey;
ALTER TABLE IF EXISTS ONLY public.canhave DROP CONSTRAINT IF EXISTS canhave_allergenid_fkey;
ALTER TABLE IF EXISTS ONLY public.addrelation DROP CONSTRAINT IF EXISTS addrelation_customerid_fkey;
ALTER TABLE IF EXISTS ONLY public.savedlists DROP CONSTRAINT IF EXISTS savedlists_pkey;
ALTER TABLE IF EXISTS ONLY public.savedlists DROP CONSTRAINT IF EXISTS savedlists_ownerid_name_recipeid_key;
ALTER TABLE IF EXISTS ONLY public.recipereference DROP CONSTRAINT IF EXISTS recipereference_pkey;
ALTER TABLE IF EXISTS ONLY public.recipecreator DROP CONSTRAINT IF EXISTS recipecreator_pkey;
ALTER TABLE IF EXISTS ONLY public.recipe DROP CONSTRAINT IF EXISTS recipe_title_key;
ALTER TABLE IF EXISTS ONLY public.recipe DROP CONSTRAINT IF EXISTS recipe_pkey;
ALTER TABLE IF EXISTS ONLY public.rate DROP CONSTRAINT IF EXISTS rate_pkey;
ALTER TABLE IF EXISTS ONLY public.processed DROP CONSTRAINT IF EXISTS processed_pkey;
ALTER TABLE IF EXISTS ONLY public.nutrition2 DROP CONSTRAINT IF EXISTS nutrition2_pkey;
ALTER TABLE IF EXISTS ONLY public.nutrition1 DROP CONSTRAINT IF EXISTS nutrition1_pkey;
ALTER TABLE IF EXISTS ONLY public.instruction DROP CONSTRAINT IF EXISTS instruction_pkey;
ALTER TABLE IF EXISTS ONLY public.ingredient DROP CONSTRAINT IF EXISTS ingredient_pkey;
ALTER TABLE IF EXISTS ONLY public.ingredient DROP CONSTRAINT IF EXISTS ingredient_name_key;
ALTER TABLE IF EXISTS ONLY public.fresh DROP CONSTRAINT IF EXISTS fresh_pkey;
ALTER TABLE IF EXISTS ONLY public.foodcritic DROP CONSTRAINT IF EXISTS foodcritic_pkey;
ALTER TABLE IF EXISTS ONLY public.customer DROP CONSTRAINT IF EXISTS customer_pkey;
ALTER TABLE IF EXISTS ONLY public.customer DROP CONSTRAINT IF EXISTS customer_email_address_key;
ALTER TABLE IF EXISTS ONLY public.cuisine DROP CONSTRAINT IF EXISTS cuisine_pkey;
ALTER TABLE IF EXISTS ONLY public.contain DROP CONSTRAINT IF EXISTS contain_pkey;
ALTER TABLE IF EXISTS ONLY public.canhave DROP CONSTRAINT IF EXISTS canhave_pkey;
ALTER TABLE IF EXISTS ONLY public.allergen DROP CONSTRAINT IF EXISTS allergen_pkey;
ALTER TABLE IF EXISTS ONLY public.allergen DROP CONSTRAINT IF EXISTS allergen_name_key;
ALTER TABLE IF EXISTS ONLY public.addrelation DROP CONSTRAINT IF EXISTS addrelation_pkey;
DROP TABLE IF EXISTS public.savedlists;
DROP TABLE IF EXISTS public.recipereference;
DROP TABLE IF EXISTS public.recipecreator;
DROP TABLE IF EXISTS public.recipe;
DROP TABLE IF EXISTS public.rate;
DROP TABLE IF EXISTS public.processed;
DROP TABLE IF EXISTS public.nutrition2;
DROP TABLE IF EXISTS public.nutrition1;
DROP TABLE IF EXISTS public.instruction;
DROP TABLE IF EXISTS public.ingredient;
DROP TABLE IF EXISTS public.fresh;
DROP TABLE IF EXISTS public.foodcritic;
DROP TABLE IF EXISTS public.customer;
DROP TABLE IF EXISTS public.cuisine;
DROP TABLE IF EXISTS public.contain;
DROP TABLE IF EXISTS public.canhave;
DROP TABLE IF EXISTS public.allergen;
DROP TABLE IF EXISTS public.addrelation;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addrelation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addrelation (
    customerid integer NOT NULL,
    recipeid integer NOT NULL
);


ALTER TABLE public.addrelation OWNER TO postgres;

--
-- Name: allergen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.allergen (
    id integer NOT NULL,
    name character(100)
);


ALTER TABLE public.allergen OWNER TO postgres;

--
-- Name: canhave; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.canhave (
    ingredientid integer NOT NULL,
    allergenid integer NOT NULL
);


ALTER TABLE public.canhave OWNER TO postgres;

--
-- Name: contain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contain (
    recipeid integer NOT NULL,
    ingredientid integer NOT NULL
);


ALTER TABLE public.contain OWNER TO postgres;

--
-- Name: cuisine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuisine (
    id integer NOT NULL,
    style character(50)
);


ALTER TABLE public.cuisine OWNER TO postgres;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    id integer NOT NULL,
    name character(50),
    email_address character(100) NOT NULL
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: foodcritic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.foodcritic (
    id integer NOT NULL,
    ratinghistory character varying(500)
);


ALTER TABLE public.foodcritic OWNER TO postgres;

--
-- Name: fresh; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fresh (
    id integer NOT NULL,
    location character(100)
);


ALTER TABLE public.fresh OWNER TO postgres;

--
-- Name: ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredient (
    id integer NOT NULL,
    name character(100)
);


ALTER TABLE public.ingredient OWNER TO postgres;

--
-- Name: instruction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.instruction (
    step integer NOT NULL,
    recipeid integer NOT NULL,
    notes character varying(500)
);


ALTER TABLE public.instruction OWNER TO postgres;

--
-- Name: nutrition1; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nutrition1 (
    name character(100) NOT NULL,
    grams numeric(6,2),
    recipeid integer NOT NULL
);


ALTER TABLE public.nutrition1 OWNER TO postgres;

--
-- Name: nutrition2; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nutrition2 (
    id integer NOT NULL,
    name character(100),
    recipeid integer
);


ALTER TABLE public.nutrition2 OWNER TO postgres;

--
-- Name: processed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.processed (
    id integer NOT NULL,
    companyname character(100)
);


ALTER TABLE public.processed OWNER TO postgres;

--
-- Name: rate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rate (
    customerid integer NOT NULL,
    recipeid integer NOT NULL,
    stars integer,
    CONSTRAINT rate_stars_check CHECK (((stars >= 1) AND (stars <= 5)))
);


ALTER TABLE public.rate OWNER TO postgres;

--
-- Name: recipe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe (
    id integer NOT NULL,
    title character(100),
    time_consumed integer,
    difficulty character(20),
    cuisineid integer
);


ALTER TABLE public.recipe OWNER TO postgres;

--
-- Name: recipecreator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipecreator (
    id integer NOT NULL,
    cookinghistory character varying(500)
);


ALTER TABLE public.recipecreator OWNER TO postgres;

--
-- Name: recipereference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipereference (
    recipeid integer NOT NULL,
    referenceid integer NOT NULL
);


ALTER TABLE public.recipereference OWNER TO postgres;

--
-- Name: savedlists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.savedlists (
    id integer NOT NULL,
    name character(50),
    ownerid integer NOT NULL,
    recipeid integer NOT NULL
);


ALTER TABLE public.savedlists OWNER TO postgres;

--
-- Data for Name: addrelation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addrelation (customerid, recipeid) FROM stdin;
1	1
1	2
2	3
3	4
4	5
1	6
3	7
4	8
2	9
3	10
\.


--
-- Data for Name: allergen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.allergen (id, name) FROM stdin;
1	Egg                                                                                                 
2	Dairy                                                                                               
3	Gluten                                                                                              
4	Peanut                                                                                              
5	Soy                                                                                                 
\.


--
-- Data for Name: canhave; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.canhave (ingredientid, allergenid) FROM stdin;
1	1
4	2
3	3
5	5
2	4
\.


--
-- Data for Name: contain; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contain (recipeid, ingredientid) FROM stdin;
1	3
1	1
1	4
2	2
4	5
6	3
6	4
6	6
6	8
8	4
7	10
\.


--
-- Data for Name: cuisine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuisine (id, style) FROM stdin;
1	Japanese                                          
2	Italian                                           
3	Korean                                            
4	Chinese                                           
5	Western                                           
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (id, name, email_address) FROM stdin;
1	Satsuki Onome                                     	satsuki@example.com                                                                                 
2	Dayna Yoon                                        	dayna@example.com                                                                                   
3	Sarah Liang                                       	sarah@example.com                                                                                   
4	cpsc304                                           	cpsc304@example.com                                                                                 
5	ubc cs                                            	ubccs@example.com                                                                                   
100	food critic                                       	food_critic@example.com                                                                             
200	recipe creator                                    	recipe_creator@example.com                                                                          
300	just customer                                     	just_customer@example.com                                                                           
\.


--
-- Data for Name: foodcritic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.foodcritic (id, ratinghistory) FROM stdin;
1	Rated 50 recipes in total
2	Prefers spicy foods
3	Writes detailed reviews
4	Cares about presentation
5	Values ingredient quality
100	food criticizing professional
\.


--
-- Data for Name: fresh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fresh (id, location) FROM stdin;
2	Vancouver Farm Market                                                                               
5	Vancouver Farm Market                                                                               
6	BC Tomato Farm                                                                                      
7	Green Leaf Farm                                                                                     
10	Free Range Poultry                                                                                  
\.


--
-- Data for Name: ingredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredient (id, name) FROM stdin;
1	Egg                                                                                                 
2	Peanut                                                                                              
3	Pasta Noodle                                                                                        
4	Cheese                                                                                              
5	Soy                                                                                                 
6	Tomato                                                                                              
7	Lettuce                                                                                             
8	Garlic                                                                                              
9	Milk                                                                                                
10	Chicken                                                                                             
\.


--
-- Data for Name: instruction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.instruction (step, recipeid, notes) FROM stdin;
1	1	Boil pasta until al dente.
2	1	Mix egg and cheese in bowl.
1	2	Boil rice cakes in spicy sauce.
1	3	Prepare sushi rice and roll with fillings.
1	4	Stir-fry rice with vegetables.
\.


--
-- Data for Name: nutrition1; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nutrition1 (name, grams, recipeid) FROM stdin;
Protein                                                                                             	12.50	1
Fat                                                                                                 	8.30	1
Carbs                                                                                               	65.20	2
Protein                                                                                             	10.00	3
Fat                                                                                                 	5.40	4
\.


--
-- Data for Name: nutrition2; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nutrition2 (id, name, recipeid) FROM stdin;
1	Protein                                                                                             	1
2	Fat                                                                                                 	1
3	Carbs                                                                                               	2
4	Protein                                                                                             	3
5	Fat                                                                                                 	4
\.


--
-- Data for Name: processed; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.processed (id, companyname) FROM stdin;
1	Golden Eggs Farm.                                                                                   
3	Walmart                                                                                             
4	Dairyland Foods                                                                                     
8	Garlic Picks.                                                                                       
9	Happy Cow Dairy                                                                                     
\.


--
-- Data for Name: rate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rate (customerid, recipeid, stars) FROM stdin;
1	1	5
2	1	5
3	1	4
4	1	5
5	1	5
100	1	5
200	1	4
300	1	5
1	2	4
2	2	3
3	2	5
4	2	4
5	2	4
100	2	3
200	2	4
300	2	3
1	3	2
2	3	2
3	3	3
4	3	1
5	3	2
100	3	2
200	3	1
300	3	2
1	4	4
2	4	4
3	4	3
4	4	5
5	4	4
100	4	4
200	4	5
300	4	3
1	5	5
2	5	5
3	5	4
4	5	5
5	5	5
100	5	5
200	5	5
300	5	4
\.


--
-- Data for Name: recipe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipe (id, title, time_consumed, difficulty, cuisineid) FROM stdin;
1	Pasta Carbonara                                                                                     	25	Medium              	2
2	Tteokbokki                                                                                          	20	Easy                	3
3	Sushi                                                                                               	45	Hard                	1
4	Fried Rice                                                                                          	15	Easy                	4
5	Burger                                                                                              	30	Medium              	5
6	Pasta Bolognese                                                                                     	25	Medium              	2
7	Fried Chicken                                                                                       	40	Medium              	5
8	Pizza                                                                                               	45	Hard                	2
9	Kimbap                                                                                              	30	Medium              	3
10	Dimsum                                                                                              	60	Hard                	4
\.


--
-- Data for Name: recipecreator; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipecreator (id, cookinghistory) FROM stdin;
1	Created 10 recipes this month
2	Specializes in Korean dishes
3	Focuses on Italian fusion
4	Tests community recipes
5	New creator, learning sushi
200	recipe professional
\.


--
-- Data for Name: recipereference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipereference (recipeid, referenceid) FROM stdin;
1	2
2	3
3	4
4	5
5	1
\.


--
-- Data for Name: savedlists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.savedlists (id, name, ownerid, recipeid) FROM stdin;
1	Favorites                                         	1	1
2	To Try                                            	2	2
12	Favorites                                         	2	5
3	High Protein                                      	3	3
13	High Protein                                      	3	4
4	Spicy Food                                        	4	1
5	Comfort Meals                                     	5	2
\.


--
-- Name: addrelation addrelation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addrelation
    ADD CONSTRAINT addrelation_pkey PRIMARY KEY (customerid, recipeid);


--
-- Name: allergen allergen_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.allergen
    ADD CONSTRAINT allergen_name_key UNIQUE (name);


--
-- Name: allergen allergen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.allergen
    ADD CONSTRAINT allergen_pkey PRIMARY KEY (id);


--
-- Name: canhave canhave_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canhave
    ADD CONSTRAINT canhave_pkey PRIMARY KEY (ingredientid, allergenid);


--
-- Name: contain contain_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contain
    ADD CONSTRAINT contain_pkey PRIMARY KEY (recipeid, ingredientid);


--
-- Name: cuisine cuisine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuisine
    ADD CONSTRAINT cuisine_pkey PRIMARY KEY (id);


--
-- Name: customer customer_email_address_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_email_address_key UNIQUE (email_address);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: foodcritic foodcritic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foodcritic
    ADD CONSTRAINT foodcritic_pkey PRIMARY KEY (id);


--
-- Name: fresh fresh_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fresh
    ADD CONSTRAINT fresh_pkey PRIMARY KEY (id);


--
-- Name: ingredient ingredient_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_name_key UNIQUE (name);


--
-- Name: ingredient ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_pkey PRIMARY KEY (id);


--
-- Name: instruction instruction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instruction
    ADD CONSTRAINT instruction_pkey PRIMARY KEY (step, recipeid);


--
-- Name: nutrition1 nutrition1_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nutrition1
    ADD CONSTRAINT nutrition1_pkey PRIMARY KEY (name, recipeid);


--
-- Name: nutrition2 nutrition2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nutrition2
    ADD CONSTRAINT nutrition2_pkey PRIMARY KEY (id);


--
-- Name: processed processed_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processed
    ADD CONSTRAINT processed_pkey PRIMARY KEY (id);


--
-- Name: rate rate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rate
    ADD CONSTRAINT rate_pkey PRIMARY KEY (customerid, recipeid);


--
-- Name: recipe recipe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe
    ADD CONSTRAINT recipe_pkey PRIMARY KEY (id);


--
-- Name: recipe recipe_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe
    ADD CONSTRAINT recipe_title_key UNIQUE (title);


--
-- Name: recipecreator recipecreator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipecreator
    ADD CONSTRAINT recipecreator_pkey PRIMARY KEY (id);


--
-- Name: recipereference recipereference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipereference
    ADD CONSTRAINT recipereference_pkey PRIMARY KEY (recipeid, referenceid);


--
-- Name: savedlists savedlists_ownerid_name_recipeid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.savedlists
    ADD CONSTRAINT savedlists_ownerid_name_recipeid_key UNIQUE (ownerid, name, recipeid);


--
-- Name: savedlists savedlists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.savedlists
    ADD CONSTRAINT savedlists_pkey PRIMARY KEY (id);


--
-- Name: addrelation addrelation_customerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addrelation
    ADD CONSTRAINT addrelation_customerid_fkey FOREIGN KEY (customerid) REFERENCES public.customer(id);


--
-- Name: canhave canhave_allergenid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canhave
    ADD CONSTRAINT canhave_allergenid_fkey FOREIGN KEY (allergenid) REFERENCES public.allergen(id);


--
-- Name: canhave canhave_ingredientid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canhave
    ADD CONSTRAINT canhave_ingredientid_fkey FOREIGN KEY (ingredientid) REFERENCES public.ingredient(id);


--
-- Name: contain contain_ingredientid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contain
    ADD CONSTRAINT contain_ingredientid_fkey FOREIGN KEY (ingredientid) REFERENCES public.ingredient(id);


--
-- Name: foodcritic foodcritic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foodcritic
    ADD CONSTRAINT foodcritic_id_fkey FOREIGN KEY (id) REFERENCES public.customer(id) ON DELETE CASCADE;


--
-- Name: fresh fresh_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fresh
    ADD CONSTRAINT fresh_id_fkey FOREIGN KEY (id) REFERENCES public.ingredient(id) ON DELETE CASCADE;


--
-- Name: processed processed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processed
    ADD CONSTRAINT processed_id_fkey FOREIGN KEY (id) REFERENCES public.ingredient(id) ON DELETE CASCADE;


--
-- Name: rate rate_customerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rate
    ADD CONSTRAINT rate_customerid_fkey FOREIGN KEY (customerid) REFERENCES public.customer(id);


--
-- Name: recipe recipe_cuisineid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe
    ADD CONSTRAINT recipe_cuisineid_fkey FOREIGN KEY (cuisineid) REFERENCES public.cuisine(id);


--
-- Name: recipecreator recipecreator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipecreator
    ADD CONSTRAINT recipecreator_id_fkey FOREIGN KEY (id) REFERENCES public.customer(id) ON DELETE CASCADE;


--
-- Name: savedlists savedlists_ownerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.savedlists
    ADD CONSTRAINT savedlists_ownerid_fkey FOREIGN KEY (ownerid) REFERENCES public.customer(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 34f3yvzE6PexPFdIQUYKuODmXuK2zcAHSNcZ5MjNxwCgleAyX0HtDJKoFP5IaVw


import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import 'dotenv/config';

// Σύνδεση σε Διακομιστή (Connect to Server)
const διακ = express();
const πύλη = 3000;

// Σύνδεση σε Βάση Δεδομένων (Connect to Database)
const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'λίστες',
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

db.connect();

// Αρχικές Τιμές (Initial Values)
let υπομνήσεις = [];


// Λειτουργίες (Functions)
const λήψηΥπομνήσεων = async (res, req, next) => {
  const δεδομένα = await db.query('SELECT * from υπομνήσεις');
  υπομνήσεις = δεδομένα.rows;
  console.log('Υπομνήσεις', υπομνήσεις);
  next();
};

// Ενδιάμεσες Λειτουργίες (Middleware)
διακ.use(bodyParser.urlencoded({ extended: true }));
διακ.use(express.static('public'));
διακ.use(λήψηΥπομνήσεων);

// GET
διακ.get('/', (req, res) => {
  res.render('index.ejs', {
    listTitle: 'Σήμερα',
    listItems: υπομνήσεις,
  });
});

// POST
διακ.post('/add', (req, res) => {
  const νέαΥπόμνηση = req.body.newItem;
  // console.log(νέαΥπόμνηση)
  db.query(`INSERT INTO υπομνήσεις (title) VALUES ('${νέαΥπόμνηση}')`);
  res.redirect('/');
});

διακ.post('/edit', (req, res) => {
  const νέοςΤίτλοςΥπόμνησης = req.body.updatedItemTitle;
  const τΥπόμνησης = parseInt(req.body.updatedItemId);
  db.query(`UPDATE υπομνήσεις SET title = '${νέοςΤίτλοςΥπόμνησης}' WHERE id = ${τΥπόμνησης}`);
  res.redirect('/');
});

διακ.post('/delete', (req, res) => {
  const τΥπόμνησης = parseInt(req.body.deleteItemId);
  db.query(`DELETE FROM υπομνήσεις
  WHERE id = ${τΥπόμνησης}`);
  res.redirect('/');
});

// PUT
// PATCH
// DELETE

διακ.listen(πύλη, () => {
  console.log(
    `Διακομιστής: Ενεργός στην πύλη ${πύλη} --> http://localhost:${πύλη}`
  );
});

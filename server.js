const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.listen(4000, () => {
  console.log('Server running at http://localhost:3000');
});     

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (e.g., HTML, CSS, JS)

// Connect to SQLite database
const db = new sqlite3.Database('./college.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create tables if they don't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            department TEXT NOT NULL,
            regno TEXT NOT NULL,
            city TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS faculty (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            empid TEXT NOT NULL,
            name TEXT NOT NULL,
            department TEXT NOT NULL,
            city TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating tables:', err.message);
        } else {
            console.log('Tables created or already exist.');
        }
    });
});

// Routes for Students
app.post('/add-student', (req, res) => {
    const { name, department, regno, city } = req.body;
    const query = `INSERT INTO students (name, department, regno, city) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, department, regno, city], function (err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).send('Error inserting data.');
        }
        res.send('Student added successfully!');
    });
});

app.get('/students', (req, res) => {
    const query = `SELECT * FROM students`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return res.status(500).send('Error fetching data.');
        }
        res.json(rows); // Return the rows as JSON
    });
});

// Update a student
app.put('/update-student/:id', (req, res) => {
    const { id } = req.params;
    const { name, department, regno, city } = req.body;
    const query = `UPDATE students SET name = ?, department = ?, regno = ?, city = ? WHERE id = ?`;
    db.run(query, [name, department, regno, city, id], function (err) {
        if (err) {
            console.error('Error updating student:', err.message);
            return res.status(500).send('Error updating student.');
        }
        res.send('Student updated successfully!');
    });
});

// Delete a student
app.delete('/delete-student/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM students WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            console.error('Error deleting student:', err.message);
            return res.status(500).send('Error deleting student.');
        }
        res.send('Student deleted successfully!');
    });
});

// Routes for Faculty
app.post('/add-faculty', (req, res) => {
    const { empid, name, department, city } = req.body;
    const query = `INSERT INTO faculty (empid, name, department, city) VALUES (?, ?, ?, ?)`;
    db.run(query, [empid, name, department, city], function (err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).send('Error inserting data.');
        }
        res.send('Faculty member added successfully!');
    });
});

app.get('/faculty', (req, res) => {
    const query = `SELECT * FROM faculty`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return res.status(500).send('Error fetching data.');
        }
        res.json(rows); // Return the rows as JSON
    });
});

// Update and Delete Routes for Faculty
app.put('/update-faculty/:id', (req, res) => {
    const { id } = req.params;
    const { empid, name, department, city } = req.body;
    const query = `UPDATE faculty SET empid = ?, name = ?, department = ?, city = ? WHERE id = ?`;
    db.run(query, [empid, name, department, city, id], function (err) {
        if (err) {
            console.error('Error updating faculty:', err.message);
            return res.status(500).send('Error updating faculty.');
        }
        res.send('Faculty member updated successfully!');
    });
});

app.delete('/delete-faculty/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM faculty WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            console.error('Error deleting faculty:', err.message);
            return res.status(500).send('Error deleting faculty.');
        }
        res.send('Faculty member deleted successfully!');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
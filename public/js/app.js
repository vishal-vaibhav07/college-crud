// This file contains the JavaScript code for the college database application.
// It handles the logic for interacting with the SQLite database.

let db;

// Open the database
function openDatabase() {
    db = new SQL.Database();
    db.run("CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, major TEXT)");
}

// Add a student
function addStudent(name, age, major) {
    const stmt = db.prepare("INSERT INTO students (name, age, major) VALUES (?, ?, ?)");
    stmt.run(name, age, major);
    stmt.free();
}

// Get all students
function getStudents() {
    const stmt = db.prepare("SELECT * FROM students");
    const students = [];
    while (stmt.step()) {
        const row = stmt.get();
        students.push({ id: row[0], name: row[1], age: row[2], major: row[3] });
    }
    stmt.free();
    return students;
}

// Update a student
function updateStudent(id, name, age, major) {
    const stmt = db.prepare("UPDATE students SET name = ?, age = ?, major = ? WHERE id = ?");
    stmt.run(name, age, major, id);
    stmt.free();
}

// Delete a student
function deleteStudent(id) {
    const stmt = db.prepare("DELETE FROM students WHERE id = ?");
    stmt.run(id);
    stmt.free();
}

// Initialize the database on page load
document.addEventListener("DOMContentLoaded", () => {
    openDatabase();
    fetchFaculty();
});
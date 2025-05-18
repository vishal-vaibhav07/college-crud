// Handle form submission
document.getElementById('student-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Get form data
    const name = document.getElementById('name').value;
    const department = document.getElementById('department').value;
    const regno = document.getElementById('regno').value;
    const city = document.getElementById('city').value;

    // Validate form data
    if (!name || !department || !regno || !city) {
        alert('Please fill out all fields.');
        return;
    }

    // Send data to the server using AJAX
    fetch('/add-student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            name: name,
            department: department,
            regno: regno,
            city: city,
        }),
    })
        .then((response) => response.text())
        .then((message) => {
            alert(message); // Show success message

            // Add the new student to the table dynamically
            const tableBody = document.getElementById('student-table-body');
            const rowCount = tableBody.rows.length + 1;

            const row = `
                <tr>
                    <td>${rowCount}</td>
                    <td>${name}</td>
                    <td>${department}</td>
                    <td>${regno}</td>
                    <td>${city}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editStudent(this)">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStudent(this)">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);

            // Clear the form fields
            document.getElementById('student-form').reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to add student.');
        });
});

// Edit a student row
function editStudent(button) {
    alert('You can directly edit the fields in the table.');
}

// Delete a student row
function deleteStudent(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

// Route to fetch all faculty members
app.get('/faculty', (req, res) => {
    const query = `SELECT * FROM faculty`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return res.status(500).send('Error fetching data.');
        }
        res.json(rows);
    });
});

// Fetch and display faculty members
function fetchFaculty() {
    fetch('/faculty')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('faculty-table-body');
            tableBody.innerHTML = ''; // Clear existing rows
            data.forEach((faculty, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${faculty.empid}</td>
                        <td>${faculty.name}</td>
                        <td>${faculty.department}</td>
                        <td>${faculty.city}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editFaculty(${faculty.id}, '${faculty.empid}', '${faculty.name}', '${faculty.department}', '${faculty.city}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteFaculty(${faculty.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Error fetching faculty:', error));
}

// Fetch faculty members on page load
document.addEventListener('DOMContentLoaded', fetchFaculty);

<script src="js/faculty.js"></script>
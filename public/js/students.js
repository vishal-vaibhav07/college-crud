// List of all cities
const cities = [
    "Ahmedabad", "Alappuzha", "Amritsar", "Ayodhaya", "Bangalore", "Begusarai", "Chennai", 
    "Darbhanga", "Delhi", "Gaya", "Gurugram", "Jamshedpur", "Kannur", "Lucknow", "Mangalore", 
    "Meerut", "Mumbai", "Muzaffarpur", "Munnar", "Nagpur", "Nalanda", "Noida", "Ooty", "Pune", "Purnia", 
    "Raipur", "Ranchi", "Sitamarhi", "Tirupati", "Varanasi", "Vellore", "Vijayawada", 
    "Vishakhapatnam"
].sort();

// Fetch and display student data
function fetchStudents() {
    fetch('/students')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('student-table-body');
            tableBody.innerHTML = ''; // Clear existing rows
            data.forEach((student, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${student.name}</td>
                        <td>${student.department}</td>
                        <td>${student.regno}</td>
                        <td>${student.city}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editStudent(${student.id}, '${student.name}', '${student.department}', '${student.regno}', '${student.city}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Error fetching students:', error));
}

// Edit a student
function editStudent(id, name, department, regno, city) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-department').value = department;
    document.getElementById('edit-regno').value = regno;

    // Populate the city dropdown
    const cityDropdown = document.getElementById('edit-city');
    cityDropdown.innerHTML = ''; // Clear existing options
    cities.forEach((cityOption) => {
        const option = document.createElement('option');
        option.value = cityOption;
        option.textContent = cityOption;
        if (cityOption === city) {
            option.selected = true; // Select the current city
        }
        cityDropdown.appendChild(option);
    });

    const editModal = new bootstrap.Modal(document.getElementById('editStudentModal'));
    editModal.show();
}

// Update a student
function updateStudent() {
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    const department = document.getElementById('edit-department').value;
    const regno = document.getElementById('edit-regno').value;
    const city = document.getElementById('edit-city').value;

    fetch(`/update-student/${id}`, {
        method: 'PUT',
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
        .then(response => response.text())
        .then(message => {
            alert(message);
            fetchStudents(); // Refresh the table
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editStudentModal'));
            editModal.hide();
        })
        .catch(error => console.error('Error updating student:', error));
}

// Delete a student
function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    fetch(`/delete-student/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.text())
        .then(message => {
            alert(message);
            fetchStudents(); // Refresh the table
        })
        .catch(error => console.error('Error deleting student:', error));
}

// Add a new student
document.getElementById('student-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const department = document.getElementById('department').value;
    const regno = document.getElementById('regno').value;
    const city = document.getElementById('city').value;

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
        .then(response => response.text())
        .then(message => {
            alert(message);
            fetchStudents(); // Refresh the table
            document.getElementById('student-form').reset(); // Clear the form
        })
        .catch(error => console.error('Error adding student:', error));
});

// Search students by name or registration number
function searchStudents() {
    const searchValue = document.getElementById('search-bar').value.toLowerCase();
    const tableBody = document.getElementById('student-table-body');
    const rows = tableBody.getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const regno = row.cells[3].textContent.toLowerCase();

        if (name.includes(searchValue) || regno.includes(searchValue)) {
            row.style.display = ''; // Show row
        } else {
            row.style.display = 'none'; // Hide row
        }
    });
}

// Fetch students on page load
document.addEventListener('DOMContentLoaded', fetchStudents);
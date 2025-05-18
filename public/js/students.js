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
                        <td>${student.name.replace(/'/g, "\\'")}</td>
                        <td>${student.department}</td>
                        <td>${student.regno}</td>
                        <td>${student.city.replace(/'/g, "\\'")}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editStudent(${student.id}, '${student.name.replace(/'/g, "\\'")}', '${student.department}', '${student.regno}', '${student.city.replace(/'/g, "\\'")}')">Edit</button>
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

    // Populate the city field directly
    document.getElementById('edit-city').value = city;

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
// Show success modal with a custom message
function showSuccessMessage(message) {
    const successModalMessage = document.getElementById('successModalMessage');
    successModalMessage.textContent = message;

    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}

// Add this to your students.js if not already present
function showFailureMessage(message) {
    const failureModalMessage = document.getElementById('failureModalMessage');
    failureModalMessage.textContent = message;

    const failureModal = new bootstrap.Modal(document.getElementById('failureModal'));
    failureModal.show();
}

// Delete a student
function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    fetch(`/delete-student/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.text())
        .then(message => {
            showSuccessMessage('Student has been deleted successfully!');
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
    .then(async response => {
        const message = await response.text();
        if (!response.ok) {
            // Show popup for error (e.g., duplicate regno)
            //alert(message);
            showFailureMessage('Student onboarding failed! Due to existing registration number.');
            
            return;
        }
        //const modal = new bootstrap.Modal(document.getElementById('successModal'));
        //modal.show();
        showSuccessMessage('Student onboarding successfully!');
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
    const noRecordsMessage = document.getElementById('no-records-message');
    let hashMatch = false;

    Array.from(rows).forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const regno = row.cells[3].textContent.toLowerCase();

        if (name.includes(searchValue) || regno.includes(searchValue)) {
            row.style.display = ''; // Show row
            hashMatch = true; // At least one match found
        } else {
            row.style.display = 'none'; // Hide row
        }
    });
    // Show/hide "No records found" message
    if (!hashMatch) {
        noRecordsMessage.classList.add('fade-in');
        noRecordsMessage.style.display = 'block';
    } else {
        noRecordsMessage.style.display = 'none';
    } 

}

// Fetch students on page load
document.addEventListener('DOMContentLoaded', fetchStudents);
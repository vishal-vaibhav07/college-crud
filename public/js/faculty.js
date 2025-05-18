// Fetch and display faculty data
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
                        <td>${faculty.name.replace(/'/g, "\\'")}</td>
                        <td>${faculty.department}</td>
                        <td>${faculty.city.replace(/'/g, "\\'")}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editFaculty(${faculty.id}, '${faculty.empid}', '${faculty.name.replace(/'/g,"\\'")}', '${faculty.department}', '${faculty.city.replace(/'/g, "\\'")}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteFaculty(${faculty.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Error fetching faculty:', error));
}

// Edit a faculty member
function editFaculty(id, empid, name, department, city) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-empid').value = empid;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-department').value = department;
    document.getElementById('edit-city').value = city; // Directly set the city value

    const editModal = new bootstrap.Modal(document.getElementById('editFacultyModal'));
    editModal.show();
}

// Update a faculty member
function updateFaculty() {
    const id = document.getElementById('edit-id').value;
    const empid = document.getElementById('edit-empid').value;
    const name = document.getElementById('edit-name').value;
    const department = document.getElementById('edit-department').value;
    const city = document.getElementById('edit-city').value;

    fetch(`/update-faculty/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            empid: empid,
            name: name,
            department: department,
            city: city,
        }),
    })
        .then(response => response.text())
        .then(message => {
            alert(message);
            fetchFaculty(); // Refresh the table
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editFacultyModal'));
            editModal.hide();
        })
        .catch(error => console.error('Error updating faculty:', error));
}

// Show success modal with a custom message
function showSuccessMessage(message) {
    const successModalMessage = document.getElementById('successModalMessage');
    successModalMessage.textContent = message;

    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}

// Show failure modal with a custom message
function showFailureMessage(message) {
    const failureModalMessage = document.getElementById('failureModalMessage');
    failureModalMessage.textContent = message;

    const failureModal = new bootstrap.Modal(document.getElementById('failureModal'));
    failureModal.show();
}

// Delete a faculty member
function deleteFaculty(id) {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;

    fetch(`/delete-faculty/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.text())
        .then(message => {
            showSuccessMessage('Faculty member deleted successfully!');
            fetchFaculty(); // Refresh the table
        })
        .catch(error => console.error('Error deleting faculty:', error));
}

// Search faculty by name or employee ID
function searchFaculty() {
    const searchValue = document.getElementById('search-bar').value.toLowerCase();
    const tableBody = document.getElementById('faculty-table-body');
    const rows = tableBody.getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const name = row.cells[2].textContent.toLowerCase();
        const empid = row.cells[1].textContent.toLowerCase();

        if (name.includes(searchValue) || empid.includes(searchValue)) {
            row.style.display = ''; // Show row
        } else {
            row.style.display = 'none'; // Hide row
        }
    });
}

// Handle Add Faculty Form Submission
document.getElementById('faculty-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const empid = document.getElementById('empid').value;
    const name = document.getElementById('name').value;
    const department = document.getElementById('department').value;
    const city = document.getElementById('city').value;

    fetch('/add-faculty', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            empid: empid,
            name: name,
            department: department,
            city: city,
        }),
    })
    .then(async response => {
        const message = await response.text();
        if (!response.ok) {
            showFailureMessage(message); // Shows server error (e.g., duplicate empid)
            return;
        }
        showSuccessMessage('Faculty onboarding successfully!');
        // Optionally refresh faculty table and reset form
        fetchFaculty();
        document.getElementById('faculty-form').reset();
    })
    .catch(error => showFailureMessage('An error occurred while adding faculty.'));
});

// Search students by name or registration number
function searchFaculty() {
    const searchValue = document.getElementById('search-bar').value.toLowerCase();
    const tableBody = document.getElementById('faculty-table-body');
    const rows = tableBody.getElementsByTagName('tr');
    const noRecordsMessage = document.getElementById('no-records-message');
    let hashMatch = false;

    Array.from(rows).forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const empid = row.cells[2].textContent.toLowerCase();

        if (name.includes(searchValue) || empid.includes(searchValue)) {
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

// Fetch faculty on page load
document.addEventListener('DOMContentLoaded', fetchFaculty);
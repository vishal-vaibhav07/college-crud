// List of all cities
const cities = [
    "Ahmedabad", "Alappuzha", "Amritsar", "Ayodhaya", "Bangalore", "Begusarai", "Chennai", 
    "Darbhanga", "Delhi", "Gaya", "Gurugram", "Jamshedpur", "Kannur", "Lucknow", "Mangalore", 
    "Meerut", "Mumbai", "Muzaffarpur", "Munnar", "Nagpur", "Nalanda", "Noida", "Ooty", "Pune", "Purnia", 
    "Raipur", "Ranchi", "Sitamarhi", "Tirupati", "Varanasi", "Vellore", "Vijayawada", 
    "Vishakhapatnam"
].sort();

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

// Edit a faculty member
function editFaculty(id, empid, name, department, city) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-empid').value = empid;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-department').value = department;

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

// Delete a faculty member
function deleteFaculty(id) {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;

    fetch(`/delete-faculty/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.text())
        .then(message => {
            alert(message);
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
        .then(response => response.text())
        .then(message => {
            alert(message);
            fetchFaculty(); // Refresh the table
            document.getElementById('faculty-form').reset(); // Clear the form
        })
        .catch(error => console.error('Error adding faculty:', error));
});

// Fetch faculty on page load
document.addEventListener('DOMContentLoaded', fetchFaculty);
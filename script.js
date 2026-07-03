const API = "http://localhost:3000/students";

// ==========================
// Toast Message
// ==========================

function showToast(message, color = "#198754") {

    const toast = document.getElementById("toast");

    toast.innerHTML = message;
    toast.style.background = color;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);

}

// ==========================
// Dashboard
// ==========================

function updateDashboard(students) {

    document.getElementById("totalStudents").innerHTML = students.length;

    const departments = [...new Set(students.map(s => s.department))];
    document.getElementById("departmentCount").innerHTML = departments.length;

    const colleges = [...new Set(students.map(s => s.college))];
    document.getElementById("collegeCount").innerHTML = colleges.length;

}

// ==========================
// Load Students
// ==========================

async function loadStudents() {

    const table = document.getElementById("studentTable");

    table.innerHTML = `
    <tr>
        <td colspan="6">Loading...</td>
    </tr>
    `;

    try {

        const response = await fetch(API);

        const students = await response.json();

        table.innerHTML = "";

        if (students.length === 0) {

            table.innerHTML = `
            <tr>
                <td colspan="6">
                    No Students Found
                </td>
            </tr>
            `;

            updateDashboard([]);

            return;

        }

        students.forEach(student => {

            table.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.department}</td>
                <td>${student.college}</td>
                <td>
                    <button
                        class="edit-btn"
                        onclick="openEditModal(
                            ${student.id},
                            '${student.name}',
                            ${student.age},
                            '${student.department}',
                            '${student.college}'
                        )">
                        <i class="fa-solid fa-pen"></i>
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteStudent(${student.id})">
                        <i class="fa-solid fa-trash"></i>
                        Delete
                    </button>
                </td>
            </tr>
            `;

        });

        updateDashboard(students);

    }

    catch (error) {

        table.innerHTML = `
        <tr>
            <td colspan="6">
                Unable to connect to server
            </td>
        </tr>
        `;

        console.error(error);

    }

}

// ==========================
// Add Student
// ==========================

async function addStudent() {

    const name = document.getElementById("name").value.trim();

    const age = Number(document.getElementById("age").value);

    const department = document.getElementById("department").value.trim();

    const college = document.getElementById("college").value.trim();

    if (
        name === "" ||
        department === "" ||
        college === "" ||
        age === 0
    ) {

        showToast("Please Fill All Fields", "#dc3545");

        return;

    }

    if (age < 16 || age > 100) {

        showToast("Invalid Age", "#dc3545");

        return;

    }

    const student = {
        name,
        age,
        department,
        college
    };

    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(student)

        });

        const data = await response.json();

        showToast(data.message);

        document.getElementById("name").value = "";
        document.getElementById("age").value = "";
        document.getElementById("department").value = "";
        document.getElementById("college").value = "";

        loadStudents();

    }

    catch (error) {

        showToast("Server Error", "#dc3545");

        console.error(error);

    }

}

// ==========================
// Open Edit Modal
// ==========================

function openEditModal(id, name, age, department, college) {

    document.getElementById("editId").value = id;
    document.getElementById("editName").value = name;
    document.getElementById("editAge").value = age;
    document.getElementById("editDepartment").value = department;
    document.getElementById("editCollege").value = college;

    document.getElementById("editModal").style.display = "flex";

}

// ==========================
// Close Edit Modal
// ==========================

function closeModal() {

    document.getElementById("editModal").style.display = "none";

}

// ==========================
// Update Student
// ==========================

async function updateStudent() {

    const id = document.getElementById("editId").value;

    const student = {
        name: document.getElementById("editName").value.trim(),
        age: Number(document.getElementById("editAge").value),
        department: document.getElementById("editDepartment").value.trim(),
        college: document.getElementById("editCollege").value.trim()
    };

    if (
        student.name === "" ||
        student.department === "" ||
        student.college === "" ||
        student.age <= 0
    ) {

        showToast("Please fill all fields", "#dc3545");
        return;

    }

    if (student.age < 16 || student.age > 100) {

        showToast("Age must be between 16 and 100", "#dc3545");
        return;

    }

    try {

        const response = await fetch(`${API}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(student)

        });

        const data = await response.json();

        showToast(data.message);

        closeModal();

        loadStudents();

    }

    catch (error) {

        console.error(error);

        showToast("Unable to update student", "#dc3545");

    }

}

// ==========================
// Delete Student
// ==========================

async function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(`${API}/${id}`, {

            method: "DELETE"

        });

        const data = await response.json();

        showToast(data.message);

        loadStudents();

    }

    catch (error) {

        console.error(error);

        showToast("Unable to delete student", "#dc3545");

    }

}

// ==========================
// Search Student
// ==========================

async function searchStudent() {

    const id = document.getElementById("searchId").value.trim();

    if (id === "") {

        showToast("Enter Student ID", "#dc3545");
        return;

    }

    try {

        const response = await fetch(`${API}/${id}`);

        if (!response.ok) {

            showToast("Student Not Found", "#dc3545");
            return;

        }

        const student = await response.json();

        const table = document.getElementById("studentTable");

        table.innerHTML = `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.department}</td>
            <td>${student.college}</td>
            <td>
                <button
                    class="edit-btn"
                    onclick="openEditModal(
                        ${student.id},
                        '${student.name}',
                        ${student.age},
                        '${student.department}',
                        '${student.college}'
                    )">
                    <i class="fa-solid fa-pen"></i>
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </td>
        </tr>
        `;

    }

    catch (error) {

        console.error(error);

        showToast("Server Error", "#dc3545");

    }

}

// ==========================
// Live Search
// ==========================

document.getElementById("searchId").addEventListener("keyup", function () {

    if (this.value === "") {

        loadStudents();

    }

});

// ==========================
// Press Enter to Add / Update Student
// ==========================

document.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        const modal = document.getElementById("editModal");

        if (modal.style.display === "flex") {

            updateStudent();

        } else {

            addStudent();

        }

    }

});

// ==========================
// Close Modal on Outside Click
// ==========================

window.onclick = function (event) {

    const modal = document.getElementById("editModal");

    if (event.target === modal) {

        closeModal();

    }

};

// ==========================
// Auto Load Students on Page Load
// ==========================

window.onload = function () {

    loadStudents();

};

// ==========================
// Optional: Auto Refresh Every 30 Seconds
// ==========================

/*
setInterval(() => {
    loadStudents();
}, 30000);
*/
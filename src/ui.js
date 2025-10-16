export function showFeedback(message, type = 'success') {
    const feedbackElement = document.getElementById('feedbackMessage');
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback-message show ${type}`;

    setTimeout(() => {
        feedbackElement.classList.remove('show');
    }, 3000);
}

export function renderStudents(students) {
    const tableBody = document.getElementById('studentsTableBody');

    if (students.length === 0) {
        tableBody.innerHTML = `
            <tr class="no-data">
                <td colspan="4">No students found. Add a student to get started!</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = students.map(student => `
        <tr data-id="${student.id}">
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml(student.roll_number)}</td>
            <td>${student.marks}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="window.editStudent('${student.id}')">Edit</button>
                    <button class="btn btn-delete" onclick="window.deleteStudentHandler('${student.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

export function clearForm() {
    document.getElementById('studentForm').reset();
    const form = document.getElementById('studentForm');
    form.removeAttribute('data-editing-id');
}

export function populateForm(student) {
    document.getElementById('studentName').value = student.name;
    document.getElementById('rollNumber').value = student.roll_number;
    document.getElementById('marks').value = student.marks;

    const form = document.getElementById('studentForm');
    form.setAttribute('data-editing-id', student.id);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function getFormData() {
    return {
        name: document.getElementById('studentName').value.trim(),
        roll_number: document.getElementById('rollNumber').value.trim(),
        marks: parseInt(document.getElementById('marks').value)
    };
}

export function getEditingId() {
    return document.getElementById('studentForm').getAttribute('data-editing-id');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

import {
    getAllStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    checkDuplicateRollNumber
} from './database.js';

import {
    showFeedback,
    renderStudents,
    clearForm,
    populateForm,
    getFormData,
    getEditingId
} from './ui.js';

import { validateStudentData } from './validation.js';

let studentsCache = [];

async function loadStudents() {
    try {
        studentsCache = await getAllStudents();
        renderStudents(studentsCache);
    } catch (error) {
        console.error('Error loading students:', error);
        showFeedback('Failed to load students. Please refresh the page.', 'error');
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const formData = getFormData();
    const editingId = getEditingId();

    const validation = validateStudentData(formData);
    if (!validation.isValid) {
        showFeedback(validation.errors.join(', '), 'error');
        return;
    }

    try {
        const isDuplicate = await checkDuplicateRollNumber(
            formData.roll_number,
            editingId
        );

        if (isDuplicate) {
            showFeedback('A student with this roll number already exists!', 'error');
            return;
        }

        if (editingId) {
            await updateStudent(editingId, formData);
            showFeedback('Student updated successfully!', 'success');
        } else {
            await addStudent(formData);
            showFeedback('Student added successfully!', 'success');
        }

        clearForm();
        await loadStudents();
    } catch (error) {
        console.error('Error saving student:', error);
        showFeedback('Failed to save student. Please try again.', 'error');
    }
}

async function editStudentHandler(id) {
    const student = studentsCache.find(s => s.id === id);
    if (student) {
        populateForm(student);
        showFeedback('Edit the student details and click Submit', 'success');
    }
}

async function deleteStudentHandler(id) {
    const student = studentsCache.find(s => s.id === id);
    if (!student) return;

    const confirmed = confirm(
        `Are you sure you want to delete ${student.name} (${student.roll_number})?`
    );

    if (!confirmed) return;

    try {
        await deleteStudent(id);
        showFeedback('Student deleted successfully!', 'success');
        await loadStudents();
    } catch (error) {
        console.error('Error deleting student:', error);
        showFeedback('Failed to delete student. Please try again.', 'error');
    }
}

function handleClear() {
    clearForm();
    showFeedback('Form cleared!', 'success');
}

window.editStudent = editStudentHandler;
window.deleteStudentHandler = deleteStudentHandler;

document.addEventListener('DOMContentLoaded', () => {
    loadStudents();

    document.getElementById('studentForm').addEventListener('submit', handleSubmit);
    document.getElementById('clearBtn').addEventListener('click', handleClear);
});

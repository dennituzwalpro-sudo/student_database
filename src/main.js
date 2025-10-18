import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


const SUPABASE_URL = "https://nylutsjvyiqerbrsztnn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bHV0c2p2eWlxZXJicnN6dG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1OTEwODcsImV4cCI6MjA3NjE2NzA4N30.8zeOzwpSs_jhQxHQcFBXd6zEtVW4A_hXyviDFAtdrWE"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test connection
async function testConnection() {
  const { data, error } = await supabase.from('students').select('*');
  if (error) {
    console.error("Supabase connection error:", error);
  } else {
    console.log("Fetched data:", data);
  }
}

testConnection();

// Function to load students and display in table
async function loadStudents() {
  const { data, error } = await supabase.from('students').select('*');

  const tableBody = document.getElementById('studentsTableBody');
  tableBody.innerHTML = ""; // Clear previous rows

  if (error) {
    tableBody.innerHTML = `<tr><td colspan="4">Error loading students: ${error.message}</td></tr>`;
    return;
  }

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4">No students found.</td></tr>`;
    return;
  }

  data.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.roll_number}</td>
      <td>${student.marks}</td>
      <td>
        <button class="edit-btn" data-id="${student.id}">Edit</button>
        <button class="delete-btn" data-id="${student.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Call this function after testing connection
loadStudents();


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

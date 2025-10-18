import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ✅ Supabase credentials
const SUPABASE_URL = "https://nylutsjvyiqerbrsztnn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bHV0c2p2eWlxZXJicnN6dG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1OTEwODcsImV4cCI6MjA3NjE2NzA4N30.8zeOzwpSs_jhQxHQcFBXd6zEtVW4A_hXyviDFAtdrWE"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

// ✅ Load students from Supabase (single definition)
async function loadStudents() {
    try {
        const { data, error } = await supabase.from('students').select('*');
        if (error) throw error;

        studentsCache = data;
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
        const { data: existing } = await supabase
            .from('students')
            .select('*')
            .eq('roll_number', formData.roll_number);

        if (existing.length > 0 && !editingId) {
            showFeedback('A student with this roll number already exists!', 'error');
            return;
        }

        if (editingId) {
            await supabase.from('students').update(formData).eq('id', editingId);
            showFeedback('Student updated successfully!', 'success');
        } else {
            await supabase.from('students').insert([formData]);
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
        await supabase.from('students').delete().eq('id', id);
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

// ✅ Expose edit/delete handlers globally
window.editStudent = editStudentHandler;
window.deleteStudentHandler = deleteStudentHandler;

document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    document.getElementById('studentForm').addEventListener('submit', handleSubmit);
    document.getElementById('clearBtn').addEventListener('click', handleClear);
});

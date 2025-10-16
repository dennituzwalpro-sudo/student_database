import { supabase } from './supabase.js';

export async function getAllStudents() {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function addStudent(studentData) {
    const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function updateStudent(id, studentData) {
    const { data, error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function deleteStudent(id) {
    const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function checkDuplicateRollNumber(rollNumber, excludeId = null) {
    let query = supabase
        .from('students')
        .select('id')
        .eq('roll_number', rollNumber);

    if (excludeId) {
        query = query.neq('id', excludeId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    return data !== null;
}

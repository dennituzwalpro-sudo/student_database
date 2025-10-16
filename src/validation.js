export function validateStudentData(data) {
    const errors = [];

    if (!data.name || data.name.length === 0) {
        errors.push('Student name is required');
    }

    if (data.name.length > 100) {
        errors.push('Student name must be less than 100 characters');
    }

    if (!data.roll_number || data.roll_number.length === 0) {
        errors.push('Roll number is required');
    }

    if (data.roll_number.length > 50) {
        errors.push('Roll number must be less than 50 characters');
    }

    if (isNaN(data.marks)) {
        errors.push('Marks must be a valid number');
    }

    if (data.marks < 0 || data.marks > 100) {
        errors.push('Marks must be between 0 and 100');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

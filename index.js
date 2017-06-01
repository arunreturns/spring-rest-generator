const promptUser = require('./userInput');

const TestDataList = [{
    ClassName: 'subject',
    TableName: 'SUBJECT',
    FieldsList: {
        FieldNames: ['subjectId', 'subjectName'],
        FieldTypes: ['Integer', 'String']
    }
}, {
    ClassName: 'student',
    TableName: 'STUDENTS',
    FieldsList: {
        FieldNames: ['studentId', 'studentName', 'studentClass', 'studentEmail', 'parentEmail', 'dateOfBirth'],
        FieldTypes: ['Integer', 'String', 'String', 'String', 'String', 'Date']
    }
}, {
    ClassName: 'staff',
    TableName: 'STAFF',
    FieldsList: {
        FieldNames: ['staffId', 'staffName', 'dateOfBirth', 'staffRole'],
        FieldTypes: ['Integer', 'String', 'Date', 'String']
    }
}, {
    ClassName: 'teacher',
    TableName: 'TEACHERS',
    FieldsList: {
        FieldNames: ['teacherId', 'teacherName', 'yearsOfExperience', 'dateOfBirth', 'joiningDate'],
        FieldTypes: ['Integer', 'String', 'Integer', 'Date', 'Date']
    }
}, {
    ClassName: 'classroom',
    TableName: 'CLASSROOM',
    FieldsList: {
        FieldNames: ['classroomId', 'classroomName', 'teacherInCharge', 'studentsInClass'],
        FieldTypes: ['Integer', 'String', 'String', 'Integer']
    }
}]
TestDataList.map(TestData => {
    promptUser(TestData);
})

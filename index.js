const promptUser = require('./userInput');

const TestData = {
    ClassName: 'teacher',
    TableName: 'TEACHERS',
    FieldsList: {
        FieldNames: ['teacherId', 'teacherName', 'yearsOfExperience', 'dateOfBirth', 'joiningDate'],
        FieldTypes: ['Integer', 'String', 'String', 'Date', 'Date']
    }
}
promptUser(TestData);
//promptUser();
const promptUser = require('./userInput');

const TestData = {
    ClassName: 'staff',
    FieldsList: {
        FieldNames: ['staffId', 'staffName', 'dateOfBirth', 'staffRole'],
        FieldTypes: ['Integer', 'String', 'Date', 'String']
    }
}
promptUser(TestData);

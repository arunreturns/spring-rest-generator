const _ = require('lodash');
const inquirer = require('inquirer');
const doProcessing = require('./processFiles');

var questions = [
    {
        type: 'input',
        name: 'className',
        message: 'Enter the class name',
        default: "Student"
    }, {
        type: 'confirm',
        name: 'enterFieldInteractive',
        message: 'Do you want to enter fields interactively (just hit enter for YES)?',
        default: true
    }, {
        type: 'input',
        name: 'fieldNames',
        message: 'Enter the field names separted by commas',
        when: function (answers) {
            return !answers.enterFieldInteractive;
        }
    }, {
        type: 'input',
        name: 'fieldTypes',
        message: 'Enter the field types separted by commas',
        when: function (answers) {
            return !answers.enterFieldInteractive;
        },
        validate: function (value, answers) {
            if (value.split(",").length !== answers.fieldNames.split(",").length)
                return "Number of Field Types should match Field Names";
            else
                return true;
        }
    }
];
var fieldQuestions = [
    {
        type: 'input',
        name: 'fieldName',
        message: 'Field Name',
        validate: function (value) {
            var valid = value.length > 0;
            return valid || 'Please enter a field name';
        },
    },
    {
        type: 'list',
        name: 'fieldType',
        message: 'Field Type',
        choices: ["String", "Integer", "Date", "Boolean"]
    },
    {
        type: 'confirm',
        name: 'addMoreFields',
        message: 'Do you want to add more fields (just hit enter for YES)?',
        default: true
    }
];
var FieldsList = [];

function ProcessingCallback() {
    console.log("Process completed successfully");
}
module.exports = function promptUser(TestData) {
    if (TestData) {
        var ClassName = _.startCase(_.toLower(TestData.ClassName))
        var VariableName = ClassName.toLowerCase();
        var TableName = TestData.TableName;
        var TestFieldsList = [];
        TestData.FieldsList.FieldNames.map((Name, index) => {
            TestData.FieldsList.FieldTypes[index];
            var FieldObj = {
                fieldCaps: _.startCase(Name).replace(/ /g, ""),
                fieldName: Name,
                fieldType: TestData.FieldsList.FieldTypes[index]
            };
            TestFieldsList.push(FieldObj);
        });
        doProcessing(ClassName, VariableName, TableName, TestFieldsList, ProcessingCallback);
    }
    else {
        inquirer.prompt(questions).then(function (answers) {

            var ClassName = _.startCase(_.toLower(answers.className))
            var VariableName = ClassName.toLowerCase();
            var TableName = ClassName.toUpperCase();

            function getClassFields() {
                inquirer.prompt(fieldQuestions).then(function (answers) {
                    var FieldObj = {
                        fieldCaps: _.startCase(answers.fieldName).replace(/ /g, ""),
                        fieldName: answers.fieldName,
                        fieldType: answers.fieldType
                    };
                    FieldsList.push(FieldObj);
                    if (answers.addMoreFields) {
                        getClassFields();
                    }
                    else {
                        //console.log('Field List:', FieldsList);
                        doProcessing(ClassName, VariableName, TableName, FieldsList, ProcessingCallback);
                    }
                });
            }

            if (answers.enterFieldInteractive) {
                getClassFields();
            }
            else {
                var FieldNameList = answers.fieldNames.split(",");
                var FieldTypeList = answers.fieldTypes.split(",");
                for (var i = 0; i < FieldNameList.length; i++) {
                    var FieldObj = {
                        fieldCaps: _.startCase(FieldNameList[i]).replace(/ /g, ""),
                        fieldName: FieldNameList[i],
                        fieldType: FieldTypeList[i]
                    };
                    FieldsList.push(FieldObj);
                }
                doProcessing(ClassName, VariableName, TableName, FieldsList, ProcessingCallback);
            }

        });
    }
}

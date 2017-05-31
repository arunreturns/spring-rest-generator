const Constants = require('./dataConstants');
const InsertQuery = Constants.InsertQuery;
const UpdateQuery = Constants.UpdateQuery;
const ToString = Constants.ToString;
const Variable = Constants.Variable;
const GetterSetter = Constants.GetterSetter;
const RowMapper = Constants.RowMapper;

const _ = require('lodash');
const fs = require('fs-extra');

function formModelFile(ClassName, FieldsList) {
    var VariableContent = "\n";
    var GetterSetterContent = "\n"
    var ToStringContent = "\n";

    var ToStringContentData = "";
    FieldsList.map((Field) => {
        VariableContent += Variable
            .replace(/__FIELD_TYPE__/g, Field.fieldType)
            .replace(/__FIELD_NAME__/g, Field.fieldName);
    })
    FieldsList.map((Field) => {
        GetterSetterContent += GetterSetter
            .replace(/__FIELD_TYPE__/g, Field.fieldType)
            .replace(/__FIELD_NAME__/g, Field.fieldName)
            .replace(/__CAP_NAME__/g, Field.fieldCaps);

        ToStringContentData += '"' + _.startCase(Field.fieldName) + ': " + ' + Field.fieldName + ' + "," + ';
    })
    ToStringContentData = ToStringContentData.substring(1, ToStringContentData.length - 9)
    ToStringContent = ToString.replace(/__TOSTRING_DATA__/g, ToStringContentData).replace(/__CLASS_NAME__/g, ClassName);

    return {
        VariableContent,
        GetterSetterContent,
        ToStringContent
    }
}

function formInsertQuery(TableName, VariableName, FieldsList) {
    var NameList = [];
    var ValueList = [];
    var AddList = [];
    FieldsList.map((Field) => {
        if (Field.fieldName === VariableName)
            return;
        AddList.push(`.addValue("${Field.fieldName}", ${VariableName}.get${Field.fieldCaps}())`)
        NameList.push(Field.fieldName);
        ValueList.push(":" + Field.fieldName);
    })
    return InsertQuery
        .replace(/__FIELDS__/g, NameList.join(", "))
        .replace(/__VALUES__/g, ValueList.join(", "))
        .replace(/__ADD_VALUES__/g, AddList.join(""))
        .replace(/__TABLE_NAME__/g, TableName);
}

function formUpdateQuery(TableName, VariableName, FieldsList) {
    var NameList = [];
    var AddList = [];
    FieldsList.map((Field) => {
        if (Field.fieldName === VariableName)
            return;

        AddList.push(`.addValue("${Field.fieldName}", ${VariableName}.get${Field.fieldCaps}())`)
        NameList.push(Field.fieldName + " = :" + Field.fieldName);
    })
    return UpdateQuery
        .replace(/__FIELDS__/g, NameList.join(", "))
        .replace(/__ADD_VALUES__/g, AddList.join(""))
        .replace(/__VARIABLE_NAME__/g, VariableName)
        .replace(/__TABLE_NAME__/g, TableName);
}

module.exports = function doProcessing(ClassName, VariableName, TableName, FieldsList, Callback) {
    var MainPath = "./template";
    var CopyPath = VariableName;

    var recursive = require('recursive-readdir');

    fs.copy(MainPath, CopyPath, function (err) {
        if (err) {
            return console.error(err);
        }

        recursive(CopyPath, function (err, files) {
            if (err) {
                throw err;
            }
            //console.log(files);
            files.map((file) => {
                //console.log("Working on file", file);
                var RowMapperContent = "\n";
                var VariableContent = "\n";
                var GetterSetterContent = "\n"
                var ToStringContent = "\n";

                if (file.indexOf("__CLASS_NAME__.txt") !== -1) {
                    var ModelData = formModelFile(ClassName, FieldsList);
                    VariableContent = ModelData.VariableContent;
                    GetterSetterContent = ModelData.GetterSetterContent;
                    ToStringContent = ModelData.ToStringContent;
                }
                if (file.indexOf("__CLASS_NAME__RowMapper.txt") !== -1) {
                    FieldsList.map((Field) => {
                        RowMapperContent += RowMapper
                            .replace(/__VARIABLE_NAME__/g, VariableName)
                            .replace(/__FIELD_NAME__/g, Field.fieldName)
                            .replace(/__CAP_NAME__/g, Field.fieldCaps)
                            .replace(/__FIELD_TYPE__/g, Field.fieldType == "Integer" ? "Int" : Field.fieldType);
                    })
                }
                var InsertQueryData = "";
                var UpdateQueryData = "";
                if (file.indexOf("__CLASS_NAME__DBOps.txt") !== -1) {
                    InsertQueryData = formInsertQuery(TableName, VariableName, FieldsList);
                    UpdateQueryData = formUpdateQuery(TableName, VariableName, FieldsList);
                }

                var fileContents = fs.readFileSync(file).toString();

                fileContents = fileContents
                    .replace(/__CLASS_NAME__/g, ClassName)
                    .replace(/__VARIABLE_NAME__/g, VariableName)
                    .replace(/__TABLE_NAME__/g, TableName)
                    .replace(/__INSERT_QUERY__/g, InsertQueryData)
                    .replace(/__UPDATE_QUERY__/g, UpdateQueryData)
                    .replace(/__VARIABLE_CONTENT__/g, VariableContent)
                    .replace(/__GETTER_SETTER__/g, GetterSetterContent)
                    .replace(/__TOSTRING_CONTENT__/g, ToStringContent)
                    .replace(/__MAP_HERE__/g, RowMapperContent);

                fs.writeFileSync(file, fileContents);
                var newFileName = file.replace('txt', 'java').replace(/__CLASS_NAME__/g, ClassName);
                fs.move(file, newFileName);
            })
            Callback();
        });
    });
}

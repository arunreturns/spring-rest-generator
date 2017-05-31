var InsertQuery = `
        String query = "INSERT INTO __TABLE_NAME__(__FIELDS__) "
    				 + "VALUES (__VALUES__)";
        logger.info("Running query " + query);
        
    	MapSqlParameterSource param = new MapSqlParameterSource()
    	             __ADD_VALUES__;
`

var UpdateQuery = `
        String query = "UPDATE __TABLE_NAME__ __FIELDS__ "
				     + "WHERE __VARIABLE_NAME__Id = :__VARIABLE_NAME__Id";
		logger.info("Running query " + query);
		MapSqlParameterSource param = new MapSqlParameterSource()
				     __ADD_VALUES__;
`

var ToString = `
    @Override
	public String toString(){
		return "__CLASS_NAME__: __TOSTRING_DATA__;
	}
`
var Variable = "\tprivate __FIELD_TYPE__ __FIELD_NAME__;\n"
var GetterSetter = `
    public __FIELD_TYPE__ get__CAP_NAME__() {
		return __FIELD_NAME__;
	}
	public void set__CAP_NAME__(__FIELD_TYPE__ __FIELD_NAME__) {
		this.__FIELD_NAME__ = __FIELD_NAME__;
	}
`;

var RowMapper = `
    __VARIABLE_NAME__.set__CAP_NAME__(rs.get__FIELD_TYPE__("__FIELD_NAME__"));
`;

module.exports = {
    InsertQuery,
    UpdateQuery,
    ToString,
    Variable,
    GetterSetter,
    RowMapper
};

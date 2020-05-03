const validator = require('validator');
const {ServerError, JsonError} = require('./errors');

/**
 * @param {*} field
 * @throws {ServerError}
 */
const validateFields = (fields) => {
    for (const fieldName in fields)
        if (fields.hasOwnProperty(fieldName)) {
            const fieldValue = fields[fieldName].value + ''; // validator functioneaza doar pe strings
            const fieldType = fields[fieldName].type;

            if (!fieldValue) {
                throw new JsonError(0, {description: `${fieldName} cannot be empty`, field: fieldName}, 400);
            }

            let error;
            switch (fieldType) {
                case 'ascii':
                    if (!validator.isAscii(fieldValue))
                        error = `${fieldName} should only contain ASCII characters`;
                    break;
                case 'alpha':
                    if (!validator.isAlpha(fieldValue))
                        error = `${fieldName} should only contain alphabetic characters`;
                    break;
                case 'int':
                    if (!validator.isInt(fieldValue))
                        error = `${fieldName} should only contain alphabetic characters`;
                    break;
                case 'jwt':
                    if (!validator.isJWT(fieldValue))
                        error = `${fieldName} should be a JWT token`;
                    break;
                case 'email':
                    if (!validator.isEmail(fieldValue))
                        error = `${fieldName} should be an email address`;
                    break;
            }

            if (error) {
                throw new JsonError(0, {
                    description: error,
                    field: fieldName
                }, 400);
            }
        }

};

module.exports = {
    validateFields
};

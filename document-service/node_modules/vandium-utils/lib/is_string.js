'use string';

function isString( value ) {

    return !!value && ((typeof value === 'string') || (value instanceof String));
}

module.exports = isString;

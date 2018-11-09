'use strict';

function parseBoolean( value ) {

    if( !value ) {

        return false;
    }

    if( (value === true) || (value === false) ) {

        return value;
    }

    switch( value.toString().toLowerCase().trim() ) {

        case 'true':
        case 'yes':
        case 'on':
            return true;

        case 'false':
        case 'no':
        case 'off':
            return false;

        default:
            return false;
    }
}

module.exports = parseBoolean;

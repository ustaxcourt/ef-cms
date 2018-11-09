'use strict';

const isObject = require( './is_object' );

function isFunction( value ) {

    return (!!value && value.constructor === Function);
}

function isPromise( value ) {

    return ((!!value && isFunction( value.then ) && isFunction( value.catch ) ));
}

function clone( value ) {

    if( !isObject( value ) ) {

        return value;
    }

    return Object.assign( {}, value );
}

module.exports = {

    clone,

    isObject,

    isString: require( './is_string' ),

    isArray: Array.isArray,

    isFunction,

    isPromise,

    parseBoolean: require( './parse_boolean' ),

    templateString: require( './template_string' )
};

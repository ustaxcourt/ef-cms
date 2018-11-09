'use strict';

const isObject = require( './is_object' );

function resolveValue( path, state ) {

    let value = state;

    for( let part of path.split( '.' ) ) {

        if( isObject( value ) ) {

            value = value[ part ];
        }
        else {

            value = undefined;
        }
    }

    return value;
}

function templateString( str, state ) {

    if( str === undefined ) {

        return str;
    }

    str = str.toString();

    let escaped = false;

    let last;

    let templateIndex = -1;

    for( let i = 0; i < str.length; i++ ) {

        let ch = str.charAt( i );

        if( ch === '\\' ) {

            escaped = !escaped;
        }
        else if( escaped ) {

            // last character was excepted
            last = undefined;
            escaped = false;
            continue;
        }
        else if( ch === '{' && last === '$' && (templateIndex < 0) ) {

            templateIndex = i - 1;
        }
        else if( ch === '}' && templateIndex > -1 ) {

            let propPath = str.substr( templateIndex + 2, (i-templateIndex) - 2 ).trim();

            let value = resolveValue( propPath, state );

            let tail = str.substr( i + 1 );

            str = str.substr( 0, templateIndex ) + value;

            // reposition index
            i = str.length - 1;

            str = str + tail;

            templateIndex = -1;
        }

        last = ch;
    }

    return str;
}

module.exports = templateString;

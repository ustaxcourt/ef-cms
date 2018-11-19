'use strict';

function getActiveHandles() {

    return process._getActiveHandles();
}

function isTimerValid( handle ) {

    return (handle._list._idlePrev !== handle._list );
}

function isHandleValid( handle ) {

    let valid = true;

    // special cases for Timers that might be finished but in the handler list
    if( handle.constructor && (handle.constructor.name === 'Timer') ) {

        valid = isTimerValid( handle );
    }
    else if( handle.destroyed === true ) {

        // streams/sockets that have been destroyed but might haven't been cleared out
        valid = false;
    }

    return valid;
}

function containsState( savedState, handle ) {

    for( let i = 0; i < savedState.length; i++ ) {

        if( handle === savedState[i] ) {

            return true;
        }
    }

    return false;
}
//
// function extract() {
//
//     let handles = getActiveHandles();
//
//     for( state )
//     // save a copy of the current handles
//     this.savedState = getActiveHandles().slice( 0 );
// }

class ActiveHandleState {

    constructor() {

        // save a copy of the current handles
        this.savedState = getActiveHandles().slice( 0 );
    }

    getDifferenceInHandles() {

        let difference = [];

        let savedState = this.savedState;

        let handles = getActiveHandles();

        for( let handle of handles ) {

            if( !containsState( savedState, handle ) ) {

                if( isHandleValid( handle ) ) {

                    difference.push( handle );
                }
            }
        }

        return difference;
    }
}

function capture() {

    return new ActiveHandleState();
}

module.exports = {

    capture
};

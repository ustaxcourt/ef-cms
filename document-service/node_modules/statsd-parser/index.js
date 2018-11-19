var Stream  = require('stream').Stream
  , statsd  = exports
  ;

//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ const ~~
//
var EVENTS = ['stat', 'error', 'end', 'ready'];

var isStatsD =
  //
  // stat   :value                  |type       |@sample_rate <optional>
  //
  // Groups:
  //  * stat        : 1
  //  * value       : 2
  //  * type        : 3
  //  * sample_rate : 5
  //
  /^(.+):([\-+]?[0-9]*\.?[0-9]+)\|(s|g|ms|c)(\|@([\-+]?[0-9]*\.?[0-9]*))?\s*$/;

//
// Remove error and end for event handling
//
var F_EVENTS = EVENTS.filter(function (ev) {
  return ev !== 'error' && ev !== 'end';
});

//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ stream ~~
//

statsd.createStream =  function createStream(opt) { 
  return new StatsdStream(opt);
};

//
// Our streaming parser
//
function StatsdStream (opt) {
  //
  // If `this` ain't already a stream we need to return one with these opts
  //
  if (!(this instanceof StatsdStream)) {
    return statsd.createStream(opt);
  }
  
  var me = this;

  //
  // Super call
  //
  Stream.apply(me);

  //
  // Instantiate our parser
  //
  this._parser = new StatsdParser(opt);

  //
  // This stream can write and read (duplex)
  //
  this.writable = true;
  this.readable = true;

  //
  // Implements the on end function with respect to `this`
  //
  this._parser.onend   = function () {
    me.emit('end');
  };

  //
  // Implements the on error function with respect to `this`
  //
  this._parser.onerror = function (er) {
    me.emit('error', er);
    me._parser.error = null;
  };

  //
  // Define methods on the stream such as
  // stream.onerror
  // stream.onstat
  //
  // These are defined in F_EVENTS, call on the parser functionality and
  // are used on the actual `on('stat', f)` handlers
  //
  F_EVENTS.forEach(function (ev) {
    Object.defineProperty(me, 'on' + ev,
      { get          : function () { return me._parser['on' + ev]; }
      , set          : function (h) {
          if (!h) {
            me.removeAllListeners(ev);
            me._parser['on'+ev] = h;
            return h;
          }
          me.on(ev, h);
        }
      , enumerable   : true
      , configurable : false
      });
  });
}

StatsdStream.prototype = Object.create(Stream.prototype,
  { constructor: { value: StatsdStream } });

StatsdStream.prototype.write = function (data) {
  this._parser.write(data.toString());
  this.emit('data', data);
  return true;
};

StatsdStream.prototype.end = function (chunk) {
  if (chunk && chunk.length) {
    this._parser.write(chunk.toString());
  }
  this._parser.end();
  return true;
};

StatsdStream.prototype.on = function (ev, handler) {
  var me = this;
  //
  // If we dont have this method in the parser and its included in F_EVENTS
  //
  if (!me._parser['on'+ev] && ~F_EVENTS.indexOf(ev)) {
    //
    // Define it in the parser
    //
    me._parser['on'+ev] = function () {
      var args = arguments.length === 1 
               ? [arguments[0]]
               : Array.apply(null, arguments)
               ;
      args.splice(0, 0, ev);
      me.emit.apply(me, args);
    };
  }
  return Stream.prototype.on.call(me, ev, handler);
};

StatsdStream.prototype.destroy = function () {
  this.emit('close');
};

//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ parser ~~
//

statsd.parser = function (opt) {
  return new StatsdParser(opt);
};

function StatsdParser (opt) {
  //
  // If `this` ain't already a parser we need to return one with these opts
  //
  if (!(this instanceof StatsdParser)) {
    return statsd.parser(opt);
  }

  var parser = this;

  //
  // A buffer for our text until we find newline
  //
  parser.buffer = '';

  //
  // Is our parser closed?
  //
  parser.closed = false;

  //
  // Any possible parser `error`
  //
  parser.error = null;

  //
  // If we are looking for a new stat
  //
  parser.new_stat = true;

  // mostly just for error reporting
  parser.position = 0;
  parser.column   = 0;
  parser.line     = 1;
  emit(parser, 'onready');
}

StatsdParser.prototype.end = function end() {
  end(this);
};

StatsdParser.prototype.resume = function resume() {
  this.error = null;
  return this;
};

StatsdParser.prototype.close = function close() {
  return this.write(null);
};

StatsdParser.prototype.write = function write (chunk) {
  var parser = this;

  //
  // If there is an error
  //
  if (this.error) {
    throw this.error;
  }

  //
  // Cant write, already closed
  //
  if (parser.closed) {
    return error(parser,
      'Cannot write after close. Assign an onready handler.');
  }

  //
  // Nothing to do here
  //
  if (chunk === null) {
    return end(parser);
  }

  //
  // Get ready for some parsing
  //
  var i = 0
    , c = chunk[0]
    ;

  while (c) {
    c = chunk.charAt(i++);

    if(parser.new_stat && c === ' ' || c === '\t' || c === '\r') {
      //
      // Ignore whitespace
      //
      continue;
    }

    parser.position++;
    if (c === '\n') {
      emitStat(parser, true);
      parser.line ++;
      parser.column = 0;
      parser.new_stat = true;
    } else {
      parser.new_stat = false;
      if (!(c === '\r' || c === '\t')) {
        parser.buffer += c;
      }
      parser.column ++;
    }
  }

  emitStat(parser);
  return parser;
};

statsd.isStatsd = function test(string) {
  return isStatsD.test(string);
};

statsd.matchStatsd = function match(string) {
  var m = isStatsD.exec(string);
  if(m) {
    var stat =
      { stat  : m[1]
      , value : m[2]
      , type  : m[3]
      };

    if(typeof m[5] === 'string' && m[5] !== '') {
      stat.sample_rate = m[5];
    }

    return stat;
  }
  else {
    //
    // Just like in the original exec
    //
    return null;
  }
};

//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ aux ~~
//

function emitStat(parser, fromNewline) {
  if(!parser.buffer || parser.buffer === '') {
    return;
  }

  var stat = statsd.matchStatsd(parser.buffer);

  if(stat) {
    emit(parser, 'onstat', parser.buffer, stat);
    parser.buffer = '';
  }
  else {
    if(fromNewline) {
      var buf = parser.buffer;
      parser.buffer = '';
      error(parser, "Buffered Line was not valid stats d `" + buf + "`.");
    }
  }
}

function emit(parser, event, txtData, jsonData) {
  if (parser[event]) {
    parser[event](txtData, jsonData);
  }
}

function error (parser, er) {
  //
  // See if we have anything buffered
  //
  emitStat(parser);
  er += '\nLine: '   + parser.line   +
        '\nColumn: ' + parser.column +
        '\nBuffer: ' + parser.buffer;
  er = new Error(er);
  parser.error = er;
  emit(parser, 'onerror', er);
  return parser;
}

function end(parser) {
  //
  // See if we have anything buffered
  //
  emitStat(parser);
  parser.buffer = '';
  parser.closed = true;
  emit(parser, 'onend');
  //
  // Restart our parser
  //
  StatsdParser.call(parser, parser.opt);
  return parser;
}
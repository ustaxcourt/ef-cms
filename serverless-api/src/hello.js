'use strict';

/**
 * Hello World Simple Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.handler = (event, context, callback) => {

  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? JSON.stringify(err.message) : JSON.stringify(res.result),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  });

  done(null, { result: 'Hello World' });
};
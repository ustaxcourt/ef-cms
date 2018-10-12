/* global describe it expect */

const { handler } = require('./hello.js');

describe('hello', () => {
  describe('handler', () => {
    it('should pass', async () => {
      const results = await handler();
      expect(results).toEqual({
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: '"Hello World!"',
      });
    });
  });
});
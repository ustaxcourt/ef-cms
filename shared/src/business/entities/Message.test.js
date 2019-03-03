const assert = require('assert');

const Message = require('./Message');

describe('Message', () => {
  describe('isValid', () => {
    it('Creates a valid document', () => {
      const message = new Message({
        message: 'hello world',
        sentBy: 'gg',
        userId: '123',
      });
      assert.ok(message.isValid());
    });

    it('Creates a valid document', () => {
      const message = new Message({
        message: 'hello world',
        messageId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        sentBy: 'gg',
        userId: '123',
      });
      assert.ok(message.isValid());
    });

    it('Creates an invalid document with no document type', () => {
      const message = new Message({
        sentBy: 'gg',
        userId: '123',
      });
      assert.ok(!message.isValid());
    });
  });
});

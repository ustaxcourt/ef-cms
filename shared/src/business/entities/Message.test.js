const assert = require('assert');

const Message = require('./Message');

describe('Message', () => {
  describe('isValid', () => {
    it('Creates a valid document', () => {
      const message = new Message({
        message: 'hello world',
        userId: '123',
        sentBy: 'gg',
      });
      assert.ok(message.isValid());
    });

    it('Creates a valid document', () => {
      const message = new Message({
        messageId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        message: 'hello world',
        userId: '123',
        sentBy: 'gg',
      });
      assert.ok(message.isValid());
    });

    it('Creates an invalid document with no document type', () => {
      const message = new Message({
        userId: '123',
        sentBy: 'gg',
      });
      assert.ok(!message.isValid());
    });
  });
});

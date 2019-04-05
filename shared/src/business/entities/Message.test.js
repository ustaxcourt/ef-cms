const assert = require('assert');
const { Message } = require('./Message');

describe('Message', () => {
  describe('isValid', () => {
    it('Creates a valid document', () => {
      const message = new Message({
        from: 'gg',
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'hello world',
      });
      assert.ok(message.isValid());
    });

    it('Creates a valid document', () => {
      const message = new Message({
        from: 'gg',
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'hello world',
        messageId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });
      assert.ok(message.isValid());
    });

    it('Creates an invalid document with no document type', () => {
      const message = new Message({
        from: 'gg',
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
      assert.ok(!message.isValid());
    });
  });
});

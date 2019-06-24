const { Message } = require('./Message');

describe('Message', () => {
  describe('isValid', () => {
    it('Creates a valid Message without messageId (defaults to new uuid)', () => {
      const message = new Message({
        from: 'gg',
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'hello world',
      });
      expect(message.isValid()).toBeTruthy();
    });

    it('Creates a valid Message with messageId', () => {
      const message = new Message({
        from: 'gg',
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'hello world',
        messageId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });
      expect(message.isValid()).toBeTruthy();
    });

    it('Creates an invalid Message with no message', () => {
      const message = new Message({
        from: 'gg',
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
      expect(message.isValid()).toBeFalsy();
    });
  });
});

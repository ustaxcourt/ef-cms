const { applicationContext } = require('../test/createTestApplicationContext');
const { NewCaseMessage } = require('./NewCaseMessage');

describe('NewCaseMessage', () => {
  describe('isValid', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new NewCaseMessage({}, {})).toThrow();
    });

    it('creates a valid NewCaseMessage', () => {
      const message = new NewCaseMessage(
        {
          message: 'hello world',
          subject: 'hey!',
          to: 'bob',
          toSection: 'petitions',
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        { applicationContext },
      );
      expect(message.isValid()).toBeTruthy();
    });

    it('creates an invalid NewCaseMessage with no message', () => {
      const message = new NewCaseMessage(
        {
          subject: 'hey!',
          to: 'bob',
          toSection: 'petitions',
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        { applicationContext },
      );
      expect(message.isValid()).toBeFalsy();
    });
  });
});

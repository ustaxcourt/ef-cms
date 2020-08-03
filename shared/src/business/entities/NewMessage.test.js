const { applicationContext } = require('../test/createTestApplicationContext');
const { NewMessage } = require('./NewMessage');
const { PETITIONS_SECTION } = require('./EntityConstants');

describe('NewMessage', () => {
  describe('isValid', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new NewMessage({}, {})).toThrow();
    });

    it('creates a valid NewMessage', () => {
      const message = new NewMessage(
        {
          message: 'hello world',
          subject: 'hey!',
          to: 'bob',
          toSection: PETITIONS_SECTION,
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        { applicationContext },
      );
      expect(message.isValid()).toBeTruthy();
    });

    it('creates an invalid NewMessage with no message', () => {
      const message = new NewMessage(
        {
          subject: 'hey!',
          to: 'bob',
          toSection: PETITIONS_SECTION,
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        { applicationContext },
      );
      expect(message.isValid()).toBeFalsy();
    });
  });
});

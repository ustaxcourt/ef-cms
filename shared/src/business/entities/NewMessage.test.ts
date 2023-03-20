const { applicationContext } = require('../test/createTestApplicationContext');
const { getTextByCount } = require('../utilities/getTextByCount');
const { Message } = require('./Message');
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

  describe('validation message', () => {
    it('displays a message when the message is over 500 characters long', () => {
      const message = new NewMessage(
        {
          message: getTextByCount(1001),
          subject: 'hey!',
          to: 'bob',
          toSection: PETITIONS_SECTION,
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        { applicationContext },
      );
      expect(message.getFormattedValidationErrors()).toEqual({
        message: Message.VALIDATION_ERROR_MESSAGES.message[1].message,
      });
    });
  });
});

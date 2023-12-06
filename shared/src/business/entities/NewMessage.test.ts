import { NewMessage } from './NewMessage';
import { PETITIONS_SECTION } from './EntityConstants';
import { getTextByCount } from '../utilities/getTextByCount';

describe('NewMessage', () => {
  describe('isValid', () => {
    it('should be true when required fields are provided', () => {
      const message = new NewMessage({
        message: 'hello world',
        subject: 'hey!',
        to: 'bob',
        toSection: PETITIONS_SECTION,
        toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });

      expect(message.isValid()).toBeTruthy();
    });

    it('should be false when required fields are missing', () => {
      const message = new NewMessage({
        message: undefined,
        subject: 'hey!',
        to: 'bob',
        toSection: PETITIONS_SECTION,
        toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416', // This is a required property
      });

      expect(message.isValid()).toBeFalsy();
    });
  });

  describe('validation', () => {
    it('should return a validation message when the message is over 500 characters long', () => {
      const message = new NewMessage({
        message: getTextByCount(1001),
        subject: 'hey!',
        to: 'bob',
        toSection: PETITIONS_SECTION,
        toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });

      expect(message.getFormattedValidationErrors()).toEqual({
        message: 'Limit is 700 characters. Enter 700 or fewer characters.',
      });
    });
  });
});

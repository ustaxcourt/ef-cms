import { NewMessage } from './NewMessage';
import { PETITIONS_SECTION } from './EntityConstants';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
import { getTextByCount } from '../utilities/getTextByCount';

describe('NewMessage', () => {
  describe('isValid', () => {
    it('creates a valid NewMessage', () => {
      const message = new NewMessage({
        message: 'hello world',
        subject: 'hey!',
        to: 'bob',
        toSection: PETITIONS_SECTION,
        toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
      expect(message.isValid()).toBeTruthy();
    });

    it('creates an invalid NewMessage with no message', () => {
      const message = new NewMessage({
        subject: 'hey!',
        to: 'bob',
        toSection: PETITIONS_SECTION,
        toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
      expect(message.isValid()).toBeFalsy();
    });
  });

  describe('validation message', () => {
    it('displays a message when the message is over 500 characters long', () => {
      const message = new NewMessage({
        message: getTextByCount(1001),
        subject: 'hey!',
        to: 'bob',
        toSection: PETITIONS_SECTION,
        toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });

      const customMessages = extractCustomMessages(
        message.getValidationRules(),
      );
      expect(message.getFormattedValidationErrors()).toEqual({
        message: customMessages.message[1],
      });
    });
  });
});

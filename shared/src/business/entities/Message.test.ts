import { CASE_STATUS_TYPES, PETITIONS_SECTION } from './EntityConstants';
import { Message, RawMessage } from './Message';
import { applicationContext } from '../test/createTestApplicationContext';
import { createISODateString } from '../utilities/DateHandler';
import { getTextByCount } from '../utilities/getTextByCount';

jest.mock('../utilities/DateHandler', () => {
  const originalModule = jest.requireActual('../utilities/DateHandler');
  return {
    __esModule: true,
    ...originalModule,
    createISODateString: jest.fn(),
    formatNow: jest.fn().mockReturnValue('1999'),
  };
});

describe('Message', () => {
  const mockCreatedAt = '2019-03-01T22:54:06.000Z';

  const mockMessage: RawMessage = {
    caseStatus: CASE_STATUS_TYPES.generalDocket,
    caseTitle: 'The Land Before Time',
    createdAt: '2019-03-01T21:40:46.415Z',
    docketNumber: '123-20',
    docketNumberWithSuffix: '123-45S',
    entityName: 'Message',
    from: 'Test Petitionsclerk',
    fromSection: PETITIONS_SECTION,
    fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
    isCompleted: false,
    isRead: false,
    isRepliedTo: false,
    message: 'hey there',
    messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
    parentMessageId: '31687a1e-3640-42cd-8e7e-a8e6df39ce9a',
    subject: 'hello',
    to: 'Test Petitionsclerk2',
    toSection: PETITIONS_SECTION,
    toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
  };

  (createISODateString as jest.Mock).mockReturnValue(mockCreatedAt);

  describe('constructor', () => {
    it('should throw an error when application context is not provided as an argument', () => {
      expect(() => new Message(mockMessage, {} as any)).toThrow(
        'applicationContext must be defined',
      );
    });

    it('should populate leadDocketNumber when it is provided', () => {
      const mockLeadDocketNumber = '999-99';

      const message = new Message(
        {
          ...mockMessage,
          leadDocketNumber: mockLeadDocketNumber,
        },
        { applicationContext },
      );

      expect(message.leadDocketNumber).toEqual(mockLeadDocketNumber);
    });

    it('should set createdAt to now when createdAt is not provided', () => {
      const message = new Message(
        {
          ...mockMessage,
          createdAt: undefined,
        },
        { applicationContext },
      );

      expect(message.createdAt).toEqual(mockCreatedAt);
    });

    it('should set parentMessageId to messageId when parentMessageId is not provided', () => {
      const message = new Message(
        {
          ...mockMessage,
          parentMessageId: undefined,
        },
        { applicationContext },
      );

      expect(message.parentMessageId).toEqual(mockMessage.messageId);
    });
  });

  describe('isValid', () => {
    it('should be true when messageId is not provided', () => {
      const message = new Message(
        {
          ...mockMessage,
          messageId: undefined,
        },
        { applicationContext },
      );

      expect(message.isValid()).toBeTruthy();
    });

    it('should be false when no message is provided', () => {
      const message = new Message(
        {
          ...mockMessage,
          message: undefined,
        },
        { applicationContext },
      );

      expect(message.isValid()).toBeFalsy();
    });

    it('should be false when no subject is provided', () => {
      const message = new Message(
        {
          ...mockMessage,
          subject: undefined,
        },
        { applicationContext },
      );

      expect(message.isValid()).toBeFalsy();
      expect(message.getFormattedValidationErrors()!.subject).toEqual(
        'Enter a subject line',
      );
    });

    it('should be false when subject contains no characters other than spaces', () => {
      const message = new Message(
        {
          ...mockMessage,
          subject: '   ',
        },
        { applicationContext },
      );

      expect(message.isValid()).toBeFalsy();
      expect(message.getFormattedValidationErrors()!.subject).toEqual(
        'Enter a subject line',
      );
    });

    it('should be false when subject is an empty string', () => {
      const message = new Message(
        {
          ...mockMessage,
          subject: '',
        },
        { applicationContext },
      );

      expect(message.isValid()).toBeFalsy();
      expect(message.getFormattedValidationErrors()!.subject).toEqual(
        'Enter a subject line',
      );
    });

    it('should be false when a subject is provided that is too long', () => {
      const message = new Message(
        {
          ...mockMessage,
          subject:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec fringilla diam. Donec molestie metus eu purus posuere, eu porta ex aliquet. Sed metus justo, sodales sit amet vehicula a, elementum a dolor. Aliquam matis mi eget erat scelerisque ph.', // 250 chars
        },
        { applicationContext },
      );

      expect(message.isValid()).toBeFalsy();
      expect(message.getFormattedValidationErrors()!.subject).toEqual(
        'Limit is 250 characters. Enter 250 or fewer characters.',
      );
    });

    it('should be false when isCompleted is true but other required completedBy fields are not provided', () => {
      const message = new Message(
        {
          ...mockMessage,
          completedAt: undefined,
          completedBy: undefined,
          completedBySection: undefined,
          completedByUserId: undefined,
          isCompleted: true,
        },
        { applicationContext },
      );

      expect(message.isValid()).toBeFalsy();
      expect(Object.keys(message.getFormattedValidationErrors()!)).toEqual([
        'completedAt',
        'completedBy',
        'completedBySection',
        'completedByUserId',
      ]);
    });

    it('should be true when valid attachments are provided', () => {
      const message = new Message(
        {
          ...mockMessage,
          attachments: [
            {
              documentId: 'b5533197-01c7-40e6-abf2-1a705fd6ed27',
              documentTitle: 'Petition',
              documentType: 'Petition',
              eventCode: 'P',
            },
          ],
        },
        { applicationContext },
      );

      expect(message.isValid()).toBeTruthy();
      expect(message.attachments).toEqual([
        {
          documentId: 'b5533197-01c7-40e6-abf2-1a705fd6ed27',
        },
      ]);
    });

    it('should be false when attachements are provided that are missing required fields', () => {
      const message = new Message(
        {
          ...mockMessage,
          attachments: [
            {
              documentType: 'Petition',
              eventCode: 'P',
            },
          ],
        },
        { applicationContext },
      );

      expect(message.isValid()).toBeFalsy();
      expect(Object.keys(message.getFormattedValidationErrors()!)).toEqual([
        'documentId',
      ]);
    });
  });

  describe('validation', () => {
    it('should return a message when the message is over 700 characters long', () => {
      const message = new Message(
        {
          ...mockMessage,
          message: getTextByCount(1001),
        },
        { applicationContext },
      );

      expect(message.getFormattedValidationErrors()).toEqual({
        message: 'Limit is 700 characters. Enter 700 or fewer characters.',
      });
    });
  });

  describe('markAsCompleted', () => {
    it('should mark the message as replied to and completed by the provided user', () => {
      const message = new Message(
        {
          ...mockMessage,
        },
        { applicationContext },
      );

      message.markAsCompleted({
        message: 'the completed message',
        user: {
          name: 'Test Person',
          section: PETITIONS_SECTION,
          userId: 'f3cf18f9-f1b0-43f7-a4e0-d0e2658e1faa',
        },
      });

      expect(message.isValid()).toBeTruthy();
      expect(message).toMatchObject({
        completedBy: 'Test Person',
        completedBySection: PETITIONS_SECTION,
        completedByUserId: 'f3cf18f9-f1b0-43f7-a4e0-d0e2658e1faa',
        completedMessage: 'the completed message',
        createdAt: expect.anything(),
        isCompleted: true,
        isRepliedTo: true,
      });
    });

    it('should not throw an error when the completed message is a blank string', () => {
      const message = new Message(mockMessage, { applicationContext });

      message.markAsCompleted({
        message: '',
        user: {
          name: 'Test Person',
          section: PETITIONS_SECTION,
          userId: 'f3cf18f9-f1b0-43f7-a4e0-d0e2658e1faa',
        },
      });

      expect(message.isValid()).toBeTruthy();
      expect(message).toMatchObject({
        completedBy: 'Test Person',
        completedBySection: PETITIONS_SECTION,
        completedByUserId: 'f3cf18f9-f1b0-43f7-a4e0-d0e2658e1faa',
        completedMessage: null,
        createdAt: expect.anything(),
        isCompleted: true,
        isRepliedTo: true,
      });
    });
  });

  describe('addAttachment', () => {
    it('should add the provided attachment to the attachments array', () => {
      const message = new Message(mockMessage, { applicationContext });

      message.addAttachment({
        documentId: '1f63acc7-d3f1-4115-9310-0570559a023a',
        documentTitle: 'Petition',
      });

      expect(message.isValid()).toBeTruthy();
      expect(message.attachments).toMatchObject([
        {
          documentId: '1f63acc7-d3f1-4115-9310-0570559a023a',
          documentTitle: 'Petition',
        },
      ]);
    });
  });
});

const { applicationContext } = require('../test/createTestApplicationContext');
const { CASE_STATUS_TYPES, PETITIONS_SECTION } = require('./EntityConstants');
const { getTextByCount } = require('../utilities/getTextByCount');
const { Message } = require('./Message');

describe('Message', () => {
  describe('isValid', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new Message({}, {})).toThrow();
    });

    it('creates a valid Message without messageId (defaults to new uuid)', () => {
      const message = new Message(
        {
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: PETITIONS_SECTION,
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
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

    it('creates an invalid Message with no message', () => {
      const message = new Message(
        {
          from: 'gg',
          fromSection: PETITIONS_SECTION,
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          subject: 'hey!',
        },
        { applicationContext },
      );
      expect(message.isValid()).toBeFalsy();
    });

    it('creates an invalid Message with no subject', () => {
      const message = new Message(
        {
          from: 'gg',
          fromSection: PETITIONS_SECTION,
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        { applicationContext },
      );

      expect(message.isValid()).toBeFalsy();
      expect(message.getFormattedValidationErrors().subject).toEqual(
        'Enter a subject line',
      );
    });

    it('creates an invalid Message with an empty subject', () => {
      const message = new Message(
        {
          from: 'gg',
          fromSection: PETITIONS_SECTION,
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          subject: ' ',
        },
        { applicationContext },
      );

      expect(message.isValid()).toBeFalsy();
      expect(message.getFormattedValidationErrors().subject).toEqual(
        'Enter a subject line',
      );
    });

    it('creates an invalid Message with a subject that is too long', () => {
      const message = new Message(
        {
          from: 'gg',
          fromSection: PETITIONS_SECTION,
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          subject:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec fringilla diam. Donec molestie metus eu purus posuere, eu porta ex aliquet. Sed metus justo, sodales sit amet vehicula a, elementum a dolor. Aliquam matis mi eget erat scelerisque ph.', // 250 chars
        },
        { applicationContext },
      );
      expect(message.isValid()).toBeFalsy();
      expect(message.getFormattedValidationErrors().subject).toEqual(
        'Limit is 250 characters. Enter 250 or fewer characters.',
      );
    });

    it('creates an invalid Message with isCompleted true and without completedBy fields', () => {
      const message = new Message(
        {
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: PETITIONS_SECTION,
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          isCompleted: true,
          message: 'hello world',
          subject: 'hey!',
          to: 'bob',
          toSection: PETITIONS_SECTION,
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        { applicationContext },
      );
      expect(message.isValid()).toBeFalsy();
      expect(Object.keys(message.getFormattedValidationErrors())).toEqual([
        'completedAt',
        'completedBy',
        'completedBySection',
        'completedByUserId',
      ]);
    });

    it('creates a valid Message with attachments', () => {
      const message = new Message(
        {
          attachments: [
            {
              documentId: 'b5533197-01c7-40e6-abf2-1a705fd6ed27',
              documentTitle: 'Petition',
              documentType: 'Petition',
              eventCode: 'P',
            },
          ],
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: PETITIONS_SECTION,
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'hello world',
          subject: 'hey!',
          to: 'bob',
          toSection: PETITIONS_SECTION,
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
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

    it('creates an invalid Message with invalid attachments', () => {
      const message = new Message(
        {
          attachments: [
            {
              documentType: 'Petition',
              eventCode: 'P',
            },
          ],
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: PETITIONS_SECTION,
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'hello world',
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

  describe('markAsCompleted', () => {
    it('should mark the message as completed and replied to with a message and user', () => {
      const message = new Message(
        {
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: PETITIONS_SECTION,
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          isRepliedTo: false,
          message: 'hello world',
          subject: 'hey!',
          to: 'bob',
          toSection: PETITIONS_SECTION,
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
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

    it('should not error out if message is a blank string', () => {
      const message = new Message(
        {
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: PETITIONS_SECTION,
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          isRepliedTo: false,
          message: 'hello world',
          subject: 'hey!',
          to: 'bob',
          toSection: PETITIONS_SECTION,
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        { applicationContext },
      );

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
    it('should add the passed in attachment to the attachments array', () => {
      const message = new Message(
        {
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: PETITIONS_SECTION,
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'hello world',
          subject: 'hey!',
          to: 'bob',
          toSection: PETITIONS_SECTION,
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        { applicationContext },
      );

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

  describe('validation message', () => {
    it('displays a message when the message is over 700 characters long', () => {
      const message = new Message(
        {
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: PETITIONS_SECTION,
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
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

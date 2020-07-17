const { applicationContext } = require('../test/createTestApplicationContext');
const { CASE_STATUS_TYPES } = require('./EntityConstants');
const { CaseMessage } = require('./CaseMessage');

describe('CaseMessage', () => {
  describe('isValid', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new CaseMessage({}, {})).toThrow();
    });

    it('creates a valid CaseMessage without messageId (defaults to new uuid)', () => {
      const message = new CaseMessage(
        {
          caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: 'petitions',
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
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

    it('creates an invalid CaseMessage with no message', () => {
      const message = new CaseMessage(
        {
          caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
          from: 'gg',
          fromSection: 'petitions',
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          subject: 'hey!',
        },
        { applicationContext },
      );
      expect(message.isValid()).toBeFalsy();
    });

    it('creates an invalid CaseMessage with isCompleted true and without completedBy fields', () => {
      const message = new CaseMessage(
        {
          caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: 'petitions',
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          isCompleted: true,
          message: 'hello world',
          subject: 'hey!',
          to: 'bob',
          toSection: 'petitions',
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

    it('creates a valid CaseMessage with attachments', () => {
      const message = new CaseMessage(
        {
          attachments: [
            {
              documentId: 'b5533197-01c7-40e6-abf2-1a705fd6ed27',
              documentTitle: 'Petition',
              documentType: 'Petition',
              eventCode: 'P',
            },
          ],
          caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: 'petitions',
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'hello world',
          subject: 'hey!',
          to: 'bob',
          toSection: 'petitions',
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        { applicationContext },
      );
      expect(message.isValid()).toBeTruthy();
      expect(message.attachments).toEqual([
        {
          documentId: 'b5533197-01c7-40e6-abf2-1a705fd6ed27',
          documentTitle: 'Petition',
        },
      ]);
    });

    it('creates an invalid CaseMessage with invalid attachments', () => {
      const message = new CaseMessage(
        {
          attachments: [
            {
              documentType: 'Petition',
              eventCode: 'P',
            },
          ],
          caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: 'petitions',
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'hello world',
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

  describe('markAsCompleted', () => {
    it('should mark the message as completed with a message and user', () => {
      const message = new CaseMessage(
        {
          caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: 'petitions',
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'hello world',
          subject: 'hey!',
          to: 'bob',
          toSection: 'petitions',
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        { applicationContext },
      );

      message.markAsCompleted({
        message: 'the completed message',
        user: {
          name: 'Test Person',
          section: 'petitions',
          userId: 'f3cf18f9-f1b0-43f7-a4e0-d0e2658e1faa',
        },
      });

      expect(message.isValid()).toBeTruthy();
      expect(message).toMatchObject({
        completedBy: 'Test Person',
        completedBySection: 'petitions',
        completedByUserId: 'f3cf18f9-f1b0-43f7-a4e0-d0e2658e1faa',
        completedMessage: 'the completed message',
        createdAt: expect.anything(),
        isCompleted: true,
      });
    });
  });

  describe('addAttachment', () => {
    it('should add the passed in attachment to the attachments array', () => {
      const message = new CaseMessage(
        {
          caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-01-01T17:29:13.122Z',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          from: 'gg',
          fromSection: 'petitions',
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'hello world',
          subject: 'hey!',
          to: 'bob',
          toSection: 'petitions',
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
});

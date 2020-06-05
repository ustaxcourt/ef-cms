const { applicationContext } = require('../test/createTestApplicationContext');
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
          caseStatus: 'General Docket - Not at Issue',
          createdAt: '2019-01-01T17:29:13.122Z',
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
  });
});

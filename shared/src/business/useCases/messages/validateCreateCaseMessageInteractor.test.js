const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateCreateCaseMessageInteractor,
} = require('./validateCreateCaseMessageInteractor');

describe('validateCreateCaseMessageInteractor', () => {
  it('returns null when no errors exist in the CaseMessage', () => {
    const errors = validateCreateCaseMessageInteractor({
      applicationContext,
      message: {
        caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
        from: 'yup',
        fromSection: 'yup',
        fromUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
        message: 'yup',
        subject: 'hi',
        to: 'yup',
        toSection: 'yup',
        toUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
      },
    });

    expect(errors).toBeNull();
  });

  it('returns an error when a subject is missing', () => {
    const errors = validateCreateCaseMessageInteractor({
      applicationContext,
      message: {
        caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
        from: 'yup',
        fromSection: 'yup',
        fromUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
        message: 'yup',
        to: 'yup',
        toSection: 'yup',
        toUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
      },
    });

    expect(errors).toMatchObject({
      subject: 'Enter a subject line',
    });
  });
});

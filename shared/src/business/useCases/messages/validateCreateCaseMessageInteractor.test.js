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
        message: 'yup',
        subject: 'hi',
        toSection: 'petitions',
        toUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
      },
    });

    expect(errors).toBeNull();
  });

  it('returns an error when a subject is missing', () => {
    const errors = validateCreateCaseMessageInteractor({
      applicationContext,
      message: {
        message: 'yup',
        toSection: 'petitions',
        toUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
      },
    });

    expect(errors).toMatchObject({
      subject: 'Enter a subject line',
    });
  });
});

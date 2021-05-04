const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('setQcCompleteForTrial', () => {
  it('should set qcCompleteForTrial on the given case for the given trial session id', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        qcCompleteForTrial: { 'd6fdd6e7-8dfa-463a-8a17-ed4512d1a68d': false },
      },
      { applicationContext },
    );
    const result = caseEntity.setQcCompleteForTrial({
      qcCompleteForTrial: true,
      trialSessionId: 'da61b7b3-5854-4434-a116-9e4135af60e0',
    });

    expect(result.isValid()).toBeTruthy();
    expect(result.qcCompleteForTrial).toEqual({
      'd6fdd6e7-8dfa-463a-8a17-ed4512d1a68d': false,
      'da61b7b3-5854-4434-a116-9e4135af60e0': true,
    });
  });

  it('should default qcCompleteForTrial to an empty object if not provided when entity is constructed', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
      },
      { applicationContext },
    );

    expect(caseEntity.isValid()).toBeTruthy();
    expect(caseEntity.qcCompleteForTrial).toEqual({});
  });

  it('should set qcCompleteForTrial to value provided when passed through Case constructor', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        qcCompleteForTrial: { '80950eee-7efd-4374-a642-65a8262135ab': true },
      },
      { applicationContext },
    );

    expect(caseEntity.isValid()).toBeTruthy();
    expect(caseEntity.qcCompleteForTrial).toEqual({
      '80950eee-7efd-4374-a642-65a8262135ab': true,
    });
  });
});

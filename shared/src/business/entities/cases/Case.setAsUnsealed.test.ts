const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('setAsUnsealed', () => {
  it('should set isSealed to false and sealedDate to undefined', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );

    updatedCase.setAsUnsealed();

    expect(updatedCase.isSealed).toEqual(false);
    expect(updatedCase.sealedDate).toEqual(undefined);
  });
});

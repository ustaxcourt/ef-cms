const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('generateNextDocketRecordIndex', () => {
  it('returns the next possible index based on the current docket record array', () => {
    const caseRecord = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );

    const nextIndex = caseRecord.generateNextDocketRecordIndex();
    expect(nextIndex).toEqual(2); // because there is one document with isOnDocketRecord = true
  });

  it('returns an index of 1 if the docketEntries array is empty', () => {
    const caseRecord = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [],
      },
      {
        applicationContext,
      },
    );

    const nextIndex = caseRecord.generateNextDocketRecordIndex();
    expect(nextIndex).toEqual(1); // because there is one document with isOnDocketRecord = true
  });
});

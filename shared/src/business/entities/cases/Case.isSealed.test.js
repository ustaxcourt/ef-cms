const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');

describe('isSealed', () => {
  it('marks case as sealed if it has at least one document with isSealed = true', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [
          ...MOCK_DOCUMENTS,
          {
            ...MOCK_DOCUMENTS[0],
            isSealed: true,
          },
        ],
      },
      { applicationContext },
    );

    expect(caseEntity.isSealed).toBeTruthy();
  });

  it('marks case as sealed if it has at least one document with isLegacySealed = true', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [
          ...MOCK_DOCUMENTS,
          {
            ...MOCK_DOCUMENTS[0],
            isLegacySealed: true,
          },
        ],
      },
      { applicationContext },
    );

    expect(caseEntity.isSealed).toBeTruthy();
  });
});

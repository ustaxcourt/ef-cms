const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');

describe('getDocketEntryById', () => {
  it('should get the docket entry by an Id', () => {
    const myCase = new Case(MOCK_CASE, {
      applicationContext,
    });
    const result = myCase.getDocketEntryById({
      docketEntryId: MOCK_DOCUMENTS[0].docketEntryId,
    });
    expect(result.docketEntryId).toEqual(MOCK_DOCUMENTS[0].docketEntryId);
  });
});

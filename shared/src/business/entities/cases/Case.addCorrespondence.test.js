const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('addCorrespondence', () => {
  it('should successfully add correspondence', () => {
    const caseEntity = new Case(MOCK_CASE, { applicationContext });

    caseEntity.fileCorrespondence({
      correspondenceId: 'yeehaw',
      documentTitle: 'Correspondence document',
    });

    expect(caseEntity.correspondence.length).toEqual(1);
  });
});

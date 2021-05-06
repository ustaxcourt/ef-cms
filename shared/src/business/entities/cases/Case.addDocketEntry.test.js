const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');

describe('addDocketEntry', () => {
  it('attaches the docket entry to the case', () => {
    const caseToVerify = new Case(
      { docketNumber: '123-45' },
      {
        applicationContext,
      },
    );
    caseToVerify.addDocketEntry({
      docketEntryId: '123',
      documentType: 'Answer',
      userId: 'irsPractitioner',
    });
    expect(caseToVerify.docketEntries.length).toEqual(1);
    expect(caseToVerify.docketEntries[0]).toMatchObject({
      docketEntryId: '123',
      docketNumber: '123-45',
      documentType: 'Answer',
      userId: 'irsPractitioner',
    });
  });
});

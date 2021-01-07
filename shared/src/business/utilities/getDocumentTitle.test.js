const { applicationContext } = require('../test/createTestApplicationContext');
const { getDocumentTitle } = require('./getDocumentTitle');

describe('getDocumentTitle', () => {
  let docketEntry = {
    additionalInfo: 'additional info',
    additionalInfo2: 'additional info 2',
    docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
    documentTitle: 'Answer',
    documentType: 'Answer',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    index: 42,
    isOnDocketRecord: true,
    servedAt: '2019-08-25T05:00:00.000Z',
    servedParties: [{ name: 'Bernard Lowe' }],
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  it('returns the original documentTitle when addToCoversheet is false', () => {
    expect(getDocumentTitle({ applicationContext, docketEntry })).toEqual(
      docketEntry.documentTitle,
    );
  });

  it('appends additionalInfo to docketEntry.documentTitle when docketEntry.addToCoversheet is true', () => {
    docketEntry.addToCoversheet = true;
    docketEntry.additionalInfo2 = undefined;

    expect(getDocumentTitle({ applicationContext, docketEntry })).not.toEqual(
      docketEntry.documentTitle,
    );
    expect(getDocumentTitle({ applicationContext, docketEntry })).toEqual(
      `${docketEntry.documentTitle} ${docketEntry.additionalInfo}`,
    );
  });

  it('appends additionalInfo2 to docketEntry.documentTitle + additionalInfo when docketEntry.addToCoversheet is true', () => {
    docketEntry.addToCoversheet = true;
    docketEntry.additionalInfo2 = 'Another one (DJ Khaled)';

    expect(getDocumentTitle({ applicationContext, docketEntry })).not.toEqual(
      docketEntry.documentTitle,
    );
    expect(getDocumentTitle({ applicationContext, docketEntry })).toEqual(
      `${docketEntry.documentTitle} ${docketEntry.additionalInfo} ${docketEntry.additionalInfo2}`,
    );
  });

  it('appends additionalInfo2 to docketEntry.documentTitle when docketEntry.addToCoversheet is true', () => {
    docketEntry.addToCoversheet = true;
    docketEntry.additionalInfo = undefined;
    docketEntry.additionalInfo2 = 'Another one (DJ Khaled)';

    expect(getDocumentTitle({ applicationContext, docketEntry })).not.toEqual(
      docketEntry.documentTitle,
    );
    expect(getDocumentTitle({ applicationContext, docketEntry })).not.toEqual(
      `${docketEntry.documentTitle} ${docketEntry.additionalInfo} ${docketEntry.additionalInfo2}`,
    );
    expect(getDocumentTitle({ applicationContext, docketEntry })).toEqual(
      `${docketEntry.documentTitle} ${docketEntry.additionalInfo2}`,
    );
  });
});

import { applicationContext } from '../test/createTestApplicationContext';
import { getDocumentTitleForNoticeOfChange } from './getDocumentTitleForNoticeOfChange';

describe('getDocumentTitleForNoticeOfChange', () => {
  let docketEntry;

  beforeEach(() => {
    docketEntry = {
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
  });

  it('should return the original documentTitle when no other fields are populated', () => {
    const docketEntryOriginalTitle = {
      additionalInfo: undefined,
      additionalInfo2: undefined,
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

    expect(
      getDocumentTitleForNoticeOfChange({
        applicationContext,
        docketEntry: docketEntryOriginalTitle,
      }),
    ).toEqual(docketEntry.documentTitle);
  });

  it('appends additionalInfo to docketEntry.documentTitle when it is defined', () => {
    docketEntry.addToCoversheet = true;
    docketEntry.additionalInfo2 = undefined;

    expect(
      getDocumentTitleForNoticeOfChange({ applicationContext, docketEntry }),
    ).not.toEqual(docketEntry.documentTitle);
    expect(
      getDocumentTitleForNoticeOfChange({ applicationContext, docketEntry }),
    ).toEqual(`${docketEntry.documentTitle} ${docketEntry.additionalInfo}`);
  });

  it('appends additionalInfo2 to docketEntry.documentTitle + additionalInfo when they are defined', () => {
    docketEntry.addToCoversheet = true;
    docketEntry.additionalInfo2 = 'Another one (DJ Khaled)';

    expect(
      getDocumentTitleForNoticeOfChange({ applicationContext, docketEntry }),
    ).not.toEqual(docketEntry.documentTitle);
    expect(
      getDocumentTitleForNoticeOfChange({ applicationContext, docketEntry }),
    ).toEqual(
      `${docketEntry.documentTitle} ${docketEntry.additionalInfo} ${docketEntry.additionalInfo2}`,
    );
  });

  it('appends additionalInfo2 to docketEntry.documentTitle when it is defined', () => {
    docketEntry.addToCoversheet = true;
    docketEntry.additionalInfo = undefined;
    docketEntry.additionalInfo2 = 'Another one (DJ Khaled)';

    expect(
      getDocumentTitleForNoticeOfChange({ applicationContext, docketEntry }),
    ).not.toEqual(docketEntry.documentTitle);
    expect(
      getDocumentTitleForNoticeOfChange({ applicationContext, docketEntry }),
    ).not.toEqual(
      `${docketEntry.documentTitle} ${docketEntry.additionalInfo} ${docketEntry.additionalInfo2}`,
    );
    expect(
      getDocumentTitleForNoticeOfChange({ applicationContext, docketEntry }),
    ).toEqual(`${docketEntry.documentTitle} ${docketEntry.additionalInfo2}`);
  });
});

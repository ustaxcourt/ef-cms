import { DocketEntry } from './DocketEntry';

describe('setNumberOfPages', () => {
  it('sets the number of pages', () => {
    const docketEntry = new DocketEntry(
      {
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filingDate: '9000-01-01T00:00:00.000Z',
        index: 1,
      },
      { authorizedUser: undefined },
    );
    docketEntry.setNumberOfPages(13);
    expect(docketEntry.numberOfPages).toEqual(13);
  });
});

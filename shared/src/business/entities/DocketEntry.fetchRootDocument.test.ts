import { DocketEntry } from './DocketEntry';

describe('fetchRootDocument', () => {
  it('should set up all the previous documents for the docket entry passed in', () => {
    const theDocketEntry: any = {
      docketEntryId: '1',
      documentTitle: 'booba',
      previousDocument: {
        docketEntryId: '2',
      },
    };
    const docketEntries = [
      theDocketEntry,
      {
        docketEntryId: '2',
        documentTitle: 'fruity',
        previousDocument: { docketEntryId: '3' },
      },
      { docketEntryId: '3', documentTitle: 'minions' },
    ];

    const docketEntry = DocketEntry.fetchRootDocument(
      theDocketEntry,
      docketEntries,
    );

    expect(docketEntry).toEqual({
      docketEntryId: '3',
      documentTitle: 'minions',
    });
  });

  it('should return the closest to the parent if the chain is missing an entry', () => {
    const theDocketEntry: any = {
      docketEntryId: '1',
      documentTitle: 'booba',
      previousDocument: {
        docketEntryId: '2',
      },
    };
    const docketEntries = [
      theDocketEntry,
      {
        docketEntryId: '2',
        documentTitle: 'fruity',
        previousDocument: { docketEntryId: '3' },
      },
    ];

    const docketEntry = DocketEntry.fetchRootDocument(
      theDocketEntry,
      docketEntries,
    );

    expect(docketEntry).toEqual({
      docketEntryId: '2',
      documentTitle: 'fruity',
      previousDocument: { docketEntryId: '3' },
    });
  });
});

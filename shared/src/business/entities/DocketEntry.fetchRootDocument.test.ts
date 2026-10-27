import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_RELATIONSHIPS,
} from './EntityConstants';
import { DocketEntry } from './DocketEntry';
import { applicationContext } from '../test/createTestApplicationContext';
import { createISODateString } from '../utilities/DateHandler';

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

  it('should resolve the primary motion for a same-filing supporting document without a parent docket entry id', () => {
    const filingDate = createISODateString('2027-01-02', 'yyyy-MM-dd');
    const motionDocketEntryId = applicationContext.getUniqueId();
    const briefDocketEntryId = applicationContext.getUniqueId();
    const primaryMotion: RawDocketEntry = {
      createdAt: filingDate,
      docketEntryId: motionDocketEntryId,
      docketNumber: '123-45',
      documentStorageId: motionDocketEntryId,
      documentTitle: 'Motion for Continuance',
      documentType: 'Motion for Continuance',
      eventCode: 'M006',
      filers: [],
      filingDate,
      isOnDocketRecord: true,
      multiDocketedOn: [],
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      receivedAt: filingDate,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      stampData: {},
    };
    const briefInSupport: RawDocketEntry = {
      ...primaryMotion,
      docketEntryId: briefDocketEntryId,
      documentStorageId: briefDocketEntryId,
      documentTitle: 'Brief in Support of Motion for Continuance',
      documentType: 'Brief in Support',
      eventCode: 'BRF',
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
      previousDocument: {
        documentType: 'Motion for Continuance',
        documentTitle: 'Motion for Continuance',
      },
    };

    const rootDocument = DocketEntry.fetchRootDocument(briefInSupport, [
      briefInSupport,
      primaryMotion,
    ]);

    expect(rootDocument).toEqual(primaryMotion);
  });
});

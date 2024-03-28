import {
  ATP_DOCKET_ENTRY,
  MOCK_DOCUMENTS,
  STANDING_PRETRIAL_ORDER_ENTRY,
} from '@shared/test/mockDocketEntry';
import { DOCKET_RECORD_FILTER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseDocumentsIdsFilteredByDocumentType } from './getCaseDocumentsIdsFilteredByDocumentType';

describe('getCaseDocumentsIdsFilteredByDocumentType', () => {
  const PETITION_DOCKET_ENTRY = MOCK_DOCUMENTS[0];

  const mockDocketEntries = [
    PETITION_DOCKET_ENTRY,
    ATP_DOCKET_ENTRY,
    STANDING_PRETRIAL_ORDER_ENTRY,
  ];

  const docIdsSelectedForDownload = mockDocketEntries.map(docEntry => ({
    docketEntryId: docEntry.docketEntryId,
  }));

  it('should return ids for ALL the documents to process', () => {
    const expectedResults = [
      PETITION_DOCKET_ENTRY.docketEntryId,
      ATP_DOCKET_ENTRY.docketEntryId,
      STANDING_PRETRIAL_ORDER_ENTRY.docketEntryId,
    ];

    const result = getCaseDocumentsIdsFilteredByDocumentType(
      applicationContext,
      {
        docIdsSelectedForDownload,
        docketEntries: mockDocketEntries,
        docketRecordFilter: 'All documents',
      },
    );

    expect(result).toEqual(expectedResults);
  });

  it('should return ids of the documents by selected the filter', () => {
    const expectedResults = [STANDING_PRETRIAL_ORDER_ENTRY.docketEntryId];

    const result = getCaseDocumentsIdsFilteredByDocumentType(
      applicationContext,
      {
        docIdsSelectedForDownload,
        docketEntries: mockDocketEntries,
        docketRecordFilter: DOCKET_RECORD_FILTER_OPTIONS.orders,
      },
    );

    expect(result).toEqual(expectedResults);
  });
});

import { MOCK_CASE } from '../../test/mockCase';
import { getDocumentStorageId } from './getDocumentStorageId';

describe('getDocumentStorageId', () => {
  const MOCK_DOCKET_ENTRY = MOCK_CASE.docketEntries[0];

  it('should return the documentStorageId for the matching docket entry', () => {
    const mockDocumentStorageId = 'abc-123-storage-id';
    const mockDocketEntryId = MOCK_DOCKET_ENTRY.docketEntryId;

    const caseDetail = {
      ...MOCK_CASE,
      docketEntries: [
        {
          ...MOCK_DOCKET_ENTRY,
          docketEntryId: mockDocketEntryId,
          documentStorageId: mockDocumentStorageId,
        },
      ],
    };

    const result = getDocumentStorageId({
      caseDetail,
      docketEntryId: mockDocketEntryId,
    });

    expect(result).toEqual(mockDocumentStorageId);
  });

  it('should return the correct documentStorageId when multiple docket entries exist', () => {
    const mockDocumentStorageId = 'target-storage-id';
    const targetDocketEntryId = 'target-docket-entry-id';

    const caseDetail = {
      ...MOCK_CASE,
      docketEntries: [
        {
          ...MOCK_DOCKET_ENTRY,
          docketEntryId: 'other-docket-entry-id',
          documentStorageId: 'other-storage-id',
        },
        {
          ...MOCK_DOCKET_ENTRY,
          docketEntryId: targetDocketEntryId,
          documentStorageId: mockDocumentStorageId,
        },
      ],
    };

    const result = getDocumentStorageId({
      caseDetail,
      docketEntryId: targetDocketEntryId,
    });

    expect(result).toEqual(mockDocumentStorageId);
  });
});

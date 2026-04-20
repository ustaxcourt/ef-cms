import {
  getOriginalNoticeValues,
  buildUpdatedDocketEntry,
  needsNewCoversheet,
} from './noticeOfDocketChangeHelper';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { DOCUMENT_RELATIONSHIPS } from '@shared/business/entities/EntityConstants';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT } from '@shared/test/mockDocketEntry';

jest.mock('@web-api/utilities/logger/getDawsonLogger');

const mockGetDawsonLogger = getDawsonLogger as jest.MockedFunction<
  typeof getDawsonLogger
>;

describe('noticeOfDocketChangeHelper', () => {
  let mockLogger: { error: jest.Mock };

  beforeEach(() => {
    mockLogger = {
      error: jest.fn(),
    };
    mockGetDawsonLogger.mockReturnValue(mockLogger as any);
  });

  describe('getOriginalNoticeValues', () => {
    it('should return documentTitleForNotice and filedBy from docket entry', () => {
      const mockDocketEntry = {
        ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
        objections: undefined,
        documentTitle: 'Motion for Leave to File',
        filedBy: 'Test Petitioner',
      };

      applicationContext
        .getUtilities()
        .getDocumentTitleForNoticeOfChange.mockReturnValue(
          'Motion for Leave to File',
        );

      const result = getOriginalNoticeValues({
        docketEntry: mockDocketEntry,
      });

      expect(result).toEqual({
        documentTitleForNotice: 'Motion for Leave to File',
        filedBy: 'Test Petitioner',
      });
    });

    it('should use values from editState when valid JSON string is provided', () => {
      const mockDocketEntry = {
        ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
        objections: undefined,
        documentTitle: 'Original Motion',
        filedBy: 'Original Petitioner',
        editState: JSON.stringify({
          documentTitle: 'Amended Motion',
          filedBy: 'Amended Petitioner',
        }),
      };

      applicationContext
        .getUtilities()
        .getDocumentTitleForNoticeOfChange.mockReturnValueOnce(
          'Original Motion',
        )
        .mockReturnValueOnce('Amended Motion');

      const result = getOriginalNoticeValues({
        docketEntry: mockDocketEntry,
      });

      expect(result.documentTitleForNotice).toEqual('Amended Motion');
      expect(result.filedBy).toEqual('Amended Petitioner');
    });

    it('should log error when editState has invalid JSON', () => {
      const mockDocketEntry = {
        ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
        objections: undefined,
        documentTitle: 'Motion',
        filedBy: 'Petitioner',
        editState: 'invalid json',
      };

      applicationContext
        .getUtilities()
        .getDocumentTitleForNoticeOfChange.mockReturnValue('Motion');

      getOriginalNoticeValues({
        docketEntry: mockDocketEntry,
      });

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to parse docketEntry.editState for notice of docket change',
      );
    });

    it('should NOT parse editState when it is "{}"', () => {
      const mockDocketEntry = {
        ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
        objections: undefined,
        documentTitle: 'Original Motion',
        filedBy: 'Original Petitioner',
        editState: '{}',
      };

      applicationContext
        .getUtilities()
        .getDocumentTitleForNoticeOfChange.mockReturnValue('Original Motion');

      const result = getOriginalNoticeValues({
        docketEntry: mockDocketEntry,
      });

      expect(result.documentTitleForNotice).toEqual('Original Motion');
      expect(result.filedBy).toEqual('Original Petitioner');
    });

    it('should NOT update fields when parsedEditState is not an object', () => {
      const mockDocketEntry = {
        ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
        objections: undefined,
        documentTitle: 'Original Motion',
        filedBy: 'Original Petitioner',
        editState: 'null',
      };

      applicationContext
        .getUtilities()
        .getDocumentTitleForNoticeOfChange.mockReturnValue('Original Motion');

      const result = getOriginalNoticeValues({
        docketEntry: mockDocketEntry,
      });

      expect(result.documentTitleForNotice).toEqual('Original Motion');
      expect(result.filedBy).toEqual('Original Petitioner');
    });

    it('should NOT update documentTitleForNotice when parsedTitle is falsy', () => {
      const mockDocketEntry = {
        ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
        objections: undefined,
        documentTitle: 'Original Motion',
        filedBy: 'Original Petitioner',
        editState: JSON.stringify({
          documentTitle: '',
          filedBy: 'Amended Petitioner',
        }),
      };

      applicationContext
        .getUtilities()
        .getDocumentTitleForNoticeOfChange.mockReturnValueOnce(
          'Original Motion',
        )
        .mockReturnValueOnce('');

      const result = getOriginalNoticeValues({
        docketEntry: mockDocketEntry,
      });

      expect(result.documentTitleForNotice).toEqual('Original Motion');
      expect(result.filedBy).toEqual('Amended Petitioner');
    });

    it('should NOT update filedBy when parsedFiledBy is not present', () => {
      const mockDocketEntry = {
        ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
        objections: undefined,
        documentTitle: 'Original Motion',
        filedBy: 'Original Petitioner',
        editState: JSON.stringify({
          documentTitle: 'Amended Motion',
        }),
      };

      applicationContext
        .getUtilities()
        .getDocumentTitleForNoticeOfChange.mockReturnValueOnce(
          'Original Motion',
        )
        .mockReturnValueOnce('Amended Motion');

      const result = getOriginalNoticeValues({
        docketEntry: mockDocketEntry,
      });

      expect(result.documentTitleForNotice).toEqual('Amended Motion');
      expect(result.filedBy).toEqual('Original Petitioner');
    });
  });

  describe('buildUpdatedPrimaryDocketEntry', () => {
    it('should merge editableFields with docketEntry and set relationship to PRIMARY', () => {
      const mockDocketEntry = {
        docketEntryId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        docketNumber: '101-23',
        documentTitle: 'Original Title',
        documentType: 'Motion',
        eventCode: 'MISC',
        filedBy: 'Petitioner',
        filedByRole: 'petitioner',
        filingDate: '2023-01-01T12:00:00.000Z',
        processingStatus: 'pending',
        isOnDocketRecord: true,
      };

      const editableFields = {
        documentTitle: 'Updated Title',
        additionalInfo: 'Additional Info',
      };

      const result = buildUpdatedDocketEntry({
        authorizedUser: mockDocketClerkUser,
        docketEntry: mockDocketEntry,
        editableFields,
        petitioners: [],
      });

      expect(result.documentTitle).toBe('Updated Title');
      expect(result.editState).toBe('{}');
      expect(result.relationship).toBe(DOCUMENT_RELATIONSHIPS.PRIMARY);
    });
  });

  describe('needsNewCoversheet', () => {
    it('should return true when receivedAt is different', () => {
      const result = needsNewCoversheet({
        currentDocketEntry: {
          ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
          receivedAt: '2023-01-01',
          certificateOfService: false,
        },
        updatedDocketEntry: {
          ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
          receivedAt: '2023-01-02',
          certificateOfService: false,
        },
      });

      expect(result).toBe(true);
    });

    it('should return true when certificateOfService is different', () => {
      const result = needsNewCoversheet({
        currentDocketEntry: {
          ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
          receivedAt: '2023-01-01',
          certificateOfService: false,
        },
        updatedDocketEntry: {
          ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
          receivedAt: '2023-01-01',
          certificateOfService: true,
        },
      });

      expect(result).toBe(true);
    });

    it('should return true when document title is different', () => {
      const result = needsNewCoversheet({
        currentDocketEntry: {
          ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
          receivedAt: '2023-01-01',
          certificateOfService: false,
          documentTitle: 'Title 1',
        },
        updatedDocketEntry: {
          ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
          receivedAt: '2023-01-01',
          certificateOfService: false,
          documentTitle: 'Title 2',
        },
      });

      expect(result).toBe(true);
    });

    it('should return false when no fields are updated', () => {
      const result = needsNewCoversheet({
        currentDocketEntry: {
          ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
          receivedAt: '2023-01-01',
          certificateOfService: false,
          documentTitle: 'Same Title',
        },
        updatedDocketEntry: {
          ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
          receivedAt: '2023-01-01',
          certificateOfService: false,
          documentTitle: 'Same Title',
        },
      });

      expect(result).toBe(false);
    });
  });
});

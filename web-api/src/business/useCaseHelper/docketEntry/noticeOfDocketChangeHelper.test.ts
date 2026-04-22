import {
  buildUpdatedDocketEntry,
  needsNewCoversheet,
} from './noticeOfDocketChangeHelper';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { DOCUMENT_RELATIONSHIPS } from '@shared/business/entities/EntityConstants';
import { MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT } from '@shared/test/mockDocketEntry';

jest.mock('@web-api/utilities/logger/getDawsonLogger');

describe('noticeOfDocketChangeHelper', () => {
  describe('buildUpdatedPrimaryDocketEntry', () => {
    it('should merge editableFields with docketEntry and set relationship to PRIMARY', () => {
      const mockDocketEntry = {
        ...MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
        docketEntryId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        docketNumber: '101-23',
        originallyFiledDocketNumber: '101-23',
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

import { MOCK_CASE } from '../../test/mockCase';
import { PARTIES_CODES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { setPretrialMemorandumFiler } from './getFormattedTrialSessionDetails';

describe('getFormattedTrialSessionDetails', () => {
  describe('setPretrialMemorandumFiler', () => {
    const mockPretrialMemorandumDocketEntry = {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
      docketNumber: '101-18',
      documentTitle: 'Pretrial Memorandum',
      documentType: 'Pretrial Memorandum',
      eventCode: 'PMT',
      filedBy: 'Test Petitioner',
      filers: [MOCK_CASE.petitioners[0].contactId],
      filingDate: '2018-03-01T05:00:00.000Z',
      index: 5,
      isFileAttached: true,
      isOnDocketRecord: true,
      isStricken: false,
      partyIrsPractitioner: false,
      processingStatus: 'complete',
      receivedAt: '2018-03-01T05:00:00.000Z',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    };

    let mockCase;

    it('should set the pretrialMemorandumStatus to "P" when the filer is the petitioner', () => {
      mockCase = {
        ...MOCK_CASE,
        docketEntries: [mockPretrialMemorandumDocketEntry],
        irsPractitioners: [],
      };

      const result = setPretrialMemorandumFiler({
        applicationContext,
        caseItem: mockCase,
      });

      expect(result).toEqual(PARTIES_CODES.PETITIONER);
    });

    it('should set the pretrialMemorandumStatus to "R" when the filer is the respondent', () => {
      mockCase = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...mockPretrialMemorandumDocketEntry,
            filers: [],
            partyIrsPractitioner: true,
          },
        ],
      };

      const result = setPretrialMemorandumFiler({
        applicationContext,
        caseItem: mockCase,
      });

      expect(result).toEqual(PARTIES_CODES.RESPONDENT);
    });

    it('should set the pretrialMemorandumStatus to "B" when the filers are both petitioner and respondent', () => {
      mockCase = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...mockPretrialMemorandumDocketEntry,
            filers: [MOCK_CASE.petitioners[0].contactId],
            partyIrsPractitioner: true,
          },
        ],
      };

      const result = setPretrialMemorandumFiler({
        applicationContext,
        caseItem: mockCase,
      });

      expect(result).toEqual(PARTIES_CODES.BOTH);
    });

    it('should set the pretrialMemorandumStatus to "B" when there are 2 PMTs, one filed by petitioner and one filed by respondent', () => {
      mockCase = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...mockPretrialMemorandumDocketEntry,
            filers: [MOCK_CASE.petitioners[0].contactId],
            partyIrsPractitioner: false,
          },
          {
            ...mockPretrialMemorandumDocketEntry,
            filers: [],
            partyIrsPractitioner: true,
          },
        ],
      };

      const result = setPretrialMemorandumFiler({
        applicationContext,
        caseItem: mockCase,
      });

      expect(result).toEqual(PARTIES_CODES.BOTH);
    });

    it('should set the pretrialMemorandumStatus to "R" when there are 2 PMTs, one stricken and filed by petitioner and one filed by respondent', () => {
      mockCase = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...mockPretrialMemorandumDocketEntry,
            filers: [MOCK_CASE.petitioners[0].contactId],
            isStricken: true,
            partyIrsPractitioner: false,
          },
          {
            ...mockPretrialMemorandumDocketEntry,
            filers: [],
            partyIrsPractitioner: true,
          },
        ],
      };

      const result = setPretrialMemorandumFiler({
        applicationContext,
        caseItem: mockCase,
      });

      expect(result).toEqual(PARTIES_CODES.RESPONDENT);
    });

    it('should set the pretrialMemorandumStatus to an empty string when there is no pretrial memorandum on the case', () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

      const result = setPretrialMemorandumFiler({
        applicationContext,
        caseItem: MOCK_CASE,
      });

      expect(result).toEqual('');
    });

    it('should set the pretrialMemorandumStatus to an empty string when there is a pretrial memorandum on the case but it is stricken', () => {
      mockCase = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...mockPretrialMemorandumDocketEntry,
            isStricken: true,
          },
        ],
      };

      const result = setPretrialMemorandumFiler({
        applicationContext,
        caseItem: MOCK_CASE,
      });

      expect(result).toEqual('');
    });
  });
});

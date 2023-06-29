import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { formatConsolidatedCaseCoversheetData } from './formatConsolidatedCaseCoversheetData';

describe('formatConsolidatedCaseCoversheetData', () => {
  const mockDocketEntry = MOCK_CASE.docketEntries[0];

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValue([
        {
          docketEntries: [],
          docketNumber: '102-19',
        },
        {
          docketEntries: [
            {
              docketEntryId: mockDocketEntry.docketEntryId,
              index: 3,
            },
          ],
          docketNumber: '101-30',
        },

        {
          docketEntries: [
            {
              docketEntryId: mockDocketEntry.docketEntryId,
              index: 4,
            },
          ],
          docketNumber: '101-19',
        },
      ]);
  });

  it('should add docket numbers of all cases in the consolidated group to the coversheet data', async () => {
    const result = await formatConsolidatedCaseCoversheetData({
      applicationContext,
      caseEntity: MOCK_CASE,
      coverSheetData: {},
      docketEntryEntity: mockDocketEntry,
    });

    expect(result.consolidatedCases.length).toEqual(2);
  });

  it('should not add any consolidated group information to the coversheet when the document has only been filed on the lead case', async () => {
    const docketEntryIdOnLeadCaseNotMultiDocketed =
      'b0efe7fd-a8d6-4eb8-bf66-857bcb700483';

    const result = await formatConsolidatedCaseCoversheetData({
      applicationContext,
      caseEntity: MOCK_CASE,
      coverSheetData: {},
      docketEntryEntity: {
        ...mockDocketEntry,
        docketEntryId: docketEntryIdOnLeadCaseNotMultiDocketed,
      },
    });

    expect(result.consolidatedCases).toBeUndefined();
  });

  it('should sort the docket numbers of all cases in the consolidated group by docketNumber, ascending', async () => {
    const result = await formatConsolidatedCaseCoversheetData({
      applicationContext,
      caseEntity: MOCK_CASE,
      coverSheetData: {},
      docketEntryEntity: mockDocketEntry,
    });

    expect(result.consolidatedCases[0]).toMatchObject({
      docketNumber: '101-19',
    });
    expect(result.consolidatedCases[1]).toMatchObject({
      docketNumber: '101-30',
    });
  });

  it('should include the index of the docket entry for each case in the consolidated group that the document was filed on', async () => {
    const result = await formatConsolidatedCaseCoversheetData({
      applicationContext,
      caseEntity: MOCK_CASE,
      coverSheetData: {},
      docketEntryEntity: mockDocketEntry,
    });

    expect(result.consolidatedCases[0]).toMatchObject({
      documentNumber: 4,
    });
    expect(result.consolidatedCases[1]).toMatchObject({
      documentNumber: 3,
    });
  });
});

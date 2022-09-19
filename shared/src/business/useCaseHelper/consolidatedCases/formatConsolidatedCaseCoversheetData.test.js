const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  formatConsolidatedCaseCoversheetData,
} = require('./formatConsolidatedCaseCoversheetData');
import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';

describe('formatConsolidatedCaseCoversheetData', () => {
  const testingCaseData = {
    ...MOCK_CASE,
    docketEntries: [
      {
        ...MOCK_CASE.docketEntries[0],
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentType: 'Answer',
        eventCode: 'A',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.pending,
      },
    ],
  };

  applicationContext
    .getUseCases()
    .getFeatureFlagValueInteractor.mockResolvedValue({
      isFeatureFlagEnabled: true,
    });

  it('should add consolidatedCases to the coversheet data when the document is being filed on a lead case and the feature flag is enabled', async () => {
    const mockDocumentType = 'Hearing Exhibits';

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
              docketEntryId: testingCaseData.docketEntries[0].docketEntryId,
              index: 3,
            },
          ],
          docketNumber: '101-30',
        },

        {
          docketEntries: [
            {
              docketEntryId: testingCaseData.docketEntries[0].docketEntryId,
              index: 4,
            },
          ],
          docketNumber: '101-19',
        },
      ]);

    const result = await formatConsolidatedCaseCoversheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        leadDocketNumber: testingCaseData.docketNumber,
      },
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        documentTitle: undefined,
        documentType: mockDocumentType,
        eventCode: 'HE',
      },
      filingDateUpdated: false,
    });

    // should be in ascending order
    expect(result.consolidatedCases.length).toEqual(2);
    expect(result.consolidatedCases[0]).toMatchObject({
      docketNumber: '101-19',
      documentNumber: 4,
    });
    expect(result.consolidatedCases[1]).toMatchObject({
      docketNumber: '101-30',
      documentNumber: 3,
    });
  });
});

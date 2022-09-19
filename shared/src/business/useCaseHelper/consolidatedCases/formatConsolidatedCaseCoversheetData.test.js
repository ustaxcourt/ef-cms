const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  formatConsolidatedCaseCoversheetData,
} = require('./formatConsolidatedCaseCoversheetData');

describe('formatConsolidatedCaseCoversheetData', () => {
  it('should add consolidatedCases to the coversheet data when the document is being filed on a lead case and the', async () => {
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

    const result = await generateCoverSheetData({
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
    } as any);

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

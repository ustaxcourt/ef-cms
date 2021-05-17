const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const { PARTY_TYPES } = require('../../entities/EntityConstants');
const { removeCoversheet } = require('./removeCoversheet');

describe('removeCoversheet', () => {
  const testingCaseData = {
    contactPrimary: {
      name: 'Daenerys Stormborn',
    },
    createdAt: '2019-04-19T14:45:15.595Z',
    docketEntries: [
      {
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        docketEntryId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
        numberOfPages: 2,
        processingStatus: 'pending',
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      },
    ],
    docketNumber: '101-19',
    partyType: PARTY_TYPES.petitioner,
  };
  beforeAll(() => {
    jest.setTimeout(15000);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: testPdfDoc,
      }),
    });
  });

  it('removes a cover sheet from a pdf document', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(testingCaseData);
    const params = {
      docketEntryId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: '101-19',
    };

    const updatedDocketEntry = await removeCoversheet(
      applicationContext,
      params,
    );
    expect(updatedDocketEntry.numberOfPages).toBe(1);

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).toHaveBeenCalled();
  });

  it('throws an exception if the requested document cannot be found in S3', async () => {
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => {
        throw new Error('oh no');
      },
    });

    const params = {
      docketEntryId: '55551f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: '101-19',
    };

    await expect(removeCoversheet(applicationContext, params)).rejects.toThrow(
      'oh no docket entry id is 55551f4d-1e47-423a-8caf-6d2fdc3d3859',
    );
  });
});

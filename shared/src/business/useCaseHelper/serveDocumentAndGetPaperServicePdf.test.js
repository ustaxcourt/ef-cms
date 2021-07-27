const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const {
  serveDocumentAndGetPaperServicePdf,
} = require('./serveDocumentAndGetPaperServicePdf');
const { Case, getContactPrimary } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { SERVICE_INDICATOR_TYPES } = require('../entities/EntityConstants');

describe('serveDocumentAndGetPaperServicePdf', () => {
  let caseEntity;

  const mockPdfUrl = 'www.example.com';
  const mockDocketEntryId = 'cf105788-5d34-4451-aa8d-dfd9a851b675';

  beforeEach(() => {
    caseEntity = new Case(MOCK_CASE, { applicationContext });

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: testPdfDoc,
      }),
    });

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: mockPdfUrl });
  });

  it('should call sendServedPartiesEmails with the case entity, docket entry id, and aggregated served parties from the case', async () => {
    await serveDocumentAndGetPaperServicePdf({
      applicationContext,
      caseEntity,
      docketEntryId: mockDocketEntryId,
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails.mock
        .calls[0][0],
    ).toMatchObject({
      caseEntity,
      docketEntryId: mockDocketEntryId,
      servedParties: expect.anything(),
    });
  });

  it('should not call getObject or appendPaperServiceAddressPageToPdf if there are no paper service parties on the case', async () => {
    caseEntity.petitioners.forEach(
      p => (p.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC),
    );

    const result = await serveDocumentAndGetPaperServicePdf({
      applicationContext,
      caseEntity,
      docketEntryId: mockDocketEntryId,
    });

    expect(applicationContext.getStorageClient().getObject).not.toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).not.toBeCalled();
    expect(result).toEqual(undefined);
  });

  it('should call getObject and appendPaperServiceAddressPageToPdf and return the pdf url if there are paper service parties on the case', async () => {
    caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { applicationContext },
    );

    const result = await serveDocumentAndGetPaperServicePdf({
      applicationContext,
      caseEntity,
      docketEntryId: mockDocketEntryId,
    });

    expect(applicationContext.getStorageClient().getObject).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).toBeCalled();
    expect(result).toEqual({ pdfUrl: mockPdfUrl });
  });

  it('should not send the service email if an error occurs while appending paper service address page to the PDF', async () => {
    caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { applicationContext },
    );

    applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf.mockRejectedValueOnce(
        new Error('bad!'),
      );

    await expect(
      serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntity,
        docketEntryId: mockDocketEntryId,
      }),
    ).rejects.toThrow(new Error('bad!'));

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toBeCalled();
  });
});

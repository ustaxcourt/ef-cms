import { testPdfDoc } from '../test/getFakeFile';

import { Case, getContactPrimary } from '../entities/cases/Case';
import {
  MOCK_CASE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '../../test/mockCase';
import { SERVICE_INDICATOR_TYPES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { serveDocumentAndGetPaperServicePdf } from './serveDocumentAndGetPaperServicePdf';

describe('serveDocumentAndGetPaperServicePdf', () => {
  let caseEntity;

  const mockPdfUrl = 'www.example.com';
  const mockDocketEntryId = 'cf105788-5d34-4451-aa8d-dfd9a851b675';

  beforeEach(() => {
    caseEntity = new Case(MOCK_CASE, { applicationContext });

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
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
      caseEntities: [caseEntity],
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

    await serveDocumentAndGetPaperServicePdf({
      applicationContext,
      caseEntities: [caseEntity],
      docketEntryId: mockDocketEntryId,
    });

    expect(
      applicationContext.getStorageClient().getObject,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).not.toHaveBeenCalled();
  });

  it('should call getObject and appendPaperServiceAddressPageToPdf and return the pdf url if there are paper service parties on the case', async () => {
    applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf.mockImplementationOnce(
        ({ newPdfDoc }) => {
          newPdfDoc.addPage();
        },
      );

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
      caseEntities: [caseEntity],
      docketEntryId: mockDocketEntryId,
    });

    expect(applicationContext.getStorageClient().getObject).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).toHaveBeenCalled();
    expect(result).toEqual({ pdfUrl: mockPdfUrl });
  });

  it('should serve parties for all consolidated cases', async () => {
    applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf.mockImplementationOnce(
        ({ newPdfDoc }) => {
          newPdfDoc.addPage();
        },
      );

    caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
          {
            ...getContactPrimary(MOCK_CASE),
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          },
        ],
        privatePractitioners: [
          { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER },
        ],
      },
      { applicationContext },
    );

    const secondCaseEntity = new Case(MOCK_LEAD_CASE_WITH_PAPER_SERVICE, {
      applicationContext,
    });

    const result = await serveDocumentAndGetPaperServicePdf({
      applicationContext,
      caseEntities: [caseEntity, secondCaseEntity],
      docketEntryId: caseEntity.docketEntries[0].docketEntryId,
    });

    expect(applicationContext.getStorageClient().getObject).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails.mock
        .calls[0][0],
    ).toMatchObject({
      caseEntity: expect.objectContaining({
        docketNumber: caseEntity.docketNumber,
      }),
    });
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails.mock
        .calls[1][0],
    ).toMatchObject({
      caseEntity: expect.objectContaining({
        docketNumber: secondCaseEntity.docketNumber,
      }),
    });
    expect(result).toEqual({ pdfUrl: mockPdfUrl });
  });

  it('should not call getObject or appendPaperServiceAddressPageToPdf if there are no paper service parties on any consolidated case', async () => {
    caseEntity.petitioners.forEach(
      p => (p.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC),
    );

    const secondCaseEntity = new Case(
      {
        ...MOCK_CASE,
        privatePractitioners: [
          { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC },
        ],
      },
      {
        applicationContext,
      },
    );

    await serveDocumentAndGetPaperServicePdf({
      applicationContext,
      caseEntities: [caseEntity, secondCaseEntity],
      docketEntryId: mockDocketEntryId,
    });
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getStorageClient().getObject,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).not.toHaveBeenCalled();
  });
});

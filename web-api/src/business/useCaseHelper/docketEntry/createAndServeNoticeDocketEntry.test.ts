import { Case } from '@shared/business/entities/cases/Case';
import {
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getFakeFile } from '@shared/business/test/getFakeFile';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { MOCK_CASE } from '@shared/test/mockCase';
import { createAndServeNoticeDocketEntry } from '@web-api/business/useCaseHelper/docketEntry/createAndServeNoticeDocketEntry';
import { PDFDocument } from 'pdf-lib';

describe('createAndServeDocketEntry', () => {
  const TEST_PDF_DOCUMENT = getFakeFile as unknown as PDFDocument;
  const mockDocketEntryId = '85a5b1c81eed44b6932a967af060597a';
  const mockNotice = Buffer.from('The rain falls mainly on the plane');

  const mockCaseEntity = new Case(
    {
      ...MOCK_CASE,
    },
    { authorizedUser: mockDocketClerkUser },
  );

  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf.mockReturnValue({});

    applicationContext.getUniqueId.mockReturnValue(mockDocketEntryId);

    applicationContext.getPdfLib = jest.fn().mockResolvedValue({
      PDFDocument: {
        load: jest.fn().mockResolvedValue({}),
      },
    });
  });

  it('should save the generated notice to s3', async () => {
    await createAndServeNoticeDocketEntry(
      applicationContext,
      {
        caseEntity: mockCaseEntity,
        documentInfo:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
        newPdfDoc: TEST_PDF_DOCUMENT,
        noticePdf: mockNotice,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      document: mockNotice,
      key: mockDocketEntryId,
    });
  });

  it('should create and serve a docket entry and add it to the docket record', async () => {
    await createAndServeNoticeDocketEntry(
      applicationContext,
      {
        caseEntity: mockCaseEntity,
        documentInfo:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
        newPdfDoc: TEST_PDF_DOCUMENT,
        noticePdf: mockNotice,
      },
      mockDocketClerkUser,
    );

    const expectedNotice = mockCaseEntity.docketEntries.find(
      doc =>
        doc.documentTitle ===
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge
          .documentTitle,
    );
    expect(expectedNotice).toMatchObject({
      isOnDocketRecord: true,
      servedAt: expect.anything(),
      servedParties: [
        {
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
        },
      ],
    });
  });

  it('should make a call to serveGeneratedNoticesOnCase when onlyProSePetitioners is "false"', async () => {
    const mockCaseWithPaperService = new Case(
      {
        ...mockCaseEntity,
        petitioners: [
          {
            ...mockCaseEntity.petitioners[0],
            email: undefined,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { authorizedUser: mockDocketClerkUser },
    );

    await createAndServeNoticeDocketEntry(
      applicationContext,
      {
        caseEntity: mockCaseWithPaperService,
        documentInfo:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
        newPdfDoc: TEST_PDF_DOCUMENT,
        noticePdf: mockNotice,
        onlyProSePetitioners: false,
      },
      mockDocketClerkUser,
    );

    const serveGeneratedNoticesOnCaseCalls =
      applicationContext.getUseCaseHelpers().serveGeneratedNoticesOnCase.mock
        .calls;
    expect(serveGeneratedNoticesOnCaseCalls.length).toEqual(1);
    expect(
      serveGeneratedNoticesOnCaseCalls[0][0].noticeDocketEntryEntity,
    ).toMatchObject({
      servedPartiesCode: 'B',
    });
  });

  it('should make a call to serveGeneratedNoticesOnCase when onlyProSePetitioners is "true"', async () => {
    const mockCaseWithPaperService = new Case(
      {
        ...mockCaseEntity,
        petitioners: [
          {
            ...mockCaseEntity.petitioners[0],
            email: undefined,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { authorizedUser: mockDocketClerkUser },
    );

    await createAndServeNoticeDocketEntry(
      applicationContext,
      {
        caseEntity: mockCaseWithPaperService,
        documentInfo:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
        newPdfDoc: TEST_PDF_DOCUMENT,
        noticePdf: mockNotice,
        onlyProSePetitioners: true,
      },
      mockDocketClerkUser,
    );

    const serveGeneratedNoticesOnCaseCalls =
      applicationContext.getUseCaseHelpers().serveGeneratedNoticesOnCase.mock
        .calls;
    expect(serveGeneratedNoticesOnCaseCalls.length).toEqual(1);
    expect(
      serveGeneratedNoticesOnCaseCalls[0][0].noticeDocketEntryEntity,
    ).toMatchObject({
      servedPartiesCode: 'P',
    });
  });
});

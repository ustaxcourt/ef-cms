const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  createAndServeNoticeDocketEntry,
} = require('./createAndServeNoticeDocketEntry');
const {
  SERVICE_INDICATOR_TYPES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../entities/EntityConstants');
const { Case } = require('../../entities/cases/Case');
const { getFakeFile } = require('../../test/getFakeFile');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('createAndServeDocketEntry', () => {
  const mockDocketEntryId = '85a5b1c81eed44b6932a967af060597a';
  const mockUserId = '85a5b1c81eed44b6932a967af060597a';
  const mockNotice = 'The rain falls mainly on the plane';

  const mockCaseEntity = new Case(
    {
      ...MOCK_CASE,
    },
    { applicationContext },
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
    await createAndServeNoticeDocketEntry(applicationContext, {
      caseEntity: mockCaseEntity,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc: getFakeFile,
      noticePdf: mockNotice,
      userId: mockUserId,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      document: mockNotice,
      key: mockDocketEntryId,
    });
  });

  it('should create and serve a docket entry and add it to the docket record', async () => {
    await createAndServeNoticeDocketEntry(applicationContext, {
      caseEntity: mockCaseEntity,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc: getFakeFile,
      noticePdf: mockNotice,
      userId: mockUserId,
    });

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

  it('should make a call to serveGeneratedNoticesOnCase', async () => {
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
      { applicationContext },
    );

    await createAndServeNoticeDocketEntry(applicationContext, {
      caseEntity: mockCaseWithPaperService,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc: getFakeFile,
      noticePdf: getFakeFile,
      userId: mockUserId,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveGeneratedNoticesOnCase,
    ).toHaveBeenCalled();
  });
});

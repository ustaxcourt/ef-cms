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
  const trialSessionId = '76a5b1c81eed44b6932a967af060597a';

  const mockOpenCase = new Case(
    {
      ...MOCK_CASE,
      trialDate: '20190301T21:42:29.073Z',
      trialSessionId,
    },
    { applicationContext },
  );

  const mockNotice = 'The rain falls mainly on the plane';

  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf.mockReturnValue({});

    applicationContext.getUniqueId.mockReturnValue(mockDocketEntryId);

    applicationContext
      .getUseCases()
      .generateNoticeOfChangeOfTrialJudgeInteractor.mockReturnValue(mockNotice);

    applicationContext.getPdfLib = jest.fn().mockResolvedValue({
      PDFDocument: {
        load: jest.fn().mockResolvedValue({
          isEncrypted: true,
        }),
      },
    });
  });

  it('should save the generated notice to s3', async () => {
    await createAndServeNoticeDocketEntry(applicationContext, {
      caseEntity: mockOpenCase,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc: getFakeFile,
      notice: mockNotice,
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

  it('should create and serve new docket entry and add it to the docket record', async () => {
    await createAndServeNoticeDocketEntry(applicationContext, {
      caseEntity: mockOpenCase,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc: getFakeFile,
      notice: mockNotice,
      userId: mockUserId,
    });

    const expectedNotice = mockOpenCase.docketEntries.find(
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

  it('should send service emails to the appropriate parties when the case has no paper service', async () => {
    const mockCaseWithPaperService = new Case(
      {
        ...mockOpenCase,
        petitioners: [
          {
            ...mockOpenCase.petitioners[0],
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
      notice: getFakeFile,
      userId: mockUserId,
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).toHaveBeenCalled();
  });
});

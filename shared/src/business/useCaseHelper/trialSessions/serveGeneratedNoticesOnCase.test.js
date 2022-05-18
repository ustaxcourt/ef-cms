const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  serveGeneratedNoticesOnCase,
} = require('./serveGeneratedNoticesOnCase');
const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { getFakeFile, testPdfDoc } = require('../../test/getFakeFile');
const { MOCK_CASE } = require('../../../test/mockCase');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');

describe('serveGeneratedNoticesOnCase', () => {
  const trialSessionId = '76a5b1c8-1eed-44b6-932a-967af060597a';

  const mockPdfDocument = {
    load: () => jest.fn().mockReturnValue(getFakeFile),
  };
  const mockOpenCase = new Case(
    {
      ...MOCK_CASE,
      trialDate: '2019-03-01T21:42:29.073Z',
      trialSessionId,
    },
    { applicationContext },
  );

  it('should sendServedPartiesEmails and append the paper service info to the docket entry on the case when the case has parties with paper service', async () => {
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

    const mockNoticeDocketEntry = new DocketEntry(
      {
        ...MOCK_CASE.docketEntries[0],
      },
      { applicationContext },
    );

    await serveGeneratedNoticesOnCase({
      PDFDocument: mockPdfDocument,
      applicationContext,
      caseEntity: mockCaseWithPaperService,
      newPdfDoc: getFakeFile,
      noticeDocketEntryEntity: mockNoticeDocketEntry,
      noticeDocumentPdfData: testPdfDoc,
      servedParties: {
        paper: ['test'],
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
  });

  it('should not append the paper service info to the docket entry on the case when the case does not have parties with paper service', async () => {
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

    const mockNoticeDocketEntry = new DocketEntry(
      {
        ...MOCK_CASE.docketEntries[0],
      },
      { applicationContext },
    );

    const mockNoticeDocumentPdfData = applicationContext
      .getUseCaseHelpers()
      .generateNoticeOfChangeToInPersonProceeding.mockReturnValue(getFakeFile);

    await serveGeneratedNoticesOnCase({
      PDFDocument: mockPdfDocument,
      applicationContext,
      caseEntity: mockCaseWithPaperService,
      newPdfDoc: getFakeFile,
      noticeDocketEntryEntity: mockNoticeDocketEntry,
      noticeDocumentPdfData: mockNoticeDocumentPdfData,
      servedParties: {
        paper: [],
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).not.toHaveBeenCalled();
  });
});

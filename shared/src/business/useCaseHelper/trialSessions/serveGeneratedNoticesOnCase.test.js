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

describe('serveGeneratedNoticesOnCase', () => {
  const mockOpenCaseEntity = new Case(MOCK_CASE, { applicationContext });

  const mockNoticeDocketEntryEntity = new DocketEntry(
    {
      ...MOCK_CASE.docketEntries[0],
    },
    { applicationContext },
  );

  it('should sendServedPartiesEmails and append the paper service info to the docket entry on the case when the case has parties with paper service', async () => {
    const mockServedParties = {
      paper: ['test'],
    };

    await serveGeneratedNoticesOnCase({
      applicationContext,
      caseEntity: mockOpenCaseEntity,
      newPdfDoc: getFakeFile,
      noticeDocketEntryEntity: mockNoticeDocketEntryEntity,
      noticeDocumentPdfData: testPdfDoc,
      servedParties: mockServedParties,
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalledWith({
      applicationContext,
      caseEntity: mockOpenCaseEntity,
      docketEntryId: mockNoticeDocketEntryEntity.docketEntryId,
      servedParties: mockServedParties,
    });
    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).toHaveBeenCalledWith({
      applicationContext,
      caseEntity: mockOpenCaseEntity,
      newPdfDoc: expect.anything(),
      noticeDoc: expect.anything(),
      servedParties: mockServedParties,
    });
  });

  it('should not append the paper service info to the docket entry on the case when servedParties does not include any paper entries', async () => {
    await serveGeneratedNoticesOnCase({
      applicationContext,
      caseEntity: mockOpenCaseEntity,
      newPdfDoc: getFakeFile,
      noticeDocketEntryEntity: mockNoticeDocketEntryEntity,
      noticeDocumentPdfData: testPdfDoc,
      servedParties: {
        paper: [],
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).not.toHaveBeenCalled();
  });
});

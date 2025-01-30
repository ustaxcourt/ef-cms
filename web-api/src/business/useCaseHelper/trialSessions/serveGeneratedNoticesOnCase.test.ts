import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getFakeFile, testPdfDoc } from '@shared/business/test/getFakeFile';
import { MOCK_CASE } from '@shared/test/mockCase';
import { serveGeneratedNoticesOnCase } from '@web-api/business/useCaseHelper/trialSessions/serveGeneratedNoticesOnCase';
import { PDFDocument } from 'pdf-lib';

describe('serveGeneratedNoticesOnCase', () => {
  const mockOpenCaseEntity = new Case(MOCK_CASE, { authorizedUser: undefined });

  const mockNoticeDocketEntryEntity = new DocketEntry(
    {
      ...MOCK_CASE.docketEntries[0],
    },
    { authorizedUser: undefined },
  );

  it('should sendServedPartiesEmails and append the paper service info to the docket entry on the case when the case has parties with paper service', async () => {
    const mockServedParties = {
      paper: ['test'],
      all: [],
      electronic: [],
    };

    await serveGeneratedNoticesOnCase({
      applicationContext,
      caseEntity: mockOpenCaseEntity,
      newPdfDoc: getFakeFile as unknown as PDFDocument,
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
      skipEmailToIrs: false,
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
    const mockServedParties = {
      paper: [],
      all: [],
      electronic: [],
    };

    await serveGeneratedNoticesOnCase({
      applicationContext,
      caseEntity: mockOpenCaseEntity,
      newPdfDoc: getFakeFile as unknown as PDFDocument,
      noticeDocketEntryEntity: mockNoticeDocketEntryEntity,
      noticeDocumentPdfData: testPdfDoc,
      servedParties: mockServedParties,
    });

    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).not.toHaveBeenCalled();
  });
});

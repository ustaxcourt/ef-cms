import { getFakeFile, testPdfDoc } from '../../test/getFakeFile';

import { Case } from '../../entities/cases/Case';
import { DocketEntry } from '../../entities/DocketEntry';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { serveGeneratedNoticesOnCase } from './serveGeneratedNoticesOnCase';

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

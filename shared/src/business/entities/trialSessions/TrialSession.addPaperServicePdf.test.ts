import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { TrialSession } from './TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('addPaperServicePdf', () => {
    it('should add the provided document to the list of paper service pdfs that have been generated for the trial session', () => {
      const mockFileId = '10aa0a9d-29b4-4862-9e8d-4a50c0d760d2';
      const mockPaperServicePdfTitle =
        '30 Day Notice of Trial on 10/12/2023 at Seattle, WA';

      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_INPERSON,
          paperServicePdfs: [],
        },
        {
          applicationContext,
        },
      );

      trialSession.addPaperServicePdf(mockFileId, mockPaperServicePdfTitle);

      expect(trialSession.paperServicePdfs).toEqual([
        { fileId: mockFileId, title: mockPaperServicePdfTitle },
      ]);
    });
  });
});

import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateTrialSessionPaperServicePdfInteractor } from './generateTrialSessionPaperServicePdfInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { testPdfDoc } from '../../../../../shared/src/business/test/getFakeFile';

describe('generateTrialSessionPaperServicePdfInteractor', () => {
  const mockPdfUrl = 'www.example.com';
  const mockFileId = '46f3244d-aaca-48c8-a7c1-de561d000c90';

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockResolvedValue(testPdfDoc);

    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockResolvedValue({
        fileId: mockFileId,
        url: mockPdfUrl,
      });
  });

  it('should return an unauthorized error when the user does not have the TRIAL_SESSIONS permission', async () => {
    await expect(
      generateTrialSessionPaperServicePdfInteractor(
        applicationContext,
        {
          trialNoticePdfsKeys: ['1234-56'],
          trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should combine each of the provided paper trial notices into one pdf and save the the combined document as a paper service PDF on the trial session', async () => {
    const mockTrialNoticePdfsKeys = ['123-123', '456-456', '789-789'];
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(MOCK_TRIAL_INPERSON);

    await generateTrialSessionPaperServicePdfInteractor(
      applicationContext,
      {
        trialNoticePdfsKeys: mockTrialNoticePdfsKeys,
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalledTimes(mockTrialNoticePdfsKeys.length);
    expect(
      applicationContext.getUtilities().copyPagesAndAppendToTargetPdf,
    ).toHaveBeenCalledTimes(mockTrialNoticePdfsKeys.length);
    const bytes =
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl.mock
        .calls[0][0].file;
    const { PDFDocument } = await applicationContext.getPdfLib();
    const pdfDoc = await PDFDocument.load(bytes);
    expect(pdfDoc.getPageCount()).toBe(mockTrialNoticePdfsKeys.length);
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      trialSessionToUpdate: expect.objectContaining({
        paperServicePdfs: [
          { fileId: mockFileId, title: 'Initial Calendaring' },
        ],
      }),
    });
  });

  it('should send a notification to the user when combining the paper service documents is complete', async () => {
    await generateTrialSessionPaperServicePdfInteractor(
      applicationContext,
      {
        trialNoticePdfsKeys: ['123-56'],
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[2][0],
    ).toMatchObject({
      message: {
        action: 'set_trial_calendar_paper_service_complete',
        fileId: mockFileId,
        hasPaper: true,
        pdfUrl: mockPdfUrl,
      },
    });
  });
});

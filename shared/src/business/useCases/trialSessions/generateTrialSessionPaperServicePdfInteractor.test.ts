import { PARTY_TYPES, ROLES } from '../../entities/EntityConstants';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateTrialSessionPaperServicePdfInteractor } from './generateTrialSessionPaperServicePdfInteractor';
import { testPdfDoc } from '../../test/getFakeFile';

describe('generateTrialSessionPaperServicePdfInteractor', () => {
  const mockPdfUrl = 'www.example.com';
  const mockDocketEntryId = '99999';
  const unAuthorizedUser = new User({
    name: PARTY_TYPES.petitioner,
    role: ROLES.petitioner,
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  });

  const user = new User({
    name: PARTY_TYPES.petitioner,
    role: ROLES.petitionsClerk,
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  });

  let trialNoticePdfsKeys;

  beforeEach(() => {
    trialNoticePdfsKeys = ['1234-5678'];

    applicationContext.getCurrentUser.mockReturnValue(user);

    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockResolvedValue({
        fileId: mockDocketEntryId,
        url: mockPdfUrl,
      });

    applicationContext
      .getPersistenceGateway()
      .getDocument.mockResolvedValue(testPdfDoc);
  });

  it('should return an unauthorized error if the user does not have the TRIAL_SESSIONS permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue(unAuthorizedUser);

    await expect(
      generateTrialSessionPaperServicePdfInteractor(applicationContext, {
        trialNoticePdfsKeys,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should save the combined copies of the calendared cases for the trial sessions', async () => {
    trialNoticePdfsKeys = ['123-123', '456-456', '789-789'];

    await generateTrialSessionPaperServicePdfInteractor(applicationContext, {
      trialNoticePdfsKeys,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalledTimes(trialNoticePdfsKeys.length);
    expect(
      applicationContext.getUtilities().copyPagesAndAppendToTargetPdf,
    ).toHaveBeenCalledTimes(trialNoticePdfsKeys.length);

    const bytes =
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl.mock
        .calls[0][0].file;
    const { PDFDocument } = await applicationContext.getPdfLib();
    const pdfDoc = await PDFDocument.load(bytes);
    expect(pdfDoc.getPageCount()).toBe(trialNoticePdfsKeys.length);
  });

  it('should return paper service pdf related information', async () => {
    await generateTrialSessionPaperServicePdfInteractor(applicationContext, {
      trialNoticePdfsKeys,
    });
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[2][0],
    ).toMatchObject({
      message: {
        action: 'paper_service_complete',
        docketEntryId: '99999',
        hasPaper: true,
        pdfUrl: 'www.example.com',
      },
    });
  });
});

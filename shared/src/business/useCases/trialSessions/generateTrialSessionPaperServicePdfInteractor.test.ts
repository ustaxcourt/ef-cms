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

  let trialNoticePdfsKeysArray;

  beforeEach(() => {
    trialNoticePdfsKeysArray = ['1234-5678'];

    applicationContext.getCurrentUser.mockReturnValue(user);

    applicationContext
      .getUseCaseHelpers()
      .savePaperServicePdf.mockResolvedValue({
        docketEntryId: mockDocketEntryId,
        hasPaper: true,
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
        trialNoticePdfsKeysArray,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should save the combined copies of the calendared cases for the trial sessions', async () => {
    trialNoticePdfsKeysArray = ['123-123', '456-456', '789-789'];

    await generateTrialSessionPaperServicePdfInteractor(applicationContext, {
      trialNoticePdfsKeysArray,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalledTimes(trialNoticePdfsKeysArray.length);
    expect(
      applicationContext.getUtilities().copyPagesAndAppendToTargetPdf,
    ).toHaveBeenCalledTimes(trialNoticePdfsKeysArray.length);

    const pdfDoc =
      applicationContext.getUseCaseHelpers().savePaperServicePdf.mock
        .calls[0][0].document;
    expect(pdfDoc.getPages().length).toBe(trialNoticePdfsKeysArray.length);
  });

  it('should return paper service pdf related information', async () => {
    const result = await generateTrialSessionPaperServicePdfInteractor(
      applicationContext,
      {
        trialNoticePdfsKeysArray,
      },
    );

    expect(result).toEqual({
      docketEntryId: mockDocketEntryId,
      hasPaper: true,
      pdfUrl: mockPdfUrl,
    });
  });

  it('should return null when pdfUrl is undefined', async () => {
    applicationContext
      .getUseCaseHelpers()
      .savePaperServicePdf.mockResolvedValue({
        docketEntryId: mockDocketEntryId,
        hasPaper: true,
        url: undefined,
      });

    const result = await generateTrialSessionPaperServicePdfInteractor(
      applicationContext,
      {
        trialNoticePdfsKeysArray,
      },
    );

    expect(result.pdfUrl).toBeNull();
  });
});

import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generatePrintableTrialSessionCopyReportInteractor } from './generatePrintableTrialSessionCopyReportInteractor';

describe('generatePrintableTrialSessionCopyReportInteractor', () => {
  let mockUser;
  let mockTrialSession;

  const interactorProps = {
    filters: {
      aBasisReached: true,
      continued: true,
      dismissed: true,
      recall: true,
      rule122: true,
      setForTrial: true,
      settled: true,
      showAll: true,
      statusUnassigned: true,
      takenUnderAdvisement: true,
    },
    formattedCases: [MOCK_CASE],
    formattedTrialSession: mockTrialSession,
    sessionNotes: 'session notes',
    showCaseNotes: true,
    sort: 'docket',
    userHeading: 'Yggdrasil - Session Copy',
  };

  beforeAll(() => {
    applicationContext.getStorageClient.mockReturnValue({
      upload: jest.fn((params, callback) => callback()),
    });

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: 'https://example.com' });
  });

  beforeEach(() => {
    mockUser = {
      role: ROLES.trialClerk,
      userId: 'trialclerk',
    };

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);

    mockTrialSession = MOCK_TRIAL_REGULAR;
  });

  afterEach(() => {
    applicationContext
      .getDocumentGenerators()
      .printableWorkingCopySessionList.mockReset();
  });

  it('should throw an unauthorized error when the user does not have access', async () => {
    mockUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      generatePrintableTrialSessionCopyReportInteractor(
        applicationContext,
        interactorProps,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('calls the document generator function to generate a Trial Session Working Copy PDF', async () => {
    await generatePrintableTrialSessionCopyReportInteractor(
      applicationContext,
      interactorProps,
    );

    expect(
      applicationContext.getDocumentGenerators()
        .printableWorkingCopySessionList,
    ).toHaveBeenCalledWith({
      applicationContext,
      data: interactorProps,
    });
  });

  it('uploads the Trial Session Working Copy PDF to s3', async () => {
    await generatePrintableTrialSessionCopyReportInteractor(
      applicationContext,
      interactorProps,
    );

    expect(applicationContext.getStorageClient).toHaveBeenCalled();
    expect(applicationContext.getStorageClient().upload).toHaveBeenCalled();
  });

  it('should return the Trial Session Working Copy PDF url', async () => {
    const results = await generatePrintableTrialSessionCopyReportInteractor(
      applicationContext,
      interactorProps,
    );

    expect(
      applicationContext.getPersistenceGateway().getDownloadPolicyUrl,
    ).toHaveBeenCalled();
    expect(results).toEqual('https://example.com');
  });

  it('fails and logs if the s3 upload fails', async () => {
    applicationContext.getStorageClient.mockReturnValue({
      upload: (params, callback) => callback('error'),
    });

    await expect(
      generatePrintableTrialSessionCopyReportInteractor(
        applicationContext,
        interactorProps,
      ),
    ).rejects.toEqual('error');
    expect(applicationContext.logger.error).toHaveBeenCalled();
    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'error uploading to s3',
    );
  });
});

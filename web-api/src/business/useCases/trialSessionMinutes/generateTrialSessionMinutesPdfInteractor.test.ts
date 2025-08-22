import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
jest.mock('@shared/sharedAppContext');
jest.mock('@web-api/persistence/s3/getDownloadPolicyUrl');
jest.mock(
  '@web-api/business/useCaseHelper/trialSessionMinutes/createAndUploadMinuteSheet',
);
import { UnauthorizedError } from '@web-api/errors/errors';
import { generateTrialSessionMinutesPdfInteractor } from './generateTrialSessionMinutesPdfInteractor';
import {
  mockTrialClerkUser,
  mockDocketClerkUser,
} from '@shared/test/mockAuthUsers';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getDownloadPolicyUrl } from '@web-api/persistence/s3/getDownloadPolicyUrl';
import { getUniqueId } from '@shared/sharedAppContext';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getTrialSessionById as getTrialSessionsMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { createAndUploadMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/createAndUploadMinuteSheet';

describe('generateTrialSessionMinutesPdfInteractor', () => {
  const mockGetCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const getTrialSessionById = jest.mocked(getTrialSessionsMock);
  const mockGetUniqueId = getUniqueId as jest.Mock;
  const mockGetDownloadPolicyUrl = getDownloadPolicyUrl as jest.Mock;
  const mockCreateAndUploadMinuteSheet =
    createAndUploadMinuteSheet as jest.Mock;
  const mockParams = {
    docketNumber: '123-45',
    trialSessionId: 'trial-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    getTrialSessionById.mockResolvedValue(MOCK_TRIAL_REGULAR);
    mockGetUniqueId.mockReturnValue('unique-id-123');
    mockGetDownloadPolicyUrl.mockResolvedValue({
      url: 'https://example.com/pdf',
    });
  });

  it('throws an unauthorized error when user lacks permission', async () => {
    await expect(
      generateTrialSessionMinutesPdfInteractor(
        applicationContext,
        mockParams,
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('throws an error when case or trial session cannot be retrieved', async () => {
    mockGetCaseByDocketNumber.mockRejectedValue(
      new Error('Could not get case'),
    );

    await expect(
      generateTrialSessionMinutesPdfInteractor(
        applicationContext,
        mockParams,
        mockTrialClerkUser,
      ),
    ).rejects.toThrow('Could not get case');
  });

  it('successfully generates and processes minute sheet PDF', async () => {
    const result = await generateTrialSessionMinutesPdfInteractor(
      applicationContext,
      mockParams,
      mockTrialClerkUser,
    );

    expect(result).toBe('https://example.com/pdf');
    expect(mockGetCaseByDocketNumber).toHaveBeenCalledWith({
      docketNumber: mockParams.docketNumber,
    });
    expect(getTrialSessionById).toHaveBeenCalledWith({
      trialSessionId: mockParams.trialSessionId,
    });
    expect(mockCreateAndUploadMinuteSheet).toHaveBeenCalled();
  });
});

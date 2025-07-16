import '@web-api/persistence/postgres/cases/mocks.jest';
jest.mock('@web-api/persistence/dynamo/trialSessions/getTrialSessionById');
jest.mock('@web-api/persistence/postgres/minuteSheets/getMinuteSheet');
jest.mock(
  '@web-api/business/useCaseHelper/trialSessionMinutes/formatMinuteSheet',
);
jest.mock('@shared/business/utilities/documentGenerators/minuteSheet');
jest.mock('@shared/sharedAppContext');
jest.mock('@web-api/persistence/s3/uploadDocument');
jest.mock('@web-api/persistence/s3/getDownloadPolicyUrl');
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { UnauthorizedError, NotFoundError } from '@web-api/errors/errors';
import { generateTrialSessionMinutesPdfInteractor } from './generateTrialSessionMinutesPdfInteractor';
import {
  mockTrialClerkUser,
  mockDocketClerkUser,
} from '@shared/test/mockAuthUsers';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { uploadDocument } from '@web-api/persistence/s3/uploadDocument';
import { getTrialSessionById } from '@web-api/persistence/dynamo/trialSessions/getTrialSessionById';
import { minuteSheet as minuteSheetDocumentGenerator } from '@shared/business/utilities/documentGenerators/minuteSheet';
import { getDownloadPolicyUrl } from '@web-api/persistence/s3/getDownloadPolicyUrl';
import { getMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/getMinuteSheet';
import { formatMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/formatMinuteSheet';
import { getUniqueId } from '@shared/sharedAppContext';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { mockMinuteSheet } from '@shared/test/mockMinuteSheet';
import { mockFormattedMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/mockFormattedMinuteSheet';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

describe('generateTrialSessionMinutesPdfInteractor', () => {
  const mockGetCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const mockGetTrialSessionById = getTrialSessionById as jest.Mock;
  const mockGetMinuteSheet = getMinuteSheet as jest.Mock;
  const mockFormatMinuteSheet = formatMinuteSheet as jest.Mock;
  const mockMinuteSheetDocumentGenerator =
    minuteSheetDocumentGenerator as jest.Mock;
  const mockGetUniqueId = getUniqueId as jest.Mock;
  const mockUploadDocument = uploadDocument as jest.Mock;
  const mockGetDownloadPolicyUrl = getDownloadPolicyUrl as jest.Mock;
  const mockUpdateCaseAndAssociations = updateCaseAndAssociations as jest.Mock;
  const mockParams = {
    docketNumber: '123-45',
    trialSessionId: 'trial-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    mockGetTrialSessionById.mockResolvedValue(MOCK_TRIAL_REGULAR);
    mockGetMinuteSheet.mockResolvedValue({
      ...mockParams,
      content: mockMinuteSheet,
    });
    mockFormatMinuteSheet.mockReturnValue(mockFormattedMinuteSheet);
    mockMinuteSheetDocumentGenerator.mockResolvedValue(Buffer.from('pdf'));
    mockGetUniqueId.mockReturnValue('unique-id-123');
    mockUploadDocument.mockResolvedValue(undefined);
    mockGetDownloadPolicyUrl.mockResolvedValue({
      url: 'https://example.com/pdf',
    });
    mockUpdateCaseAndAssociations.mockResolvedValue(undefined);
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

  it('throws a NotFoundError when minute sheet is not found', async () => {
    mockGetMinuteSheet.mockResolvedValue(null);

    await expect(
      generateTrialSessionMinutesPdfInteractor(
        applicationContext,
        mockParams,
        mockTrialClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
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
    expect(mockGetTrialSessionById).toHaveBeenCalledWith({
      applicationContext,
      trialSessionId: mockParams.trialSessionId,
    });
    expect(mockGetMinuteSheet).toHaveBeenCalledWith({
      docketNumber: mockParams.docketNumber,
      trialSessionId: mockParams.trialSessionId,
    });
    expect(mockFormatMinuteSheet).toHaveBeenCalledWith({
      aCase: MOCK_CASE,
      minuteSheet: mockMinuteSheet,
      trialSession: MOCK_TRIAL_REGULAR,
    });
    expect(mockUploadDocument).toHaveBeenCalled();
    expect(mockUpdateCaseAndAssociations).toHaveBeenCalled();
  });
});

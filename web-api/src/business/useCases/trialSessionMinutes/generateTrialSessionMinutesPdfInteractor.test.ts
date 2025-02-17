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
import { getCaseByDocketNumber } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';
import { getTrialSessionById } from '@web-api/persistence/dynamo/trialSessions/getTrialSessionById';
import { minuteSheet as minuteSheetDocumentGenerator } from '@shared/business/utilities/documentGenerators/minuteSheet';
import { getDownloadPolicyUrl } from '@web-api/persistence/s3/getDownloadPolicyUrl';
import { getMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/getMinuteSheet';
import { formatMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/formatMinuteSheet';
import { getUniqueId } from '@shared/sharedAppContext';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { mockMinuteSheet } from '@shared/test/mockMinuteSheet';
import { mockFormattedMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/mockFormattedMinuteSheet';

jest.mock('@web-api/persistence/dynamo/cases/getCaseByDocketNumber', () => ({
  getCaseByDocketNumber: jest.fn(),
}));
const mockGetCaseByDocketNumber = getCaseByDocketNumber as jest.Mock;

jest.mock(
  '@web-api/persistence/dynamo/trialSessions/getTrialSessionById',
  () => ({
    getTrialSessionById: jest.fn(),
  }),
);
const mockGetTrialSessionById = getTrialSessionById as jest.Mock;

jest.mock('@web-api/persistence/postgres/minuteSheets/getMinuteSheet', () => ({
  getMinuteSheet: jest.fn(),
}));
const mockGetMinuteSheet = getMinuteSheet as jest.Mock;

jest.mock(
  '@web-api/business/useCaseHelper/trialSessionMinutes/formatMinuteSheet',
  () => ({
    formatMinuteSheet: jest.fn(),
  }),
);
const mockFormatMinuteSheet = formatMinuteSheet as jest.Mock;

jest.mock('@shared/business/utilities/documentGenerators/minuteSheet', () => ({
  minuteSheet: jest.fn(),
}));
const mockMinuteSheetDocumentGenerator =
  minuteSheetDocumentGenerator as jest.Mock;

jest.mock('@shared/sharedAppContext', () => ({
  getUniqueId: jest.fn(),
}));
const mockGetUniqueId = getUniqueId as jest.Mock;

jest.mock('@web-api/persistence/s3/uploadDocument', () => ({
  uploadDocument: jest.fn(),
}));
const mockUploadDocument = uploadDocument as jest.Mock;

jest.mock('@web-api/persistence/s3/getDownloadPolicyUrl', () => ({
  getDownloadPolicyUrl: jest.fn(),
}));
const mockGetDownloadPolicyUrl = getDownloadPolicyUrl as jest.Mock;

jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
  () => ({
    updateCaseAndAssociations: jest.fn(),
  }),
);
const mockUpdateCaseAndAssociations = updateCaseAndAssociations as jest.Mock;

const mockParams = {
  docketNumber: '123-45',
  trialSessionId: 'trial-123',
};

describe('generateTrialSessionMinutesPdfInteractor', () => {
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
    mockGetCaseByDocketNumber.mockResolvedValue(null);

    await expect(
      generateTrialSessionMinutesPdfInteractor(
        applicationContext,
        mockParams,
        mockTrialClerkUser,
      ),
    ).rejects.toThrow('Case and trial session could not be retrieved');
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
      applicationContext,
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

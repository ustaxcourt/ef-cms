import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getUniqueId } from '@shared/sharedAppContext';
import {
  mockDocketClerkUser,
  mockTrialClerkUser,
} from '@shared/test/mockAuthUsers';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { saveMinuteSheetToDraftsInteractor } from '@web-api/business/useCases/trialSessionMinutes/saveMinuteSheetToDraftsInteractor';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { createAndUploadMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/createAndUploadMinuteSheet';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { Case } from '@shared/business/entities/cases/Case';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber');
jest.mock('@shared/sharedAppContext');
jest.mock(
  '@web-api/business/useCaseHelper/trialSessionMinutes/createAndUploadMinuteSheet',
);
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);

describe('saveMinuteSheetToDraftsInteractor', () => {
  const mockGetCaseByDocketNumber = getCaseByDocketNumber as jest.Mock;
  const mockGetTrialSessionById = getTrialSessionById as jest.Mock;
  const mockGetUniqueId = getUniqueId as jest.Mock;
  const mockCreateAndUploadMinuteSheet =
    createAndUploadMinuteSheet as jest.Mock;
  const mockUpdateCaseAndAssociations = updateCaseAndAssociations as jest.Mock;

  const mockParams = {
    docketNumber: '123-45',
    trialSessionId: 'trial-123',
  };

  beforeEach(() => {
    mockGetCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    mockGetTrialSessionById.mockResolvedValue(MOCK_TRIAL_REGULAR);
    mockGetUniqueId.mockReturnValue('unique-id-abc');
    mockCreateAndUploadMinuteSheet.mockResolvedValue({ byteLength: 12345 });
    mockUpdateCaseAndAssociations.mockResolvedValue(MOCK_CASE);
  });

  it('throws an unauthorized error when user lacks permission', async () => {
    await expect(
      saveMinuteSheetToDraftsInteractor(
        applicationContext,
        mockParams,
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('throws an error when trial session is undefined', async () => {
    mockGetTrialSessionById.mockResolvedValue(undefined);
    await expect(
      saveMinuteSheetToDraftsInteractor(
        applicationContext,
        mockParams,
        mockTrialClerkUser,
      ),
    ).rejects.toThrow('Case and trial session could not be retrieved');
  });

  it('saves the minute sheet to drafts', async () => {
    await saveMinuteSheetToDraftsInteractor(
      applicationContext,
      mockParams,
      mockTrialClerkUser,
    );
    expect(mockGetCaseByDocketNumber).toHaveBeenCalledWith({
      docketNumber: mockParams.docketNumber,
    });
    expect(mockGetTrialSessionById).toHaveBeenCalledWith({
      trialSessionId: mockParams.trialSessionId,
    });
    expect(mockCreateAndUploadMinuteSheet).toHaveBeenCalledWith(
      applicationContext,
      expect.objectContaining({
        docketNumber: mockParams.docketNumber,
        trialSessionId: mockParams.trialSessionId,
        aCase: MOCK_CASE,
        trialSession: MOCK_TRIAL_REGULAR,
        documentStorageId: 'unique-id-abc',
      }),
    );
    expect(mockUpdateCaseAndAssociations).toHaveBeenCalledWith({
      authorizedUser: mockTrialClerkUser,
      caseToUpdate: expect.any(Case),
      oldCase: expect.anything(),
    });
  });
});

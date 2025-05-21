import { InvalidEntityError, UnauthorizedError } from '@web-api/errors/errors';
import { getMinuteSheetInteractor } from './getMinuteSheetInteractor';
import {
  mockDocketClerkUser,
  mockTrialClerkUser,
} from '@shared/test/mockAuthUsers';
import { getMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/getMinuteSheet';
import { validateMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/validateMinuteSheet';

jest.mock('@web-api/persistence/postgres/minuteSheets/getMinuteSheet', () => ({
  getMinuteSheet: jest.fn(),
}));
const mockGetMinuteSheet = getMinuteSheet as jest.Mock;

jest.mock(
  '@web-api/business/useCaseHelper/trialSessionMinutes/validateMinuteSheet',
  () => ({
    validateMinuteSheet: jest.fn().mockReturnValue(true),
  }),
);
const mockValidateMinuteSheet =
  validateMinuteSheet as unknown as jest.Mock<boolean>;

describe('getMinuteSheetInteractor', () => {
  const mockParams = {
    docketNumber: '123-45',
    trialSessionId: 'trial-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an unauthorized error when user lacks permission', async () => {
    await expect(
      getMinuteSheetInteractor(mockParams, mockDocketClerkUser),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('returns empty object when no minute sheet is found', async () => {
    const result = await getMinuteSheetInteractor(
      mockParams,
      mockTrialClerkUser,
    );
    expect(result).toEqual({});
  });

  it('returns minute sheet content when found and valid', async () => {
    const mockMinuteSheet = {
      content: { text: 'Some minute sheet content' },
    };

    mockGetMinuteSheet.mockResolvedValue(mockMinuteSheet);
    mockValidateMinuteSheet.mockReturnValue(true);

    const result = await getMinuteSheetInteractor(
      mockParams,
      mockTrialClerkUser,
    );
    expect(result).toEqual(mockMinuteSheet.content);
  });

  it('throws InvalidEntityError when minute sheet content is invalid', async () => {
    const mockMinuteSheet = {
      content: { text: 'Invalid content' },
    };

    mockGetMinuteSheet.mockResolvedValue(mockMinuteSheet);
    mockValidateMinuteSheet.mockReturnValue(false);

    await expect(
      getMinuteSheetInteractor(mockParams, mockTrialClerkUser),
    ).rejects.toThrow(
      new InvalidEntityError('Minute Sheet Entity is invalid.'),
    );
  });
});

import { UnauthorizedError } from '@web-api/errors/errors';
import { updateMinuteSheetInteractor } from './updateMinuteSheetInteractor';
import {
  mockDocketClerkUser,
  mockTrialClerkUser,
} from '@shared/test/mockAuthUsers';
import { mockMinuteSheet } from '@shared/test/mockMinuteSheet';
import { upsertMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/updateMinuteSheet';

jest.mock(
  '@web-api/persistence/postgres/minuteSheets/updateMinuteSheet',
  () => ({
    upsertMinuteSheet: jest.fn(),
  }),
);
const mockUpsertMinuteSheet = upsertMinuteSheet as jest.Mock;

describe('updateMinuteSheetInteractor', () => {
  const mockParams = {
    docketNumber: '123-45',
    trialSessionId: 'trial-123',
    minuteSheet: mockMinuteSheet,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an unauthorized error when user lacks permission', async () => {
    await expect(
      updateMinuteSheetInteractor(mockParams, mockDocketClerkUser),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('successfully updates minute sheet when user has permission', async () => {
    const mockUpdatedMinuteSheet = {
      content: mockParams.minuteSheet,
      docketNumber: '123-45',
      trialSessionId: 'trial-123',
    };

    mockUpsertMinuteSheet.mockResolvedValue(mockUpdatedMinuteSheet);

    const result = await updateMinuteSheetInteractor(
      mockParams,
      mockTrialClerkUser,
    );

    expect(result).toEqual(mockUpdatedMinuteSheet);
    expect(upsertMinuteSheet).toHaveBeenCalledWith({
      minuteSheetToUpsert: {
        content: mockParams.minuteSheet,
        docketNumber: mockParams.docketNumber,
        trialSessionId: mockParams.trialSessionId,
      },
    });
  });
});

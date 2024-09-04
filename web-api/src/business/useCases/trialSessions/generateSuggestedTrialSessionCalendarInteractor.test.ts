import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { checkForReadyForTrialCasesInteractor } from '../checkForReadyForTrialCasesInteractor';
import { generateSuggestedTrialSessionCalendar } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendar';

describe('checkForReadyForTrialCasesInteractor', () => {
  // beforeAll(() => {
  //   applicationContext
  //     .getPersistenceGateway()
  //     .getReadyForTrialCases.mockImplementation(() => mockCasesReadyForTrial);

  //   applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});
  // });

  // beforeEach(() => {
  //   applicationContext
  //     .getPersistenceGateway()
  //     .getLock.mockReturnValue(undefined);
  // });

  it('should generate a trial term when valid date range is provided', async () => {
    const mockStartDate = '2019-08-22T04:00:00.000Z';
    const mockEndDate = '2019-09-22T04:00:00.000Z';

    const result = await generateSuggestedTrialSessionCalendar(
      applicationContext,
      { trialTermEndDate: mockEndDate, trialTermStartDate: mockStartDate },
    );

    expect(result).toEqual([
      {
        city: 'City A',
        sessionType: SESSION_TYPES.regular,
        weekOf: '01/01/01',
      },
      {
        city: 'City B',
        sessionType: SESSION_TYPES.small,
        weekOf: '01/07/01',
      },
    ]);
  });

  // it('should throw an error when...', async () => {
  //   mockCasesReadyForTrial = [];
  //   applicationContext
  //     .getPersistenceGateway()
  //     .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

  //   await expect(
  //     checkForReadyForTrialCasesInteractor(applicationContext),
  //   ).resolves.not.toThrow();

  //   expect(
  //     applicationContext.getPersistenceGateway().getReadyForTrialCases,
  //   ).toHaveBeenCalled();
  // });
});

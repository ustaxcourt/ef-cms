import { CerebralTest } from 'cerebral/test';
import {
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoTrialSessionWorkingCopySequence } from '../sequences/gotoTrialSessionWorkingCopySequence';
import { presenter } from '../presenter-mock';

describe('gotoTrialSessionWorkingCopySequence', () => {
  const mockTrialSessionId = '2f731ada-0276-4eca-b518-cfedc4c496d9';
  const mockJudgeUserId = '42e55e43-2cc2-4266-96ed-8cc0400ff1ce';

  const mockTrialSession = {
    judge: {
      userId: mockJudgeUserId,
    },
    maxCases: 100,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    sessionType: 'Regular',
    startDate: '2025-03-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

  const mockWorkingCopy = {
    trialSessionId: mockTrialSessionId,
    userId: mockJudgeUserId,
  };

  let cerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoTrialSessionWorkingCopySequence,
    };
    cerebralTest = CerebralTest(presenter);

    applicationContext
      .getUseCases()
      .getTrialSessionWorkingCopyInteractor.mockReturnValue(mockWorkingCopy);
  });

  it('should set up state for a user associated with the trial session', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.judge,
      userId: mockJudgeUserId,
    });

    applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor.mockReturnValue(mockTrialSession);

    await cerebralTest.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: mockTrialSessionId,
    });

    expect(cerebralTest.getState()).toMatchObject({
      trialSession: mockTrialSession,
      trialSessionId: mockTrialSessionId,
      trialSessionWorkingCopy: mockWorkingCopy,
    });
  });
});

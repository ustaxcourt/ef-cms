jest.mock(
  '@web-api/business/useCases/trialSessions/updateTrialSessionInteractorHelper',
);
jest.mock('@web-api/persistence/dynamo/trialSessions/getTrialSessionById');

import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { getTrialSessionAssociatedCasesCountInteractor } from '@web-api/business/useCases/trialSessions/getTrialSessionAssociatedCasesCountInteractor';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { getCasesInTrialSession } from '@web-api/business/useCases/trialSessions/updateTrialSessionInteractorHelper';
import { getTrialSessionById } from '@web-api/persistence/dynamo/trialSessions/getTrialSessionById';

describe('getTrialSessionAssociatedCasesCountInteractor', () => {
  const TEST_TRIAL_SESSION_ID = 'TEST_TRIAL_SESSION_ID';

  it('should throw error if user is unauthorized', async () => {
    await expect(
      getTrialSessionAssociatedCasesCountInteractor(
        {
          trialSessionId: TEST_TRIAL_SESSION_ID,
        },
        undefined,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw error if the trial session does not exist', async () => {
    (getTrialSessionById as jest.Mock).mockReturnValue(undefined);

    await expect(
      getTrialSessionAssociatedCasesCountInteractor(
        {
          trialSessionId: TEST_TRIAL_SESSION_ID,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);

    const getTrialSessionByIdCalls = (getTrialSessionById as jest.Mock).mock
      .calls;
    expect(getTrialSessionByIdCalls.length).toEqual(1);
    expect(getTrialSessionByIdCalls[0][0].trialSessionId).toEqual(
      TEST_TRIAL_SESSION_ID,
    );
  });

  it('should return the correct results', async () => {
    const TEST_TRIAL_SESSION = {
      trialSessionId: TEST_TRIAL_SESSION_ID,
      testProp: 'TEST_PROP',
    };

    (getTrialSessionById as jest.Mock).mockReturnValue(TEST_TRIAL_SESSION);

    (getCasesInTrialSession as jest.Mock).mockReturnValue({
      calendaredCaseEntities: [{}, {}, {}],
      casesThatShouldReceiveNotices: [{}, {}, {}, {}, {}],
    });

    const { calendaredCaseEntitiesCount, casesThatShouldReceiveNoticesCount } =
      await getTrialSessionAssociatedCasesCountInteractor(
        {
          trialSessionId: TEST_TRIAL_SESSION_ID,
        },
        mockDocketClerkUser,
      );

    expect(calendaredCaseEntitiesCount).toEqual(3);
    expect(casesThatShouldReceiveNoticesCount).toEqual(5);

    const getCasesInTrialSessionCalls = (getCasesInTrialSession as jest.Mock)
      .mock.calls;
    expect(getCasesInTrialSessionCalls.length).toEqual(1);
    expect(getCasesInTrialSessionCalls[0][0]).toMatchObject({
      trialSession: TEST_TRIAL_SESSION,
      authorizedUser: mockDocketClerkUser,
    });
  });
});

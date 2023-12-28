import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPendingMotionDocketEntriesForCurrentJudgeAction } from '@web-client/presenter/actions/PendingMotion/getPendingMotionDocketEntriesForCurrentJudgeAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContext;

describe('getPendingMotionDocketEntriesForCurrentJudgeAction', () => {
  const TEST_JUDGE_NAME = 'TEST_JUDGE_NAME';
  const PENDING_MOTION_ENTRIES = [];

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getPendingMotionDocketEntriesForCurrentJudgeInteractor.mockResolvedValue(
        { docketEntries: PENDING_MOTION_ENTRIES },
      );
  });

  it('should call the interactor with correct params', async () => {
    const results = await runAction(
      getPendingMotionDocketEntriesForCurrentJudgeAction,
      {
        modules: {
          presenter,
        },
        state: {
          judgeUser: {
            name: TEST_JUDGE_NAME,
          },
        },
      },
    );

    const callcount =
      applicationContext.getUseCases()
        .getPendingMotionDocketEntriesForCurrentJudgeInteractor.mock.calls
        .length;

    expect(callcount).toEqual(1);

    const params =
      applicationContext.getUseCases()
        .getPendingMotionDocketEntriesForCurrentJudgeInteractor.mock
        .calls[0][1];

    expect(params).toEqual({
      judges: [TEST_JUDGE_NAME],
    });

    expect(results.output.docketEntries).toEqual(PENDING_MOTION_ENTRIES);
  });
});

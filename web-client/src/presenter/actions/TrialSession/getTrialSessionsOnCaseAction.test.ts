import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getTrialSessionsOnCaseAction } from './getTrialSessionsOnCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getTrialSessionsOnCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should return two trial sessions, one for the trialSessionId and one for the hearing', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor.mockResolvedValue({
        sort: 'practitioner',
        sortOrder: 'desc',
        trialSessionId: '123',
        userId: '234',
      });

    const result = await runAction(getTrialSessionsOnCaseAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          hearings: [
            {
              trialSessionId: 'abc',
            },
          ],
          trialSessionId: '123',
        },
      },
    });

    expect(result.output.trialSessions.length).toEqual(2);
  });

  it('should set the judge name in state based on the trial session id', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor.mockResolvedValue({
        judge: { name: 'Armen' },
        sort: 'practitioner',
        sortOrder: 'desc',
        trialSessionId: '123',
        userId: '234',
      });

    const result = await runAction(getTrialSessionsOnCaseAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          hearings: [],
          trialSessionId: '123',
        },
      },
    });

    expect(result.state.trialSessionJudge).toEqual({ name: 'Armen' });
  });

  it('should return an empty array if no trial session id or hearing is set', async () => {
    const result = await runAction(getTrialSessionsOnCaseAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          hearings: [],
        },
      },
    });

    expect(result.output.trialSessions.length).toEqual(0);
  });

  it('should set the judge as Unassigned if the trial session has no judge assigned', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor.mockResolvedValue({
        judge: null,
        sort: 'practitioner',
        sortOrder: 'desc',
        trialSessionId: '123',
        userId: '234',
      });

    const result = await runAction(getTrialSessionsOnCaseAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          hearings: [],
          trialSessionId: 'abc',
        },
      },
    });

    expect(result.state.trialSessionJudge).toEqual({
      name: 'Unassigned',
    });
  });
});

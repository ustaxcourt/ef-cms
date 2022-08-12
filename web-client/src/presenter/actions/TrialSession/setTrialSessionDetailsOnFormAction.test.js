import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setTrialSessionDetailsOnFormAction } from './setTrialSessionDetailsOnFormAction';

describe('setTrialSessionDetailsOnFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the props.trialSession on state.form, splitting only the startDate into month, day, and year when estimatedEndDate is null', async () => {
    const result = await runAction(setTrialSessionDetailsOnFormAction, {
      modules: {
        presenter,
      },
      props: {
        trialSession: {
          estimatedEndDate: null,
          judge: { userId: '456' },
          sessionType: 'Regular',
          startDate: '2019-03-01T21:40:46.415Z',
          trialClerk: { userId: '098' },
          trialSessionId: '123',
        },
      },
      state: { form: {} },
    });
    expect(result.state.form).toEqual({
      estimatedEndDate: null,
      estimatedEndDateDay: undefined,
      estimatedEndDateMonth: undefined,
      estimatedEndDateYear: undefined,
      judge: { userId: '456' },
      judgeId: '456',
      sessionType: 'Regular',
      startDate: '2019-03-01T21:40:46.415Z',
      startDateDay: '1',
      startDateMonth: '3',
      startDateYear: '2019',
      trialClerk: { userId: '098' },
      trialClerkId: '098',
      trialSessionId: '123',
    });
  });

  it('sets the props.trialSession on state.form, splitting the estimatedEndDateValues into month, day, and year only when estimatedEndDate is not null', async () => {
    const result = await runAction(setTrialSessionDetailsOnFormAction, {
      modules: {
        presenter,
      },
      props: {
        trialSession: {
          estimatedEndDate: '2019-05-01T21:40:46.415Z',
          judge: { userId: '456' },
          sessionType: 'Regular',
          startDate: '2019-03-01T21:40:46.415Z',
          trialClerk: { userId: '098' },
          trialSessionId: '123',
        },
      },
      state: { form: {} },
    });
    expect(result.state.form).toEqual({
      estimatedEndDate: '2019-05-01T21:40:46.415Z',
      estimatedEndDateDay: '1',
      estimatedEndDateMonth: '5',
      estimatedEndDateYear: '2019',
      judge: { userId: '456' },
      judgeId: '456',
      sessionType: 'Regular',
      startDate: '2019-03-01T21:40:46.415Z',
      startDateDay: '1',
      startDateMonth: '3',
      startDateYear: '2019',
      trialClerk: { userId: '098' },
      trialClerkId: '098',
      trialSessionId: '123',
    });
  });
});

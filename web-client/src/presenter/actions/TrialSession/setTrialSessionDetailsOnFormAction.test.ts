import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionDetailsOnFormAction } from './setTrialSessionDetailsOnFormAction';

describe('setTrialSessionDetailsOnFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the props.trialSession on state.form', async () => {
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
      irsCalendarAdministratorInfo: {
        name: undefined,
      },
      judge: { userId: '456' },
      judgeId: '456',
      sessionType: 'Regular',
      startDate: '2019-03-01T21:40:46.415Z',
      trialClerk: { userId: '098' },
      trialClerkId: '098',
      trialSessionId: '123',
    });
  });

  it('sets the props.trialSession on state.form to include setting trialClerkId to "Other", when alternateTrialClerkName is given', async () => {
    const result = await runAction(setTrialSessionDetailsOnFormAction, {
      modules: {
        presenter,
      },
      props: {
        trialSession: {
          alternateTrialClerkName: 'Iron Man',
          estimatedEndDate: '2019-05-01T21:40:46.415Z',
          judge: { userId: '456' },
          sessionType: 'Regular',
          startDate: '2019-03-01T21:40:46.415Z',
          trialSessionId: '123',
        },
      },
      state: { form: {} },
    });

    expect(result.state.form).toEqual({
      alternateTrialClerkName: 'Iron Man',
      estimatedEndDate: '2019-05-01T21:40:46.415Z',
      irsCalendarAdministratorInfo: {
        name: undefined,
      },
      judge: { userId: '456' },
      judgeId: '456',
      sessionType: 'Regular',
      startDate: '2019-03-01T21:40:46.415Z',
      trialClerkId: 'Other',
      trialSessionId: '123',
    });
  });

  it('should set the "irsCalendarAdministratorInfo" property correctly if "irsCalendarAdministratorInfo" doesn\'t exist already', async () => {
    const result = await runAction(setTrialSessionDetailsOnFormAction, {
      modules: {
        presenter,
      },
      props: {
        trialSession: {
          alternateTrialClerkName: 'Iron Man',
          estimatedEndDate: '2019-05-01T21:40:46.415Z',
          irsCalendarAdministrator: 'SOME_TEST_IRS_CALENDAR_ADMINISTRATOR',
          judge: { userId: '456' },
          sessionType: 'Regular',
          startDate: '2019-03-01T21:40:46.415Z',
          trialSessionId: '123',
        },
      },
      state: { form: {} },
    });

    expect(result.state.form).toMatchObject({
      irsCalendarAdministratorInfo: {
        name: 'SOME_TEST_IRS_CALENDAR_ADMINISTRATOR',
      },
    });
  });

  it('should set the "irsCalendarAdministratorInfo" property correctly if "irsCalendarAdministratorInfo" exist in trial session', async () => {
    const result = await runAction(setTrialSessionDetailsOnFormAction, {
      modules: {
        presenter,
      },
      props: {
        trialSession: {
          alternateTrialClerkName: 'Iron Man',
          estimatedEndDate: '2019-05-01T21:40:46.415Z',
          irsCalendarAdministrator: 'SOME_TEST_IRS_CALENDAR_ADMINISTRATOR',
          irsCalendarAdministratorInfo: {
            email: 'TEST_EMAIL',
            name: 'TEST_NAME',
            phone: 'TEST_PHONE',
          },
          judge: { userId: '456' },
          sessionType: 'Regular',
          startDate: '2019-03-01T21:40:46.415Z',
          trialSessionId: '123',
        },
      },
      state: { form: {} },
    });

    expect(result.state.form).toMatchObject({
      irsCalendarAdministrator: undefined,
      irsCalendarAdministratorInfo: {
        email: 'TEST_EMAIL',
        name: 'TEST_NAME',
        phone: 'TEST_PHONE',
      },
    });
  });
});

import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultTrialSessionFormValuesAction } from './setDefaultTrialSessionFormValuesAction';

describe('setDefaultTrialSessionFormValuesAction', () => {
  const { TRIAL_SESSION_PROCEEDING_TYPES, TRIAL_SESSION_SCOPE_TYPES } =
    applicationContext.getConstants();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.form.startTime values to a default 10:00am value', async () => {
    const { state } = await runAction(setDefaultTrialSessionFormValuesAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(state.form).toMatchObject({
      startTimeExtension: 'am',
      startTimeHours: '10',
      startTimeMinutes: '00',
    });
  });

  it('sets state.form.proceedingType to remote', async () => {
    const { state } = await runAction(setDefaultTrialSessionFormValuesAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(state.form).toMatchObject({
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    });
  });

  it('sets state.form.sessionScope to locationBased', async () => {
    const { state } = await runAction(setDefaultTrialSessionFormValuesAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(state.form).toMatchObject({
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
    });
  });
});

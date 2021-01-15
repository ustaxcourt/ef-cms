import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultTrialSessionFormValuesAction } from './setDefaultTrialSessionFormValuesAction';

describe('setDefaultTrialSessionFormValuesAction', () => {
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
      proceedingType: 'Remote',
    });
  });
});

import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { unsetDeniedOptionsOnStampFormAction } from './unsetDeniedOptionsOnStampFormAction';

describe('unsetDeniedOptionsOnStampFormAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should unset denied options on the form', async () => {
    const { state } = await runAction(unsetDeniedOptionsOnStampFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          deniedAsMoot: true,
          deniedWithoutPrejudice: true,
        },
      },
    });

    expect(state.form.deniedAsMoot).toBeUndefined();
    expect(state.form.deniedWithoutPrejudice).toBeUndefined();
  });
});

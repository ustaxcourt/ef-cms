import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetDeniedOptionsOnStampFormAction } from './unsetDeniedOptionsOnStampFormAction';

describe('unsetDeniedOptionsOnStampFormAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const { MOTION_DISPOSITIONS } = applicationContext.getConstants();

  it('should unset denied options on the form when stampOrderStatus is "Granted"', async () => {
    const result = await runAction(unsetDeniedOptionsOnStampFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          deniedAsMoot: true,
          deniedWithoutPrejudice: true,
          disposition: MOTION_DISPOSITIONS.GRANTED,
        },
      },
    });

    expect(result.state.form.deniedAsMoot).toBeUndefined();
    expect(result.state.form.deniedWithoutPrejudice).toBeUndefined();
  });

  it('should not unset denied options on the form when stampOrderStatus is "Denied"', async () => {
    const result = await runAction(unsetDeniedOptionsOnStampFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          deniedAsMoot: true,
          deniedWithoutPrejudice: true,
          disposition: MOTION_DISPOSITIONS.DENIED,
        },
      },
    });

    expect(result.state.form.deniedAsMoot).toBeDefined();
    expect(result.state.form.deniedWithoutPrejudice).toBeDefined();
  });
});

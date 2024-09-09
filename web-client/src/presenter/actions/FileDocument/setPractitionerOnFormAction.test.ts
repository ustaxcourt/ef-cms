import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setPractitionerOnFormAction } from './setPractitionerOnFormAction';

describe('setPractitionerOnFormAction', () => {
  const { USER_ROLES } = applicationContext.getConstants();

  presenter.providers.applicationContext = applicationContext;

  it('should not set state.form.practitioner when the logged in user is not a privatePractitioner', async () => {
    const { state } = await runAction(setPractitionerOnFormAction, {
      modules: { presenter },
      state: {
        user: { role: USER_ROLES.docketClerk },
      },
    });

    expect(state.form).toBeUndefined();
  });

  it('should set state.form.practitioner to the logged in user when the user is a privatePractitioner', async () => {
    const { state } = await runAction(setPractitionerOnFormAction, {
      modules: { presenter },
      state: {
        user: { role: USER_ROLES.privatePractitioner },
      },
    });

    expect(state.form.practitioner).toEqual([
      {
        partyPrivatePractitioner: true,
        role: USER_ROLES.privatePractitioner,
      },
    ]);
  });
});

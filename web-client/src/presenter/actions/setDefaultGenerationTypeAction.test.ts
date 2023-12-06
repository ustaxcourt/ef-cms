import { GENERATION_TYPES } from '@web-client/getConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  irsPractitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultGenerationTypeAction } from './setDefaultGenerationTypeAction';

describe('setDefaultGenerationTypeAction', () => {
  presenter.providers.applicationContext = applicationContext;

  applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);

  it('should set the generation type to auto when the changed event code is EA', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'eventCode',
        value: 'EA',
      },
      state: {
        form: {
          generationType: GENERATION_TYPES.MANUAL,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.AUTO);
  });

  it('should set the generation type to manual when the changed event code is NOT EA and the user is NOT an IRS Practitioner', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'eventCode',
        value: 'SOC',
      },
      state: {
        form: {
          generationType: GENERATION_TYPES.AUTO,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
  });

  it('should set the generation type to manual when the changed event code is NOT EA and the user is an IRS Practitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValueOnce(irsPractitionerUser);

    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'eventCode',
        value: 'SOC',
      },
      state: {
        form: {
          generationType: GENERATION_TYPES.AUTO,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
  });

  it('should not modify the existing generation type when props.key is NOT one of eventCode or generationType', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'documentType',
        value: 'Substitution of Counsel',
      },
      state: {
        form: {
          generationType: GENERATION_TYPES.AUTO,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.AUTO);
  });
});

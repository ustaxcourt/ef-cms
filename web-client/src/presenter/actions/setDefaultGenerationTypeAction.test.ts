import { GENERATION_TYPES, getConstants } from '@web-client/getConstants';
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

  it('should set the generation type to auto when the changed event code is EA', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'eventCode',
        value: 'EA',
      },
      state: {
        caseDetail: {
          petitioners: [],
        },
        form: {
          generationType: GENERATION_TYPES.MANUAL,
        },
        user: privatePractitionerUser,
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
        caseDetail: {
          petitioners: [],
        },
        form: {
          generationType: GENERATION_TYPES.AUTO,
        },
        user: privatePractitionerUser,
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
  });

  it('should set the generation type to manual when the changed event code is NOT EA and the user is an IRS Practitioner', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'eventCode',
        value: 'SOC',
      },
      state: {
        caseDetail: {
          petitioners: [],
        },
        form: {
          generationType: GENERATION_TYPES.AUTO,
        },
        user: irsPractitionerUser,
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
  });

  it('should set the generation type to "auto"" when the changed event code is EA and the user is an IRS Practitioner with no parties having paper service', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'eventCode',
        value: 'EA',
      },
      state: {
        caseDetail: {
          petitioners: [],
        },
        form: {
          generationType: GENERATION_TYPES.MANUAL,
        },

        user: irsPractitionerUser,
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.AUTO);
  });

  it('should not modify the existing generation type when props.key is NOT one of eventCode or generationType', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'documentType',
        value: 'Substitution of Counsel',
      },
      state: {
        caseDetail: {
          petitioners: [],
        },
        form: {
          generationType: GENERATION_TYPES.AUTO,
        },
        user: privatePractitionerUser,
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.AUTO);
  });

  it('should set the generation type to manual if code is EA but a petitioner has paper', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'eventCode',
        value: 'EA',
      },
      state: {
        caseDetail: {
          petitioners: [
            {
              serviceIndicator: getConstants().SERVICE_INDICATOR_TYPES.SI_PAPER,
            },
          ],
        },
        form: {
          generationType: GENERATION_TYPES.AUTO,
        },
        user: irsPractitionerUser,
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
  });

  it('should set the generation type to auto if code is EA ans user is private practitioner', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'eventCode',
        value: 'EA',
      },
      state: {
        caseDetail: {
          petitioners: [
            {
              serviceIndicator:
                getConstants().SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
            },
          ],
        },
        form: {
          generationType: GENERATION_TYPES.MANUAL,
        },
        user: privatePractitionerUser,
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.AUTO);
  });
});

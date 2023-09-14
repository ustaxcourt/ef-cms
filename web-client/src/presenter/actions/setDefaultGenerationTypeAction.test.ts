import { GENERATION_TYPES } from '@web-client/getConstants';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultGenerationTypeAction } from './setDefaultGenerationTypeAction';

describe('setDefaultGenerationTypeAction', () => {
  it('should set the generation type to auto when the changed event code is EA', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      props: {
        key: 'eventCode',
        value: 'EA',
      },
      state: {
        constants: {
          GENERATION_TYPES,
        },
        form: {
          generationType: GENERATION_TYPES.MANUAL,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.AUTO);
  });

  it('should set the generation type to manual when the changed event code is NOT EA', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      props: {
        key: 'eventCode',
        value: 'SOC',
      },
      state: {
        constants: {
          GENERATION_TYPES,
        },
        form: {
          generationType: GENERATION_TYPES.AUTO,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
  });

  it('should not modify the existing generation type for non eventCode props', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      props: {
        key: 'documentType',
        value: 'Substitution of Counsel',
      },
      state: {
        constants: {
          GENERATION_TYPES,
        },
        form: {
          generationType: GENERATION_TYPES.AUTO,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.AUTO);
  });
});

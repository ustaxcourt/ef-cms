import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { clearOtherIterationAction } from './clearOtherIterationAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContext;

describe('clearOtherIterationAction', () => {
  it('should not unset otherIteration if otherIteration is undefined and ordinalValue is not "Other"', async () => {
    const originalForm = { ordinalValue: '7', otherIteration: undefined };
    const result = await runAction(clearOtherIterationAction, {
      modules: {
        presenter,
      },
      state: {
        form: originalForm,
      },
    });
    expect(result.state.form).toEqual(originalForm);
  });

  it('should not unset otherIteration if otherIteration is defined and ordinalValue is "Other"', async () => {
    const originalForm = { ordinalValue: 'Other', otherIteration: '123' };
    const result = await runAction(clearOtherIterationAction, {
      modules: {
        presenter,
      },
      state: {
        form: originalForm,
      },
    });
    expect(result.state.form).toEqual(originalForm);
  });

  it('should unset otherIteration if otherIteration is defined and ordinalValue is not "Other"', async () => {
    const originalForm = { ordinalValue: '7', otherIteration: '123' };

    const result = await runAction(clearOtherIterationAction, {
      modules: {
        presenter,
      },
      state: {
        form: originalForm,
      },
    });

    expect(result.state.form.otherIteration).toBeUndefined();
  });
});

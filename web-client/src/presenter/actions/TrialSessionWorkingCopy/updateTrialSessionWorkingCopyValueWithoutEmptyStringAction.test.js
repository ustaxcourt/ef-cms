import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateTrialSessionWorkingCopyValueWithoutEmptyStringAction } from './updateTrialSessionWorkingCopyValueWithoutEmptyStringAction';

describe('updateTrialSessionWorkingCopyValueWithoutEmptyStringAction', () => {
  it('sets the value for the key provided if the value is not an empty string', async () => {
    const { state } = await runAction(
      updateTrialSessionWorkingCopyValueWithoutEmptyStringAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'something',
          value: 'yes',
        },
        state: { trialSessionWorkingCopy: {} },
      },
    );
    expect(state.trialSessionWorkingCopy.something).toEqual('yes');
  });

  it('sets the value for the key provided if the value is false', async () => {
    const { state } = await runAction(
      updateTrialSessionWorkingCopyValueWithoutEmptyStringAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'something',
          value: false,
        },
        state: { trialSessionWorkingCopy: {} },
      },
    );
    expect(state.trialSessionWorkingCopy.something).toEqual(false);
  });

  it('does not set a value if no key is present', async () => {
    const { state } = await runAction(
      updateTrialSessionWorkingCopyValueWithoutEmptyStringAction,
      {
        modules: {
          presenter,
        },
        props: {
          value: 'something',
        },
        state: { trialSessionWorkingCopy: {} },
      },
    );
    expect(state.trialSessionWorkingCopy).toEqual({});
  });

  it('removes the value for the key provided if the value is an empty string', async () => {
    const { state } = await runAction(
      updateTrialSessionWorkingCopyValueWithoutEmptyStringAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'something',
          value: '',
        },
        state: { trialSessionWorkingCopy: { something: 'yes' } },
      },
    );
    expect(state.trialSessionWorkingCopy.something).toBeUndefined();
  });

  it('removes the value for the key provided if the value is not provided', async () => {
    const { state } = await runAction(
      updateTrialSessionWorkingCopyValueWithoutEmptyStringAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'something',
        },
        state: { trialSessionWorkingCopy: { something: 'yes' } },
      },
    );
    expect(state.trialSessionWorkingCopy.something).toBeUndefined();
  });
});

import { runAction } from 'cerebral/test';
import { updateOrderForDesignatingPlaceOfTrialAction } from './updateOrderForDesignatingPlaceOfTrialAction';

describe('updateOrderForDesignatingPlaceOfTrialAction', () => {
  it('sets orderForRequestedTrialLocation true when preferredTrialCity and requestForPlaceOfTrialFile are undefined', async () => {
    const result = await runAction(
      updateOrderForDesignatingPlaceOfTrialAction,
      {
        props: { key: 'preferredTrialCity' },
        state: {
          form: {},
        },
      },
    );

    expect(result.state.form.orderForRequestedTrialLocation).toBe(true);
  });

  it('sets orderForRequestedTrialLocation false when preferredTrialCity or requestForPlaceOfTrialFile are defined', async () => {
    const result = await runAction(
      updateOrderForDesignatingPlaceOfTrialAction,
      {
        props: { key: 'preferredTrialCity' },
        state: {
          form: {
            preferredTrialCity: 'Seattle, WA',
          },
        },
      },
    );

    expect(result.state.form.orderForRequestedTrialLocation).toBe(false);
  });

  it('sets orderForRequestedTrialLocation false when preferredTrialCity or requestForPlaceOfTrialFile are defined', async () => {
    const result = await runAction(
      updateOrderForDesignatingPlaceOfTrialAction,
      {
        props: { key: 'requestForPlaceOfTrialFile' },
        state: {
          form: {
            requestForPlaceOfTrialFile: 'fakeFile.pdf',
          },
        },
      },
    );

    expect(result.state.form.orderForRequestedTrialLocation).toBe(false);
  });

  it('does not update orderForRequestedTrialLocation if props.key is not preferredTrialCity or requestForPlaceOfTrialFile', async () => {
    const result = await runAction(
      updateOrderForDesignatingPlaceOfTrialAction,
      {
        props: { key: 'anotherField' },
        state: {
          form: { orderForRequestedTrialLocation: false },
        },
      },
    );

    expect(result.state.form.orderForRequestedTrialLocation).toBe(false);
  });
});

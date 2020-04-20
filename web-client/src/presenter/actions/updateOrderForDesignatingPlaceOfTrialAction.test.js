import { runAction } from 'cerebral/test';
import { updateOrderForDesignatingPlaceOfTrialAction } from './updateOrderForDesignatingPlaceOfTrialAction';

describe('updateOrderForDesignatingPlaceOfTrialAction', () => {
  it('sets orderForRequestedTrialLocation true when preferredTrialCity and requestForPlaceOfTrialFile are undefined', async () => {
    const result = await runAction(
      updateOrderForDesignatingPlaceOfTrialAction,
      {
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
        state: {
          form: {
            requestForPlaceOfTrialFile: 'fakeFile.pdf',
          },
        },
      },
    );

    expect(result.state.form.orderForRequestedTrialLocation).toBe(false);
  });
});

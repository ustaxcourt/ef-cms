import { runAction } from '@web-client/presenter/test.cerebral';
import { updateOrderForDesignatingPlaceOfTrialAction } from './updateOrderForDesignatingPlaceOfTrialAction';

describe('updateOrderForDesignatingPlaceOfTrialAction', () => {
  it('sets orderDesignatingPlaceOfTrial true when preferredTrialCity and requestForPlaceOfTrialFile are undefined', async () => {
    const result = await runAction(
      updateOrderForDesignatingPlaceOfTrialAction,
      {
        props: { key: 'preferredTrialCity' },
        state: {
          form: {},
        },
      },
    );

    expect(result.state.form.orderDesignatingPlaceOfTrial).toBe(true);
  });

  it('sets orderDesignatingPlaceOfTrial false when preferredTrialCity or requestForPlaceOfTrialFile are defined', async () => {
    const result = await runAction(
      updateOrderForDesignatingPlaceOfTrialAction,
      {
        props: { key: 'preferredTrialCity' },
        state: {
          form: {
            preferredTrialCity: 'Seattle, Washington',
          },
        },
      },
    );

    expect(result.state.form.orderDesignatingPlaceOfTrial).toBe(false);
  });

  it('sets orderDesignatingPlaceOfTrial false when preferredTrialCity or requestForPlaceOfTrialFile are defined', async () => {
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

    expect(result.state.form.orderDesignatingPlaceOfTrial).toBe(false);
  });

  it('does not update orderDesignatingPlaceOfTrial if props.key is not preferredTrialCity or requestForPlaceOfTrialFile', async () => {
    const result = await runAction(
      updateOrderForDesignatingPlaceOfTrialAction,
      {
        props: { key: 'anotherField' },
        state: {
          form: { orderDesignatingPlaceOfTrial: false },
        },
      },
    );

    expect(result.state.form.orderDesignatingPlaceOfTrial).toBe(false);
  });
});

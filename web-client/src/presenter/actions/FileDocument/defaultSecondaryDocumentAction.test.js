import { defaultSecondaryDocumentAction } from './defaultSecondaryDocumentAction';
import { runAction } from 'cerebral/test';

describe('defaultSecondaryDocumentAction', () => {
  it('sets the default form values for a secondary document if the scenario is Nonstandard H', async () => {
    const result = await runAction(defaultSecondaryDocumentAction, {
      state: {
        form: {
          scenario: 'Nonstandard H',
        },
      },
    });

    expect(result.state).toMatchObject({
      form: {
        secondaryDocument: {},
      },
    });
  });

  it('unsets the secondary document if the scenario is not Nonstandard H', async () => {
    const result = await runAction(defaultSecondaryDocumentAction, {
      state: {
        form: {
          scenario: 'Standard',
        },
      },
    });

    expect(result.state).toEqual({
      form: {
        scenario: 'Standard',
      },
    });
  });
});

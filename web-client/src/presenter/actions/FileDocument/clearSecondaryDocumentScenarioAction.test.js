import { clearSecondaryDocumentScenarioAction } from './clearSecondaryDocumentScenarioAction';
import { runAction } from 'cerebral/test';

describe('clearSecondaryDocumentScenarioAction', () => {
  it('clears the secondaryDocument.scenario within the form', async () => {
    const result = await runAction(clearSecondaryDocumentScenarioAction, {
      state: {
        form: {
          secondaryDocument: {
            scenario: {},
          },
        },
      },
    });

    expect(result.state.form.secondaryDocument.scenario).toBeUndefined();
  });
});

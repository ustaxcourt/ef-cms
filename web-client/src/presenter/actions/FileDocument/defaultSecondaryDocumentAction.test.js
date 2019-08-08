import { defaultSecondaryDocumentAction } from './defaultSecondaryDocumentAction';
import { runAction } from 'cerebral/test';

describe('defaultSecondaryDocumentAction', () => {
  it('sets the default form values for a secondary document', async () => {
    const result = await runAction(defaultSecondaryDocumentAction, {
      state: {
        form: {},
      },
    });

    expect(result.state).toMatchObject({
      form: {
        secondaryDocument: {},
      },
    });
  });
});

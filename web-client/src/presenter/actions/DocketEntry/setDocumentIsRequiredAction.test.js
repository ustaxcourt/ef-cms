import { runAction } from 'cerebral/test';
import { setDocumentIsRequiredAction } from './setDocumentIsRequiredAction';

describe('setDocumentIsRequiredAction', () => {
  it('sets state.form.isDocumentRequired to true', async () => {
    const result = await runAction(setDocumentIsRequiredAction);

    expect(result.state.form).toMatchObject({
      isDocumentRequired: true,
    });
  });
});

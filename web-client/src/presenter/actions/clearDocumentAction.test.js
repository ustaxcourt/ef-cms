import { clearDocumentAction } from './clearDocumentAction';
import { runAction } from 'cerebral/test';

describe.only('clearDocumentAction', () => {
  it('should set state.document to an empty object', async () => {
    const result = await runAction(clearDocumentAction, {
      state: { document: { something: 'yes' } },
    });

    expect(result.state.document).toEqual({});
  });
});

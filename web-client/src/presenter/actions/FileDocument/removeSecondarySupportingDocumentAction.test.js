import { removeSecondarySupportingDocumentAction } from './removeSecondarySupportingDocumentAction';
import { runAction } from 'cerebral/test';

describe('removeSecondarySupportingDocumentAction', () => {
  it('removes an item from the list', async () => {
    const result = await runAction(removeSecondarySupportingDocumentAction, {
      props: { index: 0 },
      state: {
        form: {
          secondarySupportingDocuments: [{}],
        },
      },
    });

    expect(result.state.form.hasSecondarySupportingDocuments).toEqual(false);
    expect(result.state.form.secondarySupportingDocuments).toEqual([]);
    expect(result.state.form.secondarySupportingDocumentCount).toEqual(0);
  });
});

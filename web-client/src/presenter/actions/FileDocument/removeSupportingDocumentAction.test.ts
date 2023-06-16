import { removeSupportingDocumentAction } from './removeSupportingDocumentAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removeSupportingDocumentAction', () => {
  it('removes an item from the list', async () => {
    const result = await runAction(removeSupportingDocumentAction, {
      props: { index: 0 },
      state: {
        form: {
          supportingDocuments: [{}],
        },
      },
    });

    expect(result.state.form.hasSupportingDocuments).toEqual(false);
    expect(result.state.form.supportingDocuments).toEqual([]);
  });
});

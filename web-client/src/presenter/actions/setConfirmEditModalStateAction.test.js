import { runAction } from 'cerebral/test';
import { setConfirmEditModalStateAction } from './setConfirmEditModalStateAction';

describe('setConfirmEditModalStateAction', () => {
  it('sets the case and document to display in the modal', async () => {
    const result = await runAction(setConfirmEditModalStateAction, {
      props: {
        docketNumber: 'abc-123',
        documentIdToEdit: 'abc-123',
        parentMessageId: '987',
      },
    });

    expect(result.state).toMatchObject({
      modal: {
        docketNumber: 'abc-123',
        documentIdToEdit: 'abc-123',
        parentMessageId: '987',
      },
    });
  });
});

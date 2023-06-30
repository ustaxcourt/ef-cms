import { runAction } from '@web-client/presenter/test.cerebral';
import { setConfirmEditModalStateAction } from './setConfirmEditModalStateAction';

describe('setConfirmEditModalStateAction', () => {
  it('sets the case and document to display in the modal', async () => {
    const result = await runAction(setConfirmEditModalStateAction, {
      props: {
        docketEntryIdToEdit: 'abc-123',
        docketNumber: 'abc-123',
        parentMessageId: '987',
      },
    });

    expect(result.state).toMatchObject({
      modal: {
        docketEntryIdToEdit: 'abc-123',
        docketNumber: 'abc-123',
        parentMessageId: '987',
      },
    });
  });
});

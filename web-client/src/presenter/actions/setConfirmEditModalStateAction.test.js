import { runAction } from 'cerebral/test';
import { setConfirmEditModalStateAction } from './setConfirmEditModalStateAction';

describe('setConfirmEditModalStateAction', () => {
  it('do', async () => {
    const result = await runAction(setConfirmEditModalStateAction, {
      props: {
        caseId: 'abc-123',
        docketNumber: 'abc-123',
        documentIdToEdit: 'abc-123',
      },
    });

    expect(result.state).toMatchObject({
      modal: {
        caseId: 'abc-123',
        docketNumber: 'abc-123',
        documentIdToEdit: 'abc-123',
      },
    });
  });
});

import { runAction } from 'cerebral/test';
import { setupConfirmWithPropsAction } from './setupConfirmWithPropsAction';

describe('setupConfirmWithPropsAction', () => {
  it('sets up confirmation with props', async () => {
    const result = await runAction(setupConfirmWithPropsAction, {
      state: {
        modal: {
          caseId: 'abc-123',
          docketNumber: 'abc-123',
          documentIdToEdit: 'abc-123',
        },
      },
    });

    expect(result.output).toMatchObject({
      caseId: 'abc-123',
      docketNumber: 'abc-123',
      documentIdToEdit: 'abc-123',
    });
  });
});

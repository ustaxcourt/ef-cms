import { runAction } from 'cerebral/test';
import { setPropsForRemoveSignatureAction } from './setPropsForRemoveSignatureAction';

describe('setPropsForRemoveSignatureAction', () => {
  it('returns props needed for removing signature from state', async () => {
    const { output } = await runAction(setPropsForRemoveSignatureAction, {
      state: {
        caseDetail: {
          caseId: '123',
        },
        modal: { documentIdToEdit: 'abc' },
      },
    });

    expect(output).toEqual({
      caseDetail: {
        caseId: '123',
      },
      documentIdToEdit: 'abc',
    });
  });
});

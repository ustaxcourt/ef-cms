import { runAction } from 'cerebral/test';
import { setPropsForRemoveSignatureAction } from './setPropsForRemoveSignatureAction';

describe('setPropsForRemoveSignatureAction', () => {
  it('returns props needed for removing signature from state', async () => {
    const { output } = await runAction(setPropsForRemoveSignatureAction, {
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        modal: { documentIdToEdit: 'abc' },
      },
    });

    expect(output).toEqual({
      caseDetail: {
        docketNumber: '123-45',
      },
      documentIdToEdit: 'abc',
    });
  });
});

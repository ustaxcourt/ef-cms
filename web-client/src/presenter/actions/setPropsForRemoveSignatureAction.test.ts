import { runAction } from '@web-client/presenter/test.cerebral';
import { setPropsForRemoveSignatureAction } from './setPropsForRemoveSignatureAction';

describe('setPropsForRemoveSignatureAction', () => {
  it('returns props needed for removing signature from state', async () => {
    const { output } = await runAction(setPropsForRemoveSignatureAction, {
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        modal: { docketEntryIdToEdit: 'abc' },
      },
    });

    expect(output).toEqual({
      caseDetail: {
        docketNumber: '123-45',
      },
      docketEntryIdToEdit: 'abc',
    });
  });
});

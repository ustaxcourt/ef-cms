import { runAction } from '@web-client/presenter/test.cerebral';
import { setDeleteUserCaseNoteModalStateAction } from './setDeleteUserCaseNoteModalStateAction';

describe('setDeleteUserCaseNoteModalStateAction', () => {
  const mockDocketNumber = '121-21';

  it('should set state.modal.docketNumber to props.docketNumber', async () => {
    const { state } = await runAction(setDeleteUserCaseNoteModalStateAction, {
      props: {
        docketNumber: mockDocketNumber,
      },
      state: { modal: {} },
    });

    expect(state.modal.docketNumber).toEqual(mockDocketNumber);
  });
});

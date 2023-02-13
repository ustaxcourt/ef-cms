import { runAction } from 'cerebral/test';
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

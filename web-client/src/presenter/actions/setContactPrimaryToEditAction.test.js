import { runAction } from 'cerebral/test';
import { setContactPrimaryToEditAction } from './setContactPrimaryToEditAction';

describe('setContactPrimaryToEditAction', () => {
  it('sets the contsactPrimary data to edit on state', async () => {
    const mockCase = {
      caseId: '123',
      contactPrimary: {
        contactId: '456',
      },
    };
    const result = await runAction(setContactPrimaryToEditAction, {
      state: {
        caseDetail: mockCase,
        contactToEdit: null,
      },
    });

    expect(result.state.contactToEdit.contactPrimary).toEqual(
      mockCase.contactPrimary,
    );
  });
});

import { runAction } from 'cerebral/test';
import { setEditPractitionersAction } from './setEditPractitionersAction';

describe('setEditPractitionersAction', () => {
  it('should set the state.caseDetail.practitioners on state.modal', async () => {
    const result = await runAction(setEditPractitionersAction, {
      state: {
        caseDetail: {
          practitioners: [
            { name: 'Test Practitioner1', userId: '1' },
            { name: 'Test Practitioner2', userId: '2' },
          ],
        },
      },
    });

    expect(result.state.modal.practitioners).toEqual([
      { name: 'Test Practitioner1', userId: '1' },
      { name: 'Test Practitioner2', userId: '2' },
    ]);
  });
});

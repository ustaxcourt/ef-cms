import { runAction } from 'cerebral/test';
import { setEditPractitionersAction } from './setEditPractitionersAction';

describe('setEditPractitionersAction', () => {
  it('should set the state.caseDetail.privatePractitioners on state.modal', async () => {
    const result = await runAction(setEditPractitionersAction, {
      state: {
        caseDetail: {
          privatePractitioners: [
            { name: 'Test Practitioner1', userId: '1' },
            { name: 'Test Practitioner2', userId: '2' },
          ],
        },
      },
    });

    expect(result.state.modal.privatePractitioners).toEqual([
      { name: 'Test Practitioner1', userId: '1' },
      { name: 'Test Practitioner2', userId: '2' },
    ]);
  });
});

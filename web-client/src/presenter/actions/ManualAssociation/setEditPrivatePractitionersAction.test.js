import { runAction } from 'cerebral/test';
import { setEditPrivatePractitionersAction } from './setEditPrivatePractitionersAction';

describe('setEditPrivatePractitionersAction', () => {
  it('should set the state.caseDetail.privatePractitioners on state.modal', async () => {
    const result = await runAction(setEditPrivatePractitionersAction, {
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

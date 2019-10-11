import { runAction } from 'cerebral/test';
import { setEditPractitionersFormAction } from './setEditPractitionersFormAction';

describe('setEditPractitionersFormAction', () => {
  it('should set the state.caseDetail.practitioners on state.form', async () => {
    const result = await runAction(setEditPractitionersFormAction, {
      state: {
        caseDetail: {
          practitioners: [
            { name: 'Test Practitioner1', userId: '1' },
            { name: 'Test Practitioner2', userId: '2' },
          ],
        },
      },
    });

    expect(result.state.form.practitioners).toEqual([
      { name: 'Test Practitioner1', userId: '1' },
      { name: 'Test Practitioner2', userId: '2' },
    ]);
  });
});

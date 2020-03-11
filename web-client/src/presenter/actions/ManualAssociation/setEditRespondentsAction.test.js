import { runAction } from 'cerebral/test';
import { setEditRespondentsAction } from './setEditRespondentsAction';

describe('setEditRespondentsAction', () => {
  it('should set the state.caseDetail.irsPractitioners on state.modal', async () => {
    const result = await runAction(setEditRespondentsAction, {
      state: {
        caseDetail: {
          irsPractitioners: [
            { name: 'Test Respondent1', userId: '1' },
            { name: 'Test Respondent2', userId: '2' },
          ],
        },
      },
    });

    expect(result.state.modal.irsPractitioners).toEqual([
      { name: 'Test Respondent1', userId: '1' },
      { name: 'Test Respondent2', userId: '2' },
    ]);
  });
});

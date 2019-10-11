import { runAction } from 'cerebral/test';
import { setEditRespondentsFormAction } from './setEditRespondentsFormAction';

describe('setEditRespondentsFormAction', () => {
  it('should set the state.caseDetail.respondents on state.form', async () => {
    const result = await runAction(setEditRespondentsFormAction, {
      state: {
        caseDetail: {
          respondents: [
            { name: 'Test Respondent1', userId: '1' },
            { name: 'Test Respondent2', userId: '2' },
          ],
        },
      },
    });

    expect(result.state.form.respondents).toEqual([
      { name: 'Test Respondent1', userId: '1' },
      { name: 'Test Respondent2', userId: '2' },
    ]);
  });
});

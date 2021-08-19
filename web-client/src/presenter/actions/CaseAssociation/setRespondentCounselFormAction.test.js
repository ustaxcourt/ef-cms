import { runAction } from 'cerebral/test';
import { setRespondentCounselFormAction } from './setRespondentCounselFormAction';

describe('setRespondentCounselFormAction', () => {
  it('should set the state.form to the associated respondent counsel via its barNumber', async () => {
    const { state } = await runAction(setRespondentCounselFormAction, {
      props: {
        barNumber: 'abc',
      },
      state: {
        caseDetail: {
          irsPractitioners: [
            {
              barNumber: 'abc',
              serviceIndicator: 'Electronic',
            },
          ],
          petitioners: [],
        },
      },
    });
    expect(state.form).toMatchObject({
      barNumber: 'abc',
      serviceIndicator: 'Electronic',
    });
  });
});

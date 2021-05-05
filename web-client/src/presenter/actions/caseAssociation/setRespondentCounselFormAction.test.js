import { runAction } from 'cerebral/test';
import { setRespondentCounselFormAction } from './setRespondentCounselFormAction';

describe('setRespondentCounselFormAction', () => {
  it('should call the delete use case for each respondent counsel on the form with removeFromCase set to true and call the path.success when finished', async () => {
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

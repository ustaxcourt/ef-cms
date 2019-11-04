import { clearPreferredTrialCityAction } from './clearPreferredTrialCityAction';
import { runAction } from 'cerebral/test';

describe.only('clearPreferredTrialCityAction', () => {
  it('should set state.form.preferredTrialCity to an empty string', async () => {
    const result = await runAction(clearPreferredTrialCityAction, {
      state: { form: { preferredTrialCity: 'Birmingham, Alabama' } },
    });

    expect(result.state.form.preferredTrialCity).toEqual('');
  });
});

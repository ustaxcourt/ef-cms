import { clearPreferredTrialCityAction } from './clearPreferredTrialCityAction';
import { runAction } from 'cerebral/test';

describe('clearPreferredTrialCityAction', () => {
  it('should set state.form.preferredTrialCity to null', async () => {
    const result = await runAction(clearPreferredTrialCityAction, {
      state: { form: { preferredTrialCity: 'Birmingham, Alabama' } },
    });

    expect(result.state.form.preferredTrialCity).toEqual(undefined);
  });
});

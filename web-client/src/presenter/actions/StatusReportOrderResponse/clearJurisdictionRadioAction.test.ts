import { clearJurisdictionRadioAction } from './clearJurisdictionRadioAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearJurisdictionRadioAction,', () => {
  it("should unset the jurisdiction form property if the 'Case is striken from the trial sessions' checkbox is unselected", async () => {
    const result = await runAction(clearJurisdictionRadioAction, {
      props: {
        key: 'strickenFromTrialSessions',
        value: false,
      },
      state: {
        form: {
          jurisdiction: 'retained',
        },
      },
    });

    expect(result.state.form).toEqual({});
  });

  it("should not unset the jurisdiction form property if the 'Case is striken from the trial sessions' checkbox is selected", async () => {
    const result = await runAction(clearJurisdictionRadioAction, {
      props: {
        key: 'strickenFromTrialSessions',
        value: true,
      },
      state: {
        form: {
          jurisdiction: 'retained',
        },
      },
    });

    expect(result.state.form).toEqual({
      jurisdiction: 'retained',
    });
  });
});

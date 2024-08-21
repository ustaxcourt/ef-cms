import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { clearJurisdictionRadioAction } from './clearJurisdictionRadioAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearJurisdictionRadioAction,', () => {
  it("should unset the jurisdiction form property if the 'Case is stricken from the trial session' checkbox is unselected", async () => {
    const result = await runAction(clearJurisdictionRadioAction, {
      props: {
        key: 'strickenFromTrialSessions',
        value: false,
      },
      state: {
        form: {
          jurisdiction:
            STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
        },
      },
    });

    expect(result.state.form).toEqual({});
  });

  it("should not unset the jurisdiction form property if the 'Case is stricken from the trial session' checkbox is selected", async () => {
    const result = await runAction(clearJurisdictionRadioAction, {
      props: {
        key: 'strickenFromTrialSessions',
        value: true,
      },
      state: {
        form: {
          jurisdiction:
            STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
        },
      },
    });

    expect(result.state.form).toEqual({
      jurisdiction: STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
    });
  });
});

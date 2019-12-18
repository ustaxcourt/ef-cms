import { clearAlertsAction } from './clearAlertsAction';
import { runAction } from 'cerebral/test';

describe.only('clearAlertsAction', () => {
  it('should save alertError and alertSuccess but clear caseDetailErrors and validationErrors if state.saveAlertsForNavigation is true', async () => {
    const result = await runAction(clearAlertsAction, {
      state: {
        alertError: 'some error',
        alertSuccess: 'hooray',
        caseDetailErrors: { error: true },
        saveAlertsForNavigation: true,
        validationErrors: { error: true },
      },
    });

    expect(result.state.alertError).toEqual('some error');
    expect(result.state.alertSuccess).toEqual('hooray');
    expect(result.state.saveAlertsForNavigation).toEqual(false);
    expect(result.state.caseDetailErrors).toEqual({});
    expect(result.state.validationErrors).toEqual({});
  });

  it('should clear alertError, alertSuccess, caseDetailErrors, and validationErrors if state.saveAlertsForNavigation is false and props.fromModal is not present', async () => {
    const result = await runAction(clearAlertsAction, {
      state: {
        alertError: 'some error',
        alertSuccess: 'hooray',
        caseDetailErrors: { error: true },
        saveAlertsForNavigation: false,
        validationErrors: { error: true },
      },
    });

    expect(result.state.alertError).toBeUndefined();
    expect(result.state.alertSuccess).toBeUndefined();
    expect(result.state.saveAlertsForNavigation).toEqual(false);
    expect(result.state.caseDetailErrors).toEqual({});
    expect(result.state.validationErrors).toEqual({});
  });

  it('should clear alertError, alertSuccess, caseDetailErrors, and modal.validationErrors if state.saveAlertsForNavigation is false and props.fromModal is true', async () => {
    const result = await runAction(clearAlertsAction, {
      props: { fromModal: true },
      state: {
        alertError: 'some error',
        alertSuccess: 'hooray',
        caseDetailErrors: { error: true },
        modal: { validationErrors: { error: true } },
        saveAlertsForNavigation: false,
        validationErrors: { error: true },
      },
    });

    expect(result.state.alertError).toBeUndefined();
    expect(result.state.alertSuccess).toBeUndefined();
    expect(result.state.saveAlertsForNavigation).toEqual(false);
    expect(result.state.caseDetailErrors).toEqual({});
    expect(result.state.modal.validationErrors).toEqual({});
    expect(result.state.validationErrors).toEqual({ error: true });
  });
});

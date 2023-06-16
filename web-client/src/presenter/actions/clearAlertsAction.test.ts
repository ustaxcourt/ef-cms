import { clearAlertsAction } from './clearAlertsAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearAlertsAction', () => {
  it('should save alertError and alertSuccess but clear validationErrors if state.saveAlertsForNavigation is true', async () => {
    const result = await runAction(clearAlertsAction, {
      state: {
        alertError: 'some error',
        alertSuccess: 'hooray',
        saveAlertsForNavigation: true,
        validationErrors: { error: true },
      },
    });

    expect(result.state.alertError).toEqual('some error');
    expect(result.state.alertSuccess).toEqual('hooray');
    expect(result.state.saveAlertsForNavigation).toEqual(false);
    expect(result.state.validationErrors).toEqual({});
  });

  it('should clear alertError, alertSuccess, and validationErrors if state.saveAlertsForNavigation is false and props.fromModal is not present', async () => {
    const result = await runAction(clearAlertsAction, {
      state: {
        alertError: 'some error',
        alertSuccess: 'hooray',
        saveAlertsForNavigation: false,
        validationErrors: { error: true },
      },
    });

    expect(result.state.alertError).toBeUndefined();
    expect(result.state.alertSuccess).toBeUndefined();
    expect(result.state.saveAlertsForNavigation).toEqual(false);
    expect(result.state.validationErrors).toEqual({});
  });

  it('should clear alertError, alertSuccess, and modal.validationErrors if state.saveAlertsForNavigation is false and props.fromModal is true', async () => {
    const result = await runAction(clearAlertsAction, {
      props: { fromModal: true },
      state: {
        alertError: 'some error',
        alertSuccess: 'hooray',
        modal: { validationErrors: { error: true } },
        saveAlertsForNavigation: false,
        validationErrors: { error: true },
      },
    });

    expect(result.state.alertError).toBeUndefined();
    expect(result.state.alertSuccess).toBeUndefined();
    expect(result.state.saveAlertsForNavigation).toEqual(false);
    expect(result.state.modal.validationErrors).toEqual({});
    expect(result.state.validationErrors).toEqual({ error: true });
  });
});

import { PAYMENT_FILING_FEE_ORIGIN } from '@shared/business/entities/EntityConstants';
import { paymentCancelRouteByOriginAction } from '@web-client/presenter/actions/FilingFee/paymentCancelRouteByOriginAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('paymentCancelRouteByOriginAction', () => {
  const pathDashboardStub = jest.fn();
  const pathPetitionStub = jest.fn();

  beforeEach(() => {
    pathDashboardStub.mockClear();
    pathPetitionStub.mockClear();
    presenter.providers.path = {
      dashboard: pathDashboardStub,
      petition: pathPetitionStub,
    };
  });

  it('should replace the URL and take the dashboard path when origin is dashboard', async () => {
    const replaceStateSpy = jest
      .spyOn(window.history, 'replaceState')
      .mockImplementation(() => {});

    const { state } = await runAction(paymentCancelRouteByOriginAction, {
      modules: { presenter },
      props: { origin: PAYMENT_FILING_FEE_ORIGIN.DASHBOARD },
    });

    expect(replaceStateSpy).toHaveBeenCalledWith({}, '', '/');
    expect(state.currentPage).toEqual('DashboardExternalUser');
    expect(pathDashboardStub).toHaveBeenCalled();
    expect(pathPetitionStub).not.toHaveBeenCalled();

    replaceStateSpy.mockRestore();
  });

  it('should take the petition path when origin is not dashboard', async () => {
    await runAction(paymentCancelRouteByOriginAction, {
      modules: { presenter },
      props: {},
    });

    expect(pathPetitionStub).toHaveBeenCalled();
    expect(pathDashboardStub).not.toHaveBeenCalled();
  });
});

import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { initFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/initFilingFeePaymentAction';
import { PAYMENT_FILLING_FEE_ORIGIN } from '@web-client/presenter/actions/FilingFee/paymentFillingFeeOrigin';

describe('initFilingFeePaymentAction', () => {
  let hrefSetter: jest.SpyInstance | undefined;
  let pathSuccessStub;
  let pathErrorStub;

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    const implSymbol = Reflect.ownKeys(window.location).find(
      k => typeof k === 'symbol',
    )!;

    hrefSetter = jest
      .spyOn(
        Object.getPrototypeOf((window.location as any)[implSymbol]),
        'href',
        'set',
      )
      .mockImplementation(() => {});

    pathSuccessStub = jest.fn();
    pathErrorStub = jest.fn();

    presenter.providers.path = {
      success: pathSuccessStub,
      error: pathErrorStub,
    };
  });

  it('should call the initPaymentInteractor and the success path when successful', async () => {
    applicationContext.getUseCases().initPaymentInteractor.mockResolvedValue({
      paymentRedirect: 'newUrl',
    });
    await runAction(initFilingFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '101-20' },
      },
    });

    expect(
      applicationContext.getUseCases().initPaymentInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      docketNumber: '101-20',
      filingFeeReturnOrigin: 'petition',
    });

    expect(hrefSetter).toHaveBeenCalledWith('newUrl');
    expect(pathSuccessStub).toHaveBeenCalled();
  });

  it('should pass dashboard filingFeeReturnOrigin when paymentFillingFeeOrigin is dashboard', async () => {
    applicationContext.getUseCases().initPaymentInteractor.mockResolvedValue({
      paymentRedirect: 'newUrl',
    });
    await runAction(initFilingFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '101-20' },
        paymentFillingFeeOrigin: PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD,
      },
    });

    expect(
      applicationContext.getUseCases().initPaymentInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      docketNumber: '101-20',
      filingFeeReturnOrigin: 'dashboard',
    });
  });

  it('should set alertError and call error path if initPaymentInteractor fails', async () => {
    applicationContext.getUseCases().initPaymentInteractor.mockRejectedValue();
    const { state } = await runAction(initFilingFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '101-20' },
      },
    });

    expect(state.alertError).toEqual({
      message: 'Error: payment cannot be started',
    });
    expect(pathErrorStub).toHaveBeenCalled();
  });

  it('should set dashboard-style alertError when paymentFillingFeeOrigin is dashboard', async () => {
    applicationContext.getUseCases().initPaymentInteractor.mockRejectedValue();
    const { state } = await runAction(initFilingFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '101-20' },
        paymentFillingFeeOrigin: PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD,
      },
    });

    expect(state.alertError).toEqual({
      strongTitle: true,
      title: 'Error: payment cannot be started.',
      message: 'Error: payment cannot be started for 101-20',
      scrollToErrorNotification: true,
    });
    expect(pathErrorStub).toHaveBeenCalled();
  });
});

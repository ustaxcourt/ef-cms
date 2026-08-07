import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { initFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/initFilingFeePaymentAction';

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
    ).toHaveBeenCalled();

    expect(hrefSetter).toHaveBeenCalledWith('newUrl');
    expect(pathSuccessStub).toHaveBeenCalled();
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
});

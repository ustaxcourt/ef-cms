import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { initFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/initFilingFeePaymentAction';

describe('initFilingFeePaymentAction', () => {
  let hrefSetter: jest.SpyInstance | undefined;

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext.getUseCases().initPaymentInteractor.mockResolvedValue({
      paymentRedirect: 'newUrl',
    });

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
  });

  it('should call the initPaymentInteractor', async () => {
    await runAction(initFilingFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumer: '101-20' },
      },
    });

    expect(
      applicationContext.getUseCases().initPaymentInteractor,
    ).toHaveBeenCalled();

    expect(hrefSetter).toHaveBeenCalledWith('newUrl');
  });
});

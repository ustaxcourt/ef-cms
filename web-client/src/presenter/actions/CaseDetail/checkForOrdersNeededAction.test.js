import { checkForOrdersNeededAction } from './checkForOrdersNeededAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('checkForOrdersNeededAction', () => {
  let yesStub;
  let noStub;

  beforeEach(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('should select yes when any one order (or notice) is needed for a specific case', async () => {
    await runAction(checkForOrdersNeededAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          noticeOfAttachments: false,
          orderForAmendedPetition: true,
          orderForAmendedPetitionAndFilingFee: false,
          orderForFilingFee: false,
          orderForOds: true,
          orderForRatification: false,
          orderToShowCause: true,
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('should call no path there are not any orders needed for a case', async () => {
    await runAction(checkForOrdersNeededAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          noticeOfAttachments: false,
          orderForAmendedPetition: false,
          orderForAmendedPetitionAndFilingFee: false,
          orderForFilingFee: false,
          orderForOds: false,
          orderForRatification: false,
          orderToShowCause: false,
        },
      },
    });

    expect(noStub).toHaveBeenCalled();
  });
});

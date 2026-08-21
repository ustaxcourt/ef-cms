import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { isNoticeOfWithdrawalAction } from './isNoticeOfWithdrawalAction';

describe('isNoticeOfWithdrawalAction', () => {
  beforeAll(() => {
    presenter.providers.path = {
      no: jest.fn(),
      yes: jest.fn(),
    };
  });

  it('calls path.yes if the eventCode is NOTW', () => {
    runAction(isNoticeOfWithdrawalAction, {
      modules: { presenter },
      state: {
        form: {
          eventCode: 'NOTW',
        },
      },
    });

    expect(presenter.providers.path.yes).toHaveBeenCalledTimes(1);
    expect(presenter.providers.path.no).toHaveBeenCalledTimes(0);
  });

  it('calls path.no if the eventCode is not NOTW', () => {
    runAction(isNoticeOfWithdrawalAction, {
      modules: { presenter },
      state: {
        form: {
          eventCode: 'ABC',
        },
      },
    });
    expect(presenter.providers.path.yes).toHaveBeenCalledTimes(0);
    expect(presenter.providers.path.no).toHaveBeenCalledTimes(1);
  });
});

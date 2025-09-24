import { getIsOnCaseDetailAction } from './getIsOnCaseDetailAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getIsOnCaseDetailAction', () => {
  let noMock: jest.Mock;
  let yesMock: jest.Mock;
  let presenter: any;

  beforeAll(() => {
    noMock = jest.fn();
    yesMock = jest.fn();

    presenter = {
      providers: {
        path: {
          no: noMock,
          yes: yesMock,
        },
      },
    };
  });

  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('returns the yes path if the current route matches the case detail view', async () => {
    window.history.pushState({}, '', '/case-detail/101-20');

    await runAction(getIsOnCaseDetailAction, {
      modules: { presenter },
      state: { caseDetail: { docketNumber: '101-20' } },
    });

    expect(yesMock).toHaveBeenCalled();
    expect(noMock).not.toHaveBeenCalled();
  });

  it('returns the no path if the current route does not match the case detail view', async () => {
    window.history.pushState({}, '', '/messages');

    await runAction(getIsOnCaseDetailAction, {
      modules: { presenter },
      state: { caseDetail: { docketNumber: '101-20' } },
    });

    expect(noMock).toHaveBeenCalled();
    expect(yesMock).not.toHaveBeenCalled();
  });

  it('returns the no path if caseDetail is not set on state', async () => {
    window.history.pushState({}, '', '/messages');

    await runAction(getIsOnCaseDetailAction, {
      modules: { presenter },
      state: {},
    });

    expect(noMock).toHaveBeenCalled();
    expect(yesMock).not.toHaveBeenCalled();
  });
});

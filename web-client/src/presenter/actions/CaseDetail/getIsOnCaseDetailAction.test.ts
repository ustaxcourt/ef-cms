import { getIsOnCaseDetailAction } from './getIsOnCaseDetailAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getIsOnCaseDetailAction', () => {
  let noMock;
  let yesMock;
  let presenter;

  beforeAll(() => {
    noMock = jest.fn();
    yesMock = jest.fn();

    delete window.location;
    window.location = {
      href: '',
      pathname: '',
    };

    presenter = {
      providers: {
        path: {
          no: noMock,
          yes: yesMock,
        },
      },
    };
  });

  it('returns the yes path if the current route matches the case detail view', async () => {
    window.location.pathname = '/case-detail/101-20';

    await runAction(getIsOnCaseDetailAction, {
      modules: { presenter },
      state: { caseDetail: { docketNumber: '101-20' } },
    });

    expect(yesMock).toHaveBeenCalled();
  });

  it('returns the no path if the current route does not match the case detail view', async () => {
    window.location.pathname = '/messages';

    await runAction(getIsOnCaseDetailAction, {
      modules: { presenter },
      state: { caseDetail: { docketNumber: '101-20' } },
    });

    expect(noMock).toHaveBeenCalled();
  });

  it('returns the no path if caseDetail is not set on state', async () => {
    window.location.pathname = '/messages';

    await runAction(getIsOnCaseDetailAction, {
      modules: { presenter },
      state: {},
    });

    expect(noMock).toHaveBeenCalled();
  });
});

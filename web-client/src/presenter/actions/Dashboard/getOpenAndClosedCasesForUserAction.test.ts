import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getOpenAndClosedCasesForUserAction } from './getOpenAndClosedCasesForUserAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getOpenAndClosedCasesForUserAction', () => {
  const mockOpenCases = [
    {
      createdAt: '2019-07-20T20:20:15.680Z',
      docketNumber: '123-45',
    },
    {
      createdAt: '2019-07-19T20:20:15.680Z',
      docketNumber: '678-90',
    },
    {
      createdAt: '2019-07-21T20:20:15.680Z',
      docketNumber: '000-00',
    },
  ];

  const mockClosedCases = [
    {
      createdAt: '2019-07-20T20:20:15.680Z',
      docketNumber: '123-45',
    },
    {
      createdAt: '2019-07-19T20:20:15.680Z',
      docketNumber: '678-90',
    },
    {
      createdAt: '2019-07-21T20:20:15.680Z',
      docketNumber: '000-00',
    },
  ];

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext.getUseCases().getCasesForUserInteractor.mockReturnValue({
      closedCaseList: mockClosedCases,
      openCaseList: mockOpenCases,
    });
  });

  it('should return open and closed cases for the current user', async () => {
    const { output } = await runAction(getOpenAndClosedCasesForUserAction, {
      modules: { presenter },
      state: {
        currentViewMetadata: {
          caseList: {
            tab: 'Open',
          },
        },
      },
    });

    expect(output.openCaseList).toBeDefined();
    expect(output.closedCaseList).toBeDefined();
  });
});

import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getOpenAndClosedCasesByUserAction } from './getOpenAndClosedCasesByUserAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getOpenAndClosedCasesByUserAction', () => {
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

    // applicationContext.getCurrentUser.mockReturnValue({
    //   userId: '15adf875-8c3c-4e94-91e9-a4c1bff51291',
    // });
  });

  it('should return open and closed cases for the current user', async () => {
    const { output } = await runAction(getOpenAndClosedCasesByUserAction, {
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

  it('should sort the list of open cases by when they were created, in descending order', async () => {
    const { output } = await runAction(getOpenAndClosedCasesByUserAction, {
      modules: { presenter },
      state: {
        currentViewMetadata: {
          caseList: {
            tab: 'Open',
          },
        },
      },
    });

    expect(output.openCaseList).toBe([
      { createdAt: '2019-07-21T20:20:15.680Z', docketNumber: '000-00' },
      { createdAt: '2019-07-20T20:20:15.680Z', docketNumber: '123-45' },
      { createdAt: '2019-07-19T20:20:15.680Z', docketNumber: '678-90' },
    ]);
  });
});

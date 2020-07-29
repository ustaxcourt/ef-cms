import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getOpenAndClosedCasesByUserAction } from './getOpenAndClosedCasesByUserAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getOpenAndClosedCasesByUserAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getOpenConsolidatedCasesInteractor.mockReturnValue([
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
      ]);
    applicationContext.getUseCases().getClosedCasesInteractor.mockReturnValue([
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
    ]);
    applicationContext.getCurrentUser.mockReturnValue({
      userId: '15adf875-8c3c-4e94-91e9-a4c1bff51291',
    });

    presenter.providers.applicationContext = applicationContext;
  });

  it('gets the consolidated cases by userId', async () => {
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

    expect(output).toMatchObject({
      closedCaseList: [
        { createdAt: '2019-07-21T20:20:15.680Z', docketNumber: '000-00' },
        { createdAt: '2019-07-20T20:20:15.680Z', docketNumber: '123-45' },
        { createdAt: '2019-07-19T20:20:15.680Z', docketNumber: '678-90' },
      ],
      openCaseList: [
        { createdAt: '2019-07-21T20:20:15.680Z', docketNumber: '000-00' },
        { createdAt: '2019-07-20T20:20:15.680Z', docketNumber: '123-45' },
        { createdAt: '2019-07-19T20:20:15.680Z', docketNumber: '678-90' },
      ],
    });
  });
});

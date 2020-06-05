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
          caseId: 'case-id-234',
          createdAt: '2019-07-20T20:20:15.680Z',
        },
        {
          caseId: 'case-id-123',
          createdAt: '2019-07-19T20:20:15.680Z',
        },
        {
          caseId: 'case-id-345',
          createdAt: '2019-07-21T20:20:15.680Z',
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
      closedCaseList: [],
      openCaseList: [
        { caseId: 'case-id-345', createdAt: '2019-07-21T20:20:15.680Z' },
        { caseId: 'case-id-234', createdAt: '2019-07-20T20:20:15.680Z' },
        { caseId: 'case-id-123', createdAt: '2019-07-19T20:20:15.680Z' },
      ],
    });
  });

  it('should retrieve all open cases when props.currentViewMetadata.caseList.tab is not Closed', async () => {
    await runAction(getOpenAndClosedCasesByUserAction, {
      modules: { presenter },
      state: {
        currentViewMetadata: {
          caseList: {
            tab: 'Open',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().getOpenConsolidatedCasesInteractor,
    ).toHaveBeenCalled();
  });

  it('should retrieve all closed cases when props.status is Closed', async () => {
    await runAction(getOpenAndClosedCasesByUserAction, {
      modules: { presenter },
      state: {
        currentViewMetadata: {
          caseList: {
            tab: 'Closed',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().getClosedCasesInteractor,
    ).toHaveBeenCalled();
  });
});

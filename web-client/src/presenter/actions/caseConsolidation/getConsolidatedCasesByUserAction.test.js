import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getConsolidatedCasesByUserAction } from './getConsolidatedCasesByUserAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getConsolidatedCasesByUserAction', () => {
  beforeAll(() => {
    applicationContext.getUseCases().getOpenCasesInteractor.mockReturnValue([
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
    const { output } = await runAction(getConsolidatedCasesByUserAction, {
      modules: { presenter },
      state: {
        currentViewMetadata: {
          caseList: {
            tab: 'New',
          },
        },
      },
    });

    expect(output).toMatchObject({
      caseList: [
        { caseId: 'case-id-345', createdAt: '2019-07-21T20:20:15.680Z' },
        { caseId: 'case-id-234', createdAt: '2019-07-20T20:20:15.680Z' },
        { caseId: 'case-id-123', createdAt: '2019-07-19T20:20:15.680Z' },
      ],
    });
  });

  it('should retrieve all open cases when props.status is not Closed', async () => {
    await runAction(getConsolidatedCasesByUserAction, {
      modules: { presenter },
      state: {
        currentViewMetadata: {
          caseList: {
            tab: 'New',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().getOpenCasesInteractor,
    ).toHaveBeenCalled();
  });

  it('should retrieve all closed cases when props.status is Closed', async () => {
    await runAction(getConsolidatedCasesByUserAction, {
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
      applicationContext.getUseCases().getClosedConsolidatedCasesInteractor,
    ).toHaveBeenCalled();
  });
});

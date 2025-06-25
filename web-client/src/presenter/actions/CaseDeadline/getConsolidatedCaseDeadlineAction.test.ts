import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getConsolidatedCaseDeadlineAction } from './getConsolidatedCaseDeadlineAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { getUniqueId } from '@shared/sharedAppContext';

describe('getConsolidatedCaseDeadlineAction', () => {
  const TEST_CASE_DEADLINE_ID = getUniqueId();
  const TEST_INTERACTOR_RESULTS = 'TEST_INTERACTOR_RESULTS';

  presenter.providers.applicationContext = applicationContext;

  applicationContext
    .getUseCases()
    .getConsolidatedCaseDeadlinesInteractor.mockResolvedValue(
      TEST_INTERACTOR_RESULTS,
    );

  it('should call the interactor with case deadline and return thee results', async () => {
    const { output } = await runAction(getConsolidatedCaseDeadlineAction, {
      modules: {
        presenter,
      },
      props: {
        caseDeadlineId: TEST_CASE_DEADLINE_ID,
      },
    });

    const interactorCalls = (
      applicationContext.getUseCases()
        .getConsolidatedCaseDeadlinesInteractor as jest.Mock
    ).mock.calls;

    expect(interactorCalls.length).toEqual(1);
    expect(interactorCalls[0][1]).toEqual({
      consolidatedCaseDeadlineId: TEST_CASE_DEADLINE_ID,
    });
    expect(output).toEqual({
      consolidatedCaseDeadlines: TEST_INTERACTOR_RESULTS,
    });
  });
});

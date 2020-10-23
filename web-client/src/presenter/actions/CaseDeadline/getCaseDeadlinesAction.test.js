import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseDeadlinesAction } from './getCaseDeadlinesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('getCaseDeadlinesAction', () => {
  it('gets all case deadlines', async () => {
    applicationContext
      .getUseCases()
      .getCaseDeadlinesInteractor.mockReturnValue('hello world');

    const START_DATE = '2020-01-01T05:00:00.000Z';
    const END_DATE = '2020-02-01T05:00:00.000Z';

    const result = await runAction(getCaseDeadlinesAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          filterEndDate: END_DATE,
          filterStartDate: START_DATE,
        },
      },
    });
    expect(
      applicationContext.getUseCases().getCaseDeadlinesInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      endDate: END_DATE,
      startDate: START_DATE,
    });
    expect(result.output.caseDeadlines).toEqual('hello world');
  });
});

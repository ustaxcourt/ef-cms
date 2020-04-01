import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getAllCaseDeadlinesAction } from './getAllCaseDeadlinesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('getAllCaseDeadlinesAction', () => {
  it('gets all case deadlines', async () => {
    applicationContext
      .getUseCases()
      .getAllCaseDeadlinesInteractor.mockReturnValue('hello world');

    const result = await runAction(getAllCaseDeadlinesAction, {
      modules: {
        presenter,
      },
    });
    expect(result.output.caseDeadlines).toEqual('hello world');
  });
});

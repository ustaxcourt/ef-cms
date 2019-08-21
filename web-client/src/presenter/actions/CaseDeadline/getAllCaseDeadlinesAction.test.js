import { getAllCaseDeadlinesAction } from './getAllCaseDeadlinesAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    getAllCaseDeadlinesInteractor: () => 'hello world',
  }),
};

describe('getAllCaseDeadlinesAction', () => {
  it('gets all case deadlines', async () => {
    const result = await runAction(getAllCaseDeadlinesAction, {
      modules: {
        presenter,
      },
    });
    expect(result.output.caseDeadlines).toEqual('hello world');
  });
});

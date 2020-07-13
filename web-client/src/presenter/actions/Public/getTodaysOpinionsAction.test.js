import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTodaysOpinionsAction } from './getTodaysOpinionsAction';
import { presenter } from '../../presenter-public';
import { runAction } from 'cerebral/test';

describe('getTodaysOpinionsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('gets the list of todays opinion', async () => {
    const mockTodaysOpinions = [
      {
        documentId: '1234',
        documentTitle: 'An opinion',
      },
      {
        documentId: '5678',
        documentTitle: 'Another opinion',
      },
    ];
    applicationContext
      .getUseCases()
      .getTodaysOpinionsInteractor.mockReturnValue(mockTodaysOpinions);

    const result = await runAction(getTodaysOpinionsAction, {
      modules: {
        presenter,
      },
    });

    expect(result.output.todaysOpinions).toMatchObject(mockTodaysOpinions);
  });
});

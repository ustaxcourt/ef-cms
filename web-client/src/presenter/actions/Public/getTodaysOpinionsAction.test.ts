import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getTodaysOpinionsAction } from './getTodaysOpinionsAction';
import { presenter } from '../../presenter-public';
import { runPublicAction } from '@web-client/presenter/test.cerebral';

describe('getTodaysOpinionsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('gets the list of todays opinion', async () => {
    const mockTodaysOpinions = [
      {
        docketEntryId: '1234',
        documentTitle: 'An opinion',
      },
      {
        docketEntryId: '5678',
        documentTitle: 'Another opinion',
      },
    ];
    applicationContext
      .getUseCases()
      .getTodaysOpinionsInteractor.mockReturnValue(mockTodaysOpinions);

    const result = await runPublicAction(getTodaysOpinionsAction, {
      modules: {
        presenter,
      },
    });

    expect(result.output.todaysOpinions).toMatchObject(mockTodaysOpinions);
  });
});

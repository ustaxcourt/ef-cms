import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPublicJudgesAction } from './getPublicJudgesAction';
import { presenter } from '../../presenter-public';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPublicJudgesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('gets the list of judges', async () => {
    const mockJudges = [
      {
        name: 'Test Judge',
        role: ROLES.judge,
      },
      {
        name: 'Test Judge2',
        role: ROLES.judge,
      },
    ];
    applicationContext
      .getUseCases()
      .getPublicJudgesInteractor.mockReturnValue(mockJudges);

    const result = await runAction(getPublicJudgesAction, {
      modules: {
        presenter,
      },
    });

    expect(result.output.users).toMatchObject(mockJudges);
  });
});

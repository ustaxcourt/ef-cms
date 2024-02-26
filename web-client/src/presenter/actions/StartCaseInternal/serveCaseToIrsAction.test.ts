import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { serveCaseToIrsAction } from './serveCaseToIrsAction';

describe('serveCaseToIrsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should serve an electronic case', async () => {
    await runAction(serveCaseToIrsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-19',
        },
      },
    });

    expect(
      applicationContext.getUseCases().serveCaseToIrsInteractor,
    ).toHaveBeenCalled();
  });
});

import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { serveCaseToIrsAction } from './serveCaseToIrsAction';

describe('serveCaseToIrsAction', () => {
  const pathErrorStub = jest.fn();
  const pathSuccessStub = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: pathErrorStub,
      success: pathSuccessStub,
    };
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
    expect(pathSuccessStub).toHaveBeenCalled();
  });
});

import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { serveCaseToIrsAction } from './serveCaseToIrsAction';

describe('serveCaseToIrsAction', () => {
  let serveCaseToIrsInteractorStub;
  let pathPaperStub;
  let pathElectronicStub;
  let createObjectURLStub;

  beforeEach(() => {
    global.window = global;
    global.Blob = () => {};

    serveCaseToIrsInteractorStub = jest.fn().mockReturnValue(null);
    pathPaperStub = jest.fn();
    pathElectronicStub = jest.fn();
    createObjectURLStub = jest.fn();

    presenter.providers.router = {
      createObjectURL: () => {
        createObjectURLStub();
        return '123456-abcdef';
      },
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        serveCaseToIrsInteractor: serveCaseToIrsInteractorStub,
      }),
    };

    presenter.providers.path = {
      electronic: pathElectronicStub,
      paper: pathPaperStub,
    };
  });

  it('should serve an electronic case', async () => {
    await runAction(serveCaseToIrsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: 'abc-123',
        },
      },
    });

    expect(serveCaseToIrsInteractorStub).toHaveBeenCalled();
    expect(pathElectronicStub).toHaveBeenCalled();
  });

  it('serves a paper case and return the paper path', async () => {
    serveCaseToIrsInteractorStub.mockReturnValue(['pdf-bytes']);

    await runAction(serveCaseToIrsAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          trialSessionId: 'abc-123',
        },
      },
    });

    expect(serveCaseToIrsInteractorStub).toHaveBeenCalled();
    expect(pathPaperStub).toHaveBeenCalled();
  });
});

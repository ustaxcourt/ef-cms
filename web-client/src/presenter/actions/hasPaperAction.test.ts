import { hasPaperAction } from './hasPaperAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('hasPaperAction', () => {
  let pathElectronicStub;
  let pathPaperStub;

  beforeEach(() => {
    pathElectronicStub = jest.fn();
    pathPaperStub = jest.fn();

    presenter.providers.path = {
      electronic: pathElectronicStub,
      paper: pathPaperStub,
    };
  });

  it('should call path.pathPaperStub when props.hasPaper is true', async () => {
    await runAction(hasPaperAction, {
      modules: {
        presenter,
      },
      props: { hasPaper: true },
    });

    expect(pathPaperStub).toHaveBeenCalled();
  });

  it('should call path.pathElectronicStub when props.hasPaper is false', async () => {
    await runAction(hasPaperAction, {
      modules: {
        presenter,
      },
      state: { hasPaper: false },
    });

    expect(pathElectronicStub).toHaveBeenCalled();
  });
});

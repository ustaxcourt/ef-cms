import { chooseNextStepAction } from './chooseNextStepAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('chooseNextStepAction', () => {
  let isPaperStub;
  let isElectronicStub;

  beforeAll(() => {
    isPaperStub = jest.fn();
    isElectronicStub = jest.fn();

    presenter.providers.path = {
      isElectronic: isElectronicStub,
      isPaper: isPaperStub,
    };
  });

  it('chooses the next step as paper if the case is paper', async () => {
    await runAction(chooseNextStepAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          isPaper: true,
        },
      },
    });

    expect(isPaperStub).toHaveBeenCalled();
  });

  it('chooses the next step as electronic if the case is electronic (not paper)', async () => {
    await runAction(chooseNextStepAction, {
      modules: {
        presenter,
      },
    });

    expect(isElectronicStub).toHaveBeenCalled();
  });
});

import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { chooseNextStepAction } from './chooseNextStepAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

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
          contactPrimary: {
            serviceIndicator: 'Paper',
          },
          irsPractitioners: [],
          isPaper: true,
          privatePractitioners: [],
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
      state: {
        caseDetail: {
          contactPrimary: {
            serviceIndicator: 'Electronic',
          },
          irsPractitioners: [],
          privatePractitioners: [],
        },
      },
    });

    expect(isElectronicStub).toHaveBeenCalled();
  });
});

import { CONTACT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { chooseNextStepAction } from './chooseNextStepAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('chooseNextStepAction', () => {
  presenter.providers.applicationContext = applicationContext;

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
          irsPractitioners: [],
          isPaper: true,
          petitioners: [
            {
              contactType: CONTACT_TYPES.primary,
              serviceIndicator: 'Paper',
            },
          ],
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
          irsPractitioners: [],
          petitioners: [
            {
              contactType: CONTACT_TYPES.primary,
              serviceIndicator: 'Electronic',
            },
          ],
          privatePractitioners: [],
        },
      },
    });

    expect(isElectronicStub).toHaveBeenCalled();
  });
});

import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { canConsolidateAction } from './canConsolidateAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('canConsolidateAction', () => {
  let yesStub;
  let noStub;
  let consolidationStub;

  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();
    consolidationStub = jest.fn();

    presenter.providers.path = { error: noStub, success: yesStub };
    const currentEntityConstructors = applicationContextForClient.getEntityConstructors();

    presenter.providers.applicationContext = {
      ...applicationContextForClient,
      getEntityConstructors: () => ({
        ...currentEntityConstructors,
        Case: () => {
          return {
            getConsolidationStatus: consolidationStub,
          };
        },
      }),
    };
  });

  it('should return false when no case is confirmed', async () => {
    await runAction(canConsolidateAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(noStub).toHaveBeenCalled();
  });

  it('should return false when cases are not consolidatable', async () => {
    consolidationStub.mockReturnValue({
      canConsolidate: false,
      reason: 'Something',
    });

    await runAction(canConsolidateAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {},
        caseToConsolidate: {},
        confirmSelection: true,
      },
    });

    expect(noStub).toHaveBeenCalled();
  });

  it('should return yes when case is consolidatable', async () => {
    consolidationStub.mockReturnValue({
      canConsolidate: true,
      reason: '',
    });
    await runAction(canConsolidateAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {},
        caseToConsolidate: {},
        confirmSelection: true,
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });
});

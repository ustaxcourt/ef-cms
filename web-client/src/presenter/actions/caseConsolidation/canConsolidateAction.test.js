import { canConsolidateAction } from './canConsolidateAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('canConsolidateAction', () => {
  let yesStub;
  let noStub;
  let consolidationStub;

  beforeEach(() => {
    yesStub = jest.fn();
    noStub = jest.fn();
    consolidationStub = jest.fn();

    presenter.providers.path = { error: noStub, success: yesStub };

    presenter.providers.applicationContext = {
      getEntityConstructors: () => ({
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
      props: { confirmSelection: true },
    });

    expect(noStub).toHaveBeenCalled();
  });

  it('should return false when no case is confirmed', async () => {
    consolidationStub.mockReturnValue({
      canConsolidate: true,
      reason: '',
    });
    await runAction(canConsolidateAction, {
      modules: {
        presenter,
      },
      props: { confirmSelection: true },
    });

    expect(yesStub).toHaveBeenCalled();
  });
});

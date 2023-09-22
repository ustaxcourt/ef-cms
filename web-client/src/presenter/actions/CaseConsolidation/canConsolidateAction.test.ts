import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { canConsolidateAction } from './canConsolidateAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('canConsolidateAction', () => {
  let yesStub;
  let noStub;

  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = { error: noStub, success: yesStub };

    presenter.providers.applicationContext = applicationContext;
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
    applicationContext.getUseCases().canConsolidateInteractor.mockReturnValue({
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
    applicationContext.getUseCases().canConsolidateInteractor.mockReturnValue({
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

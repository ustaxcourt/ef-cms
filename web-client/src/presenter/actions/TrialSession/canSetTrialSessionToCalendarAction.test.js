import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { canSetTrialSessionToCalendarAction } from './canSetTrialSessionToCalendarAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

const VALID_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
};

describe('canSetTrialSessionToCalendarAction', () => {
  let canSetTrialSessionAsCalendaredInteractorStub;
  let pathNoStub;
  let pathYesStub;

  beforeAll(() => {
    canSetTrialSessionAsCalendaredInteractorStub = jest.fn();
    pathNoStub = jest.fn();
    pathYesStub = jest.fn();

    presenter.providers.applicationContext = {
      getEntityConstructors: () => ({
        TrialSession,
      }),
      getUniqueId: () => 'easy-as-abc-123',
      getUseCases: () => ({
        canSetTrialSessionAsCalendaredInteractor: canSetTrialSessionAsCalendaredInteractorStub,
      }),
    };

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should return the no path when the trial session address is not valid and a judge has not been selected', async () => {
    canSetTrialSessionAsCalendaredInteractorStub.mockReturnValue(false);

    await runAction(canSetTrialSessionToCalendarAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          postalCode: '12345',
          state: 'TN',
        },
      },
    });

    expect(canSetTrialSessionAsCalendaredInteractorStub).toHaveBeenCalled();
    expect(pathNoStub).toHaveBeenCalledWith({
      alertWarning: {
        message: 'Provide an address and a judge to set this trial session.',
      },
    });
  });

  it('should return the no path when the trial session address is not valid', async () => {
    canSetTrialSessionAsCalendaredInteractorStub.mockReturnValue(false);

    await runAction(canSetTrialSessionToCalendarAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          judge: { name: 'Judge Armen' },
          postalCode: '12345',
          state: 'TN',
        },
      },
    });

    expect(canSetTrialSessionAsCalendaredInteractorStub).toHaveBeenCalled();
    expect(pathNoStub).toHaveBeenCalledWith({
      alertWarning: {
        message: 'Provide an address to set this trial session.',
      },
    });
  });

  it('should return the no path when a judge has not been selected', async () => {
    canSetTrialSessionAsCalendaredInteractorStub.mockReturnValue(false);

    await runAction(canSetTrialSessionToCalendarAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: {},
          postalCode: '12345',
          state: 'TN',
        },
      },
    });

    expect(canSetTrialSessionAsCalendaredInteractorStub).toHaveBeenCalled();
    expect(pathNoStub).toHaveBeenCalledWith({
      alertWarning: {
        message:
          'Provide a judge to set this trial session.',
      },
    });
  });

  it('should return the yes path if all criteria for calendaring a trial session have been met', async () => {
    canSetTrialSessionAsCalendaredInteractorStub.mockReturnValue(true);

    await runAction(canSetTrialSessionToCalendarAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {},
      },
    });

    expect(canSetTrialSessionAsCalendaredInteractorStub).toHaveBeenCalled();
    expect(pathYesStub).toHaveBeenCalled();
  });
});

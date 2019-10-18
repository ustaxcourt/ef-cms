import { getBlockedCasesByTrialLocationAction } from './getBlockedCasesByTrialLocationAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('getBlockedCasesByTrialLocationAction', () => {
  const getBlockedCasesInteractorSpy = jest.fn(async () => {
    return [{ blocked: true, caseId: '1', preferredTrialCity: 'Boise, Idaho' }];
  });

  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getBlockedCasesInteractor: getBlockedCasesInteractorSpy,
      }),
    };
  });

  it('should not call getBlockedCasesInteractorSpy if the trialLocation is not on the form', async () => {
    await runAction(getBlockedCasesByTrialLocationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(getBlockedCasesInteractorSpy).not.toHaveBeenCalled();
  });

  it('should call getBlockedCasesInteractorSpy with the passed in trialLocation and return the result from the use case', async () => {
    const result = await runAction(getBlockedCasesByTrialLocationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          trialLocation: 'Boise, Idaho',
        },
      },
    });

    expect(getBlockedCasesInteractorSpy).toHaveBeenCalled();
    expect(getBlockedCasesInteractorSpy.mock.calls[0][0].trialLocation).toEqual(
      'Boise, Idaho',
    );
    expect(result.output).toEqual({
      blockedCases: [
        { blocked: true, caseId: '1', preferredTrialCity: 'Boise, Idaho' },
      ],
    });
  });
});

import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getBlockedCasesByTrialLocationAction } from './getBlockedCasesByTrialLocationAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getBlockedCasesByTrialLocationAction', () => {
  presenter.providers.applicationContext = applicationContext;

  applicationContext
    .getUseCases()
    .getBlockedCasesInteractor.mockImplementation(() => {
      return [
        {
          blocked: true,
          docketNumber: '123-45',
          preferredTrialCity: 'Boise, Idaho',
        },
      ];
    });

  it('should not call getBlockedCasesInteractor if the trialLocation is not on the form', async () => {
    await runAction(getBlockedCasesByTrialLocationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(
      applicationContext.getUseCases().getBlockedCasesInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should call getBlockedCasesInteractor with the passed in trialLocation and return the result from the use case', async () => {
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

    expect(
      applicationContext.getUseCases().getBlockedCasesInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getBlockedCasesInteractor.mock
        .calls[0][1].trialLocation,
    ).toEqual('Boise, Idaho');
    expect(result.output).toEqual({
      blockedCases: [
        {
          blocked: true,
          docketNumber: '123-45',
          preferredTrialCity: 'Boise, Idaho',
        },
      ],
    });
  });
});

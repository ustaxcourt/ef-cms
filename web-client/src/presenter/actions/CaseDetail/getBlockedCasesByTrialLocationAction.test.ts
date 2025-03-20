import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getBlockedCasesByTrialLocationAction } from './getBlockedCasesByTrialLocationAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { DEFAULT_FILTERED_BLOCKED_CASE_STATUSES } from '@shared/business/entities/EntityConstants';

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

  it('should not call getBlockedCasesInteractor if the trialLocation is not in props', async () => {
    await runAction(getBlockedCasesByTrialLocationAction, {
      modules: {
        presenter,
      },
      props: { blockedCaseFilter: DEFAULT_FILTERED_BLOCKED_CASE_STATUSES },
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
      props: {
        trialLocation: 'Boise, Idaho',
        blockedCaseFilter: DEFAULT_FILTERED_BLOCKED_CASE_STATUSES,
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

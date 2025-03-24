import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getEligibleCasesForLocationAction } from './getEligibleCasesForLocationAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getEligibleCasesForLocationAction', () => {
  presenter.providers.applicationContext = applicationContext;
  applicationContext
    .getUseCases()
    .getEligibleCasesForCityInteractor.mockImplementation(() => {
      return [
        { caseId: '1', caseTitle: 'Case One', trialCity: 'Boise, Idaho' },
        { caseId: '2', caseTitle: 'Case Two', trialCity: 'Boise, Idaho' },
      ];
    });

  it('should call getEligibleCasesForCityInteractor with the passed in trialLocation and return the result from the use case', async () => {
    const result = await runAction(getEligibleCasesForLocationAction, {
      modules: {
        presenter,
      },
      props: {
        trialLocation: 'Boise, Idaho',
      },
    });
    expect(
      applicationContext.getUseCases().getEligibleCasesForCityInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getEligibleCasesForCityInteractor.mock
        .calls[0][1].trialCity,
    ).toEqual('Boise, Idaho');
    expect(result.output).toEqual({
      eligibleCases: [
        { caseId: '1', caseTitle: 'Case One', trialCity: 'Boise, Idaho' },
        { caseId: '2', caseTitle: 'Case Two', trialCity: 'Boise, Idaho' },
      ],
    });
  });
});

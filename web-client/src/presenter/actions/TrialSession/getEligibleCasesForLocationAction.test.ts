jest.mock('@shared/proxies/trialSessions/getEligibleCasesForCityProxy');
import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { getEligibleCasesForLocationAction } from './getEligibleCasesForLocationAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { getEligibleCasesForCityInteractor as getEligibleCasesForCityInteractorMock } from '@shared/proxies/trialSessions/getEligibleCasesForCityProxy';

describe('getEligibleCasesForLocationAction', () => {
  const getEligibleCasesForCityInteractor = jest.mocked(
    getEligibleCasesForCityInteractorMock,
  );
  presenter.providers.applicationContext = applicationContextForClient;
  getEligibleCasesForCityInteractor.mockImplementation(() => {
    return Promise.resolve([
      { caseId: '1', caseTitle: 'Case One', trialCity: 'Boise, Idaho' },
      { caseId: '2', caseTitle: 'Case Two', trialCity: 'Boise, Idaho' },
    ]);
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
    expect(getEligibleCasesForCityInteractor).toHaveBeenCalled();
    expect(
      getEligibleCasesForCityInteractor.mock.calls[0][1].trialCity,
    ).toEqual('Boise, Idaho');
    expect(result.output).toEqual({
      eligibleCases: [
        { caseId: '1', caseTitle: 'Case One', trialCity: 'Boise, Idaho' },
        { caseId: '2', caseTitle: 'Case Two', trialCity: 'Boise, Idaho' },
      ],
    });
  });
});

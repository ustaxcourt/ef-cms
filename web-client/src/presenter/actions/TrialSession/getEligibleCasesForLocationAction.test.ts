jest.mock('@web-client/proxies/trialSessions/getEligibleCasesForCityProxy');
import { MOCK_ELIGIBLE_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getEligibleCasesForLocationAction } from './getEligibleCasesForLocationAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { getEligibleCasesForCityInteractor as getEligibleCasesForCityInteractorMock } from '@web-client/proxies/trialSessions/getEligibleCasesForCityProxy';

describe('getEligibleCasesForLocationAction', () => {
  const getEligibleCasesForCityInteractor = jest.mocked(
    getEligibleCasesForCityInteractorMock,
  );
  presenter.providers.applicationContext = applicationContext;
  const eligibleCaseOne = {
    ...MOCK_ELIGIBLE_CASE,
    docketNumber: '101-21',
    docketNumberWithSuffix: '101-21',
  };
  const eligibleCaseTwo = {
    ...MOCK_ELIGIBLE_CASE,
    docketNumber: '102-21',
    docketNumberWithSuffix: '102-21',
  };
  getEligibleCasesForCityInteractor.mockResolvedValue([
    eligibleCaseOne,
    eligibleCaseTwo,
  ]);

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
      eligibleCases: [eligibleCaseOne, eligibleCaseTwo],
    });
  });
});

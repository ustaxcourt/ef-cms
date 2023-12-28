import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getIrsPractitionerUsersAction } from '@web-client/presenter/actions/TrialSession/getIrsPractitionerUsersAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContext;

describe('getIrsPractitionerUsersAction', () => {
  const EXPECTED_RESULTS = [{ role: 'irsPractitioner' }];

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getAllUsersByRoleInteractor.mockResolvedValue(EXPECTED_RESULTS);
  });

  it('call the use case to get the eligible cases', async () => {
    const results = await runAction(getIrsPractitionerUsersAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessionId: '123',
      },
    });

    expect(results.output).toEqual({ irsPractitioners: EXPECTED_RESULTS });

    const { calls } =
      applicationContext.getUseCases().getAllUsersByRoleInteractor.mock;

    expect(calls.length).toEqual(1);
    expect(calls[0][1]).toEqual(['irsPractitioner']);
  });
});

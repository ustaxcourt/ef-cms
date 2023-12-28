import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setIrsPractitionerUsersAction } from '@web-client/presenter/actions/TrialSession/setIrsPractitionerUsersAction';

describe('setIrsPractitionerUsersAction', () => {
  const irsPractitioners = [{ role: 'irsPractitioner' }];

  it('call the use case to get the eligible cases', async () => {
    const results = await runAction(setIrsPractitionerUsersAction, {
      modules: {
        presenter,
      },
      props: {
        irsPractitioners,
      },
      state: {},
    });

    expect(results.state.irsPractitioners).toEqual(irsPractitioners);
  });
});

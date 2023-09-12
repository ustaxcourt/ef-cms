import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { getPublicCaseAction } from './getPublicCaseAction';
import { presenter } from '../../presenter-public';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPublicCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('gets the public case information', async () => {
    await runAction(getPublicCaseAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-20',
      },
    });

    expect(
      applicationContextForClient.getUseCases().getCaseInteractor,
    ).toHaveBeenCalled();
  });
});

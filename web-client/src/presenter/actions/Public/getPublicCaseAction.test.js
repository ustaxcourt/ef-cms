import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPublicCaseAction } from './getPublicCaseAction';
import { presenter } from '../../presenter-public';
import { runAction } from 'cerebral/test';

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
        caseId: '02581f2b-5e55-489f-afae-09ce29553078',
      },
    });

    expect(
      applicationContextForClient.getUseCases().getCaseInteractor,
    ).toBeCalled();
  });
});

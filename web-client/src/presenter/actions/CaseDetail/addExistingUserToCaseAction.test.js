import { addExistingUserToCaseAction } from './addExistingUserToCaseAction';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('addExistingUserToCaseAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call the addExistingUserToCaseInteractor with the state.caseDetail.docketNumber and state.form.contactPrimary email and name', async () => {
    const DOCKET_NUMBER = '123-45';
    const EMAIL = 'test@example.com';
    const NAME = 'Bob Ross';

    await runAction(addExistingUserToCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: DOCKET_NUMBER,
        },
        form: {
          contactPrimary: {
            email: EMAIL,
            name: NAME,
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().addExistingUserToCaseInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: DOCKET_NUMBER,
      email: EMAIL,
      name: NAME,
    });
  });
});

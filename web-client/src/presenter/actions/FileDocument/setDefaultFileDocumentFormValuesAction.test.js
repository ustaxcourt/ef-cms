import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultFileDocumentFormValuesAction } from './setDefaultFileDocumentFormValuesAction';

describe('setDefaultFileDocumentFormValuesAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('sets form.partyPrimary to true if the user is a petitioner', async () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });
    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        form: {
          partyPrimary: false,
        },
      },
    });

    expect(result.state.form.partyPrimary).toEqual(true);
  });
  it('does not set form.partyPrimary if the user is not a petitioner', async () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.privatePractitioner,
    });
    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        form: {
          partyPrimary: false,
        },
      },
    });

    expect(result.state.form.partyPrimary).toEqual(false);
  });
});

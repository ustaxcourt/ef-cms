import { User } from '../../../../../shared/src/business/entities/User';
import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setDefaultFileDocumentFormValuesAction } from './setDefaultFileDocumentFormValuesAction';

presenter.providers.applicationContext = applicationContext;

describe('setDefaultFileDocumentFormValuesAction', () => {
  it('sets form.partyPrimary to true if the user is a petitioner', async () => {
    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        form: {
          partyPrimary: false,
        },
        user: {
          role: User.ROLES.petitioner,
        },
      },
    });

    expect(result.state.form.partyPrimary).toEqual(true);
  });
  it('does not set form.partyPrimary if the user is not a petitioner', async () => {
    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        form: {
          partyPrimary: false,
        },
        user: {
          role: User.ROLES.practitioner,
        },
      },
    });

    expect(result.state.form.partyPrimary).toEqual(false);
  });
});

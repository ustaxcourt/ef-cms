import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { hasUpdatedPetitionerEmailAction } from './hasUpdatedPetitionerEmailAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('hasUpdatedPetitionerEmailAction', () => {
  let pathNoStub = jest.fn();
  let pathYesStub = jest.fn();
  const INITIAL_EMAIL = 'test@example.com';
  const UPDATED_EMAIL = 'updated@example.com';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('returns the yes path when caseDetail.petitioners.email is different than form.contact.email', async () => {
    runAction(hasUpdatedPetitionerEmailAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          petitioners: [
            { contactType: CONTACT_TYPES.primary, email: INITIAL_EMAIL },
          ],
        },
        form: { contact: { email: UPDATED_EMAIL } },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('returns the no path when caseDetail.petitioners.email is the same as form.contact.email', async () => {
    runAction(hasUpdatedPetitionerEmailAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          petitioners: [
            { contactType: CONTACT_TYPES.primary, email: INITIAL_EMAIL },
          ],
        },
        form: {
          contact: { email: INITIAL_EMAIL },
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});

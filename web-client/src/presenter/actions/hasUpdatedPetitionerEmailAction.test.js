import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { hasUpdatedPetitionerEmailAction } from './hasUpdatedPetitionerEmailAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('hasUpdatedPetitionerEmailAction', () => {
  let pathNoStub = jest.fn();
  let pathYesStub = jest.fn();
  const INITIAL_EMAIL = 'test@example.com';
  const UPDATED_EMAIL = 'updated@example.com';

  beforeAll(() => {
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('returns the yes path when form.contact.updatedEmail is defined', async () => {
    runAction(hasUpdatedPetitionerEmailAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          petitioners: [
            { contactType: CONTACT_TYPES.primary, email: INITIAL_EMAIL },
          ],
        },
        form: { contact: { updatedEmail: UPDATED_EMAIL } },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('returns the no path when orm.contact.updatedEmail is not defined', async () => {
    runAction(hasUpdatedPetitionerEmailAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          petitioners: [
            { contactType: CONTACT_TYPES.primary, email: INITIAL_EMAIL },
          ],
        },
        form: {
          contact: { updatedEmail: undefined },
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});

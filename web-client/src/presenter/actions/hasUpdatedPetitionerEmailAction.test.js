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
            {
              contactType: CONTACT_TYPES.primary,
              email: INITIAL_EMAIL,
            },
          ],
        },
        form: {
          contact: { confirmEmail: UPDATED_EMAIL, updatedEmail: UPDATED_EMAIL },
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('returns the no path when form.contact.updatedEmail is not defined', async () => {
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

  it('should trim whitespace from form.contact.updatedEmail and form.contact.confirmEmail', async () => {
    const { state } = await runAction(hasUpdatedPetitionerEmailAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          petitioners: [
            { contactType: CONTACT_TYPES.primary, email: INITIAL_EMAIL },
          ],
        },
        form: {
          contact: {
            confirmEmail: ` ${INITIAL_EMAIL} `,
            updatedEmail: ` ${INITIAL_EMAIL} `,
          },
        },
      },
    });

    expect(state.form.contact.updatedEmail).toEqual(INITIAL_EMAIL);
    expect(state.form.contact.confirmEmail).toEqual(INITIAL_EMAIL);
  });
});

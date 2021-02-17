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

  it('returns the yes path when caseDetail.contactPrimary.email is different than form.contactPrimary.email', async () => {
    runAction(hasUpdatedPetitionerEmailAction, {
      modules: { presenter },
      state: {
        caseDetail: { contactPrimary: { email: INITIAL_EMAIL } },
        form: { contactPrimary: { email: UPDATED_EMAIL } },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('returns the no path when caseDetail.contactPrimary.email is the same as form.contactPrimary.email', async () => {
    runAction(hasUpdatedPetitionerEmailAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          contactPrimary: { email: INITIAL_EMAIL },
        },
        form: {
          contactPrimary: { email: INITIAL_EMAIL },
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});

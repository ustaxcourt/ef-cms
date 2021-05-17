import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultFileDocumentFormValuesAction } from './setDefaultFileDocumentFormValuesAction';

describe('setDefaultFileDocumentFormValuesAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const mockUserId = '082093a4-20e0-4a82-9d89-e24108535216';

  it('sets up the form with default values', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.privatePractitioner,
      userId: mockUserId,
    });

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      attachments: false,
      certificateOfService: false,
      filersMap: {},
      hasSecondarySupportingDocuments: false,
      hasSupportingDocuments: false,
      practitioner: [],
    });
  });

  it('should set filersMap[userId] to true if the logged in user is a petitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: mockUserId,
    });

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(result.state.form.filersMap).toEqual({
      [mockUserId]: true,
    });
  });
});

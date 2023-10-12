import { GENERATION_TYPES } from '@web-client/getConstants';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { allowExternalConsolidatedGroupFilingHelper } from '@web-client/presenter/computeds/allowExternalConsolidatedGroupFilingHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultFileDocumentFormValuesAction } from './setDefaultFileDocumentFormValuesAction';
jest.mock(
  '@web-client/presenter/computeds/allowExternalConsolidatedGroupFilingHelper',
);

describe('setDefaultFileDocumentFormValuesAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const mockUserId = '082093a4-20e0-4a82-9d89-e24108535216';

  it('sets up the form with default values when allowExternalConsolidatedGroupFilingHelper returns true', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.privatePractitioner,
      userId: mockUserId,
    });

    allowExternalConsolidatedGroupFilingHelper.mockReturnValue(true);

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      attachments: false,
      certificateOfService: false,
      fileAcrossConsolidatedGroup: true,
      filersMap: {},
      generationType: GENERATION_TYPES.MANUAL,
      hasSecondarySupportingDocuments: false,
      hasSupportingDocuments: false,
      practitioner: [],
    });
  });

  it('sets up the form with default values when allowExternalConsolidatedGroupFilingHelper returns false', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.privatePractitioner,
      userId: mockUserId,
    });
    allowExternalConsolidatedGroupFilingHelper.mockReturnValue(false);

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      attachments: false,
      certificateOfService: false,
      fileAcrossConsolidatedGroup: false,
      filersMap: {},
      generationType: GENERATION_TYPES.MANUAL,
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

  it('should default te generationType to manual', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: mockUserId,
    });

    const result = await runAction(setDefaultFileDocumentFormValuesAction, {
      modules: { presenter },
      state: {
        form: { generationType: undefined },
      },
    });

    expect(result.state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
  });
});
